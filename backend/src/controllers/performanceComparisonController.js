const PerformanceComparison = require("../models/PerformanceComparison");
const EvaluationAnalysis = require("../models/EvaluationAnalysis");
const FinalEvaluationAttempt = require("../models/FinalEvaluationAttempt");

const EngagementAttempt = require("../models/EngagementAttempt");
const PrerequisiteAttempt = require("../models/PrerequisiteAttempt");
const StudentProgress = require("../models/StudentProgress");
const Topic = require("../models/Topic");
const PracticeAttempt = require("../models/PracticeAttempt");
const EngagementQuestion = require("../models/EngagementQuestion");

const { predictLearningLevel } = require("../services/mlService");

// CREATE PERFORMANCE COMPARISON
const createPerformanceComparison = async (req, res) => {
  try {
    const { analysisId, finalEvaluationAttemptId } =
      req.body;

    if (!analysisId || !finalEvaluationAttemptId) {
      return res.status(400).json({
        success: false,
        message:
          "analysisId and finalEvaluationAttemptId are required.",
      });
    }

    // Get initial evaluation analysis
    const analysis = await EvaluationAnalysis.findById(
      analysisId
    );

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Evaluation analysis not found.",
      });
    }

    // Verify ownership
    if (
      analysis.studentId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to use this evaluation analysis.",
      });
    }

    // Get final evaluation
    const finalAttempt =
      await FinalEvaluationAttempt.findById(
        finalEvaluationAttemptId
      );

    if (!finalAttempt) {
      return res.status(404).json({
        success: false,
        message:
          "Final evaluation attempt not found.",
      });
    }

    // Verify ownership
    if (
      finalAttempt.studentId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to use this final evaluation.",
      });
    }

    // Final evaluation must be completed
    if (finalAttempt.status !== "completed") {
      return res.status(400).json({
        success: false,
        message:
          "Final evaluation must be completed before comparison.",
      });
    }

    // Both records must belong to the same topic
    if (
      analysis.topicId.toString() !==
      finalAttempt.topicId.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Initial and final evaluations must belong to the same topic.",
      });
    }

    // Prevent duplicate comparison
    const existingComparison =
      await PerformanceComparison.findOne({
        analysisId: analysis._id,
        finalEvaluationAttemptId:
          finalAttempt._id,
      });

    if (existingComparison) {
      return res.status(409).json({
        success: false,
        message:
          "Performance comparison already exists.",
        comparison: existingComparison,
      });
    }

    const initialScore = analysis.percentage;
    const finalScore = finalAttempt.percentage;

    // Get latest prerequisite score
const prerequisiteAttempt =
  await PrerequisiteAttempt.findOne({
    studentId: req.user._id,
    status: { $in: ["passed", "failed"] },
  }).sort({ submittedAt: -1 });

const prerequisiteScore = prerequisiteAttempt
  ? prerequisiteAttempt.percentage
  : 0;

// Get topic
const topic = await Topic.findById(analysis.topicId);

// Get student learning progress
const studentProgress = topic
  ? await StudentProgress.findOne({
      studentId: req.user._id,
      topic: topic.title,
    })
  : null;

const learningCompletionRate = studentProgress
  ? studentProgress.progressPercentage
  : 0;

// Get completed practice attempts
const practiceAttempts =
  await PracticeAttempt.countDocuments({
    studentId: req.user._id,
    topicId: analysis.topicId,
    status: "completed",
  });

console.log("Final ML - Prerequisite Score:", prerequisiteScore);
console.log(
  "Final ML - Learning Completion Rate:",
  learningCompletionRate
);
console.log(
  "Final ML - Practice Attempts:",
  practiceAttempts
);

// Calculate accuracy by difficulty
const engagementAttempt =
  await EngagementAttempt.findById(analysis.attemptId);

const learningTimeMinutes =
  engagementAttempt?.timeSpentMinutes || 0;

console.log(
  "Final ML - Learning Time:",
  learningTimeMinutes
);

let easyCorrect = 0;
let easyTotal = 0;

let mediumCorrect = 0;
let mediumTotal = 0;

let hardCorrect = 0;
let hardTotal = 0;

