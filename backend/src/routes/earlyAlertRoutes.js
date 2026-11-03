const express = require("express");

const {
  generateEarlyAlerts,
  getEarlyAlerts,
  resolveEarlyAlert,
} = require("../controllers/earlyAlertController");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Generate alerts from student progress
router.post(
  "/generate",
  authenticateUser,
  authorizeRoles("teacher"),
  generateEarlyAlerts
);

// Get all active alerts
router.get(
  "/",
  authenticateUser,
  authorizeRoles("teacher"),
  getEarlyAlerts
);

// Resolve an alert
router.put(
  "/:alertId/resolve",
  authenticateUser,
  authorizeRoles("teacher"),
  resolveEarlyAlert
);

module.exports = router;