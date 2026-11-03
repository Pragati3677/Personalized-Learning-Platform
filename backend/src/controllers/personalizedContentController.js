const LearningResource = require("../models/LearningResource");
const LearningRecommendation = require("../models/LearningRecommendation");

// GET PERSONALIZED LEARNING CONTENT
const getPersonalizedContent = async (req, res) => {
  try {
    const { topicId } = req.params;

    if (!topicId) {
      return res.status(400).json({
        success: false,
        message: "topicId is required.",
      });
    }

    // Get student's active recommendation for this topic
    const recommendation = await LearningRecommendation.findOne({
      studentId: req.user._id,
      topicId,
      status: "active",
    }).sort({ createdAt: -1 });

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message:
          "No active learning recommendation found for this topic.",
      });
    }

    // Get active learning resources for the recommended topic
    const resources = await LearningResource.find({
      topicId,
      isActive: true,
    }).sort({ order: 1, createdAt: 1 });

    return res.status(200).json({
      success: true,
      topicId,
      performanceLevel: recommendation.performanceLevel,
      recommendationId: recommendation._id,
      recommendationReason: recommendation.recommendationReason,
      resources,
    });
  } catch (error) {
    console.error(
      "Get personalized learning content error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

module.exports = {
  getPersonalizedContent,
};