if (engagementAttempt) {
  const questionIds = engagementAttempt.answers.map(
    (answer) => answer.questionId
  );

  const engagementQuestions =
    await EngagementQuestion.find({
      _id: { $in: questionIds },
    });

  for (const answer of engagementAttempt.answers) {
    const question = engagementQuestions.find(
      (q) =>
        q._id.toString() ===
        answer.questionId.toString()
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
}

const easyAccuracy =
  easyTotal > 0
    ? (easyCorrect / easyTotal) * 100
    : 0;

const mediumAccuracy =
  mediumTotal > 0
    ? (mediumCorrect / mediumTotal) * 100
    : 0;

const hardAccuracy =
  hardTotal > 0
    ? (hardCorrect / hardTotal) * 100
    : 0;

const accuracyValues = [
  easyAccuracy,
  mediumAccuracy,
  hardAccuracy,
];

const accuracySpread =
  Math.max(...accuracyValues) -
  Math.min(...accuracyValues);

console.log("Final ML - Easy Accuracy:", easyAccuracy);
console.log(
  "Final ML - Medium Accuracy:",
  mediumAccuracy
);
console.log("Final ML - Hard Accuracy:", hardAccuracy);
console.log(
  "Final ML - Accuracy Spread:",
  accuracySpread
);

// Previous analysis information
const previousScore = initialScore;

const improvementPct =
  initialScore > 0
    ? ((finalScore - initialScore) / initialScore) * 100
    : 0;

const previousLevel =
  analysis.performanceLevel;

const initialLevelNumeric =
  previousLevel === "slow"
    ? 1
    : previousLevel === "average"
    ? 2
    : previousLevel === "advanced"
    ? 3
    : 2;

const isFirstCycle = 0;

const effortProxy =
  learningTimeMinutes +
  practiceAttempts;

console.log(
  "Final ML - Previous Score:",
  previousScore
);

console.log(
  "Final ML - Improvement Percentage:",
  improvementPct
);

console.log(
  "Final ML - Initial Level Numeric:",
  initialLevelNumeric
);

console.log(
  "Final ML - Effort Proxy:",
  effortProxy
);

const mlFeatures = {
  prerequisite_score: prerequisiteScore,
  initial_level_numeric: initialLevelNumeric,
  learning_completion_rate: learningCompletionRate,
  learning_time_minutes: learningTimeMinutes,
  practice_attempts: practiceAttempts,
  engagement_score: initialScore,
  assessment_score: finalScore,
  easy_accuracy: easyAccuracy,
  medium_accuracy: mediumAccuracy,
  hard_accuracy: hardAccuracy,
  previous_score: previousScore,
  improvement_pct: improvementPct,
  is_first_cycle: isFirstCycle,
  accuracy_spread: accuracySpread,
  effort_proxy: effortProxy,
};

console.log(
  "Final ML Features:",
  mlFeatures
);

const mlPrediction = await predictLearningLevel(
  mlFeatures
);

console.log(
  "Final ML Prediction:",
  mlPrediction
);

const finalPerformanceLevel =
  mlPrediction.predicted_level;

    const scoreDifference = Number(
      (finalScore - initialScore).toFixed(2)
    );

    let improvementPercentage = 0;

    if (initialScore > 0) {
      improvementPercentage = Number(
        (
          ((finalScore - initialScore) /
            initialScore) *
          100
        ).toFixed(2)
      );
    } else if (finalScore > 0) {
      improvementPercentage = 100;
    }

    const performanceImproved =
      finalScore > initialScore;

    // Determine final performance level

    const comparison =
      await PerformanceComparison.create({
        studentId: req.user._id,
        topicId: analysis.topicId,
        analysisId: analysis._id,
        finalEvaluationAttemptId:
          finalAttempt._id,
        initialScore,
        finalScore,
        scoreDifference,
        improvementPercentage,
        initialPerformanceLevel:
          analysis.performanceLevel,
        finalPerformanceLevel,
        performanceImproved,
      });

    return res.status(201).json({
      success: true,
      message:
        "Performance comparison created successfully.",
      comparison,
    });
  } catch (error) {
    console.error(
      "Create performance comparison error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// GET MY PERFORMANCE COMPARISONS
const getMyPerformanceComparisons = async (
  req,
  res
) => {
  try {
    const comparisons =
      await PerformanceComparison.find({
        studentId: req.user._id,
      })
        .populate("topicId", "title")
        .populate(
          "analysisId",
          "percentage performanceLevel strengths weaknesses"
        )
        .populate(
          "finalEvaluationAttemptId",
          "percentage correctAnswers wrongAnswers status"
        )
        .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: comparisons.length,
      comparisons,
    });
  } catch (error) {
    console.error(
      "Get performance comparisons error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

module.exports = {
  createPerformanceComparison,
  getMyPerformanceComparisons,
};