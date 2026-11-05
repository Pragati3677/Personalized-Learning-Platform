const mongoose = require("mongoose");

const FinalEvaluationAttempt = require("../models/FinalEvaluationAttempt");
const Certificate = require("../models/Certificate");
const FinalEvaluationQuestion = require("../models/FinalEvaluationQuestion");
const StudentProgress = require("../models/StudentProgress");
const Topic = require("../models/Topic");
const { runJavaCode } = require("../services/javaCompilerService");

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

const TOTAL_QUESTIONS = 30;
const TOTAL_MARKS = 100;
const PASS_MARKS = 96;
const TOTAL_TIME_MS = 70 * 60 * 1000;

const normalizeOutput = (value) =>
  String(value || "")
    .replace(/\r\n/g, "\n")
    .trim();

const isValidObjectId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

// --------------------------------------------------
// START FINAL EVALUATION
// --------------------------------------------------
const startFinalEvaluation = async (req, res) => {
  try {
    const topics = await Topic.find({
      title: { $in: REQUIRED_TOPICS },
      isActive: true,
    }).select("_id title");

    const topicMap = new Map(
      topics.map((topic) => [topic.title, topic._id])
    );

    const missingTopics = REQUIRED_TOPICS.filter(
      (title) => !topicMap.has(title)
    );

    if (missingTopics.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Some required Java topics are missing from the Topic collection.",
        missingTopics,
      });
    }

    const completedProgress = await StudentProgress.find({
      studentId: req.user._id,
      status: "completed",
      topic: { $in: REQUIRED_TOPICS },
    }).select("topic");

    const completedTitles = new Set(
      completedProgress.map((progress) => progress.topic)
    );

    const incompleteTopics = REQUIRED_TOPICS.filter(
      (title) => !completedTitles.has(title)
    );

    if (incompleteTopics.length > 0) {
      return res.status(403).json({
        success: false,
        message:
          "Complete all 18 Java topics before starting the final evaluation.",
        incompleteTopics,
      });
    }

    const topicIds = topics.map((topic) => topic._id);

    const questions = await FinalEvaluationQuestion.find({
      topicId: { $in: topicIds },
      isActive: true,
    }).sort({ createdAt: 1 });

    const mcqs = questions.filter(
      (question) => question.questionType === "mcq"
    );

    const codingQuestions = questions.filter(
      (question) => question.questionType === "coding"
    );

    if (
      questions.length !== TOTAL_QUESTIONS ||
      mcqs.length !== 20 ||
      codingQuestions.length !== 10
    ) {
      return res.status(500).json({
        success: false,
        message:
          "The question bank must contain exactly 20 MCQs and 10 coding questions.",
        questionCount: questions.length,
        mcqCount: mcqs.length,
        codingCount: codingQuestions.length,
      });
    }

    const calculatedTotalMarks = questions.reduce(
      (sum, question) => sum + question.marks,
      0
    );

    if (calculatedTotalMarks !== TOTAL_MARKS) {
      return res.status(500).json({
        success: false,
        message:
          "The final evaluation question bank must total 100 marks.",
        calculatedTotalMarks,
      });
    }

    // Shuffle question order for each attempt.
    const shuffledQuestions = [...questions];

    for (let i = shuffledQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [shuffledQuestions[i], shuffledQuestions[j]] = [
        shuffledQuestions[j],
        shuffledQuestions[i],
      ];
    }

    const now = new Date();

    const attempt = await FinalEvaluationAttempt.create({
      studentId: req.user._id,
      topicId: null,
      totalQuestions: TOTAL_QUESTIONS,
      totalMarks: TOTAL_MARKS,
      status: "started",
      startedAt: now,
      expiresAt: new Date(now.getTime() + TOTAL_TIME_MS),
      answers: [],
    });

    // Never send correct answers or hidden tests to the client.
    const safeQuestions = shuffledQuestions.map((question) => {
      const item = question.toObject();

      delete item.correctAnswer;

      if (item.questionType === "coding") {
        item.testCases = (item.testCases || [])
          .filter((testCase) => !testCase.isHidden)
          .map((testCase) => ({
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            isHidden: false,
          }));
      } else {
        delete item.starterCode;
        delete item.testCases;
      }

      item.timeLimitSeconds =
        item.questionType === "mcq" ? 60 : 300;

      return item;
    });

    return res.status(201).json({
      success: true,
      message: "Java final evaluation started successfully.",
      attemptId: attempt._id,
      totalQuestions: TOTAL_QUESTIONS,
      totalMarks: TOTAL_MARKS,
      passMarks: PASS_MARKS,
      durationMinutes: 70,
      expiresAt: attempt.expiresAt,
      questions: safeQuestions,
    });
  } catch (error) {
    console.error("Start final evaluation error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to start the final evaluation.",
    });
  }
};

