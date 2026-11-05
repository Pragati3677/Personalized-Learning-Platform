const User = require("../models/User");
const StudentProgress = require("../models/StudentProgress");
const EvaluationAnalysis = require("../models/EvaluationAnalysis");
const PrerequisiteAttempt = require("../models/PrerequisiteAttempt");
const FinalEvaluationAttempt = require("../models/FinalEvaluationAttempt");
const Certificate = require("../models/Certificate");

const REQUIRED_TOPICS = [
  "Java Basics & Syntax",
  "Variables & Data Types",
  "Operators",
  "Conditional Statements",
  "Loops",
  "Arrays",
  "Strings",
  "Methods",
  "OOP Concepts",
  "Classes & Objects",
  "Inheritance",
  "Polymorphism",
  "Abstraction & Interfaces",
  "Exception Handling",
  "Collections Framework",
  "Generics",
  "File Handling",
  "Advanced Java",
];

const TOTAL_TOPICS = REQUIRED_TOPICS.length;
const CERTIFICATE_PASS_MARKS = 96;

const getTeacherDashboard = async (req, res) => {
  try {
    const students = await User.find({
      role: "student",
    })
      .select("_id name email createdAt updatedAt")
      .sort({ name: 1 })
      .lean();

    const studentIds = students.map((student) => student._id);

    if (students.length === 0) {
      return res.status(200).json({
        success: true,
        summary: {
          totalStudents: 0,
          classAverage: 0,
          needSupport: 0,
          completionRate: 0,
          completedStudents: 0,
          inProgressStudents: 0,
          certificateEligible: 0,
          certificateIssued: 0,
          improvedStudents: 0,
          averageTopicProgress: 0,
        },
        performanceDistribution: {
          advanced: 0,
          average: 0,
          slow: 0,
          notAvailable: 0,
        },
        students: [],
        completedStudents: [],
        atRiskStudents: [],
      });
    }

    const progressRecords = await StudentProgress.find({
      studentId: { $in: studentIds },
      topic: { $in: REQUIRED_TOPICS },
    })
      .sort({ updatedAt: -1 })
      .lean();

    const analysisRecords = await EvaluationAnalysis.find({
      studentId: { $in: studentIds },
    })
      .sort({ createdAt: -1 })
      .lean();

    const prerequisiteAttempts = await PrerequisiteAttempt.find({
      studentId: { $in: studentIds },
      status: { $in: ["passed", "failed"] },
    })
      .sort({ submittedAt: -1 })
      .lean();

    const finalAttempts = await FinalEvaluationAttempt.find({
      studentId: { $in: studentIds },
    })
      .sort({ startedAt: -1, createdAt: -1 })
      .lean();

    const issuedCertificates = await Certificate.find({
      studentId: { $in: studentIds },
    })
      .sort({ issuedAt: -1, createdAt: -1 })
      .lean();

    // Create lookup maps.
    const progressByStudent = new Map();
    const analysisByStudent = new Map();
    const prerequisiteByStudent = new Map();
    const finalAttemptsByStudent = new Map();
    const certificatesByAttempt = new Map();

    // Latest topic progress.
    for (const record of progressRecords) {
      const studentId = String(record.studentId);

      if (!progressByStudent.has(studentId)) {
        progressByStudent.set(studentId, new Map());
      }

      const topicMap = progressByStudent.get(studentId);

      if (!topicMap.has(record.topic)) {
        topicMap.set(record.topic, record);
      }
    }

    // Assessment history.
    for (const record of analysisRecords) {
      const studentId = String(record.studentId);

      if (!analysisByStudent.has(studentId)) {
        analysisByStudent.set(studentId, []);
      }

      analysisByStudent.get(studentId).push(record);
    }

    // Latest prerequisite attempt.
    for (const attempt of prerequisiteAttempts) {
      const studentId = String(attempt.studentId);

      if (!prerequisiteByStudent.has(studentId)) {
        prerequisiteByStudent.set(studentId, attempt);
      }
    }

    // Final evaluation history.
    for (const attempt of finalAttempts) {
      const studentId = String(attempt.studentId);

      if (!finalAttemptsByStudent.has(studentId)) {
        finalAttemptsByStudent.set(studentId, []);
      }

      finalAttemptsByStudent.get(studentId).push(attempt);
    }

    // Issued certificates indexed by evaluation attempt.
    for (const certificate of issuedCertificates) {
      certificatesByAttempt.set(
        String(certificate.finalEvaluationAttemptId),
        certificate
      );
    }

    // Prepare each student's data.
    const studentData = students.map((student) => {
      const studentId = String(student._id);

      const topicMap =
        progressByStudent.get(studentId) || new Map();

      const assessmentHistory =
        analysisByStudent.get(studentId) || [];

      const latestAnalysis =
        assessmentHistory[0] || null;

      const previousAnalysis =
        assessmentHistory[1] || null;

      const latestPrerequisite =
        prerequisiteByStudent.get(studentId) || null;

      const studentFinalAttempts =
        finalAttemptsByStudent.get(studentId) || [];

      // Topic-wise progress.
      const topicProgress = REQUIRED_TOPICS.map((title) => {
        const record = topicMap.get(title) || null;

        return {
          topic: title,
          status: record?.status || "not_started",
          progressPercentage: Number(
            record?.progressPercentage || 0
          ),
          completedLessons: Number(
            record?.completedLessons || 0
          ),
          totalLessons: Number(
            record?.totalLessons || 0
          ),
          bestQuizScore: record?.bestQuizScore ?? null,
          lastQuizScore: record?.lastQuizScore ?? null,
          quizAttempts: Number(record?.quizAttempts || 0),
          timeSpentMinutes: Number(
            record?.timeSpentMinutes || 0
          ),
          lastAccessedAt: record?.lastAccessedAt || null,
          completedAt: record?.completedAt || null,
        };
      });

      const completedTopics = topicProgress.filter(
        (topic) => topic.status === "completed"
      );

      const completedTopicCount = completedTopics.length;

      const progressPercentage = Math.round(
        (completedTopicCount / TOTAL_TOPICS) * 100
      );

      const incompleteTopics = topicProgress
        .filter((topic) => topic.status !== "completed")
        .map((topic) => topic.topic);

      const hasStartedCourse = topicProgress.some(
        (topic) =>
          topic.status === "in_progress" ||
          topic.status === "completed" ||
          topic.progressPercentage > 0 ||
          topic.quizAttempts > 0
      );

      const courseCompleted =
        completedTopicCount === TOTAL_TOPICS;

      const courseStatus = courseCompleted
        ? "completed"
        : hasStartedCourse
        ? "in_progress"
        : "not_started";

      // Last activity.
      let lastAccessedAt = null;

      for (const topic of topicProgress) {
        if (
          topic.lastAccessedAt &&
          (!lastAccessedAt ||
            new Date(topic.lastAccessedAt) >
              new Date(lastAccessedAt))
        ) {
          lastAccessedAt = topic.lastAccessedAt;
        }
      }

      const lastActive = lastAccessedAt
        ? formatLastActive(lastAccessedAt)
        : "Never";

      // Latest assessment.
      const hasAnalysis = Boolean(latestAnalysis);

      const score = hasAnalysis
        ? Number(latestAnalysis.percentage || 0)
        : null;

      let level = "Not Available";

      if (latestAnalysis?.performanceLevel) {
        level = capitalizeLevel(
          latestAnalysis.performanceLevel
        );
      }

      // Performance improvement.
      const previousScore = previousAnalysis
        ? Number(previousAnalysis.percentage || 0)
        : null;

      const improvement =
        score !== null && previousScore !== null
          ? Number((score - previousScore).toFixed(2))
          : null;

      let improvementStatus = "insufficient_data";

      if (improvement !== null) {
        if (improvement > 0) {
          improvementStatus = "improved";
        } else if (improvement < 0) {
          improvementStatus = "declined";
        } else {
          improvementStatus = "unchanged";
        }
      }

      // Prerequisite evaluation.
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

      // Final evaluation.
      const latestFinalAttempt =
        studentFinalAttempts[0] || null;

      const latestCompletedAttempt =
        studentFinalAttempts.find(
          (attempt) => attempt.status === "completed"
        ) || null;

      // A student must complete all topics and score at least 96.
      const eligibleAttempt = courseCompleted
        ? studentFinalAttempts.find(
            (attempt) =>
              attempt.status === "completed" &&
              attempt.certificateEligible === true &&
              Number(attempt.obtainedMarks || 0) >=
                CERTIFICATE_PASS_MARKS
          ) || null
        : null;

      const issuedCertificate = eligibleAttempt
        ? certificatesByAttempt.get(
            String(eligibleAttempt._id)
          ) || null
        : null;

      const finalEvaluation = latestFinalAttempt
        ? {
            attemptId: String(latestFinalAttempt._id),
            status: latestFinalAttempt.status,
            score: latestFinalAttempt.obtainedMarks ?? null,
            totalMarks:
              latestFinalAttempt.totalMarks || 100,
            percentage:
              latestFinalAttempt.percentage ?? null,
            correctAnswers:
              latestFinalAttempt.correctAnswers ?? 0,
            wrongAnswers:
              latestFinalAttempt.wrongAnswers ?? 0,
            attemptedQuestions:
              latestFinalAttempt.attemptedQuestions ?? 0,
            totalQuestions:
              latestFinalAttempt.totalQuestions || 30,
            startedAt:
              latestFinalAttempt.startedAt || null,
            completedAt:
              latestFinalAttempt.completedAt || null,
          }
        : {
            attemptId: null,
            status: "not_attempted",
            score: null,
            totalMarks: 100,
            percentage: null,
            correctAnswers: 0,
            wrongAnswers: 0,
            attemptedQuestions: 0,
            totalQuestions: 30,
            startedAt: null,
            completedAt: null,
          };

      const certificateEligible = Boolean(eligibleAttempt);

      const certificate = {
        eligible: certificateEligible,
        issued: Boolean(issuedCertificate),
        status: issuedCertificate
          ? "issued"
          : certificateEligible
          ? "eligible"
          : latestCompletedAttempt
          ? "not_eligible"
          : "not_attempted",
        eligibleAttemptId: eligibleAttempt
          ? String(eligibleAttempt._id)
          : null,
        qualifyingScore: eligibleAttempt
          ? Number(eligibleAttempt.obtainedMarks)
          : null,
        requiredMarks: CERTIFICATE_PASS_MARKS,
        certificateId:
          issuedCertificate?.certificateId || null,
        issuedAt: issuedCertificate?.issuedAt || null,
      };

      // Strengths and weak topics.
      const weakTopics = Array.isArray(
        latestAnalysis?.weaknesses
      )
        ? latestAnalysis.weaknesses.slice(0, 5)
        : [];

      const strengths = Array.isArray(
        latestAnalysis?.strengths
      )
        ? latestAnalysis.strengths
        : [];

      // Risk calculation.
      const risk = calculateRisk({
        score,
        progressPercentage,
        lastAccessedAt,
        hasAnalysis,
        courseCompleted,
      });

      // Mentor recommendations.
      const mentorRecommendations = [];

      if (!courseCompleted && incompleteTopics.length > 0) {
        mentorRecommendations.push(
          `Complete the remaining ${incompleteTopics.length} Java topics.`
        );
      }

      if (weakTopics.length > 0) {
        mentorRecommendations.push(
          `Revise weak areas: ${weakTopics
            .slice(0, 3)
            .join(", ")}.`
        );
      }

      if (improvementStatus === "declined") {
        mentorRecommendations.push(
          "Latest assessment score has decreased. Review recent mistakes."
        );
      }

      if (improvementStatus === "improved") {
        mentorRecommendations.push(
          "Assessment performance has improved. Continue regular practice."
        );
      }

      if (lastAccessedAt) {
        const inactiveDays =
          (Date.now() - new Date(lastAccessedAt).getTime()) /
          (1000 * 60 * 60 * 24);

        if (inactiveDays >= 3 && !courseCompleted) {
          mentorRecommendations.push(
            "Student has been inactive. Schedule a follow-up."
          );
        }
      } else if (!courseCompleted) {
        mentorRecommendations.push(
          "No learning activity recorded yet. Contact the student."
        );
      }

      if (
        latestCompletedAttempt &&
        !certificateEligible
      ) {
        mentorRecommendations.push(
          "Final evaluation completed, but the certificate requirement has not been achieved."
        );
      }

      if (latestFinalAttempt?.status === "locked") {
        mentorRecommendations.push(
          "Final evaluation is locked. Review the attempt and contact the student."
        );
      }

      // Assessment history.
      const formattedAssessmentHistory =
        assessmentHistory.map((record) => ({
          percentage: Number(record.percentage || 0),
          performanceLevel:
            record.performanceLevel || "Not Available",
          correctAnswers: record.correctAnswers ?? 0,
          wrongAnswers: record.wrongAnswers ?? 0,
          totalQuestions: record.totalQuestions ?? 0,
          timeSpentMinutes: record.timeSpentMinutes ?? 0,
          createdAt: record.createdAt || null,
        }));

      return {
        id: student._id,
        name: student.name,
        email: student.email,
        createdAt: student.createdAt,

        level,
        score,
        progress: progressPercentage,

        courseStatus,
        courseCompleted,
        completedTopics: completedTopicCount,
        totalTopics: TOTAL_TOPICS,
        incompleteTopics,
        topicProgress,

        prerequisite,

        weakTopics,
        strengths,

        lastActive,
        lastAccessedAt,
        risk,

        latestAnalysis: latestAnalysis
          ? {
              percentage: latestAnalysis.percentage,
              performanceLevel:
                latestAnalysis.performanceLevel,
              strengths: latestAnalysis.strengths || [],
              weaknesses: latestAnalysis.weaknesses || [],
              correctAnswers: latestAnalysis.correctAnswers,
              wrongAnswers: latestAnalysis.wrongAnswers,
              totalQuestions: latestAnalysis.totalQuestions,
              timeSpentMinutes:
                latestAnalysis.timeSpentMinutes,
              analysisSummary:
                latestAnalysis.analysisSummary,
              createdAt: latestAnalysis.createdAt,
            }
          : null,

        assessmentHistory: formattedAssessmentHistory,

        improvement: {
          previousScore,
          latestScore: score,
          difference: improvement,
          status: improvementStatus,
        },

        finalEvaluation,

        finalEvaluationAttempts: studentFinalAttempts.map(
          (attempt) => ({
            attemptId: String(attempt._id),
            status: attempt.status,
            obtainedMarks: attempt.obtainedMarks ?? null,
            totalMarks: attempt.totalMarks || 100,
            percentage: attempt.percentage ?? null,
            certificateEligible:
              Boolean(attempt.certificateEligible),
            startedAt: attempt.startedAt || null,
            completedAt: attempt.completedAt || null,
          })
        ),

        certificate,
        certificateEligible,
        certificateIssued: Boolean(issuedCertificate),

        mentorRecommendations,
      };
    });

    // Dashboard summary.
    const totalStudents = studentData.length;

    const studentsWithAnalysis = studentData.filter(
      (student) => student.latestAnalysis !== null
    );

    const classAverage =
      studentsWithAnalysis.length > 0
        ? Math.round(
            studentsWithAnalysis.reduce(
              (sum, student) => sum + student.score,
              0
            ) / studentsWithAnalysis.length
          )
        : 0;

    const completedStudents = studentData.filter(
      (student) => student.courseCompleted
    );

    const inProgressStudents = studentData.filter(
      (student) => student.courseStatus === "in_progress"
    );

    const certificateEligibleStudents = studentData.filter(
      (student) => student.certificateEligible
    );

    const certificateIssuedStudents = studentData.filter(
      (student) => student.certificateIssued
    );

    const improvedStudents = studentData.filter(
      (student) => student.improvement.status === "improved"
    );

    const needSupport = studentData.filter(
      (student) =>
        student.risk === "High" ||
        student.risk === "Medium" ||
        student.level === "Slow"
    ).length;

    const completionRate =
      totalStudents > 0
        ? Math.round(
            (completedStudents.length / totalStudents) * 100
          )
        : 0;

    const averageTopicProgress =
      totalStudents > 0
        ? Math.round(
            studentData.reduce(
              (sum, student) => sum + student.progress,
              0
            ) / totalStudents
          )
        : 0;

    // Performance distribution.
    const performanceDistribution = {
      advanced: studentData.filter(
        (student) => student.level === "Advanced"
      ).length,

      average: studentData.filter(
        (student) => student.level === "Average"
      ).length,

      slow: studentData.filter(
        (student) => student.level === "Slow"
      ).length,

      notAvailable: studentData.filter(
        (student) => student.level === "Not Available"
      ).length,
    };

    // At-risk students.
    const riskOrder = {
      High: 1,
      Medium: 2,
      Low: 3,
      None: 4,
    };

    const atRiskStudents = studentData
      .filter(
        (student) =>
          student.risk === "High" ||
          student.risk === "Medium"
      )
      .sort(
        (a, b) => riskOrder[a.risk] - riskOrder[b.risk]
      )
      .slice(0, 10);

    // Completed students list.
    const completedStudentList = completedStudents.map(
      (student) => ({
        id: student.id,
        name: student.name,
        email: student.email,
        completedTopics: student.completedTopics,
        totalTopics: student.totalTopics,
        progress: student.progress,

        completedAt:
          student.topicProgress
            .map((topic) => topic.completedAt)
            .filter(Boolean)
            .sort((a, b) => new Date(b) - new Date(a))[0] ||
          null,

        finalEvaluation: student.finalEvaluation,
        certificate: student.certificate,
        certificateEligible: student.certificateEligible,
        certificateIssued: student.certificateIssued,
      })
    );

    return res.status(200).json({
      success: true,

      summary: {
        totalStudents,
        classAverage,
        needSupport,
        completionRate,
        completedStudents: completedStudents.length,
        inProgressStudents: inProgressStudents.length,
        certificateEligible:
          certificateEligibleStudents.length,
        certificateIssued: certificateIssuedStudents.length,
        improvedStudents: improvedStudents.length,
        averageTopicProgress,
      },

      performanceDistribution,

      students: studentData,

      completedStudents: completedStudentList,

      atRiskStudents,
    });
  } catch (error) {
    console.error("Teacher dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load teacher dashboard data.",
      error: error.message,
    });
  }
};

