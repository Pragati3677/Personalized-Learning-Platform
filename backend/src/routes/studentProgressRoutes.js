const express = require("express");

const {
  createProgress,
  getMyProgress,
  getTopicProgress,
  updateProgress,
  completeTopic,
  deleteProgress,
} = require("../controllers/studentProgressController");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ======================================================
// CREATE STUDENT PROGRESS
// ======================================================

router.post(
  "/",
  authenticateUser,
  authorizeRoles("student"),
  createProgress
);

// ======================================================
// GET MY ALL PROGRESS
// ======================================================

router.get(
  "/",
  authenticateUser,
  authorizeRoles("student"),
  getMyProgress
);

// ======================================================
// GET PROGRESS FOR ONE TOPIC
// ======================================================

router.get(
  "/topic/:topic",
  authenticateUser,
  authorizeRoles("student"),
  getTopicProgress
);

// ======================================================
// UPDATE STUDENT PROGRESS
// ======================================================

router.put(
  "/:progressId",
  authenticateUser,
  authorizeRoles("student"),
  updateProgress
);

// ======================================================
// COMPLETE TOPIC
// Student only
// ======================================================

router.post(
  "/complete-topic",
  authenticateUser,
  authorizeRoles("student"),
  completeTopic
);

// ======================================================
// DELETE STUDENT PROGRESS
// ======================================================

router.delete(
  "/:progressId",
  authenticateUser,
  authorizeRoles("student"),
  deleteProgress
);



module.exports = router;