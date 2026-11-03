const FinalEvaluationQuestion = require("../models/FinalEvaluationQuestion");
const Topic = require("../models/Topic");

// CREATE FINAL EVALUATION QUESTION
const createFinalEvaluationQuestion = async (req, res) => {
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

    const finalQuestion =
      await FinalEvaluationQuestion.create({
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
        "Final evaluation question created successfully.",
      finalQuestion,
    });
  } catch (error) {
    console.error(
      "Create final evaluation question error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// GET FINAL EVALUATION QUESTIONS BY TOPIC
const getFinalEvaluationQuestionsByTopic = async (
  req,
  res
) => {
  try {
    const { topicId } = req.params;

    const questions =
      await FinalEvaluationQuestion.find({
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
      "Get final evaluation questions error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// GET SINGLE FINAL EVALUATION QUESTION
const getFinalEvaluationQuestionById = async (
  req,
  res
) => {
  try {
    const { questionId } = req.params;

    const question =
      await FinalEvaluationQuestion.findOne({
        _id: questionId,
        isActive: true,
      }).select("-correctAnswer");

    if (!question) {
      return res.status(404).json({
        success: false,
        message:
          "Final evaluation question not found.",
      });
    }

    return res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    console.error(
      "Get final evaluation question error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// UPDATE FINAL EVALUATION QUESTION
const updateFinalEvaluationQuestion = async (
  req,
  res
) => {
  try {
    const { questionId } = req.params;

    const finalQuestion =
      await FinalEvaluationQuestion.findById(questionId);

    if (!finalQuestion) {
      return res.status(404).json({
        success: false,
        message:
          "Final evaluation question not found.",
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

      finalQuestion.topicId = topicId;
    }

    if (questionText !== undefined) {
      finalQuestion.question = questionText;
    }

    if (options !== undefined) {
      if (!Array.isArray(options) || options.length < 2) {
        return res.status(400).json({
          success: false,
          message: "At least 2 options are required.",
        });
      }

      finalQuestion.options = options;
    }

    if (correctAnswer !== undefined) {
      const currentOptions =
        options !== undefined
          ? options
          : finalQuestion.options;

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

      finalQuestion.correctAnswer = correctAnswer;
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

      finalQuestion.difficulty = difficulty;
    }

    if (marks !== undefined) {
      finalQuestion.marks = marks;
    }

    if (isActive !== undefined) {
      finalQuestion.isActive = isActive;
    }

    await finalQuestion.save();

    return res.status(200).json({
      success: true,
      message:
        "Final evaluation question updated successfully.",
      finalQuestion,
    });
  } catch (error) {
    console.error(
      "Update final evaluation question error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// DELETE FINAL EVALUATION QUESTION
const deleteFinalEvaluationQuestion = async (
  req,
  res
) => {
  try {
    const { questionId } = req.params;

    const finalQuestion =
      await FinalEvaluationQuestion.findById(questionId);

    if (!finalQuestion) {
      return res.status(404).json({
        success: false,
        message:
          "Final evaluation question not found.",
      });
    }

    // Soft delete
    finalQuestion.isActive = false;
    await finalQuestion.save();

    return res.status(200).json({
      success: true,
      message:
        "Final evaluation question deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete final evaluation question error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

module.exports = {
  createFinalEvaluationQuestion,
  getFinalEvaluationQuestionsByTopic,
  getFinalEvaluationQuestionById,
  updateFinalEvaluationQuestion,
  deleteFinalEvaluationQuestion,
};