// --------------------------------------------------
// SUBMIT FINAL EVALUATION
// --------------------------------------------------
const submitFinalEvaluation = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { answers, tabSwitchCount = 0 } = req.body;

    if (!isValidObjectId(attemptId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid attempt ID.",
      });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Answers must be an array.",
      });
    }

    if (
      !Number.isInteger(tabSwitchCount) ||
      tabSwitchCount < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid tab switch count.",
      });
    }

    const attempt = await FinalEvaluationAttempt.findById(
      attemptId
    );

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Final evaluation attempt not found.",
      });
    }

    if (
      attempt.studentId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You cannot submit another student's attempt.",
      });
    }

    if (attempt.status !== "started") {
      return res.status(400).json({
        success: false,
        message: "This attempt is no longer active.",
      });
    }

    const now = new Date();

    // Enforce the overall assessment deadline on the server.
    if (attempt.expiresAt && now > attempt.expiresAt) {
      attempt.status = "completed";
      attempt.completedAt = now;
      attempt.obtainedMarks = 0;
      attempt.percentage = 0;
      attempt.certificateEligible = false;

      await attempt.save();

      return res.status(400).json({
        success: false,
        message:
          "The assessment time has expired. Answers were not accepted.",
      });
    }

    // Lock after three reported tab switches.
    if (tabSwitchCount >= 3) {
      attempt.tabSwitchCount = tabSwitchCount;
      attempt.isLocked = true;
      attempt.lockedAt = now;
      attempt.status = "locked";

      await attempt.save();

      return res.status(403).json({
        success: false,
        locked: true,
        message:
          "The assessment has been locked after three tab switches. Contact your teacher.",
      });
    }

    if (answers.length !== TOTAL_QUESTIONS) {
      return res.status(400).json({
        success: false,
        message:
          "Submit all 30 question entries. Leave unanswered questions blank.",
      });
    }

    const submittedIds = answers.map((answer) =>
      String(answer.questionId || "")
    );

    if (
      submittedIds.some((id) => !isValidObjectId(id)) ||
      new Set(submittedIds).size !== TOTAL_QUESTIONS
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Each question must be included exactly once.",
      });
    }

    const topics = await Topic.find({
      title: { $in: REQUIRED_TOPICS },
      isActive: true,
    }).select("_id");

    const topicIds = topics.map((topic) => topic._id);

    const questions = await FinalEvaluationQuestion.find({
      _id: { $in: submittedIds },
      topicId: { $in: topicIds },
      isActive: true,
    });

    if (questions.length !== TOTAL_QUESTIONS) {
      return res.status(400).json({
        success: false,
        message:
          "The submitted answers contain invalid or inactive questions.",
      });
    }

    const mcqCount = questions.filter(
      (question) => question.questionType === "mcq"
    ).length;

    const codingCount = questions.filter(
      (question) => question.questionType === "coding"
    ).length;

    const bankTotalMarks = questions.reduce(
      (sum, question) => sum + question.marks,
      0
    );

    if (
      mcqCount !== 20 ||
      codingCount !== 10 ||
      bankTotalMarks !== TOTAL_MARKS
    ) {
      return res.status(500).json({
        success: false,
        message:
          "The question bank does not match the required evaluation structure.",
      });
    }

    let correctAnswers = 0;
    let wrongAnswers = 0;
    let attemptedQuestions = 0;
    let obtainedMarks = 0;

    const evaluatedAnswers = [];

    for (const answer of answers) {
      const question = questions.find(
        (item) =>
          item._id.toString() === String(answer.questionId)
      );

      if (!question) {
        return res.status(400).json({
          success: false,
          message: "An invalid question was submitted.",
        });
      }

      let marksObtained = 0;
      let isCorrect = false;
      let selectedAnswer = "";
      let submittedCode = "";

      if (question.questionType === "mcq") {
        selectedAnswer =
          typeof answer.selectedAnswer === "string"
            ? answer.selectedAnswer.trim()
            : "";

        if (selectedAnswer) {
          attemptedQuestions++;

          isCorrect =
            selectedAnswer.toLowerCase() ===
            question.correctAnswer.trim().toLowerCase();

          if (isCorrect) {
            marksObtained = question.marks;
            correctAnswers++;
          } else {
            wrongAnswers++;
          }
        }
      } else if (question.questionType === "coding") {
        submittedCode =
          typeof answer.submittedCode === "string"
            ? answer.submittedCode
            : "";

        if (submittedCode.trim()) {
          attemptedQuestions++;

          const testCases = question.testCases || [];

          if (testCases.length > 0) {
            let allPassed = true;

            for (const testCase of testCases) {
              let result;

              try {
                result = await runJavaCode(
                  submittedCode,
                  testCase.input || ""
                );
              } catch (error) {
                console.error(
                  "Java execution error:",
                  error.message
                );

                return res.status(502).json({
                  success: false,
                  message:
                    "Java code execution is temporarily unavailable. Please try submitting again.",
                });
              }

              const accepted =
                result.status === "Accepted" &&
                normalizeOutput(result.output) ===
                  normalizeOutput(testCase.expectedOutput);

              if (!accepted) {
                allPassed = false;
                break;
              }
            }

            if (allPassed) {
              isCorrect = true;
              marksObtained = question.marks;
              correctAnswers++;
            } else {
              wrongAnswers++;
            }
          } else {
            wrongAnswers++;
          }
        }
      }

      obtainedMarks += marksObtained;

      evaluatedAnswers.push({
        questionId: question._id,
        selectedAnswer,
        submittedCode,
        isCorrect,
        marksObtained,
        submittedAt: now,
      });
    }

    const percentage = Number(
      ((obtainedMarks / TOTAL_MARKS) * 100).toFixed(2)
    );

    attempt.answers = evaluatedAnswers;
    attempt.attemptedQuestions = attemptedQuestions;
    attempt.correctAnswers = correctAnswers;
    attempt.wrongAnswers = wrongAnswers;
    attempt.obtainedMarks = obtainedMarks;
    attempt.percentage = percentage;
    attempt.tabSwitchCount = tabSwitchCount;
    attempt.certificateEligible = obtainedMarks >= PASS_MARKS;
    attempt.status = "completed";
    attempt.completedAt = now;

    await attempt.save();

    return res.status(200).json({
      success: true,
      message: "Final evaluation submitted successfully.",
      result: {
        attemptId: attempt._id,
        totalQuestions: TOTAL_QUESTIONS,
        attemptedQuestions,
        correctAnswers,
        wrongAnswers,
        totalMarks: TOTAL_MARKS,
        obtainedMarks,
        percentage,
        passMarks: PASS_MARKS,
        certificateEligible: attempt.certificateEligible,
        status: attempt.status,
      },
    });
  } catch (error) {
    console.error("Submit final evaluation error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit the final evaluation.",
    });
  }
};