// --------------------------------------------------
// RISK CALCULATION
// --------------------------------------------------
const calculateRisk = ({
  score,
  progressPercentage,
  lastAccessedAt,
  hasAnalysis,
  courseCompleted,
}) => {
  if (courseCompleted) {
    return "Low";
  }

  if (!lastAccessedAt && !hasAnalysis) {
    return "Medium";
  }

  if (lastAccessedAt) {
    const differenceInDays =
      (Date.now() - new Date(lastAccessedAt).getTime()) /
      (1000 * 60 * 60 * 24);

    if (differenceInDays >= 7) {
      return "High";
    }

    if (differenceInDays >= 3) {
      return "Medium";
    }
  }

  if (score !== null && score < 50) {
    return "High";
  }

  if (progressPercentage < 20) {
    return "Medium";
  }

  if (score !== null && score < 60) {
    return "Medium";
  }

  return "Low";
};

// --------------------------------------------------
// FORMAT LAST ACTIVE
// --------------------------------------------------
const formatLastActive = (date) => {
  const lastDate = new Date(date);

  if (Number.isNaN(lastDate.getTime())) {
    return "Never";
  }

  const differenceInMinutes = Math.floor(
    (Date.now() - lastDate.getTime()) / (1000 * 60)
  );

  if (differenceInMinutes < 1) {
    return "Just now";
  }

  if (differenceInMinutes < 60) {
    return `${differenceInMinutes} min ago`;
  }

  const differenceInHours = Math.floor(
    differenceInMinutes / 60
  );

  if (differenceInHours < 24) {
    return `${differenceInHours} ${
      differenceInHours === 1 ? "hour" : "hours"
    } ago`;
  }

  const differenceInDays = Math.floor(
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

// --------------------------------------------------
// CAPITALIZE PERFORMANCE LEVEL
// --------------------------------------------------
const capitalizeLevel = (value) => {
  if (!value) {
    return "Not Available";
  }

  const normalized = String(value).trim().toLowerCase();

  return (
    normalized.charAt(0).toUpperCase() +
    normalized.slice(1)
  );
};

// --------------------------------------------------
// EXPORT
// --------------------------------------------------
module.exports = {
  getTeacherDashboard,
};