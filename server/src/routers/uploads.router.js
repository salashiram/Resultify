const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const authenticateToken = require("../middleware/authMiddleware.middleware");

// Configurar multer para guardar el archivo temporalmente
const upload = multer({ dest: "uploads/" });

// Obtener los nombres de las imágenes en la carpeta 'output_images'
router.get("/get-uploaded-images", authenticateToken, (req, res) => {
  try {
    const dirPath = path.join(__dirname, "../processing/output_images/");
    fs.readdir(dirPath, (err, files) => {
      if (err) {
        return res.status(500).send("Error al leer la carpeta");
      }
      res.json(files);
    });
  } catch (err) {
    res.status(500).json({ err: "Error interno del servidor" });
  }
});

// cargar archivos
router.post(
  "/upload",
  authenticateToken,
  upload.array("files", 50),
  (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send("No se subió ningún archivo");
    }

    let processPromises = [];

    req.files.forEach((file) => {
      const filePath = path.join(__dirname, "..", "uploads", file.filename);

      // Creamos una promesa para cada procesamiento
      const promise = new Promise((resolve, reject) => {
        // const uniqueId = Date.now();
        const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

        exec(
          `python3 ../processing/process_pdf.py "${filePath}" "${uniqueId}"`,
          (error, stdout, stderr) => {
            if (error) {
              reject(error);
            } else if (stderr) {
              reject(stderr);
            } else {
              resolve(stdout);
            }
          }
        );
      });

      processPromises.push(promise);
    });

    // Esperamos a que todos los archivos se procesen
    Promise.allSettled(processPromises)
      .then((results) => {
        res.json({
          message: "Todos los archivos han sido procesados",
          results: results.map((r) =>
            r.status === "fulfilled" ? r.value : `Error: ${r.reason}`
          ),
        });
      })
      .catch((err) => {
        res.status(500).send("Error en el procesamiento");
      });
  }
);

// Obtener examenes procesados (PNG)
router.get("/get-uploaded-exams", authenticateToken, (req, res) => {
  const outputFolder = path.join(
    __dirname,
    "..",
    "..",
    "processing",
    "output_images"
  );

  fs.readdir(outputFolder, { withFileTypes: true }, (err, files) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error al leer los examenes procesados" });
    }

    // filtrar solo carpetas (cada carpeta es un examen)
    const examFolders = files
      .filter((file) => file.isDirectory())
      .map((folder) => folder.name);

    res.json(examFolders);
  });
});

// obtener examenes procesados (JSON)
router.get("/get-detected-exams", authenticateToken, (req, res) => {
  const detectedFolder = path.join(__dirname, "..", "detected_exams");

  fs.readdir(detectedFolder, (err, files) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error al leer los examenes detectados" });
    }

    // Filtrar solo archivos que sean JSON
    const detectedExams = files.filter((file) => file.endsWith(".json"));

    res.json(detectedExams);
  });
});

module.exports = router;