// --------------------------------------------------
// GET MY FINAL EVALUATION ATTEMPTS
// --------------------------------------------------
const getMyFinalEvaluationAttempts = async (req, res) => {
  try {
    const attempts = await FinalEvaluationAttempt.find({
      studentId: req.user._id,
    })
      .populate("topicId", "title")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: attempts.length,
      attempts,
    });
  } catch (error) {
    console.error("Get final evaluation attempts error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve final evaluation attempts.",
    });
  }
};

// --------------------------------------------------
// RECORD TAB-SWITCH VIOLATION
// --------------------------------------------------
const recordFinalEvaluationViolation = async (req, res) => {
  try {
    const { attemptId } = req.params;

    if (!isValidObjectId(attemptId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid attempt ID.",
      });
    }

    const attempt = await FinalEvaluationAttempt.findById(
      attemptId
    );

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Final evaluation attempt not found.",
      });
    }

    if (
      attempt.studentId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You cannot update another student's attempt.",
      });
    }

    if (attempt.status !== "started" || attempt.isLocked) {
      return res.status(400).json({
        success: false,
        message: "This assessment is no longer active.",
      });
    }

    if (attempt.expiresAt && new Date() > attempt.expiresAt) {
      return res.status(400).json({
        success: false,
        message: "The assessment time has expired.",
      });
    }

    attempt.tabSwitchCount += 1;

    if (attempt.tabSwitchCount >= 3) {
      attempt.isLocked = true;
      attempt.lockedAt = new Date();
      attempt.status = "locked";
    }

    await attempt.save();

    return res.status(200).json({
      success: true,
      tabSwitchCount: attempt.tabSwitchCount,
      isLocked: attempt.isLocked,
      status: attempt.status,
      message: attempt.isLocked
        ? "Assessment locked after three tab-switch violations."
        : "Tab-switch violation recorded.",
    });
  } catch (error) {
    console.error("Record violation error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to record assessment violation.",
    });
  }
};

