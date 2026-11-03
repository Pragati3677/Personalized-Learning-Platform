const EvaluationAnalysis = require("../models/EvaluationAnalysis");
const EngagementAttempt = require("../models/EngagementAttempt");
const PrerequisiteAttempt = require("../models/PrerequisiteAttempt");
const StudentProgress = require("../models/StudentProgress");
const Topic = require("../models/Topic");
const PracticeAttempt = require("../models/PracticeAttempt");
const EngagementQuestion = require("../models/EngagementQuestion");
const User = require("../models/User");

const { predictLearningLevel } = require("../services/mlService");

// ======================================================
// CREATE EVALUATION ANALYSIS
// Student only
// ======================================================

const createAnalysis = async (req, res) => {
  try {
    const { attemptId } = req.body;

    if (!attemptId) {
      return res.status(400).json({
        success: false,
        message: "attemptId is required.",
      });
    }

    // Find the completed engagement attempt
    const attempt = await EngagementAttempt.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Evaluation attempt not found.",
      });
    }

    // Verify that the attempt belongs to the logged-in student
    if (attempt.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to analyze this attempt.",
      });
    }

    // Only completed evaluations can be analyzed
    if (attempt.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Only completed evaluations can be analyzed.",
      });
    }

    // Prevent duplicate analysis
    const existingAnalysis = await EvaluationAnalysis.findOne({
      attemptId: attempt._id,
    });

    if (existingAnalysis) {
      return res.status(409).json({
        success: false,
        message: "Analysis for this attempt already exists.",
        analysis: existingAnalysis,
      });
    }

    // ==================================================
    // COLLECT STUDENT PERFORMANCE DATA
    // ==================================================

    const percentage = attempt.percentage;

    // Get the latest prerequisite assessment score.
    // This is used as a baseline feature, not the only
    // factor that determines the student's learning level.
    const prerequisiteAttempt = await PrerequisiteAttempt.findOne({
      studentId: req.user._id,
      status: { $in: ["passed", "failed"] },
    }).sort({ submittedAt: -1 });

    const prerequisiteScore = prerequisiteAttempt
      ? prerequisiteAttempt.percentage
      : 0;

    console.log("Prerequisite Score:", prerequisiteScore);

    // Get topic completion rate
    const topic = await Topic.findById(attempt.topicId);

    const studentProgress = topic
      ? await StudentProgress.findOne({
          studentId: req.user._id,
          topic: topic.title,
        })
      : null;

    const learningCompletionRate = studentProgress
      ? studentProgress.progressPercentage
      : 0;

    console.log("Learning Completion Rate:", learningCompletionRate);

    // Count completed practice attempts for this topic
    const practiceAttempts = await PracticeAttempt.countDocuments({
      studentId: req.user._id,
      topicId: attempt.topicId,
      status: "completed",
    });

    const effortProxy = attempt.timeSpentMinutes + practiceAttempts;

    console.log("Practice Attempts:", practiceAttempts);
    console.log("Effort Proxy:", effortProxy);

    // Get previous analysis for this student and topic
    const previousAnalysis = await EvaluationAnalysis.findOne({
      studentId: req.user._id,
      topicId: attempt.topicId,
    }).sort({ createdAt: -1 });

    const isFirstCycle = previousAnalysis ? 0 : 1;

    const previousLevel = previousAnalysis
      ? previousAnalysis.performanceLevel
      : null;

    const previousScore = previousAnalysis
      ? previousAnalysis.percentage
      : 0;

    console.log("Is First Cycle:", isFirstCycle);
    console.log("Previous Score:", previousScore);

    // Calculate improvement over the previous assessment
    const improvementPct =
      previousAnalysis && previousScore > 0
        ? ((percentage - previousScore) / previousScore) * 100
        : 0;

    console.log("Improvement Percentage:", improvementPct);

    // Convert the previous predicted level into a number
    const initialLevelNumeric =
      previousLevel === "slow"
        ? 1
        : previousLevel === "average"
        ? 2
        : previousLevel === "advanced"
        ? 3
        : 2;

    console.log("Initial Level Numeric:", initialLevelNumeric);

    // ==================================================
    // CALCULATE ACCURACY BY QUESTION DIFFICULTY
    // ==================================================

    const questionIds = attempt.answers.map(
      (answer) => answer.questionId
    );

    const engagementQuestions = await EngagementQuestion.find({
      _id: { $in: questionIds },
    });

    let easyCorrect = 0;
    let easyTotal = 0;

    let mediumCorrect = 0;
    let mediumTotal = 0;

    let hardCorrect = 0;
    let hardTotal = 0;

    for (const answer of attempt.answers) {
      const question = engagementQuestions.find(
        (q) => q._id.toString() === answer.questionId.toString()
      );

      if (!question) continue;

      if (question.difficulty === "easy") {
        easyTotal++;

        if (answer.isCorrect) {
          easyCorrect++;
        }
      }

      if (question.difficulty === "medium") {
        mediumTotal++;

        if (answer.isCorrect) {
          mediumCorrect++;
        }
      }

      if (question.difficulty === "hard") {
        hardTotal++;

        if (answer.isCorrect) {
          hardCorrect++;
        }
      }
    }

    const easyAccuracy =
      easyTotal > 0 ? (easyCorrect / easyTotal) * 100 : 0;

    const mediumAccuracy =
      mediumTotal > 0 ? (mediumCorrect / mediumTotal) * 100 : 0;

    const hardAccuracy =
      hardTotal > 0 ? (hardCorrect / hardTotal) * 100 : 0;

    const accuracyValues = [
      easyAccuracy,
      mediumAccuracy,
      hardAccuracy,
    ];

    const accuracySpread =
      Math.max(...accuracyValues) - Math.min(...accuracyValues);

    console.log("Easy Accuracy:", easyAccuracy);
    console.log("Medium Accuracy:", mediumAccuracy);
    console.log("Hard Accuracy:", hardAccuracy);
    console.log("Accuracy Spread:", accuracySpread);

    // ==================================================
    // PREPARE FEATURES FOR THE RANDOM FOREST MODEL
    // ==================================================

    const mlFeatures = {
      prerequisite_score: prerequisiteScore,
      initial_level_numeric: initialLevelNumeric,
      learning_completion_rate: learningCompletionRate,
      learning_time_minutes: attempt.timeSpentMinutes,
      practice_attempts: practiceAttempts,
      engagement_score: percentage,
      assessment_score: percentage,
      easy_accuracy: easyAccuracy,
      medium_accuracy: mediumAccuracy,
      hard_accuracy: hardAccuracy,
      previous_score: previousScore,
      improvement_pct: improvementPct,
      is_first_cycle: isFirstCycle,
      accuracy_spread: accuracySpread,
      effort_proxy: effortProxy,
    };

    console.log("ML Input Features:", mlFeatures);

    // ==================================================
    // PREDICT THE STUDENT'S PERFORMANCE LEVEL
    // ==================================================

    const mlPrediction = await predictLearningLevel(mlFeatures);

    const performanceLevel = mlPrediction.predicted_level;

    // Convert the ML labels into the values allowed by User.js
    const levelMapping = {
      slow: "basic",
      average: "medium",
      advanced: "advanced",
    };

    const learningLevel = levelMapping[performanceLevel];

    if (!learningLevel) {
      throw new Error(
        `Unexpected ML prediction: ${performanceLevel}`
      );
    }

    console.log("ML Prediction:", mlPrediction);
    console.log("Mapped Learning Level:", learningLevel);

    // ==================================================
    // GENERATE STRENGTHS AND WEAKNESSES
    // ==================================================

    const strengths = [];
    const weaknesses = [];

    if (percentage >= 80) {
      strengths.push(
        "Strong overall understanding of the topic."
      );
    } else if (percentage >= 50) {
      strengths.push(
        "Basic understanding of the topic."
      );
    } else {
      weaknesses.push(
        "Needs improvement in the topic fundamentals."
      );
    }

    if (attempt.correctAnswers > attempt.wrongAnswers) {
      strengths.push(
        "More questions were answered correctly than incorrectly."
      );
    } else if (attempt.wrongAnswers > attempt.correctAnswers) {
      weaknesses.push(
        "More incorrect answers were recorded than correct answers."
      );
    }

    if (attempt.timeSpentMinutes <= 5) {
      strengths.push(
        "Completed the evaluation in relatively less time."
      );
    }

    if (attempt.timeSpentMinutes > 15) {
      weaknesses.push(
        "Spent considerable time completing the evaluation."
      );
    }

    // ==================================================
    // CREATE ANALYSIS SUMMARY
    // ==================================================

    const analysisSummary =
      `The student scored ${percentage}% ` +
      `with ${attempt.correctAnswers} correct and ` +
      `${attempt.wrongAnswers} incorrect answers. ` +
      `The current performance level is classified as ` +
      `${performanceLevel}.`;

    // ==================================================
    // SAVE EVALUATION ANALYSIS
    // ==================================================

    const analysis = await EvaluationAnalysis.create({
      attemptId: attempt._id,
      studentId: attempt.studentId,
      topicId: attempt.topicId,
      percentage: attempt.percentage,
      correctAnswers: attempt.correctAnswers,
      wrongAnswers: attempt.wrongAnswers,
      totalQuestions: attempt.totalQuestions,
      timeSpentMinutes: attempt.timeSpentMinutes,
      performanceLevel,
      strengths,
      weaknesses,
      analysisSummary,
    });

    // ==================================================
    // UPDATE STUDENT LEVEL IN MONGODB
    // ==================================================

    const updatedStudent = await User.findOneAndUpdate(
      {
        _id: attempt.studentId,
        role: "student",
      },
      {
        $set: {
          learningLevel,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedStudent) {
      console.error(
        "Analysis saved, but student learning level was not updated:",
        attempt.studentId.toString()
      );

      return res.status(500).json({
        success: false,
        message:
          "Analysis was saved, but the student's learning level could not be updated.",
        analysis,
      });
    }

    console.log(
      "Student learning level updated successfully:",
      updatedStudent.learningLevel
    );

    // ==================================================
    // SEND RESPONSE
    // ==================================================

    return res.status(201).json({
      success: true,
      message: "Evaluation analysis created successfully.",
      analysis,
      studentLearningLevel: updatedStudent.learningLevel,
      mlPrediction,
    });
  } catch (error) {
    console.error(
      "Create evaluation analysis error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ======================================================
// GET MY ANALYSIS
// Student only
// ======================================================

const getMyAnalysis = async (req, res) => {
  try {
    const analysis = await EvaluationAnalysis.find({
      studentId: req.user._id,
    })
      .populate("topicId", "title")
      .populate(
        "attemptId",
        "percentage correctAnswers wrongAnswers status"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: analysis.length,
      analysis,
    });
  } catch (error) {
    console.error(
      "Get evaluation analysis error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

module.exports = {
  createAnalysis,
  getMyAnalysis,
};