const express = require("express");

const {
  createTeacherReport,
  getTeacherReports,
} = require("../controllers/teacherReportController");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Create a teacher report
router.post(
  "/create",
  authenticateUser,
  authorizeRoles("teacher"),
  createTeacherReport
);

// Get all teacher reports
router.get(
  "/",
  authenticateUser,
  authorizeRoles("teacher"),
  getTeacherReports
);

module.exports = router;