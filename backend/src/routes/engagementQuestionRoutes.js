const express = require("express");

const router = express.Router();

const {
  createQuestion,
  getQuestionsByTopic,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/engagementQuestionController");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// ======================================================
// GET QUESTIONS BY TOPIC
// Student + Teacher
// ======================================================

router.get(
  "/topic/:topicId",
  authenticateUser,
  authorizeRoles("student", "teacher"),
  getQuestionsByTopic
);

// ======================================================
// GET ONE QUESTION
// Student + Teacher
// ======================================================

router.get(
  "/:questionId",
  authenticateUser,
  authorizeRoles("student", "teacher"),
  getQuestionById
);

// ======================================================
// CREATE QUESTION
// Teacher only
// ======================================================

router.post(
  "/",
  authenticateUser,
  authorizeRoles("teacher"),
  createQuestion
);

// ======================================================
// UPDATE QUESTION
// Teacher only
// ======================================================

router.put(
  "/:questionId",
  authenticateUser,
  authorizeRoles("teacher"),
  updateQuestion
);

// ======================================================
// DELETE QUESTION
// Teacher only
// ======================================================

router.delete(
  "/:questionId",
  authenticateUser,
  authorizeRoles("teacher"),
  deleteQuestion
);

module.exports = router;