const mongoose = require("mongoose");

const studentProgressSchema = new mongoose.Schema(
  {
    // ==========================================
    // STUDENT
    // ==========================================

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==========================================
    // TOPIC
    // ==========================================

    topic: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // PROGRESS STATUS
    // ==========================================

    status: {
      type: String,
      enum: [
        "not_started",
        "in_progress",
        "completed",
      ],
      default: "not_started",
    },

    // ==========================================
    // OVERALL PROGRESS
    // ==========================================

    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // ==========================================
    // LESSON PROGRESS
    // ==========================================

    completedLessons: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalLessons: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ==========================================
    // QUIZ INFORMATION
    // ==========================================

    quizAttempts: {
      type: Number,
      default: 0,
      min: 0,
    },

    bestQuizScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    lastQuizScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // ==========================================
    // TIME SPENT
    // ==========================================

    timeSpentMinutes: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ==========================================
    // ACCESS / COMPLETION DATES
    // ==========================================

    lastAccessedAt: {
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

// ==========================================
// CREATE MODEL
// ==========================================

const StudentProgress = mongoose.model(
  "StudentProgress",
  studentProgressSchema
);

module.exports = StudentProgress;