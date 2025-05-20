const router = require("express").Router();
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/authMiddleware.middleware");
const Exams = require("../models/exams.model");
const Questions = require("../models/questions.model");
const Options = require("../models/options.model");
const sequelize = require("../connection");
const mysql = require("mysql2/promise");
const pool = require("../mysql");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { json, QueryTypes } = require("sequelize");

//
const deleteFilesRecursively = (folderPath) => {
  if (fs.existsSync(folderPath)) {
    const entries = fs.readdirSync(folderPath);
    entries.forEach((entry) => {
      const entryPath = path.join(folderPath, entry);
      const stats = fs.lstatSync(entryPath);

      if (stats.isDirectory()) {
        // Si es una carpeta, llamar recursivamente
        deleteFilesRecursively(entryPath);
        fs.rmdirSync(entryPath); // después de vaciarla, eliminar carpeta
      } else {
        // Si es un archivo, eliminarlo
        fs.unlinkSync(entryPath);
      }
    });
  }
};

// Consultar todos los examenes
router.get("/", authenticateToken, async (req, res) => {
  try {
    const [result] = await sequelize.query("select * from vShowExams;");

    if (result.length === 0) {
      return res.status(409).json({
        ok: false,
        status: 409,
        message: "empty",
      });
    }

    return res.json({
      ok: true,
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: "Error fetching exam data",
    });
  }
});

// Consultar examenes activos
router.get("/active-exams", async (req, res) => {
  try {
    const [result] = await sequelize.query("select * from vShowActiveExams");

    if (result.length === 0) {
      return res.status(409).json({
        ok: false,
        status: 409,
        message: "empty",
      });
    }

    return res.json({
      ok: true,
      data: result,
    });
  } catch (err) {
    console.log("Error: ", err);
    return res.status(500).json({
      ok: false,
      message: "Error fetching exam data",
    });
  }
});

