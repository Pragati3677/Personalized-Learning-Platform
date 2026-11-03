const EarlyAlert = require("../models/EarlyAlert");
const StudentProgress = require("../models/StudentProgress");

const generateEarlyAlerts = async (req, res) => {
  try {
    const progressRecords = await StudentProgress.find();

    const generatedAlerts = [];

    for (const progress of progressRecords) {
      const alerts = [];

      // 1. Student has not started the topic
      if (progress.status === "not_started") {
        alerts.push({
          alertType: "not_started",
          message: `Student has not started the topic: ${progress.topic}.`,
        });
      }

      // 2. Low progress
      if (
        progress.progressPercentage > 0 &&
        progress.progressPercentage < 50
      ) {
        alerts.push({
          alertType: "low_progress",
          message: `Student progress is below 50% for ${progress.topic}.`,
        });
      }

      // 3. Low quiz score
      if (
        progress.quizAttempts > 0 &&
        progress.lastQuizScore < 50
      ) {
        alerts.push({
          alertType: "low_quiz_score",
          message: `Student's latest quiz score is below 50% for ${progress.topic}.`,
        });
      }

      // 4. Inactive student
      if (
        progress.lastAccessedAt &&
        Date.now() - progress.lastAccessedAt.getTime() >
          7 * 24 * 60 * 60 * 1000
      ) {
        alerts.push({
          alertType: "inactive",
          message: `Student has not accessed ${progress.topic} for more than 7 days.`,
        });
      }

      for (const alert of alerts) {
        const existingAlert = await EarlyAlert.findOne({
          studentId: progress.studentId,
          topic: progress.topic,
          alertType: alert.alertType,
          status: "active",
        });

        if (!existingAlert) {
          const createdAlert = await EarlyAlert.create({
            studentId: progress.studentId,
            topic: progress.topic,
            alertType: alert.alertType,
            message: alert.message,
            progressPercentage: progress.progressPercentage,
            quizScore: progress.lastQuizScore,
            status: "active",
          });

          generatedAlerts.push(createdAlert);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Early alerts generated successfully.",
      count: generatedAlerts.length,
      alerts: generatedAlerts,
    });
  } catch (error) {
    console.error("Generate Early Alerts Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while generating early alerts.",
      error: error.message,
    });
  }
};

const getEarlyAlerts = async (req, res) => {
  try {
    const alerts = await EarlyAlert.find({
      status: "active",
    })
      .populate("studentId", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: alerts.length,
      alerts,
    });
  } catch (error) {
    console.error("Get Early Alerts Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching early alerts.",
      error: error.message,
    });
  }
};

const resolveEarlyAlert = async (req, res) => {
  try {
    const { alertId } = req.params;

    const alert = await EarlyAlert.findById(alertId);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Early alert not found.",
      });
    }

    alert.status = "resolved";

    await alert.save();

    return res.status(200).json({
      success: true,
      message: "Early alert resolved successfully.",
      alert,
    });
  } catch (error) {
    console.error("Resolve Early Alert Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while resolving early alert.",
      error: error.message,
    });
  }
};

module.exports = {
  generateEarlyAlerts,
  getEarlyAlerts,
  resolveEarlyAlert,
};