const express = require("express");

const {
  createPracticeQuestion,
  getPracticeQuestionsByTopic,
  getPracticeQuestionById,
  updatePracticeQuestion,
  deletePracticeQuestion,
} = require("../controllers/practiceQuestionController");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Teacher: create practice question
router.post(
  "/create",
  authenticateUser,
  authorizeRoles("teacher"),
  createPracticeQuestion
);

// Student + Teacher: get questions by topic
router.get(
  "/topic/:topicId",
  authenticateUser,
  authorizeRoles("student", "teacher"),
  getPracticeQuestionsByTopic
);

// Student + Teacher: get one question
router.get(
  "/:questionId",
  authenticateUser,
  authorizeRoles("student", "teacher"),
  getPracticeQuestionById
);

// Teacher: update question
router.put(
  "/:questionId",
  authenticateUser,
  authorizeRoles("teacher"),
  updatePracticeQuestion
);

// Teacher: deactivate question
router.delete(
  "/:questionId",
  authenticateUser,
  authorizeRoles("teacher"),
  deletePracticeQuestion
);

module.exports = router;