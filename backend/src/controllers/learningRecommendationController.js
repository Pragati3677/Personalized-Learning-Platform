const LearningRecommendation = require("../models/LearningRecommendation");
const EvaluationAnalysis = require("../models/EvaluationAnalysis");

// ======================================================
// CREATE LEARNING RECOMMENDATION
// Student only
// ======================================================

const createRecommendation = async (req, res) => {
  try {
    const { analysisId } = req.body;

    if (!analysisId) {
      return res.status(400).json({
        success: false,
        message: "analysisId is required.",
      });
    }

    // Find evaluation analysis
    const analysis = await EvaluationAnalysis.findById(analysisId);

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Evaluation analysis not found.",
      });
    }

    // Make sure analysis belongs to logged-in student
    if (
      analysis.studentId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to create a recommendation for this analysis.",
      });
    }

    // Check whether recommendation already exists
    const existingRecommendation =
      await LearningRecommendation.findOne({
        analysisId: analysis._id,
      });

    if (existingRecommendation) {
      return res.status(409).json({
        success: false,
        message:
          "Recommendation for this analysis already exists.",
        recommendation: existingRecommendation,
      });
    }

    // ==================================================
    // GET PERFORMANCE LEVEL
    // ==================================================

    const performanceLevel = analysis.performanceLevel;

    // ==================================================
    // RECOMMENDATION DATA
    // ==================================================

    let recommendedContent = [];
    let recommendedActivities = [];
    let recommendationReason = "";

    // --------------------------------------------------
    // SLOW LEVEL
    // --------------------------------------------------

    if (performanceLevel === "slow") {
      recommendedContent = [
        "Review basic Java concepts and fundamentals.",
        "Study topic notes carefully.",
        "Watch beginner-friendly topic videos.",
        "Practice simple examples before moving to advanced concepts.",
      ];

      recommendedActivities = [
        "Complete basic practice questions.",
        "Revise important definitions and concepts.",
        "Solve easy-level programming problems.",
        "Repeat the smart engagement evaluation after revision.",
      ];

      recommendationReason =
        "The evaluation indicates that the student needs additional practice with the topic fundamentals.";
    }

    // --------------------------------------------------
    // AVERAGE LEVEL
    // --------------------------------------------------

    else if (performanceLevel === "average") {
      recommendedContent = [
        "Review the topic notes.",
        "Watch intermediate-level learning videos.",
        "Practice topic-based worksheets.",
        "Revise concepts where mistakes were made.",
      ];

      recommendedActivities = [
        "Solve medium-level practice questions.",
        "Complete topic-based exercises.",
        "Review incorrect answers from the evaluation.",
        "Attempt another engagement evaluation after practice.",
      ];

      recommendationReason =
        "The evaluation indicates that the student has a basic understanding and should strengthen the topic through practice.";
    }

    // --------------------------------------------------
    // ADVANCED LEVEL
    // --------------------------------------------------

    else if (performanceLevel === "advanced") {
      recommendedContent = [
        "Explore advanced concepts related to the topic.",
        "Study advanced examples and use cases.",
        "Review challenging problem-solving techniques.",
        "Move towards advanced learning resources.",
      ];

      recommendedActivities = [
        "Solve hard-level programming problems.",
        "Attempt advanced topic-based exercises.",
        "Practice coding challenges.",
        "Proceed to advanced practice.",
      ];

      recommendationReason =
        "The evaluation indicates strong understanding of the topic, so the student can proceed to advanced learning content and practice.";
    }

    // ==================================================
    // SAVE RECOMMENDATION
    // ==================================================

    const recommendation =
      await LearningRecommendation.create({
        studentId: analysis.studentId,
        topicId: analysis.topicId,
        analysisId: analysis._id,
        performanceLevel,
        recommendedContent,
        recommendedActivities,
        recommendationReason,
      });

    return res.status(201).json({
      success: true,
      message:
        "Learning recommendation created successfully.",
      recommendation,
    });
  } catch (error) {
    console.error(
      "Create learning recommendation error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ======================================================
// GET MY RECOMMENDATIONS
// Student only
// ======================================================

const getMyRecommendations = async (req, res) => {
  try {
    const recommendations =
      await LearningRecommendation.find({
        studentId: req.user._id,
      })
        .populate("topicId", "title")
        .populate(
          "analysisId",
          "percentage performanceLevel strengths weaknesses"
        )
        .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: recommendations.length,
      recommendations,
    });
  } catch (error) {
    console.error(
      "Get learning recommendations error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

module.exports = {
  createRecommendation,
  getMyRecommendations,
};