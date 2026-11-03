const PracticeQuestion = require("../models/PracticeQuestion");
const Topic = require("../models/Topic");

// CREATE PRACTICE QUESTION
const createPracticeQuestion = async (req, res) => {
  try {
    const {
      topicId,
      question,
      options,
      correctAnswer,
      difficulty,
      marks,
    } = req.body;

    if (
      !topicId ||
      !question ||
      !options ||
      !correctAnswer ||
      !difficulty
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }

    // Check topic
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

    // Validate options
    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        success: false,
        message: "At least 2 options are required.",
      });
    }

    // Validate correct answer
    const normalizedOptions = options.map((option) =>
      option.trim().toLowerCase()
    );

    if (
      !normalizedOptions.includes(
        correctAnswer.trim().toLowerCase()
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "correctAnswer must match one of the provided options.",
      });
    }

    // Validate difficulty
    if (!["easy", "medium", "hard"].includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message:
          "Difficulty must be easy, medium, or hard.",
      });
    }

    const practiceQuestion =
      await PracticeQuestion.create({
        topicId,
        question,
        options,
        correctAnswer,
        difficulty,
        marks: marks || 1,
      });

    return res.status(201).json({
      success: true,
      message:
        "Practice question created successfully.",
      practiceQuestion,
    });
  } catch (error) {
    console.error(
      "Create practice question error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// GET PRACTICE QUESTIONS FOR A TOPIC
const getPracticeQuestionsByTopic = async (req, res) => {
  try {
    const { topicId } = req.params;

    const questions = await PracticeQuestion.find({
      topicId,
      isActive: true,
    })
      .select("-correctAnswer")
      .sort({ difficulty: 1, createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    console.error(
      "Get practice questions error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// GET SINGLE PRACTICE QUESTION
const getPracticeQuestionById = async (req, res) => {
  try {
    const { questionId } = req.params;

    const question = await PracticeQuestion.findOne({
      _id: questionId,
      isActive: true,
    }).select("-correctAnswer");

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Practice question not found.",
      });
    }

    return res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    console.error(
      "Get practice question error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// UPDATE PRACTICE QUESTION
const updatePracticeQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    const question =
      await PracticeQuestion.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Practice question not found.",
      });
    }

    const {
      topicId,
      question: questionText,
      options,
      correctAnswer,
      difficulty,
      marks,
      isActive,
    } = req.body;

    if (topicId) {
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

      question.topicId = topicId;
    }

    if (questionText !== undefined) {
      question.question = questionText;
    }

    if (options !== undefined) {
      if (!Array.isArray(options) || options.length < 2) {
        return res.status(400).json({
          success: false,
          message: "At least 2 options are required.",
        });
      }

      question.options = options;
    }

    if (correctAnswer !== undefined) {
      const currentOptions =
        options !== undefined
          ? options
          : question.options;

      const normalizedOptions = currentOptions.map(
        (option) => option.trim().toLowerCase()
      );

      if (
        !normalizedOptions.includes(
          correctAnswer.trim().toLowerCase()
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "correctAnswer must match one of the provided options.",
        });
      }

      question.correctAnswer = correctAnswer;
    }

    if (difficulty !== undefined) {
      if (
        !["easy", "medium", "hard"].includes(
          difficulty
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Difficulty must be easy, medium, or hard.",
        });
      }

      question.difficulty = difficulty;
    }

    if (marks !== undefined) {
      question.marks = marks;
    }

    if (isActive !== undefined) {
      question.isActive = isActive;
    }

    await question.save();

    return res.status(200).json({
      success: true,
      message:
        "Practice question updated successfully.",
      practiceQuestion: question,
    });
  } catch (error) {
    console.error(
      "Update practice question error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// DELETE PRACTICE QUESTION
const deletePracticeQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    const question =
      await PracticeQuestion.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Practice question not found.",
      });
    }

    // Soft delete
    question.isActive = false;
    await question.save();

    return res.status(200).json({
      success: true,
      message:
        "Practice question deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete practice question error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

module.exports = {
  createPracticeQuestion,
  getPracticeQuestionsByTopic,
  getPracticeQuestionById,
  updatePracticeQuestion,
  deletePracticeQuestion,
};