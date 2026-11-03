const express = require("express");

const {
  createRecommendation,
  getMyRecommendations,
} = require("../controllers/learningRecommendationController");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Create recommendation
router.post(
  "/create",
  authenticateUser,
  authorizeRoles("student"),
  createRecommendation
);

// Get logged-in student's recommendations
router.get(
  "/my-recommendations",
  authenticateUser,
  authorizeRoles("student"),
  getMyRecommendations
);

module.exports = router;