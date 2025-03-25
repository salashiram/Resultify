const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/authMiddleware.middleware");
const Exams = require("../models/exams.model");
const Questions = require("../models/questions.model");
const Options = require("../models/options.model");
const { response, text } = require("express");
const sequelize = require("../connection");

router.get("/", authenticateToken, async (req, res) => {
  try {
    const [result] = await sequelize.query("select * from vShowExams;");

    if (result.length === 0) {
      res.status(409).json({
        ok: false,
        status: 409,
        message: "empty",
      });
    }

    res.json({
      ok: true,
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      message: "Error fetching exam data",
    });
  }
});

// new exam
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

module.exports = router;
