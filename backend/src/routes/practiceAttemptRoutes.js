const express = require("express");

const {
  startPractice,
  submitPractice,
  getMyPracticeAttempts,
} = require("../controllers/practiceAttemptController");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Student: start practice
router.post(
  "/start",
  authenticateUser,
  authorizeRoles("student"),
  startPractice
);

// Student: submit practice
router.post(
  "/submit/:attemptId",
  authenticateUser,
  authorizeRoles("student"),
  submitPractice
);

// Student: get own practice attempts
router.get(
  "/my-attempts",
  authenticateUser,
  authorizeRoles("student"),
  getMyPracticeAttempts
);

module.exports = router;