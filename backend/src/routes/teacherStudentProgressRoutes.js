const express = require("express");

const {
  getAllStudentProgress,
  getStudentProgressByStudent,
} = require("../controllers/teacherStudentProgressController");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get progress of all students
router.get(
  "/",
  authenticateUser,
  authorizeRoles("teacher"),
  getAllStudentProgress
);

// Get progress of a particular student
router.get(
  "/student/:studentId",
  authenticateUser,
  authorizeRoles("teacher"),
  getStudentProgressByStudent
);

module.exports = router;