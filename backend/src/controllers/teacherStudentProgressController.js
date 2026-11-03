const StudentProgress = require("../models/StudentProgress");

const getAllStudentProgress = async (req, res) => {
  try {
    const progress = await StudentProgress.find()
      .populate("studentId", "name email role")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      count: progress.length,
      progress,
    });
  } catch (error) {
    console.error("Get Student Progress Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching student progress.",
      error: error.message,
    });
  }
};

const getStudentProgressByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const progress = await StudentProgress.find({
      studentId,
    })
      .populate("studentId", "name email role")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      count: progress.length,
      progress,
    });
  } catch (error) {
    console.error("Get Student Progress By Student Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching student progress.",
      error: error.message,
    });
  }
};

module.exports = {
  getAllStudentProgress,
  getStudentProgressByStudent,
};