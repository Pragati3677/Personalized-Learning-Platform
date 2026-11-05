
const EngagementQuestion = require("../models/EngagementQuestion");
const EngagementAttempt = require("../models/EngagementAttempt");
const StudentProgress = require("../models/StudentProgress");
const Topic = require("../models/Topic");

// ======================================================
// START SMART ENGAGEMENT EVALUATION
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

    // Find topic
    const topic = await Topic.findById(topicId);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found.",
      });
    }

    // Fetch active questions
    const questions = await EngagementQuestion.find({
      topicId,
      isActive: true,
    })
      .select("-correctAnswer")
      .sort({ createdAt: 1 });

    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No engagement questions found for this topic.",
      });
    }

    // Create new attempt
    const attempt = await EngagementAttempt.create({
      studentId: req.user._id,
      topicId,
      totalQuestions: questions.length,
      status: "started",
      startedAt: new Date(),
    });

    console.log("Smart evaluation started:", {
      attemptId: attempt._id,
      studentId: req.user._id,
      topic: topic.title,
    });

    return res.status(201).json({
      success: true,
      message: "Smart engagement evaluation started successfully.",
      attemptId: attempt._id,
      topicId,
      totalQuestions: questions.length,
      questions,
      startedAt: attempt.startedAt,
    });

  } catch (error) {
    console.error("Start engagement evaluation error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while starting evaluation.",
      error: error.message,
    });
  }
};

// ======================================================
// SUBMIT SMART ENGAGEMENT EVALUATION
// ======================================================

const submitEvaluation = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { answers, timeSpentMinutes } = req.body;

    console.log("========== QUIZ SUBMISSION ==========");
    console.log("Attempt ID:", attemptId);
    console.log("Student ID:", req.user._id);

    // Validate answers
    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Answers array is required.",
      });
    }

    // Find attempt
    const attempt = await EngagementAttempt.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Evaluation attempt not found.",
      });
    }

    // Check ownership
    if (
      attempt.studentId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to submit this evaluation.",
      });
    }

    // Prevent duplicate submission
    if (attempt.status !== "started") {
      return res.status(400).json({
        success: false,
        message: "This evaluation has already been submitted.",
      });
    }

    // Find topic
    const topic = await Topic.findById(attempt.topicId);

    if (!topic || !topic.title) {
      return res.status(404).json({
        success: false,
        message: "Topic not found or topic title is missing.",
      });
    }

    const topicName = topic.title.trim();

    console.log("Topic name:", topicName);

    // ==================================================
    // EVALUATE ANSWERS
    // ==================================================

    let correctAnswers = 0;
    let wrongAnswers = 0;
    let totalMarks = 0;
    let obtainedMarks = 0;

    const evaluatedAnswers = [];

    for (const answer of answers) {
      const question = await EngagementQuestion.findOne({
        _id: answer.questionId,
        topicId: attempt.topicId,
        isActive: true,
      });

      if (!question) {
        console.log("Question not found:", answer.questionId);
        continue;
      }

      const selectedAnswer = String(
        answer.selectedAnswer || ""
      ).trim();

      const correctAnswer = String(
        question.correctAnswer || ""
      ).trim();

      const isCorrect =
        selectedAnswer.toLowerCase() ===
        correctAnswer.toLowerCase();

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

    // Calculate percentage
    const percentage =
      totalMarks > 0
        ? Number(
            ((obtainedMarks / totalMarks) * 100).toFixed(2)
          )
        : 0;

    console.log("Evaluation result:", {
      totalQuestions: evaluatedAnswers.length,
      correctAnswers,
      wrongAnswers,
      totalMarks,
      obtainedMarks,
      percentage,
    });

    // ==================================================
    // UPDATE STUDENT PROGRESS
    // ==================================================

    console.log("Updating StudentProgress...");

    const progress = await StudentProgress.findOneAndUpdate(
      {
        studentId: req.user._id,
        topic: topicName,
      },
      {
        $inc: {
          quizAttempts: 1,
        },

        $set: {
          lastQuizScore: percentage,
          lastAccessedAt: new Date(),
        },

        $max: {
          bestQuizScore: percentage,
        },

        $setOnInsert: {
          status: "not_started",
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      }
    );

    if (!progress) {
      throw new Error(
        "StudentProgress could not be updated."
      );
    }

    console.log("StudentProgress updated successfully:", {
      studentId: progress.studentId,
      topic: progress.topic,
      quizAttempts: progress.quizAttempts,
      bestQuizScore: progress.bestQuizScore,
      lastQuizScore: progress.lastQuizScore,
    });

    // ==================================================
    // SAVE EVALUATION ATTEMPT
    // ==================================================

    attempt.answers = evaluatedAnswers;
    attempt.totalQuestions = evaluatedAnswers.length;
    attempt.correctAnswers = correctAnswers;
    attempt.wrongAnswers = wrongAnswers;
    attempt.totalMarks = totalMarks;
    attempt.obtainedMarks = obtainedMarks;
    attempt.percentage = percentage;

    attempt.timeSpentMinutes = Math.max(
      0,
      Number(timeSpentMinutes) || 0
    );

    attempt.status = "completed";
    attempt.completedAt = new Date();

    await attempt.save();

    console.log("Quiz attempt saved successfully.");
    console.log("Final quiz attempts:", progress.quizAttempts);
    console.log("=====================================");

    // ==================================================
    // SEND RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,
      message: "Smart engagement evaluation submitted successfully.",

      result: {
        attemptId: attempt._id,
        topicName,
        totalQuestions: attempt.totalQuestions,
        correctAnswers: attempt.correctAnswers,
        wrongAnswers: attempt.wrongAnswers,
        totalMarks: attempt.totalMarks,
        obtainedMarks: attempt.obtainedMarks,
        percentage: attempt.percentage,
        timeSpentMinutes: attempt.timeSpentMinutes,
        status: attempt.status,
      },

      progress: {
        quizAttempts: progress.quizAttempts,
        bestQuizScore: progress.bestQuizScore,
        lastQuizScore: progress.lastQuizScore,
      },
    });

  } catch (error) {
    console.error("Submit engagement evaluation error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while submitting evaluation.",
      error: error.message,
    });
  }
};

// ======================================================
// GET MY EVALUATION ATTEMPTS
// ======================================================

const getMyAttempts = async (req, res) => {
  try {
    const attempts = await EngagementAttempt.find({
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
    console.error("Get engagement attempts error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching evaluation attempts.",
      error: error.message,
    });
  }
};

// ======================================================
// EXPORT CONTROLLERS
// ======================================================

module.exports = {
  startEvaluation,
  submitEvaluation,
  getMyAttempts,
};
