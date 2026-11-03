const User = require("../models/User");
const StudentProgress = require("../models/StudentProgress");
const EvaluationAnalysis = require("../models/EvaluationAnalysis");
const PrerequisiteAttempt = require("../models/PrerequisiteAttempt");

// ============================================================
// GET TEACHER DASHBOARD DATA
// ============================================================

const getTeacherDashboard = async (req, res) => {
  try {
    // ----------------------------------------------------------
    // 1. GET ALL STUDENTS
    // ----------------------------------------------------------

    const students = await User.find({
      role: "student",
    })
      .select("_id name email createdAt updatedAt")
      .sort({ name: 1 });

    const studentIds = students.map((student) => student._id);

    // ----------------------------------------------------------
    // 2. GET ALL PROGRESS DATA
    // ----------------------------------------------------------

    const progressRecords = await StudentProgress.find({
      studentId: {
        $in: studentIds,
      },
    }).lean();

    // ----------------------------------------------------------
    // 3. GET ALL EVALUATION ANALYSIS
    // ----------------------------------------------------------

    const analysisRecords = await EvaluationAnalysis.find({
      studentId: {
        $in: studentIds,
      },
    })
      .sort({ createdAt: -1 })
      .lean();

    // ----------------------------------------------------------
    // 4. GET PREREQUISITE ATTEMPTS
    // ----------------------------------------------------------

    const prerequisiteAttempts = await PrerequisiteAttempt.find({
      studentId: {
        $in: studentIds,
      },
      status: {
        $in: ["passed", "failed"],
      },
    })
      .sort({ submittedAt: -1 })
      .lean();

    // ----------------------------------------------------------
    // 5. CREATE QUICK LOOKUP MAPS
    // ----------------------------------------------------------

    const progressByStudent = new Map();

    progressRecords.forEach((record) => {
      const studentId = record.studentId.toString();

      if (!progressByStudent.has(studentId)) {
        progressByStudent.set(studentId, []);
      }

      progressByStudent.get(studentId).push(record);
    });

    // ----------------------------------------------------------

    const analysisByStudent = new Map();

    analysisRecords.forEach((record) => {
      const studentId = record.studentId.toString();

      // Records are sorted newest first.
      // Therefore, first record = latest analysis.
      if (!analysisByStudent.has(studentId)) {
        analysisByStudent.set(studentId, record);
      }
    });

    // ----------------------------------------------------------

    const prerequisiteByStudent = new Map();

    prerequisiteAttempts.forEach((attempt) => {
      const studentId = attempt.studentId.toString();

      // Records are sorted newest first.
      // Therefore, first record = latest prerequisite attempt.
      if (!prerequisiteByStudent.has(studentId)) {
        prerequisiteByStudent.set(studentId, attempt);
      }
    });

    // ----------------------------------------------------------
    // 6. PREPARE STUDENT MONITORING DATA
    // ----------------------------------------------------------

    const studentData = students.map((student) => {
      const studentId = student._id.toString();

      const studentProgress =
        progressByStudent.get(studentId) || [];

      const latestAnalysis =
        analysisByStudent.get(studentId) || null;

      const latestPrerequisite =
        prerequisiteByStudent.get(studentId) || null;

      // --------------------------------------------------------
      // PROGRESS
      // --------------------------------------------------------

      let progressPercentage = 0;

      if (studentProgress.length > 0) {
        const totalProgress =
          studentProgress.reduce(
            (sum, record) =>
              sum + (record.progressPercentage || 0),
            0
          );

        progressPercentage = Math.round(
          totalProgress / studentProgress.length
        );
      }

      // --------------------------------------------------------
      // TOPIC / ASSESSMENT SCORE
      // --------------------------------------------------------

      const score = latestAnalysis
        ? Number(latestAnalysis.percentage || 0)
        : 0;

      // --------------------------------------------------------
      // PERFORMANCE LEVEL
      // --------------------------------------------------------

      let level = "Not Available";

      if (latestAnalysis?.performanceLevel) {
        level =
          latestAnalysis.performanceLevel
            .charAt(0)
            .toUpperCase() +
          latestAnalysis.performanceLevel.slice(1);
      }

      // --------------------------------------------------------
      // PREREQUISITE EVALUATION
      // --------------------------------------------------------

      const prerequisite = latestPrerequisite
        ? {
            score: Number(latestPrerequisite.score || 0),
            totalMarks: Number(
              latestPrerequisite.totalMarks || 100
            ),
            percentage: Number(
              latestPrerequisite.percentage || 0
            ),
            status: latestPrerequisite.status,
            submittedAt:
              latestPrerequisite.submittedAt || null,
          }
        : {
            score: null,
            totalMarks: 100,
            percentage: null,
            status: "not_attempted",
            submittedAt: null,
          };

      // --------------------------------------------------------
      // WEAK TOPICS
      // --------------------------------------------------------

      let weakTopics = [];

      if (
        latestAnalysis &&
        Array.isArray(latestAnalysis.weaknesses)
      ) {
        weakTopics =
          latestAnalysis.weaknesses.slice(0, 3);
      }

      // --------------------------------------------------------
      // LAST ACTIVE
      // --------------------------------------------------------

      let lastAccessedAt = null;

      studentProgress.forEach((record) => {
        if (
          record.lastAccessedAt &&
          (!lastAccessedAt ||
            new Date(record.lastAccessedAt) >
              new Date(lastAccessedAt))
        ) {
          lastAccessedAt = record.lastAccessedAt;
        }
      });

      let lastActive = "Never";

      if (lastAccessedAt) {
        lastActive =
          formatLastActive(lastAccessedAt);
      }

      // --------------------------------------------------------
      // RISK
      // --------------------------------------------------------

      const risk = calculateRisk({
        score,
        progressPercentage,
        lastAccessedAt,
        hasAnalysis: Boolean(latestAnalysis),
      });

      // --------------------------------------------------------
      // RETURN STUDENT DATA
      // --------------------------------------------------------

      return {
        id: student._id,
        name: student.name,
        email: student.email,

        // Topic performance
        level,
        score,
        progress: progressPercentage,

        // Prerequisite performance
        prerequisite,

        // Other monitoring information
        weakTopics,
        lastActive,
        lastAccessedAt,
        risk,

        // Latest topic assessment analysis
        latestAnalysis: latestAnalysis
          ? {
              percentage:
                latestAnalysis.percentage,

              performanceLevel:
                latestAnalysis.performanceLevel,

              strengths:
                latestAnalysis.strengths || [],

              weaknesses:
                latestAnalysis.weaknesses || [],

              correctAnswers:
                latestAnalysis.correctAnswers,

              wrongAnswers:
                latestAnalysis.wrongAnswers,

              totalQuestions:
                latestAnalysis.totalQuestions,

              timeSpentMinutes:
                latestAnalysis.timeSpentMinutes,

              analysisSummary:
                latestAnalysis.analysisSummary,

              createdAt:
                latestAnalysis.createdAt,
            }
          : null,
      };
    });

    // ----------------------------------------------------------
    // 7. DASHBOARD SUMMARY
    // ----------------------------------------------------------

    const totalStudents =
      studentData.length;

    const studentsWithAnalysis =
      studentData.filter(
        (student) =>
          student.latestAnalysis !== null
      );

    let classAverage = 0;

    if (studentsWithAnalysis.length > 0) {
      const totalScore =
        studentsWithAnalysis.reduce(
          (sum, student) =>
            sum + student.score,
          0
        );

      classAverage = Math.round(
        totalScore /
          studentsWithAnalysis.length
      );
    }

    // ----------------------------------------------------------
    // 8. NEED SUPPORT
    // ----------------------------------------------------------

    const needSupport =
      studentData.filter(
        (student) =>
          student.risk === "High" ||
          student.level === "Slow"
      ).length;

    // ----------------------------------------------------------
    // 9. COMPLETION RATE
    // ----------------------------------------------------------

    let completionRate = 0;

    if (totalStudents > 0) {
      const totalProgress =
        studentData.reduce(
          (sum, student) =>
            sum + student.progress,
          0
        );

      completionRate = Math.round(
        totalProgress / totalStudents
      );
    }

    // ----------------------------------------------------------
    // 10. PERFORMANCE DISTRIBUTION
    // ----------------------------------------------------------

    const performanceDistribution = {
      advanced: studentData.filter(
        (student) =>
          student.level === "Advanced"
      ).length,

      average: studentData.filter(
        (student) =>
          student.level === "Average"
      ).length,

      slow: studentData.filter(
        (student) =>
          student.level === "Slow"
      ).length,

      notAvailable: studentData.filter(
        (student) =>
          student.level === "Not Available"
      ).length,
    };

    // ----------------------------------------------------------
    // 11. AT-RISK STUDENTS
    // ----------------------------------------------------------

    const atRiskStudents =
      studentData
        .filter(
          (student) =>
            student.risk === "High" ||
            student.risk === "Medium"
        )
        .sort((a, b) => {
          const riskOrder = {
            High: 1,
            Medium: 2,
            Low: 3,
            None: 4,
          };

          return (
            riskOrder[a.risk] -
            riskOrder[b.risk]
          );
        })
        .slice(0, 10);

    // ----------------------------------------------------------
    // 12. FINAL RESPONSE
    // ----------------------------------------------------------

    return res.status(200).json({
      success: true,

      summary: {
        totalStudents,
        classAverage,
        needSupport,
        completionRate,
      },

      performanceDistribution,

      students: studentData,

      atRiskStudents,
    });
  } catch (error) {
    console.error(
      "Teacher dashboard error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load teacher dashboard data.",
      error: error.message,
    });
  }
};

