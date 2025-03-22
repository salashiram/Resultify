const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const usersRouter = require("../routers/users.router");
const examsRouter = require("../routers/exams.router");
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

app.use((err, req, res, next) => {
  // console.error(err.stack);
  res.status(500).json({
    ok: false,
    message: "Ocurrió un error en el servidor",
  });
});

module.exports = app;
