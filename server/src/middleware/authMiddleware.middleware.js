const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .set("Access-Control-Allow-Origin", "*") // Agrega encabezado CORS
      .json({ ok: false, message: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.idUser = decoded.id;
    next();
  } catch (error) {
    return res
      .status(403)
      .set("Access-Control-Allow-Origin", "*") // Agrega encabezado CORS
      .json({ ok: false, message: "Invalid token" });
  }
};

module.exports = authenticateToken;
