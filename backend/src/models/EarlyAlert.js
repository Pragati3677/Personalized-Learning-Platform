const mongoose = require("mongoose");

const earlyAlertSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    topic: {
      type: String,
      required: true,
      trim: true,
    },

    alertType: {
      type: String,
      enum: [
        "not_started",
        "low_progress",
        "low_quiz_score",
        "inactive",
      ],
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    progressPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    quizScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    status: {
      type: String,
      enum: ["active", "resolved"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const EarlyAlert = mongoose.model(
  "EarlyAlert",
  earlyAlertSchema
);

module.exports = EarlyAlert;