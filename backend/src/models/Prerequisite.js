const mongoose = require("mongoose");

const prerequisiteSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    javaQuestionCount: {
      type: Number,
      default: 20,
    },

    dsaQuestionCount: {
      type: Number,
      default: 10,
    },

    javaMarksPerQuestion: {
      type: Number,
      default: 3,
    },

    dsaMarksPerQuestion: {
      type: Number,
      default: 4,
    },

    totalQuestions: {
      type: Number,
      default: 30,
    },

    totalMarks: {
      type: Number,
      default: 100,
    },

    timePerQuestion: {
      type: Number,
      default: 60, // 60 seconds = 1 minute
    },

    totalTime: {
      type: Number,
      default: 1800, // 30 minutes
    },

    passingScore: {
      type: Number,
      default: 40,
      min: 0,
      max: 100,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Prerequisite = mongoose.model(
  "Prerequisite",
  prerequisiteSchema
);

module.exports = Prerequisite;