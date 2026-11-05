const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    finalEvaluationAttemptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FinalEvaluationAttempt",
      required: true,
    },

    certificateId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    courseName: {
      type: String,
      required: true,
      default: "Java Programming",
    },

    score: {
      type: Number,
      required: true,
      min: 96,
      max: 100,
    },

    totalMarks: {
      type: Number,
      required: true,
      default: 100,
    },

    percentage: {
      type: Number,
      required: true,
    },

    issuedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["issued"],
      default: "issued",
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate certificates for the same attempt.
certificateSchema.index(
  {
    studentId: 1,
    finalEvaluationAttemptId: 1,
  },
  { unique: true }
);

module.exports = mongoose.model(
  "Certificate",
  certificateSchema
);