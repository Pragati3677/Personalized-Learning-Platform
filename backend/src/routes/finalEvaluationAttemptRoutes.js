
const express = require("express");

const {
  startFinalEvaluation,
  submitFinalEvaluation,
  getMyFinalEvaluationAttempts,
  recordFinalEvaluationViolation,
  getMyCertificate,
} = require("../controllers/finalEvaluationAttemptController");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// All routes require an authenticated student.
router.use(authenticateUser);
router.use(authorizeRoles("student"));

// Start final evaluation.
router.post("/start", startFinalEvaluation);

// Record a tab-switch violation.
router.post(
  "/violation/:attemptId",
  recordFinalEvaluationViolation
);

// Submit final evaluation.
router.post(
  "/submit/:attemptId",
  submitFinalEvaluation
);

// Get the student's previous attempts.
router.get(
  "/my-attempts",
  getMyFinalEvaluationAttempts
);

// Get the student's certificate details.
router.get(
  "/my-certificate",
  getMyCertificate
);

module.exports = router;