// --------------------------------------------------
// GET AND ISSUE VERIFIED CERTIFICATE
// --------------------------------------------------
const getMyCertificate = async (req, res) => {
  try {
    // Verify that all 18 required topics are completed.
    const completedProgress = await StudentProgress.find({
      studentId: req.user._id,
      status: "completed",
      topic: { $in: REQUIRED_TOPICS },
    }).select("topic");

    const completedTitles = new Set(
      completedProgress.map((progress) => progress.topic)
    );

    const incompleteTopics = REQUIRED_TOPICS.filter(
      (title) => !completedTitles.has(title)
    );

    if (incompleteTopics.length > 0) {
      return res.status(403).json({
        success: false,
        message:
          "Complete all 18 Java topics before receiving the certificate.",
        incompleteTopics,
      });
    }

    // Find the latest qualifying completed evaluation.
    const attempt = await FinalEvaluationAttempt.findOne({
      studentId: req.user._id,
      status: "completed",
      certificateEligible: true,
      obtainedMarks: { $gte: PASS_MARKS },
    }).sort({ completedAt: -1 });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message:
          "No eligible certificate found. Score at least 96/100 first.",
      });
    }

    const studentName =
      req.user.name ||
      req.user.fullName ||
      req.user.username ||
      req.user.email ||
      "Student";

    const completedAt =
      attempt.completedAt || attempt.updatedAt || new Date();

    const year = new Date(completedAt).getFullYear();

    const certificateId =
      `LEARNAI-${year}-${attempt._id
        .toString()
        .slice(-8)
        .toUpperCase()}`;

    // Create a permanent certificate record.
    // If it already exists for this attempt, reuse it.
    const issuedCertificate =
      await Certificate.findOneAndUpdate(
        {
          studentId: req.user._id,
          finalEvaluationAttemptId: attempt._id,
        },
        {
          $setOnInsert: {
            studentId: req.user._id,
            finalEvaluationAttemptId: attempt._id,
            certificateId,
            courseName: "Java Programming",
            score: attempt.obtainedMarks,
            totalMarks: attempt.totalMarks || TOTAL_MARKS,
            percentage: attempt.percentage,
            issuedAt: new Date(),
            status: "issued",
          },
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      );

    const certificate = {
      student: studentName,
      studentName,

      course: issuedCertificate.courseName,
      courseName: issuedCertificate.courseName,

      date: issuedCertificate.issuedAt,
      completionDate: completedAt,

      score: issuedCertificate.score,
      finalScore: issuedCertificate.score,
      totalMarks: issuedCertificate.totalMarks,
      percentage: issuedCertificate.percentage,

      certId: issuedCertificate.certificateId,
      certificateId: issuedCertificate.certificateId,

      department: "Computer Science & Engineering",
      achievementLevel: "Certificate Earned",

      status: "Issued",
      issuedAt: issuedCertificate.issuedAt,
      verified: true,
    };

    return res.status(200).json({
      success: true,
      message: "Certificate issued successfully.",
      certificate,
      certificateId: issuedCertificate.certificateId,
      certId: issuedCertificate.certificateId,
      data: certificate,
    });
  } catch (error) {
    console.error("Get certificate error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load or issue certificate.",
    });
  }
};

// --------------------------------------------------
// EXPORT CONTROLLER FUNCTIONS
// --------------------------------------------------
module.exports = {
  startFinalEvaluation,
  submitFinalEvaluation,
  getMyFinalEvaluationAttempts,
  recordFinalEvaluationViolation,
  getMyCertificate,
};