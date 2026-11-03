const mongoose = require("mongoose");

const prerequisiteAttemptSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    prerequisiteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prerequisite",
      required: true,
    },

    questions: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "PrerequisiteQuestion",
          required: true,
        },

        order: {
          type: Number,
          required: true,
        },

        selectedAnswer: {
          type: String,
          default: null,
        },

        questionStartedAt: {
          type: Date,
          default: null,
        },

        questionExpiresAt: {
          type: Date,
          default: null,
        },

        answeredAt: {
          type: Date,
          default: null,
        },

        isExpired: {
          type: Boolean,
          default: false,
        },
      },
    ],

    currentQuestionIndex: {
      type: Number,
      default: 0,
    },

    score: {
      type: Number,
      default: 0,
    },

    totalMarks: {
      type: Number,
      default: 100,
    },

    percentage: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "in_progress",
        "passed",
        "failed",
        "expired",
      ],
      default: "in_progress",
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    submittedAt: {
      type: Date,
      default: null,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

const PrerequisiteAttempt = mongoose.model(
  "PrerequisiteAttempt",
  prerequisiteAttemptSchema
);

module.exports = PrerequisiteAttempt;