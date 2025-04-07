const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/authMiddleware.middleware");
const Exams = require("../models/exams.model");
const Questions = require("../models/questions.model");
const Options = require("../models/options.model");
const { response, text } = require("express");
const sequelize = require("../connection");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { json, QueryTypes } = require("sequelize");

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

    // 2.- insertar preguntas
    for (const q of questions) {
      const newQuestion = await Questions.create(
        {
          exam_id: newExam.id,
          question_text: q.question_text,
          question_type_id: q.question_type_id,
        },
        { transaction }
      );

      // 3.- insertar opciones(respuestas) para cada pregunta
      const optionsToInsert = q.options.map((opt) => ({
        question_id: newQuestion.id,
        option_text: opt.option_text,
        is_correct: opt.is_correct,
      }));

      await Options.bulkCreate(optionsToInsert, { transaction });
    }

    // 4 .- confirmar transaccion
    await transaction.commit();
    res.status(201).json({
      message: "Exam created successfully",
    });
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ message: "Error creating exam", err });
  }
});

// POST /api/grade-exam
// router.post("/grade-exam", async (req, res) => {
//   try {
//     const { exam_id } = req.body;

//     // Verifica si existe el archivo JSON con las respuestas detectadas
//     const jsonPath = path.join(
//       __dirname,
//       "../../processing/detected_exam.json"
//     );

//     if (!fs.existsSync(jsonPath)) {
//       return res.status(400).json({
//         error: "No se encontró el archivo JSON de respuestas detectadas",
//       });
//     }

//     // Lee el archivo JSON con las respuestas escaneadas
//     const detectedAnswers = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
//     console.log("✅ Respuestas detectadas desde el JSON:", detectedAnswers);

//     if (!detectedAnswers || detectedAnswers.length === 0) {
//       return res.status(400).json({ error: "No se detectaron respuestas" });
//     }

//     // Consultar todas las preguntas del examen
//     const questions = await sequelize.query(
//       `SELECT q.id AS question_id, q.question_text, o.option_text, o.is_correct
//          FROM Questions q
//          JOIN Options o ON q.id = o.question_id
//          WHERE q.exam_id = ?`,
//       { replacements: [exam_id], type: QueryTypes.SELECT }
//     );

//     console.log(
//       `✅ Preguntas cargadas desde la BD para el examen ${exam_id}:`,
//       questions
//     );

//     if (questions.length === 0) {
//       return res
//         .status(404)
//         .json({ error: "No se encontraron preguntas para este examen" });
//     }

//     // Ordenar preguntas de acuerdo con el orden de aparición en el examen
//     const orderedQuestions = questions.sort(
//       (a, b) => a.question_id - b.question_id
//     );

//     // Mapeo de las opciones correctas por número de pregunta
//     const correctAnswers = orderedQuestions.map((q) => {
//       const correctOption =
//         q.option_text && q.is_correct === 1
//           ? q.option_text.toLowerCase()
//           : null;
//       return {
//         question_number: orderedQuestions.indexOf(q) + 1, // El índice + 1 para alinear con el número de pregunta del JSON
//         correct_answer: correctOption,
//       };
//     });

//     // Comparación de respuestas
//     let correctCount = 0;
//     let incorrectCount = 0;

//     detectedAnswers.forEach((detected) => {
//       const correct = correctAnswers.find(
//         (c) => c.question_number === detected.question_number
//       );

//       if (correct && correct.correct_answer) {
//         if (detected.answer.toLowerCase() === correct.correct_answer) {
//           correctCount++;
//         } else {
//           incorrectCount++;
//         }
//       }
//     });

//     // Calcular la calificación
//     const totalQuestions = correctCount + incorrectCount;
//     const score =
//       totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

//     console.log(`✅ Total de preguntas: ${totalQuestions}`);
//     console.log(
//       `✅ Correctas: ${correctCount}, Incorrectas: ${incorrectCount}, Puntaje: ${score}`
//     );

//     // Respuesta final
//     res.json({
//       exam_id,
//       total_questions: totalQuestions,
//       correct: correctCount,
//       incorrect: incorrectCount,
//       score: score.toFixed(2),
//     });
//   } catch (error) {
//     console.error("Error al procesar el examen:", error);
//     res.status(500).json({ error: "Error interno del servidor" });
//   }
// });

