const mongoose = require("mongoose");

const engagementQuestionSchema = new mongoose.Schema(
  {
    // Topic to which this question belongs
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },

    // Question text
    question: {
      type: String,
      required: true,
      trim: true,
    },

    // Multiple-choice options
    options: {
      type: [String],
      required: true,
      validate: {
        validator: function (value) {
          return value.length >= 2;
        },
        message: "At least 2 options are required.",
      },
    },

    // Correct option
    correctAnswer: {
      type: String,
      required: true,
      trim: true,
    },

    // Marks for the question
    // Basic = 3
    // Medium = 3
    // Advanced = 4
    marks: {
      type: Number,
      required: true,
      min: 1,
    },

    // Assessment difficulty
    difficulty: {
      type: String,
      enum: ["basic", "medium", "advanced"],
      required: true,
    },

    // Whether the question is available for assessment
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const EngagementQuestion = mongoose.model(
  "EngagementQuestion",
  engagementQuestionSchema
);

module.exports = EngagementQuestion;