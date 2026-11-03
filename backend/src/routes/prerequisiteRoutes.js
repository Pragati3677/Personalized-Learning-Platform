const express = require("express");

const {
  createPrerequisite,
  startEvaluation,
  submitAnswer,
  timeoutQuestion,
  getEvaluationStatus,
  submitEvaluation,
  checkPrerequisiteStatus,
} = require("../controllers/prerequisiteController");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ======================================================
// CREATE PREREQUISITE
// ======================================================

router.post(
  "/create",
  authenticateUser,
  authorizeRoles("teacher"),
  createPrerequisite
);

// ======================================================
// CHECK LOGGED-IN STUDENT PREREQUISITE STATUS
// ======================================================

router.get(
  "/status",
  authenticateUser,
  authorizeRoles("student"),
  checkPrerequisiteStatus
);

// ======================================================
// START PREREQUISITE EVALUATION
// ======================================================

router.post(
  "/:id/start",
  authenticateUser,
  authorizeRoles("student"),
  startEvaluation
);

// ======================================================
// SUBMIT ONE ANSWER
// ======================================================

router.post(
  "/attempt/:attemptId/answer",
  authenticateUser,
  authorizeRoles("student"),
  submitAnswer
);

// ======================================================
// HANDLE QUESTION TIMEOUT
// ======================================================

router.post(
  "/attempt/:attemptId/timeout",
  authenticateUser,
  authorizeRoles("student"),
  timeoutQuestion
);

// ======================================================
// GET EVALUATION STATUS
// ======================================================

router.get(
  "/attempt/:attemptId",
  authenticateUser,
  authorizeRoles("student"),
  getEvaluationStatus
);

// ======================================================
// SUBMIT COMPLETE EVALUATION
// ======================================================

router.post(
  "/attempt/:attemptId/submit",
  authenticateUser,
  authorizeRoles("student"),
  submitEvaluation
);

module.exports = router;