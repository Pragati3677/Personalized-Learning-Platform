const Notification = require("../models/Notification");
const User = require("../models/User");

/* =========================================================
   SEND NOTIFICATION TO STUDENT
========================================================= */

const sendNotification = async (req, res) => {
  try {
    const { studentId, title, message, type } = req.body;

    // Teacher is taken from authenticated JWT
    const teacherId = req.user.id;

    if (!studentId || !title || !message) {
      return res.status(400).json({
        success: false,
        message:
          "Student, title and message are required.",
      });
    }

    // Verify student exists and is actually a student
    const student = await User.findOne({
      _id: studentId,
      role: "student",
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    // Create notification
    const notification =
      await Notification.create({
        studentId,
        teacherId,
        title: title.trim(),
        message: message.trim(),
        type: type || "teacher_message",
      });

    // Return notification with useful information
    const populatedNotification =
      await Notification.findById(
        notification._id
      )
        .populate(
          "studentId",
          "name email"
        )
        .populate(
          "teacherId",
          "name email"
        );

    return res.status(201).json({
      success: true,
      message:
        "Notification sent successfully.",
      notification:
        populatedNotification,
    });
  } catch (error) {
    console.error(
      "Send notification error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to send notification.",
      error: error.message,
    });
  }
};

/* =========================================================
   GET STUDENT NOTIFICATIONS
========================================================= */

const getMyNotifications = async (
  req,
  res
) => {
  try {
    const studentId = req.user.id;

    const notifications =
      await Notification.find({
        studentId,
      })
        .populate(
          "teacherId",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount:
        notifications.filter(
          (notification) =>
            !notification.isRead
        ).length,
      notifications,
    });
  } catch (error) {
    console.error(
      "Get notifications error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch notifications.",
      error: error.message,
    });
  }
};

/* =========================================================
   MARK ONE NOTIFICATION AS READ
========================================================= */

const markNotificationAsRead =
  async (req, res) => {
    try {
      const { notificationId } =
        req.params;

      const studentId = req.user.id;

      const notification =
        await Notification.findOneAndUpdate(
          {
            _id: notificationId,
            studentId,
          },
          {
            isRead: true,
          },
          {
            new: true,
          }
        );

      if (!notification) {
        return res.status(404).json({
          success: false,
          message:
            "Notification not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Notification marked as read.",
        notification,
      });
    } catch (error) {
      console.error(
        "Mark notification read error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update notification.",
        error: error.message,
      });
    }
  };

/* =========================================================
   MARK ALL NOTIFICATIONS AS READ
========================================================= */

const markAllNotificationsAsRead =
  async (req, res) => {
    try {
      const studentId = req.user.id;

      const result =
        await Notification.updateMany(
          {
            studentId,
            isRead: false,
          },
          {
            isRead: true,
          }
        );

      return res.status(200).json({
        success: true,
        message:
          "All notifications marked as read.",
        modifiedCount:
          result.modifiedCount,
      });
    } catch (error) {
      console.error(
        "Mark all notifications read error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update notifications.",
        error: error.message,
      });
    }
  };

module.exports = {
  sendNotification,
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};