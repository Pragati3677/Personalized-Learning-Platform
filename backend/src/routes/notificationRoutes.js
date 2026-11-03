const express = require("express");

const {
  sendNotification,
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = require("../controllers/notificationController");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================================================
   TEACHER → SEND NOTIFICATION TO STUDENT
========================================================= */

router.post(
  "/send",
  authenticateUser,
  authorizeRoles("teacher"),
  sendNotification
);

/* =========================================================
   STUDENT → GET MY NOTIFICATIONS
========================================================= */

router.get(
  "/my",
  authenticateUser,
  authorizeRoles("student"),
  getMyNotifications
);

/* =========================================================
   STUDENT → MARK ONE NOTIFICATION AS READ
========================================================= */

router.patch(
  "/:notificationId/read",
  authenticateUser,
  authorizeRoles("student"),
  markNotificationAsRead
);

/* =========================================================
   STUDENT → MARK ALL NOTIFICATIONS AS READ
========================================================= */

router.patch(
  "/read-all",
  authenticateUser,
  authorizeRoles("student"),
  markAllNotificationsAsRead
);

module.exports = router;