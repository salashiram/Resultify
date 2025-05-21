const router = require("express").Router();
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/authMiddleware.middleware");
const Submissions = require("../models/submissions.model");

const sequelize = require("../connection");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { json, QueryTypes } = require("sequelize");
const { parse } = require("path/posix");
const { ok } = require("assert");

module.exports = router;

router.get("/", async (req, res) => {
  const submissions = await Submissions.findAll();
  res.status(200).json({
    ok: true,
    status: 200,
    body: submissions,
  });
});

// agrupar submissions por examen
router.get("/getSubmissions/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await sequelize.query("call spGetSubmissions(:exam_id)", {
      replacements: { exam_id: id },
    });

    if (!result) {
      return res.status(409).json({
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
    console.error("Error ", err);
    res.status(500).json({
      ok: false,
      message: "Error fetching data",
    });
  }
});

// guardar submisions
router.post("/saveResults", async (req, res) => {
  try {
    const { results, exam_id } = req.body;

    if (!Array.isArray(results) || results.length === 0) {
      return res.status(400).json({ error: "No hay resultados para guardar." });
    }

    const submissionsToCreate = results
      .map((entry) => {
        console.log(entry.grade);
        const score = parseFloat(entry.grade);
        const student_id =
          entry.matricula === "default" ? null : parseInt(entry.matricula);

        if (isNaN(score)) {
          console.warn("Registro omitido por calificación inválida:", entry);
          return null;
        }

        return {
          exam_id,
          student_id, // puede ser null
          student_name: entry.nombre_completo || "Desconocido",
          score,
        };
      })
      .filter((entry) => entry !== null);

    if (submissionsToCreate.length === 0) {
      return res
        .status(400)
        .json({ error: "Todos los registros eran inválidos." });
    }

    await Submissions.bulkCreate(submissionsToCreate);

    return res
      .status(201)
      .json({ message: "Submissions guardadas exitosamente." });
  } catch (error) {
    console.error("Error al guardar submissions:", error);
    return res.status(500).json({ error: "Error interno al guardar." });
  }
});
