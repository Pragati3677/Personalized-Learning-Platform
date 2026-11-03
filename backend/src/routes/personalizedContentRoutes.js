const express = require("express");

const {
  getPersonalizedContent,
} = require("../controllers/personalizedContentController");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get personalized learning content for a topic
router.get(
  "/:topicId",
  authenticateUser,
  authorizeRoles("student"),
  getPersonalizedContent
);

module.exports = router;