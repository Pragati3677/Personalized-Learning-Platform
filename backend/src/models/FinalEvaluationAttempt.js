
const mongoose = require("mongoose");

const finalEvaluationAttemptSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      default: null,
    },

    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "FinalEvaluationQuestion",
          required: true,
        },

        // Used for MCQ answers
        selectedAnswer: {
          type: String,
          default: "",
        },

        // Used for Java coding submissions
        submittedCode: {
          type: String,
          default: "",
        },

        isCorrect: {
          type: Boolean,
          default: false,
        },

        marksObtained: {
          type: Number,
          default: 0,
          min: 0,
        },

        submittedAt: {
          type: Date,
          default: null,
        },
      },
    ],

    totalQuestions: {
      type: Number,
      default: 30,
    },

    attemptedQuestions: {
      type: Number,
      default: 0,
    },

    correctAnswers: {
      type: Number,
      default: 0,
    },

    wrongAnswers: {
      type: Number,
      default: 0,
    },

    totalMarks: {
      type: Number,
      default: 100,
    },

    obtainedMarks: {
      type: Number,
      default: 0,
    },

    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    certificateEligible: {
      type: Boolean,
      default: false,
    },

    // Assessment monitoring
    tabSwitchCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    isLocked: {
      type: Boolean,
      default: false,
    },

    lockedAt: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["started", "completed", "locked"],
      default: "started",
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    expiresAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "FinalEvaluationAttempt",
  finalEvaluationAttemptSchema
);
