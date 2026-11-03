const express = require("express");

const {
  createFinalEvaluationQuestion,
  getFinalEvaluationQuestionsByTopic,
  getFinalEvaluationQuestionById,
  updateFinalEvaluationQuestion,
  deleteFinalEvaluationQuestion,
} = require("../controllers/finalEvaluationQuestionController");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Teacher: create final evaluation question
router.post(
  "/create",
  authenticateUser,
  authorizeRoles("teacher"),
  createFinalEvaluationQuestion
);

// Student + Teacher: get questions by topic
router.get(
  "/topic/:topicId",
  authenticateUser,
  authorizeRoles("student", "teacher"),
  getFinalEvaluationQuestionsByTopic
);

// Student + Teacher: get one question
router.get(
  "/:questionId",
  authenticateUser,
  authorizeRoles("student", "teacher"),
  getFinalEvaluationQuestionById
);

// Teacher: update question
router.put(
  "/:questionId",
  authenticateUser,
  authorizeRoles("teacher"),
  updateFinalEvaluationQuestion
);

// Teacher: deactivate question
router.delete(
  "/:questionId",
  authenticateUser,
  authorizeRoles("teacher"),
  deleteFinalEvaluationQuestion
);

module.exports = router;