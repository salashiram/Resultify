const router = require("express").Router();
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/authMiddleware.middleware");
const Submissions = require("../models/submissions.model");

const sequelize = require("../connection");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { json, QueryTypes } = require("sequelize");

module.exports = router;

router.get("/", async (req, res) => {
  const submissions = await Submissions.findAll();
  res.status(200).json({
    ok: true,
    status: 200,
    body: submissions,
  });
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
        const score = parseFloat(entry.grade);
        const student_id = parseInt(entry.matricula);

        if (isNaN(score) || isNaN(student_id)) {
          console.warn("Registro omitido por datos inválidos:", {
            nombre: entry.nombre_completo,
            matricula: entry.matricula,
            grade: entry.grade,
          });
          return null; // Omitir este registro
        }

        return {
          exam_id,
          student_id,
          student_name: entry.nombre_completo || "Desconocido",
          score,
        };
      })
      .filter((entry) => entry !== null); // Elimina los registros inválidos

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
