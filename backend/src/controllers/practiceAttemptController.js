const PracticeAttempt = require("../models/PracticeAttempt");
const PracticeQuestion = require("../models/PracticeQuestion");
const LearningRecommendation = require("../models/LearningRecommendation");

// START PRACTICE
const startPractice = async (req, res) => {
  try {
    const { topicId } = req.body;

    if (!topicId) {
      return res.status(400).json({
        success: false,
        message: "topicId is required.",
      });
    }

    // Check whether the student has an active recommendation
    const recommendation = await LearningRecommendation.findOne({
      studentId: req.user._id,
      topicId,
      status: "active",
    });

    if (!recommendation) {
      return res.status(403).json({
        success: false,
        message:
          "No active learning recommendation found for this topic.",
      });
    }

    // Get active practice questions
    const questions = await PracticeQuestion.find({
      topicId,
      isActive: true,
    })
      .select("-correctAnswer")
      .sort({ difficulty: 1, createdAt: 1 });

    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "No practice questions available for this topic.",
      });
    }

    const totalMarks = await PracticeQuestion.aggregate([
      {
        $match: {
          topicId: questions[0].topicId,
          isActive: true,
        },
      },
      {
        $group: {
          _id: null,
          totalMarks: { $sum: "$marks" },
        },
      },
    ]);

    const attempt = await PracticeAttempt.create({
      studentId: req.user._id,
      topicId,
      totalQuestions: questions.length,
      totalMarks:
        totalMarks.length > 0
          ? totalMarks[0].totalMarks
          : 0,
      status: "started",
      startedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Practice started successfully.",
      attemptId: attempt._id,
      topicId,
      totalQuestions: questions.length,
      totalMarks: attempt.totalMarks,
      questions,
    });
  } catch (error) {
    console.error(
      "Start practice error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// SUBMIT PRACTICE
const submitPractice = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "answers must be an array.",
      });
    }

    const attempt = await PracticeAttempt.findById(
      attemptId
    );

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Practice attempt not found.",
      });
    }

    if (
      attempt.studentId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to submit this practice attempt.",
      });
    }

    if (attempt.status !== "started") {
      return res.status(400).json({
        success: false,
        message:
          "This practice attempt has already been completed.",
      });
    }

    const questionIds = answers.map(
      (answer) => answer.questionId
    );

    const questions = await PracticeQuestion.find({
      _id: { $in: questionIds },
      topicId: attempt.topicId,
      isActive: true,
    });

    if (questions.length !== questionIds.length) {
      return res.status(400).json({
        success: false,
        message:
          "One or more practice questions are invalid.",
      });
    }

    let correctAnswers = 0;
    let wrongAnswers = 0;
    let attemptedQuestions = 0;
    let obtainedMarks = 0;

    const evaluatedAnswers = [];

    for (const answer of answers) {
      const question = questions.find(
        (item) =>
          item._id.toString() ===
          answer.questionId.toString()
      );

      if (!question) {
        continue;
      }

      const selectedAnswer =
        answer.selectedAnswer || "";

      const isAttempted =
        selectedAnswer.trim() !== "";

      const isCorrect =
        isAttempted &&
        selectedAnswer.trim().toLowerCase() ===
          question.correctAnswer.trim().toLowerCase();

      let marksObtained = 0;

      if (isAttempted) {
        attemptedQuestions++;
      }

      if (isCorrect) {
        correctAnswers++;
        marksObtained = question.marks;
        obtainedMarks += question.marks;
      } else if (isAttempted) {
        wrongAnswers++;
      }

      evaluatedAnswers.push({
        questionId: question._id,
        selectedAnswer,
        isCorrect,
        marksObtained,
      });
    }

    const percentage =
      attempt.totalMarks > 0
        ? Number(
            (
              (obtainedMarks / attempt.totalMarks) *
              100
            ).toFixed(2)
          )
        : 0;

    attempt.answers = evaluatedAnswers;
    attempt.attemptedQuestions = attemptedQuestions;
    attempt.correctAnswers = correctAnswers;
    attempt.wrongAnswers = wrongAnswers;
    attempt.obtainedMarks = obtainedMarks;
    attempt.percentage = percentage;
    attempt.status = "completed";
    attempt.completedAt = new Date();

    await attempt.save();

    return res.status(200).json({
      success: true,
      message: "Practice submitted successfully.",
      result: {
        attemptId: attempt._id,
        totalQuestions: attempt.totalQuestions,
        attemptedQuestions: attempt.attemptedQuestions,
        correctAnswers: attempt.correctAnswers,
        wrongAnswers: attempt.wrongAnswers,
        totalMarks: attempt.totalMarks,
        obtainedMarks: attempt.obtainedMarks,
        percentage: attempt.percentage,
        status: attempt.status,
      },
    });
  } catch (error) {
    console.error(
      "Submit practice error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// GET MY PRACTICE ATTEMPTS
const getMyPracticeAttempts = async (req, res) => {
  try {
    const attempts = await PracticeAttempt.find({
      studentId: req.user._id,
    })
      .populate("topicId", "title")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: attempts.length,
      attempts,
    });
  } catch (error) {
    console.error(
      "Get practice attempts error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

module.exports = {
  startPractice,
  submitPractice,
  getMyPracticeAttempts,
};