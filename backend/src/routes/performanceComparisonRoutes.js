const express = require("express");

const {
  createPerformanceComparison,
  getMyPerformanceComparisons,
} = require("../controllers/performanceComparisonController");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Student: create performance comparison
router.post(
  "/create",
  authenticateUser,
  authorizeRoles("student"),
  createPerformanceComparison
);

// Student: get own performance comparisons
router.get(
  "/my-comparisons",
  authenticateUser,
  authorizeRoles("student"),
  getMyPerformanceComparisons
);

module.exports = router;