const router = require("express").Router();
const authenticateToken = require("../middleware/authMiddleware.middleware");
const Submissions = require("../models/submissions.model");
const sequelize = require("../connection");

router.get("/", async (req, res) => {
  const submissions = await Submissions.findAll();
  res.status(200).json({
    ok: true,
    status: 200,
    body: submissions,
  });
});

// agrupar submissions por examen
router.get("/getSubmissions/:id", authenticateToken, async (req, res) => {
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
    res.status(500).json({
      ok: false,
      message: "Error fetching data",
    });
  }
});

// guardar submisions
router.post("/saveResults", authenticateToken, async (req, res) => {
  try {
    const { results, exam_id } = req.body;

    if (!Array.isArray(results) || results.length === 0) {
      return res.status(400).json({ error: "No hay resultados para guardar." });
    }

    const submissionsToCreate = results
      .map((entry) => {
        const score = parseFloat(entry.grade);
        const student_id =
          entry.matricula === "default" ? null : parseInt(entry.matricula);

        if (isNaN(score)) {
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
    return res.status(500).json({ error: "Error interno al guardar." });
  }
});

module.exports = router;
