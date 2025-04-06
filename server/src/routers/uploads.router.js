const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const { route } = require("./users.router");
const { error } = require("console");

// Configurar multer para guardar el archivo temporalmente
const upload = multer({ dest: "uploads/" });

// Endpoint para obtener los nombres de las imágenes en la carpeta 'exam_images'
router.get("/get-uploaded-images", (req, res) => {
  try {
    // const dirPath = path.join(__dirname, "processing/output_images/");
    const dirPath = path.join(__dirname, "../processing/output_images/");
    console.log("Ruta completa a la carpeta:", dirPath);
    fs.readdir(dirPath, (err, files) => {
      if (err) {
        return res.status(500).send("Error al leer la carpeta");
      }
      res.json(files);
    });
  } catch (err) {
    console.error("Error al procesar el examen:", err);
    res.status(500).json({ err: "Error interno del servidor" });
  }
});

// 🔥 Ahora aceptamos varios archivos
router.post("/upload", upload.array("files", 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No se subió ningún archivo");
  }

  let processPromises = [];

  req.files.forEach((file) => {
    const filePath = path.join(__dirname, "..", "uploads", file.filename);
    console.log(`Archivo recibido: ${filePath}`);

    // Creamos una promesa para cada procesamiento
    const promise = new Promise((resolve, reject) => {
      const uniqueId = Date.now();
      exec(
        `python3 ../processing/process_pdf.py "${filePath}" "${uniqueId}"`,
        (error, stdout, stderr) => {
          if (error) {
            console.error(`Error procesando ${filePath}: ${error.message}`);
            reject(error);
          } else if (stderr) {
            console.error(`Stderr procesando ${filePath}: ${stderr}`);
            reject(stderr);
          } else {
            console.log(`Resultado procesando ${filePath}: ${stdout}`);
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
      console.error("Error en el procesamiento de múltiples archivos:", err);
      res.status(500).send("Error en el procesamiento");
    });
});

// obtener examenes procesados

router.get("/get-uploaded-exams", (req, res) => {
  const outputFolder = path.join(
    __dirname,
    "..",
    "..",
    "processing",
    "output_images"
  );

  fs.readdir(outputFolder, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error("Error leyendo carpeta de examenes", err);
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

module.exports = router;
