const express = require("express");

const router = express.Router();

const {
  createAnalysis,
  getMyAnalysis,
} = require("../controllers/evaluationAnalysisController");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// ======================================================
// CREATE ANALYSIS
// Student only
// ======================================================

router.post(
  "/create",
  authenticateUser,
  authorizeRoles("student"),
  createAnalysis
);

// ======================================================
// GET MY ANALYSIS
// Student only
// ======================================================

router.get(
  "/my-analysis",
  authenticateUser,
  authorizeRoles("student"),
  getMyAnalysis
);

module.exports = router;