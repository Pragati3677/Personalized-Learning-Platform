const mongoose = require("mongoose");

const learningResourceSchema = new mongoose.Schema(
  {
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    type: {
      type: String,
      required: true,
      enum: ["note", "video", "worksheet"],
    },

    level: {
      type: String,
      required: true,
      enum: ["basic", "medium", "advanced"],
      default: "basic",
      index: true,
    },

    content: {
      type: String,
      default: "",
    },

    url: {
      type: String,
      default: "",
      trim: true,
    },

    order: {
      type: Number,
      default: 0,
      min: 0,
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

learningResourceSchema.index({
  topicId: 1,
  level: 1,
  type: 1,
  isActive: 1,
});

const LearningResource = mongoose.model(
  "LearningResource",
  learningResourceSchema
);

module.exports = LearningResource;