const express = require("express");

const {
  createResource,
  getAllResources,
  getResourcesByTopic,
  getResourceById,
  updateResource,
  deleteResource,
} = require("../controllers/learningResourceController");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();


// ======================================================
// GET ALL LEARNING RESOURCES
// Student + Teacher
// ======================================================

router.get(
  "/",
  authenticateUser,
  authorizeRoles("student", "teacher"),
  getAllResources
);


// ======================================================
// GET RESOURCES BY TOPIC
// Student + Teacher
// ======================================================

router.get(
  "/topic/:topicId",
  authenticateUser,
  authorizeRoles("student", "teacher"),
  getResourcesByTopic
);


// ======================================================
// GET RESOURCE BY ID
// Student + Teacher
// ======================================================

router.get(
  "/:resourceId",
  authenticateUser,
  authorizeRoles("student", "teacher"),
  getResourceById
);


// ======================================================
// CREATE RESOURCE
// Teacher only
// ======================================================

router.post(
  "/",
  authenticateUser,
  authorizeRoles("teacher"),
  createResource
);


// ======================================================
// UPDATE RESOURCE
// Teacher only
// ======================================================

router.put(
  "/:resourceId",
  authenticateUser,
  authorizeRoles("teacher"),
  updateResource
);


// ======================================================
// DELETE RESOURCE
// Teacher only
// ======================================================

router.delete(
  "/:resourceId",
  authenticateUser,
  authorizeRoles("teacher"),
  deleteResource
);


module.exports = router;