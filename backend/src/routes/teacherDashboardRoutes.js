const express = require("express");

const {
  getTeacherDashboard,
} = require("../controllers/teacherDashboardController");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ============================================================
// TEACHER DASHBOARD
// ============================================================
// Only logged-in teachers can access this route.

router.get(
  "/dashboard",
  authenticateUser,
  authorizeRoles("teacher"),
  getTeacherDashboard
);

module.exports = router;