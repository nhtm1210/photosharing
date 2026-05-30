const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../db/userModel");
const { JWT_SECRET } = require("../middleware/requireLogin");
const router = express.Router();

router.post("/login", async (req, res) => {
  console.log(12334);
  const { login_name, password } = req.body;
  if (!login_name) return res.status(400).send("login_name is required");
  try {
    const user = await User.findOne({ login_name }).lean();
    if (!user) return res.status(400).send("Login failed: account not found");
    if (password !== undefined && user.password !== password) {
      return res.status(400).send("Login failed: wrong password");
    }
    const token = jwt.sign(
      { user_id: user._id.toString(), login_name: user.login_name },
      JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res.json({
      token, // FE lưu vào localStorage và gửi qua Authorization header
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      login_name: user.login_name,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.post("/logout", (req, res) => {
  // Với JWT: logout chỉ là FE xoá token. Endpoint giữ lại cho FE gọi.
  return res.status(200).send("Logged out");
});

router.post("/register", async (req, res) => {
  const {
    login_name,
    password,
    first_name,
    last_name,
    location,
    description,
    occupation,
  } = req.body;
  if (!login_name) return res.status(400).send("login_name is required");
  if (!password) return res.status(400).send("password is required");
  if (!first_name) return res.status(400).send("first_name is required");
  if (!last_name) return res.status(400).send("last_name is required");
  try {
    const existed = await User.findOne({ login_name });
    if (existed) return res.status(400).send("login_name already exists");
    const newUser = await User.create({
      login_name,
      password,
      first_name,
      last_name,
      location: location || "",
      description: description || "",
      occupation: occupation || "",
    });
    return res.json({
      _id: newUser._id,
      login_name: newUser.login_name,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
    });
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

// Verify token còn hợp lệ — FE gọi khi mount App để khôi phục session
router.get("/current", (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).send("No token");
  }
  try {
    const decoded = jwt.verify(auth.slice(7), JWT_SECRET);
    return res.json({
      _id: decoded.user_id,
      login_name: decoded.login_name,
    });
  } catch {
    return res.status(401).send("Invalid token");
  }
});

module.exports = router;
