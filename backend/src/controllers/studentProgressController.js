const StudentProgress = require("../models/StudentProgress");

// ======================================================
// CREATE / START STUDENT PROGRESS
// ======================================================

const createProgress = async (req, res) => {
  try {
    const { topic, totalLessons } = req.body;

    // --------------------------------------------------
    // 1. Validate topic
    // --------------------------------------------------

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: "Topic is required.",
      });
    }

    // --------------------------------------------------
    // 2. Check if progress already exists
    // --------------------------------------------------

    const existingProgress =
      await StudentProgress.findOne({
        studentId: req.user._id,
        topic: topic.trim(),
      });

    if (existingProgress) {
      return res.status(409).json({
        success: false,
        message:
          "Progress for this topic already exists.",
        progress: existingProgress,
      });
    }

    // --------------------------------------------------
    // 3. Create progress
    // --------------------------------------------------

    const progress =
      await StudentProgress.create({
        studentId: req.user._id,

        topic: topic.trim(),

        status: "not_started",

        progressPercentage: 0,

        completedLessons: 0,

        totalLessons: totalLessons || 0,

        quizAttempts: 0,

        bestQuizScore: 0,

        lastQuizScore: 0,

        timeSpentMinutes: 0,

        lastAccessedAt: null,

        completedAt: null,
      });

    // --------------------------------------------------
    // 4. Response
    // --------------------------------------------------

    return res.status(201).json({
      success: true,
      message:
        "Student progress created successfully.",
      progress,
    });
  } catch (error) {
    console.error(
      "Create progress error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ======================================================
// GET MY PROGRESS
// ======================================================

const getMyProgress = async (req, res) => {
  try {
    const progress =
      await StudentProgress.find({
        studentId: req.user._id,
      }).sort({
        updatedAt: -1,
      });

    return res.status(200).json({
      success: true,

      count: progress.length,

      progress,
    });
  } catch (error) {
    console.error(
      "Get progress error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ======================================================
// GET PROGRESS FOR ONE TOPIC
// ======================================================

const getTopicProgress = async (req, res) => {
  try {
    const { topic } = req.params;

    const progress =
      await StudentProgress.findOne({
        studentId: req.user._id,
        topic: topic.trim(),
      });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message:
          "Progress for this topic was not found.",
      });
    }

    return res.status(200).json({
      success: true,

      progress,
    });
  } catch (error) {
    console.error(
      "Get topic progress error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ======================================================
// UPDATE STUDENT PROGRESS
// ======================================================

const updateProgress = async (req, res) => {
  try {
    const { progressId } = req.params;

    const {
      status,
      progressPercentage,
      completedLessons,
      totalLessons,
      quizAttempts,
      bestQuizScore,
      lastQuizScore,
      timeSpentMinutes,
    } = req.body;

    // --------------------------------------------------
    // 1. Find progress
    // --------------------------------------------------

    const progress =
      await StudentProgress.findById(
        progressId
      );

    if (!progress) {
      return res.status(404).json({
        success: false,
        message:
          "Student progress not found.",
      });
    }

    // --------------------------------------------------
    // 2. Check ownership
    // --------------------------------------------------

    if (
      progress.studentId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to update this progress.",
      });
    }

    // --------------------------------------------------
    // 3. Update only provided fields
    // --------------------------------------------------

    if (status !== undefined) {
      progress.status = status;
    }

    if (
      progressPercentage !== undefined
    ) {
      progress.progressPercentage =
        progressPercentage;
    }

    if (
      completedLessons !== undefined
    ) {
      progress.completedLessons =
        completedLessons;
    }

    if (
      totalLessons !== undefined
    ) {
      progress.totalLessons =
        totalLessons;
    }

    if (
      quizAttempts !== undefined
    ) {
      progress.quizAttempts =
        quizAttempts;
    }

    if (
      bestQuizScore !== undefined
    ) {
      progress.bestQuizScore =
        bestQuizScore;
    }

    if (
      lastQuizScore !== undefined
    ) {
      progress.lastQuizScore =
        lastQuizScore;
    }

    if (
      timeSpentMinutes !== undefined
    ) {
      progress.timeSpentMinutes =
        timeSpentMinutes;
    }

    // --------------------------------------------------
    // 4. Update last accessed time
    // --------------------------------------------------

    progress.lastAccessedAt =
      new Date();

    // --------------------------------------------------
    // 5. If completed
    // --------------------------------------------------

    if (
      progress.status ===
      "completed"
    ) {
      progress.progressPercentage = 100;

      progress.completedAt =
        progress.completedAt ||
        new Date();
    }

    // --------------------------------------------------
    // 6. Save
    // --------------------------------------------------

    await progress.save();

    // --------------------------------------------------
    // 7. Response
    // --------------------------------------------------

    return res.status(200).json({
      success: true,

      message:
        "Student progress updated successfully.",

      progress,
    });
  } catch (error) {
    console.error(
      "Update progress error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ======================================================
// COMPLETE TOPIC
// ======================================================

const completeTopic = async (req, res) => {
  try {
    const { topic } = req.body;

    // --------------------------------------------------
    // 1. Validate topic
    // --------------------------------------------------

    if (!topic || !topic.trim()) {
      return res.status(400).json({
        success: false,
        message: "Topic is required.",
      });
    }

    const topicName = topic.trim();

    // --------------------------------------------------
    // 2. Find student's progress for this topic
    // --------------------------------------------------

    const progress = await StudentProgress.findOne({
      studentId: req.user._id,
      topic: topicName,
    });

    // --------------------------------------------------
    // 3. If progress doesn't exist
    // --------------------------------------------------

    if (!progress) {
      return res.status(404).json({
        success: false,
        message:
          "Progress for this topic was not found. Start the topic first.",
      });
    }

    // --------------------------------------------------
    // 4. Mark topic as completed
    // --------------------------------------------------

    progress.status = "completed";

    progress.progressPercentage = 100;

    progress.completedLessons = progress.totalLessons;

    progress.lastAccessedAt = new Date();

    progress.completedAt =
      progress.completedAt || new Date();

    // --------------------------------------------------
    // 5. Save progress
    // --------------------------------------------------

    await progress.save();

    // --------------------------------------------------
    // 6. Response
    // --------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Topic completed successfully.",
      progress,
    });
  } catch (error) {
    console.error(
      "Complete topic error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ======================================================
// DELETE PROGRESS
// ======================================================

const deleteProgress = async (req, res) => {
  try {
    const { progressId } = req.params;

    const progress =
      await StudentProgress.findById(
        progressId
      );

    if (!progress) {
      return res.status(404).json({
        success: false,
        message:
          "Student progress not found.",
      });
    }

    // --------------------------------------------------
    // Check ownership
    // --------------------------------------------------

    if (
      progress.studentId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to delete this progress.",
      });
    }

    await StudentProgress.findByIdAndDelete(
      progressId
    );

    return res.status(200).json({
      success: true,

      message:
        "Student progress deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete progress error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  createProgress,
  getMyProgress,
  getTopicProgress,
  updateProgress,
  completeTopic,
  deleteProgress,
};