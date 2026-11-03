const express = require("express");

const router = express.Router();

const {
  startEvaluation,
  submitEvaluation,
  getMyAttempts,
} = require("../controllers/engagementAttemptController");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// ======================================================
// START SMART ENGAGEMENT EVALUATION
// Student only
// ======================================================

router.post(
  "/start",
  authenticateUser,
  authorizeRoles("student"),
  startEvaluation
);

// ======================================================
// SUBMIT SMART ENGAGEMENT EVALUATION
// Student only
// ======================================================

router.post(
  "/submit/:attemptId",
  authenticateUser,
  authorizeRoles("student"),
  submitEvaluation
);

// ======================================================
// GET MY EVALUATION ATTEMPTS
// Student only
// ======================================================

router.get(
  "/my-attempts",
  authenticateUser,
  authorizeRoles("student"),
  getMyAttempts
);

module.exports = router;