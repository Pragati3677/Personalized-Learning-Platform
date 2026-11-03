const mongoose = require("mongoose");

const evaluationAnalysisSchema = new mongoose.Schema(
  {
    attemptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EngagementAttempt",
      required: true,
      unique: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },

    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    correctAnswers: {
      type: Number,
      default: 0,
      min: 0,
    },

    wrongAnswers: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalQuestions: {
      type: Number,
      default: 0,
      min: 0,
    },

    timeSpentMinutes: {
      type: Number,
      default: 0,
      min: 0,
    },

    performanceLevel: {
      type: String,
      enum: ["slow", "average", "advanced"],
      default: "average",
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    analysisSummary: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const EvaluationAnalysis = mongoose.model(
  "EvaluationAnalysis",
  evaluationAnalysisSchema
);

module.exports = EvaluationAnalysis;