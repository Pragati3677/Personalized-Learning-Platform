const mongoose = require("mongoose");

const teacherReportSchema = new mongoose.Schema(
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

    performanceComparisonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PerformanceComparison",
      default: null,
    },

    initialScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    finalScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
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

    improvementPercentage: {
      type: Number,
      default: 0,
    },

    reportSummary: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const TeacherReport = mongoose.model(
  "TeacherReport",
  teacherReportSchema
);

module.exports = TeacherReport;