const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const path = require("path");
const fs = require("fs");
const usersRouter = require("../routers/users.router");
const examsRouter = require("../routers/exams.router");
const uploadsRouter = require("../routers/uploads.router");
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("This is express");
});

// routers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/exams", examsRouter);
app.use("/api/v1/uploads", uploadsRouter);
// app.use("/api/v1/uploads/", uploadsRouter);

// Ruta para servir archivos estáticos (las imágenes)
// app.use(
//   "/uploads/exam_images",
//   express.static(path.join(__dirname, "uploads/exam_images"))
// );

// const uploadRoutes = require("../routers/uploads.router");
// app.use(uploadRoutes);

app.use((err, req, res, next) => {
  // console.error(err.stack);
  res.status(500).json({
    ok: false,
    message: "Ocurrió un error en el servidor",
  });
});

module.exports = app;
