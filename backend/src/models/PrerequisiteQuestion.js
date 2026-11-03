const mongoose = require("mongoose");

const prerequisiteQuestionSchema = new mongoose.Schema(
  {
    prerequisiteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prerequisite",
      required: true,
    },

    category: {
      type: String,
      enum: ["java", "dsa"],
      required: true,
    },

    question: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [String],
      required: true,
      validate: {
        validator: function (options) {
          return options.length === 4;
        },
        message: "Each question must have exactly 4 options.",
      },
    },

    correctAnswer: {
      type: String,
      required: true,
    },

    marks: {
      type: Number,
      required: true,
      enum: [3, 4],
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
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

const PrerequisiteQuestion = mongoose.model(
  "PrerequisiteQuestion",
  prerequisiteQuestionSchema
);

module.exports = PrerequisiteQuestion;