router.post("/grade-exams", async (req, res) => {
  try {
    const { exam_id } = req.body;

    // Carpeta donde están los JSONs detectados
    const detectedExamsFolder = path.join(__dirname, "../detected_exams/");

    if (!fs.existsSync(detectedExamsFolder)) {
      return res
        .status(400)
        .json({ error: "No se encontró la carpeta de exámenes detectados." });
    }

    // Leer todos los archivos JSON
    const files = fs
      .readdirSync(detectedExamsFolder)
      .filter((file) => file.endsWith(".json"));

    if (files.length === 0) {
      return res
        .status(400)
        .json({ error: "No hay archivos JSON para procesar." });
    }

    // Traer las preguntas correctas del examen en el orden correcto
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

    // Crear lista ordenada de respuestas correctas
    const correctAnswersList = [];
    const questionIdList = [];
    for (const q of questions) {
      if (q.is_correct) {
        correctAnswersList.push(q.option_text.trim().toLowerCase());
        questionIdList.push(q.question_id);
      }
    }

    const results = [];

    // Procesar cada archivo JSON detectado
    for (const file of files) {
      const filePath = path.join(detectedExamsFolder, file);
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      console.log("DATA:", data);

      const detectedAnswers = data.preguntas_detectadas || [];

      let totalQuestions = detectedAnswers.length;
      let correctCount = 0;
      let details = [];

      for (let i = 0; i < detectedAnswers.length; i++) {
        const detected = detectedAnswers[i];
        const questionNumber = detected.question_number;
        const userAnswer = detected.answer.trim().toLowerCase();

        const correctAnswer = correctAnswersList[i]; // Usamos el índice
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

      // results.push({
      //   image_name: data.nombre_imagen || file,
      //   total_questions: totalQuestions,
      //   correct_answers: correctCount,
      //   grade: grade.toFixed(2),
      //   details,
      // });
      results.push({
        image_name: data.nombre_imagen || file,
        matricula:
          data.matricula && data.matricula.trim() !== ""
            ? data.matricula
            : "No detectada",
        nombre_completo:
          data.nombre_completo && data.nombre_completo.trim() !== ""
            ? data.nombre_completo
            : "No detectado",
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

    // leer todas las subcarpetas dentro de output_images
    fs.readdir(outputImagesPath, (err, folders) => {
      if (err) {
        return res
          .status(500)
          .send("Error al leer las carpetas de los exámenes");
      }

      // Filtramos solo las carpetas (no archivos)
      const examFolders = folders.filter((folder) =>
        fs.statSync(path.join(outputImagesPath, folder)).isDirectory()
      );
      if (examFolders.length === 0) {
        return res.status(404).send("No se encontraron exámenes procesados");
      }

      const results = [];

      // Procesar cada carpeta (cada examen)
      examFolders.forEach((folder, index) => {
        const folderPath = path.join(outputImagesPath, folder);

        // Leer las imágenes dentro de cada subcarpeta
        fs.readdir(folderPath, (err, files) => {
          if (err) {
            return res
              .status(500)
              .send("Error al leer las imágenes en la subcarpeta");
          }

          const examImages = files.filter((file) => file.endsWith(".png")); // solo las imágenes PNG
          if (examImages.length === 0) {
            return res
              .status(404)
              .send(`No se encontraron imágenes en la carpeta ${folder}`);
          }

          // Procesar cada imagen dentro de la subcarpeta
          examImages.forEach((image, imageIndex) => {
            const imagePath = path.join(folderPath, image);

            exec(
              `python3 ../processing/text.py "${imagePath}"`,
              (error, stdout, stderr) => {
                if (error) {
                  console.error(`Error real al procesar ${image}:`, error);
                  return;
                }

                if (stderr) {
                  console.warn(`Advertencia al procesar ${image}:`, stderr);
                  // No hacemos return, solo mostramos el warning
                }

                console.log(`Texto procesado para ${image}:`, stdout);
                // Aquí deberíamos parsear stdout (el JSON generado por el script de Python)
                const result = JSON.parse(stdout);
                result.folder = folder; // Agregar la carpeta para identificar el examen
                results.push(result);

                // Cuando todos los exámenes hayan sido procesados
                if (results.length === examFolders.length * examImages.length) {
                  res.json({
                    message: "Exámenes procesados correctamente",
                    results,
                  });
                }
              }
            );
          });
        });
      });
    });
  } catch (err) {
    console.error("Error al procesar los exámenes:", err);
    res.status(500).send("Error al procesar los exámenes");
  }
});

module.exports = router;
