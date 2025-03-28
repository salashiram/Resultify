const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const { exec } = require("child_process");
const { route } = require("./users.router");

// Configurar multer para guardar el archivo temporalmente
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No se subió ningún archivo");
  }

  const filePath = path.join(__dirname, "..", "uploads", req.file.filename);

  console.log(`Archivo recibido: ${filePath}`);

  // 🔥 Aquí ejecutas tu script de Python para procesar el PDF
  exec(
    `python3 ../processing/process_pdf.py "${filePath}"`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).send("Error al procesar PDF");
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return res.status(500).send("Error durante el procesamiento");
      }

      console.log(`Resultado: ${stdout}`);
      res.send(`PDF procesado: ${stdout}`);
    }
  );
});

module.exports = router;
