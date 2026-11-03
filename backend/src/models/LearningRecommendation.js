const mongoose = require("mongoose");

const learningRecommendationSchema = new mongoose.Schema(
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

    performanceLevel: {
      type: String,
      enum: ["slow", "average", "advanced"],
      required: true,
    },

    recommendedContent: [
      {
        type: String,
        trim: true,
      },
    ],

    recommendedActivities: [
      {
        type: String,
        trim: true,
      },
    ],

    recommendationReason: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const LearningRecommendation = mongoose.model(
  "LearningRecommendation",
  learningRecommendationSchema
);

module.exports = LearningRecommendation;