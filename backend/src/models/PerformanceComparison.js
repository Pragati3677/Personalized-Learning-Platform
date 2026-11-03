const mongoose = require("mongoose");

const performanceComparisonSchema = new mongoose.Schema(
  {
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

    analysisId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EvaluationAnalysis",
      required: true,
    },

    finalEvaluationAttemptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FinalEvaluationAttempt",
      required: true,
    },

    initialScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },

    finalScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },

    scoreDifference: {
      type: Number,
      default: 0,
    },

    improvementPercentage: {
      type: Number,
      default: 0,
    },

    initialPerformanceLevel: {
      type: String,
      enum: ["slow", "average", "advanced"],
      required: true,
    },

    finalPerformanceLevel: {
      type: String,
      enum: ["slow", "average", "advanced"],
      required: true,
    },

    performanceImproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const PerformanceComparison = mongoose.model(
  "PerformanceComparison",
  performanceComparisonSchema
);

module.exports = PerformanceComparison;