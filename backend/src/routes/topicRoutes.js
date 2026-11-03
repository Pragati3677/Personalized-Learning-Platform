const express = require("express");

const {
  createTopic,
  getAllTopics,
  getTopicById,
  updateTopic,
  deleteTopic,
} = require("../controllers/topicController");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();


// ======================================================
// GET ALL TOPICS
// Student + Teacher
// ======================================================

router.get(
  "/",
  authenticateUser,
  authorizeRoles("student", "teacher"),
  getAllTopics
);


// ======================================================
// GET ONE TOPIC
// Student + Teacher
// ======================================================

router.get(
  "/:topicId",
  authenticateUser,
  authorizeRoles("student", "teacher"),
  getTopicById
);


// ======================================================
// CREATE TOPIC
// Teacher only
// ======================================================

router.post(
  "/",
  authenticateUser,
  authorizeRoles("teacher"),
  createTopic
);


// ======================================================
// UPDATE TOPIC
// Teacher only
// ======================================================

router.put(
  "/:topicId",
  authenticateUser,
  authorizeRoles("teacher"),
  updateTopic
);


// ======================================================
// DELETE TOPIC
// Teacher only
// ======================================================

router.delete(
  "/:topicId",
  authenticateUser,
  authorizeRoles("teacher"),
  deleteTopic
);


module.exports = router;