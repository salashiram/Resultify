const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/authMiddleware.middleware");
const Users = require("../models/users.model");
const UserProfiles = require("../models/userProfiles.model");
const { response } = require("express");
const sequelize = require("../connection");

router.get("/", async (req, res) => {
  const users = await Users.findAll();
  res.status(200).json({
    ok: true,
    status: 200,
    body: users,
  });
});

// login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      ok: false,
      message: "Email and password are required",
    });
  }

  try {
    const users = await Users.findOne({ where: { email } });

    if (!users) {
      return res.status(400).json({
        ok: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, users.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({
        ok: false,
        message: "Invalid email or password",
      });
    }

    // Crear token JWT
    const token = jwt.sign({ id: users.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      ok: true,
      message: "Login successful",
      token,
      users: {
        id: users.id,
        email: users.email,
        username: users.username,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error logging in",
      error: error.message,
    });
  }
});

// user details
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const result = await sequelize.query("call spUserDetails(:user_id);", {
      replacements: { user_id: id },
    });

    if (!result) {
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
    console.error("Error", err);
    res.status(500).json({
      ok: false,
      message: "Error fetching user data",
    });
  }
});

// user register
router.post("/register", async (req, res) => {
  const { email, password_hash, rol_id, first_name, last_name, phone_number } =
    req.body;

  const transaction = await sequelize.transaction();

  try {
    const existingEmail = await Users.findOne({ where: { email } });

    if (existingEmail) {
      return res.status(400).json({
        ok: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password_hash, 10);

    const newUser = await Users.create(
      { email, password_hash: hashedPassword, rol_id },
      { transaction }
    );

    await UserProfiles.create(
      { user_id: newUser.id, first_name, last_name, phone_number },
      { transaction }
    );

    await transaction.commit();

    res.status(201).json({
      message: "User created successfully",
      user_id: newUser.id,
    });
  } catch (err) {
    // console.error(err);
    await transaction.rollback();
    res.status(500).json({
      message: "Error",
      error: err.message,
    });
  }
});

module.exports = router;