// Consultar examen y detalles
router.get("/details/:examId", authenticateToken, async (req, res) => {
  const examId = parseInt(req.params.examId, 10);

  if (isNaN(examId)) {
    return res.status(400).json({ message: "Invalid exam ID" });
  }

  try {
    const connection = await pool.getConnection();

    const [results] = await connection.query("CALL get_exam_by_id(?);", [
      examId,
    ]);

    connection.release();

    const [examInfo, questions, options] = results;

    return res.status(200).json({
      exam: examInfo?.[0] || null,
      questions: questions || [],
      options: options || [],
    });
  } catch (err) {
    console.error("Error fetching exam:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Crear examen
router.post("/create", authenticateToken, async (req, res) => {
  const {
    title,
    description,
    exam_type_id,
    school_group,
    school_career,
    created_by,
    questions, // Array de preguntas
  } = req.body;

  const transaction = await sequelize.transaction();

  try {
    //  1.- crear examen
    const newExam = await Exams.create(
      {
        title,
        description,
        exam_type_id,
        school_group,
        school_career,
        created_by,
      },
      { transaction }
    );

    // 2.- Insertar preguntas
    for (const q of questions) {
      const newQuestion = await Questions.create(
        {
          exam_id: newExam.id,
          question_number: q.question_number,
          score_value: q.score_value,
          question_text: q.question_text,
          question_type_id: q.question_type_id,
        },
        { transaction }
      );

      // 3.- Insertar opciones(respuestas) para cada pregunta
      const optionsToInsert = q.options.map((opt) => ({
        question_id: newQuestion.id,
        option_text: opt.option_text,
        is_correct: opt.is_correct,
      }));

      await Options.bulkCreate(optionsToInsert, { transaction });
    }

    // 4 .- Confirmar transaccion
    await transaction.commit();

    // Generar hoja de respuestas PDF
    const examId = newExam.id;
    const numQuestions = questions.length;

    const scriptPath = path.join(
      __dirname,
      "..",
      "..",
      "processing",
      "generate_answer_sheet.py"
    );

    const safeTitle = title.replace(/\s+/g, "_");

    const command = `python3 "${scriptPath}" "${examId}" "${numQuestions}" "${safeTitle}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Error al generar hoja de respuestas:", error);
      } else {
        console.log("✅ PDF generado correctamente");
        console.log(stdout);
      }

      // Siempre responder al cliente aunque falle la hoja
      res.status(201).json({
        message: "Exam created successfully",
        pdfGenerated: !error,
      });
    });
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ message: "Error creating exam", err });
  }
});

// Revisar examen
// Compara examen fisico (procesado por el ocr) VS examen registrado en db

router.post("/grade-exams", async (req, res) => {
  try {
    const { exam_id } = req.body;

    const detectedExamsFolder = path.join(__dirname, "../detected_exams/");

    if (!fs.existsSync(detectedExamsFolder)) {
      return res
        .status(400)
        .json({ error: "No se encontró la carpeta de exámenes detectados." });
    }

    const files = fs
      .readdirSync(detectedExamsFolder)
      .filter((file) => file.endsWith(".json"));

    if (files.length === 0) {
      return res
        .status(400)
        .json({ error: "No hay archivos JSON para procesar." });
    }

    const questions = await sequelize.query(
      `
      SELECT q.id AS question_id, q.question_text, o.option_text, o.is_correct
      FROM Questions q
      JOIN Options o ON q.id = o.question_id
      WHERE q.exam_id = ?
      ORDER BY q.id ASC
      `,
      { replacements: [exam_id], type: QueryTypes.SELECT }
    );

    if (questions.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontraron preguntas para este examen." });
    }

    // Mapear respuestas correctas por número de pregunta
    const correctAnswersMap = {};
    let questionIndex = 1;
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].is_correct) {
        correctAnswersMap[questionIndex] = questions[i].option_text
          .trim()
          .toLowerCase();
        questionIndex++;
      } else {
        // Solo incrementamos el índice cuando completamos una pregunta (ultima opción revisada)
        if (
          i + 1 === questions.length ||
          questions[i + 1].question_id !== questions[i].question_id
        ) {
          questionIndex++;
        }
      }
    }

    const results = [];

    for (const file of files) {
      const filePath = path.join(detectedExamsFolder, file);
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      const detectedAnswers = data.preguntas_detectadas || [];

      let totalQuestions = detectedAnswers.length;
      let correctCount = 0;
      let details = [];

      for (let i = 0; i < detectedAnswers.length; i++) {
        const detected = detectedAnswers[i];
        const questionNumber = parseInt(detected.question_number); // Asegurar que es número
        const userAnswer = detected.answer.trim().toLowerCase();
        const correctAnswer = correctAnswersMap[questionNumber];

        const isCorrect = userAnswer === correctAnswer;

        if (isCorrect) correctCount++;

        details.push({
          question_number: questionNumber,
          user_answer: userAnswer,
          correct_answer: correctAnswer,
          is_correct: isCorrect,
        });
      }

      const grade =
        totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

      results.push({
        image_name: data.nombre_imagen || file,
        matricula: data.matricula?.trim() || "No detectada",
        nombre_completo: data.nombre_completo?.trim() || "No detectado",
        total_questions: totalQuestions,
        correct_answers: correctCount,
        grade: grade.toFixed(2),
        details,
      });
    }

    return res.json({
      exam_id,
      total_exams_processed: results.length,
      results,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al procesar los exámenes." });
  }
});

router.post("/process-all", (req, res) => {
  try {
    const outputImagesPath = path.join(
      __dirname,
      "..",
      "..",
      "processing",
      "output_images"
    );

    if (!fs.existsSync(outputImagesPath)) {
      return res
        .status(500)
        .send("No se encontró la carpeta de imágenes procesadas");
    }

    fs.readdir(outputImagesPath, (err, folders) => {
      if (err) {
        return res
          .status(500)
          .send("Error al leer las carpetas de los exámenes");
      }

      const examFolders = folders.filter((folder) =>
        fs.statSync(path.join(outputImagesPath, folder)).isDirectory()
      );

      if (examFolders.length === 0) {
        return res.status(404).send("No se encontraron exámenes procesados");
      }

      const results = [];
      let totalExpected = 0;
      let processedCount = 0;

      examFolders.forEach((folder) => {
        const folderPath = path.join(outputImagesPath, folder);

        fs.readdir(folderPath, (err, files) => {
          if (err) {
            console.error("Error al leer imágenes:", err);
            processedCount++;
            return;
          }

          const examImages = files.filter((file) => file.endsWith(".png"));
          totalExpected += examImages.length;

          if (examImages.length === 0) {
            processedCount++;
            return;
          }

          examImages.forEach((image) => {
            const imagePath = path.join(folderPath, image);

            // ✅ Ejecutamos el script hardcoded
            const command = `python3 ../processing/review_answer_sheet.py "${imagePath}"`;

            exec(command, (error, stdout, stderr) => {
              processedCount++;

              if (error) {
                console.error(`❌ Error al procesar ${image}:`, error);
                return;
              }

              if (stderr) {
                console.warn(`⚠️ Advertencia procesando ${image}:`, stderr);
              }

              try {
                const result = JSON.parse(stdout.trim());
                result.folder = folder;
                result.imageName = image;
                results.push(result);
              } catch (err) {
                console.error(`❌ No se pudo parsear JSON de ${image}:`, err);
              }

              if (processedCount >= totalExpected) {
                res.json({
                  message: "Exámenes procesados correctamente",
                  results,
                  stats: {
                    totalProcessed: processedCount,
                    successCount: results.length,
                    errorCount: processedCount - results.length,
                  },
                });
              }
            });
          });
        });
      });
    });
  } catch (err) {
    console.error("Error al procesar los exámenes:", err);
    res.status(500).send("Error al procesar los exámenes");
  }
});

// Borrar datos temporales (pdf uploads,imagenes generadas, json generados)
router.delete("/clear-temp-folders", (req, res) => {
  try {
    const foldersToClear = [
      path.join(__dirname, "..", "detected_exams"),
      path.join(__dirname, "..", "uploads"),
      path.join(__dirname, "..", "..", "processing", "output_images"),
    ];

    foldersToClear.forEach((folderPath) => {
      deleteFilesRecursively(folderPath);
    });

    res.json({ message: "Carpetas temporales limpiadas exitosamente" });
  } catch (err) {
    console.error("Error al limpiar carpetas temporales:", err);
    res.status(500).json({ error: "Error al limpiar carpetas" });
  }
});

// mostrar hojas de respuesta
router.get("/list-answer-sheets", (req, res) => {
  const dir = path.join(__dirname, "..", "..", "processing", "generated_pdfs");

  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error("Error leyendo hojas de respuestas:", err);
      return res
        .status(500)
        .json({ error: "No se pudieron leer los archivos" });
    }

    const pdfs = files.filter((file) => file.endsWith(".pdf"));

    res.json(pdfs);
  });
});

router.get("/download-answer-sheet-file/:filename", (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(
    __dirname,
    "..",
    "..",
    "processing",
    "generated_pdfs",
    fileName
  );

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Archivo no encontrado");
  }

  res.sendFile(filePath);
});

module.exports = router;
