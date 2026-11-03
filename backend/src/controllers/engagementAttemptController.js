const EngagementQuestion = require("../models/EngagementQuestion");
const EngagementAttempt = require("../models/EngagementAttempt");
const StudentProgress = require("../models/StudentProgress");

// ======================================================
// START SMART ENGAGEMENT EVALUATION
// Student only
// ======================================================

const startEvaluation = async (req, res) => {
  try {
    const { topicId } = req.body;

    if (!topicId) {
      return res.status(400).json({
        success: false,
        message: "topicId is required.",
      });
    }

    // Check whether questions exist for this topic
    const questions = await EngagementQuestion.find({
      topicId,
      isActive: true,
    })
      .select("-correctAnswer")
      .sort({ createdAt: 1 });

    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "No engagement questions found for this topic.",
      });
    }

    // Check whether student has completed the topic
    const progress = await StudentProgress.findOne({
      studentId: req.user._id,
      topic: topicId,
    });

    // We currently store topic name in StudentProgress.
    // Therefore, if progress is not found using topicId,
    // we don't block the evaluation.

    const attempt = await EngagementAttempt.create({
      studentId: req.user._id,
      topicId,
      totalQuestions: questions.length,
      status: "started",
      startedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message:
        "Smart engagement evaluation started successfully.",
      attemptId: attempt._id,
      topicId,
      totalQuestions: questions.length,
      questions,
      startedAt: attempt.startedAt,
    });
  } catch (error) {
    console.error(
      "Start engagement evaluation error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ======================================================
// SUBMIT SMART ENGAGEMENT EVALUATION
// Student only
// ======================================================

const submitEvaluation = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const { answers, timeSpentMinutes } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Answers array is required.",
      });
    }

    const attempt =
      await EngagementAttempt.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Evaluation attempt not found.",
      });
    }

    // Make sure this attempt belongs to logged-in student
    if (
      attempt.studentId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to submit this evaluation.",
      });
    }

    if (attempt.status !== "started") {
      return res.status(400).json({
        success: false,
        message:
          "This evaluation has already been submitted.",
      });
    }

    let correctAnswers = 0;
    let wrongAnswers = 0;
    let totalMarks = 0;
    let obtainedMarks = 0;

    const evaluatedAnswers = [];

    for (const answer of answers) {
      const question =
        await EngagementQuestion.findOne({
          _id: answer.questionId,
          topicId: attempt.topicId,
          isActive: true,
        });

      if (!question) {
        continue;
      }

      const selectedAnswer =
        answer.selectedAnswer || "";

      const isCorrect =
        selectedAnswer.trim().toLowerCase() ===
        question.correctAnswer.trim().toLowerCase();

      const marksObtained = isCorrect
        ? question.marks
        : 0;

      totalMarks += question.marks;
      obtainedMarks += marksObtained;

      if (isCorrect) {
        correctAnswers++;
      } else {
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
      totalMarks > 0
        ? Number(
            ((obtainedMarks / totalMarks) * 100).toFixed(2)
          )
        : 0;

    attempt.answers = evaluatedAnswers;
    attempt.totalQuestions = evaluatedAnswers.length;
    attempt.correctAnswers = correctAnswers;
    attempt.wrongAnswers = wrongAnswers;
    attempt.totalMarks = totalMarks;
    attempt.obtainedMarks = obtainedMarks;
    attempt.percentage = percentage;
    attempt.timeSpentMinutes =
      timeSpentMinutes || 0;
    attempt.status = "completed";
    attempt.completedAt = new Date();

    await attempt.save();

    return res.status(200).json({
      success: true,
      message:
        "Smart engagement evaluation submitted successfully.",
      result: {
        attemptId: attempt._id,
        totalQuestions: attempt.totalQuestions,
        correctAnswers: attempt.correctAnswers,
        wrongAnswers: attempt.wrongAnswers,
        totalMarks: attempt.totalMarks,
        obtainedMarks: attempt.obtainedMarks,
        percentage: attempt.percentage,
        timeSpentMinutes: attempt.timeSpentMinutes,
        status: attempt.status,
      },
    });
  } catch (error) {
    console.error(
      "Submit engagement evaluation error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ======================================================
// GET MY EVALUATION ATTEMPTS
// Student only
// ======================================================

const getMyAttempts = async (req, res) => {
  try {
    const attempts =
      await EngagementAttempt.find({
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
      "Get engagement attempts error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

module.exports = {
  startEvaluation,
  submitEvaluation,
  getMyAttempts,
};