// ============================================================
// CALCULATE STUDENT RISK
// ============================================================

const calculateRisk = ({
  score,
  progressPercentage,
  lastAccessedAt,
  hasAnalysis,
}) => {
  // No activity and no analysis
  if (!lastAccessedAt && !hasAnalysis) {
    return "Medium";
  }

  // Check inactivity
  if (lastAccessedAt) {
    const lastActiveDate =
      new Date(lastAccessedAt);

    const now = new Date();

    const differenceInDays =
      (now - lastActiveDate) /
      (1000 * 60 * 60 * 24);

    // More than 7 days inactive
    if (differenceInDays >= 7) {
      return "High";
    }

    // 3–6 days inactive
    if (differenceInDays >= 3) {
      return "Medium";
    }
  }

  // Very low performance
  if (score < 40) {
    return "High";
  }

  // Low performance
  if (score < 50) {
    return "High";
  }

  // Low learning progress
  if (progressPercentage < 20) {
    return "Medium";
  }

  // Medium performance
  if (score < 60) {
    return "Medium";
  }

  return "Low";
};

// ============================================================
// FORMAT LAST ACTIVE
// ============================================================

const formatLastActive = (date) => {
  const lastDate = new Date(date);
  const now = new Date();

  const differenceInMilliseconds =
    now - lastDate;

  const differenceInMinutes =
    Math.floor(
      differenceInMilliseconds /
        (1000 * 60)
    );

  if (differenceInMinutes < 1) {
    return "Just now";
  }

  if (differenceInMinutes < 60) {
    return `${differenceInMinutes} min ago`;
  }

  const differenceInHours =
    Math.floor(
      differenceInMinutes / 60
    );

  if (differenceInHours < 24) {
    return `${differenceInHours} ${
      differenceInHours === 1
        ? "hour"
        : "hours"
    } ago`;
  }

  const differenceInDays =
    Math.floor(
      differenceInHours / 24
    );

  if (differenceInDays === 1) {
    return "Yesterday";
  }

  if (differenceInDays < 7) {
    return `${differenceInDays} days ago`;
  }

  return lastDate.toLocaleDateString();
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  getTeacherDashboard,
};