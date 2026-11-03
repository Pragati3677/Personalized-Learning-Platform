
const express = require("express");
const {
  compileJavaCode,
} = require("../controllers/javaCompilerController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/run",
  authenticateUser,
  authorizeRoles("student", "teacher"),
  compileJavaCode
);

module.exports = router;
