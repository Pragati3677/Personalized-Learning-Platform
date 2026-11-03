const TeacherReport = require("../models/TeacherReport");
const EvaluationAnalysis = require("../models/EvaluationAnalysis");
const PerformanceComparison = require("../models/PerformanceComparison");
const Topic = require("../models/Topic");

const createTeacherReport = async (req, res) => {
  try {
    const { studentId, topicId, analysisId } = req.body;

    if (!studentId || !topicId || !analysisId) {
      return res.status(400).json({
        success: false,
        message: "studentId, topicId and analysisId are required.",
      });
    }

    const analysis = await EvaluationAnalysis.findById(analysisId);

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Evaluation analysis not found.",
      });
    }

    if (analysis.studentId.toString() !== studentId) {
      return res.status(403).json({
        success: false,
        message: "Analysis does not belong to this student.",
      });
    }

    if (analysis.topicId.toString() !== topicId) {
      return res.status(400).json({
        success: false,
        message: "Analysis does not belong to this topic.",
      });
    }

    const topic = await Topic.findById(topicId);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found.",
      });
    }

    const comparison = await PerformanceComparison.findOne({
      studentId,
      topicId,
      analysisId,
    }).sort({ createdAt: -1 });

    const existingReport = await TeacherReport.findOne({
      studentId,
      topicId,
      analysisId,
    });

    if (existingReport) {
      return res.status(409).json({
        success: false,
        message: "Teacher report already exists for this analysis.",
        report: existingReport,
      });
    }

    const initialScore = comparison
      ? comparison.initialScore
      : analysis.percentage;

    const finalScore = comparison
      ? comparison.finalScore
      : analysis.percentage;

    const improvementPercentage = comparison
      ? comparison.improvementPercentage
      : 0;

    const performanceLevel = comparison
      ? comparison.finalPerformanceLevel
      : analysis.performanceLevel;

    const reportSummary =
      `Student performance report for ${topic.title}. ` +
      `Initial score: ${initialScore}%. ` +
      `Final score: ${finalScore}%. ` +
      `Performance level: ${performanceLevel}. ` +
      `Improvement: ${improvementPercentage}%.`;

    const report = await TeacherReport.create({
      studentId,
      topicId,
      analysisId,
      performanceComparisonId: comparison
        ? comparison._id
        : null,
      initialScore,
      finalScore,
      performanceLevel,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      improvementPercentage,
      reportSummary,
    });

    return res.status(201).json({
      success: true,
      message: "Teacher report created successfully.",
      report,
    });
  } catch (error) {
    console.error("Create Teacher Report Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating teacher report.",
      error: error.message,
    });
  }
};

const getTeacherReports = async (req, res) => {
  try {
    const reports = await TeacherReport.find()
      .populate("studentId", "name email role")
      .populate("topicId", "title")
      .populate(
        "analysisId",
        "percentage performanceLevel strengths weaknesses"
      )
      .populate(
        "performanceComparisonId",
        "initialScore finalScore scoreDifference improvementPercentage performanceImproved"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error("Get Teacher Reports Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching teacher reports.",
      error: error.message,
    });
  }
};

module.exports = {
  createTeacherReport,
  getTeacherReports,
};