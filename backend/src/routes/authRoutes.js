
const express = require("express");

const {
  register,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

// Student registration
router.post("/register", register);

// Student and teacher login
router.post("/login", login);

// Forgot password - send reset email
router.post("/forgot-password", forgotPassword);

// Reset password - verify token and update password
router.post("/reset-password/:token", resetPassword);

module.exports = router;
