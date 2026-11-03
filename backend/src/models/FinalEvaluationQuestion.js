
const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      default: "",
    },
    expectedOutput: {
      type: String,
      required: true,
    },
    isHidden: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const finalEvaluationQuestionSchema = new mongoose.Schema(
  {
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },

    questionType: {
      type: String,
      enum: ["mcq", "coding"],
      default: "mcq",
      required: true,
    },

    question: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [String],
      default: [],
      validate: {
        validator: function (value) {
          return (
            this.questionType !== "mcq" ||
            value.length >= 2
          );
        },
        message: "MCQ questions require at least 2 options.",
      },
    },

    correctAnswer: {
      type: String,
      default: "",
      trim: true,
      required: function () {
        return this.questionType === "mcq";
      },
    },

    starterCode: {
      type: String,
      default: "",
    },

    testCases: {
      type: [testCaseSchema],
      default: [],
      validate: {
        validator: function (value) {
          return (
            this.questionType !== "coding" ||
            value.length >= 1
          );
        },
        message: "Coding questions require at least 1 test case.",
      },
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
      required: true,
    },

    marks: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const FinalEvaluationQuestion = mongoose.model(
  "FinalEvaluationQuestion",
  finalEvaluationQuestionSchema
);

module.exports = FinalEvaluationQuestion;
