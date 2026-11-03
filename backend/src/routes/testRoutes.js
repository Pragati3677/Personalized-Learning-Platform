const express = require("express");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();


// Student-only route
router.get(
  "/student",
  authenticateUser,
  authorizeRoles("student"),
  (req, res) => {
    res.json({
      success: true,
      message: "Student access granted",
      user: req.user,
    });
  }
);


// Teacher-only route
router.get(
  "/teacher",
  authenticateUser,
  authorizeRoles("teacher"),
  (req, res) => {
    res.json({
      success: true,
      message: "Teacher access granted",
      user: req.user,
    });
  }
);


module.exports = router;