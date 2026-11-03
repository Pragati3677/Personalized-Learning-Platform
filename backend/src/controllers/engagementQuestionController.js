const EngagementQuestion = require("../models/EngagementQuestion");
const Topic = require("../models/Topic");

// ======================================================
// CREATE ENGAGEMENT QUESTION
// Teacher only
// ======================================================

const createQuestion = async (req, res) => {
  try {
    const {
      topicId,
      question,
      options,
      correctAnswer,
      marks,
      difficulty,
    } = req.body;

    if (
      !topicId ||
      !question ||
      !options ||
      !correctAnswer
    ) {
      return res.status(400).json({
        success: false,
        message:
          "topicId, question, options and correctAnswer are required.",
      });
    }

    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        success: false,
        message: "At least 2 options are required.",
      });
    }

    const topic = await Topic.findOne({
      _id: topicId,
      isActive: true,
    });

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Active topic not found.",
      });
    }

    if (!options.includes(correctAnswer)) {
      return res.status(400).json({
        success: false,
        message:
          "Correct answer must be one of the provided options.",
      });
    }

    const newQuestion = await EngagementQuestion.create({
      topicId,
      question: question.trim(),
      options,
      correctAnswer: correctAnswer.trim(),
      marks: marks || 1,
      difficulty: difficulty || "medium",
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Engagement question created successfully.",
      question: newQuestion,
    });
  } catch (error) {
    console.error(
      "Create engagement question error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ======================================================
// GET QUESTIONS BY TOPIC
// Student + Teacher
// ======================================================

const getQuestionsByTopic = async (req, res) => {
  try {
    const { topicId } = req.params;

    const questions = await EngagementQuestion.find({
      topicId,
      isActive: true,
    })
      .select("-correctAnswer")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    console.error(
      "Get engagement questions error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ======================================================
// GET ONE QUESTION
// Student + Teacher
// ======================================================

const getQuestionById = async (req, res) => {
  try {
    const { questionId } = req.params;

    const question = await EngagementQuestion.findOne({
      _id: questionId,
      isActive: true,
    }).select("-correctAnswer");

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Engagement question not found.",
      });
    }

    return res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    console.error(
      "Get engagement question error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ======================================================
// UPDATE ENGAGEMENT QUESTION
// Teacher only
// ======================================================

const updateQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    const {
      topicId,
      question,
      options,
      correctAnswer,
      marks,
      difficulty,
    } = req.body;

    const existingQuestion =
      await EngagementQuestion.findById(questionId);

    if (!existingQuestion) {
      return res.status(404).json({
        success: false,
        message: "Engagement question not found.",
      });
    }

    if (topicId !== undefined) {
      const topic = await Topic.findOne({
        _id: topicId,
        isActive: true,
      });

      if (!topic) {
        return res.status(404).json({
          success: false,
          message: "Active topic not found.",
        });
      }

      existingQuestion.topicId = topicId;
    }

    if (question !== undefined) {
      existingQuestion.question = question.trim();
    }

    if (options !== undefined) {
      if (!Array.isArray(options) || options.length < 2) {
        return res.status(400).json({
          success: false,
          message: "At least 2 options are required.",
        });
      }

      existingQuestion.options = options;
    }

    if (correctAnswer !== undefined) {
      existingQuestion.correctAnswer =
        correctAnswer.trim();
    }

    if (
      !existingQuestion.options.includes(
        existingQuestion.correctAnswer
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Correct answer must be one of the provided options.",
      });
    }

    if (marks !== undefined) {
      existingQuestion.marks = marks;
    }

    if (difficulty !== undefined) {
      existingQuestion.difficulty = difficulty;
    }

    await existingQuestion.save();

    return res.status(200).json({
      success: true,
      message:
        "Engagement question updated successfully.",
      question: existingQuestion,
    });
  } catch (error) {
    console.error(
      "Update engagement question error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ======================================================
// DELETE / DEACTIVATE QUESTION
// Teacher only
// ======================================================

const deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    const question =
      await EngagementQuestion.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Engagement question not found.",
      });
    }

    question.isActive = false;

    await question.save();

    return res.status(200).json({
      success: true,
      message:
        "Engagement question deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete engagement question error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

module.exports = {
  createQuestion,
  getQuestionsByTopic,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};