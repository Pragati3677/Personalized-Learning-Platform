const Prerequisite = require("../models/Prerequisite");
const PrerequisiteQuestion = require("../models/PrerequisiteQuestion");
const PrerequisiteAttempt = require("../models/PrerequisiteAttempt");

// ======================================================
// CREATE PREREQUISITE
// ======================================================

const createPrerequisite = async (req, res) => {
  try {
    const prerequisite = await Prerequisite.create({
      topic: "Java Basics and Basic DSA",
      description:
        "Prerequisite evaluation covering Java fundamentals and basic Data Structures and Algorithms.",
    });

    res.status(201).json({
      success: true,
      message: "Prerequisite created successfully",
      prerequisite,
    });
  } catch (error) {
    console.error("Create prerequisite error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================================
// START EVALUATION
// ======================================================

const startEvaluation = async (req, res) => {
  try {
    const { id } = req.params;

    // --------------------------------------------------
    // 1. Find prerequisite
    // --------------------------------------------------

    const prerequisite = await Prerequisite.findById(id);

    if (!prerequisite || !prerequisite.isActive) {
      return res.status(404).json({
        success: false,
        message: "Prerequisite not found.",
      });
    }

    // --------------------------------------------------
    // 2. Get 20 Java questions
    // --------------------------------------------------

    const javaQuestions = await PrerequisiteQuestion.aggregate([
      {
        $match: {
          prerequisiteId: prerequisite._id,
          category: "java",
          isActive: true,
        },
      },
      {
        $sample: {
          size: 20,
        },
      },
    ]);

    // --------------------------------------------------
    // 3. Get 10 DSA questions
    // --------------------------------------------------

    const dsaQuestions = await PrerequisiteQuestion.aggregate([
      {
        $match: {
          prerequisiteId: prerequisite._id,
          category: "dsa",
          isActive: true,
        },
      },
      {
        $sample: {
          size: 10,
        },
      },
    ]);

    // --------------------------------------------------
    // 4. Validate question count
    // --------------------------------------------------

    if (javaQuestions.length !== 20) {
      return res.status(400).json({
        success: false,
        message: "Exactly 20 active Java questions are required.",
      });
    }

    if (dsaQuestions.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Exactly 10 active DSA questions are required.",
      });
    }

    // --------------------------------------------------
    // 5. Combine Java + DSA
    // --------------------------------------------------

    const allQuestions = [
      ...javaQuestions,
      ...dsaQuestions,
    ];

    // --------------------------------------------------
    // 6. Shuffle all 30 questions
    // --------------------------------------------------

    for (let i = allQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [allQuestions[i], allQuestions[j]] = [
        allQuestions[j],
        allQuestions[i],
      ];
    }

    // --------------------------------------------------
    // 7. Evaluation start time
    // --------------------------------------------------

    const startedAt = new Date();

    // --------------------------------------------------
    // 8. Overall evaluation expiry
    // 30 minutes = 1800 seconds
    // --------------------------------------------------

    const totalTimeInMilliseconds =
      prerequisite.totalTime * 1000;

    const expiresAt = new Date(
      startedAt.getTime() + totalTimeInMilliseconds
    );

    // --------------------------------------------------
    // 9. Create attempt question records
    // --------------------------------------------------

    const attemptQuestions = allQuestions.map(
      (question, index) => {
        const questionStartedAt =
          index === 0 ? startedAt : null;

        const questionExpiresAt =
          index === 0
            ? new Date(
                startedAt.getTime() +
                  prerequisite.timePerQuestion * 1000
              )
            : null;

        return {
          questionId: question._id,
          order: index + 1,

          selectedAnswer: null,

          questionStartedAt,

          questionExpiresAt,

          answeredAt: null,

          isExpired: false,
        };
      }
    );

    // --------------------------------------------------
    // 10. Create evaluation attempt
    // --------------------------------------------------

    const attempt = await PrerequisiteAttempt.create({
      studentId: req.user._id,

      prerequisiteId: prerequisite._id,

      questions: attemptQuestions,

      currentQuestionIndex: 0,

      score: 0,

      totalMarks: prerequisite.totalMarks,

      percentage: 0,

      status: "in_progress",

      startedAt,

      submittedAt: null,

      expiresAt,
    });

    // --------------------------------------------------
    // 11. Remove correct answers before sending
    // --------------------------------------------------

    const questionsForStudent = allQuestions.map(
      (question, index) => ({
        questionId: question._id,

        order: index + 1,

        category: question.category,

        question: question.question,

        options: question.options,

        marks: question.marks,
      })
    );

    // --------------------------------------------------
    // 12. Send response
    // --------------------------------------------------

    res.status(201).json({
      success: true,

      message: "Evaluation started successfully.",

      attemptId: attempt._id,

      evaluation: {
        totalQuestions: prerequisite.totalQuestions,

        totalMarks: prerequisite.totalMarks,

        timePerQuestion: prerequisite.timePerQuestion,

        totalTime: prerequisite.totalTime,

        passingScore: prerequisite.passingScore,

        startedAt,

        expiresAt,
      },

      questions: questionsForStudent,
    });
  } catch (error) {
    console.error(
      "Start evaluation error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================================
// SUBMIT ONE ANSWER
// ======================================================

const submitAnswer = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const {
      questionId,
      selectedAnswer,
    } = req.body;

    // --------------------------------------------------
    // 1. Validate question ID
    // --------------------------------------------------

    if (!questionId) {
      return res.status(400).json({
        success: false,
        message: "Question ID is required.",
      });
    }

    // --------------------------------------------------
    // 2. Find attempt
    // --------------------------------------------------

    const attempt =
      await PrerequisiteAttempt.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Evaluation attempt not found.",
      });
    }

    // --------------------------------------------------
    // 3. Check ownership
    // --------------------------------------------------

    if (
      attempt.studentId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to access this evaluation.",
      });
    }

    // --------------------------------------------------
    // 4. Check evaluation status
    // --------------------------------------------------

    if (attempt.status !== "in_progress") {
      return res.status(400).json({
        success: false,
        message:
          "This evaluation is no longer active.",
      });
    }

    // --------------------------------------------------
    // 5. Check overall 30-minute expiry
    // --------------------------------------------------

    const now = new Date();

    if (now > attempt.expiresAt) {
      attempt.status = "expired";

      attempt.submittedAt = now;

      await attempt.save();

      return res.status(400).json({
        success: false,
        message:
          "The 30-minute evaluation time has expired.",
      });
    }

    // --------------------------------------------------
    // 6. Get current question
    // --------------------------------------------------

    const currentIndex =
      attempt.currentQuestionIndex;

    const currentQuestion =
      attempt.questions[currentIndex];

    if (!currentQuestion) {
      return res.status(400).json({
        success: false,
        message:
          "No current question found.",
      });
    }

    // --------------------------------------------------
    // 7. Check correct question
    // --------------------------------------------------

    if (
      currentQuestion.questionId.toString() !==
      questionId.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This is not the current question.",
      });
    }

    // --------------------------------------------------
    // 8. Prevent duplicate answer
    // --------------------------------------------------

    if (
      currentQuestion.selectedAnswer !== null
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This question has already been answered.",
      });
    }

    // --------------------------------------------------
    // 9. Check 60-second question expiry
    // --------------------------------------------------

    if (
      currentQuestion.questionExpiresAt &&
      now > currentQuestion.questionExpiresAt
    ) {
      // Mark question expired
      currentQuestion.isExpired = true;

      currentQuestion.answeredAt = now;

      // Move to next question
      attempt.currentQuestionIndex += 1;

      const nextIndex =
        attempt.currentQuestionIndex;

      // ------------------------------------------------
      // If there is another question
      // ------------------------------------------------

      if (
        nextIndex <
        attempt.questions.length
      ) {
        const nextAttemptQuestion =
          attempt.questions[nextIndex];

        const nextStartedAt = new Date();

        const prerequisite =
          await Prerequisite.findById(
            attempt.prerequisiteId
          );

        const timePerQuestion =
          prerequisite
            ? prerequisite.timePerQuestion
            : 60;

        const nextExpiresAt =
          new Date(
            nextStartedAt.getTime() +
              timePerQuestion * 1000
          );

        nextAttemptQuestion.questionStartedAt =
          nextStartedAt;

        nextAttemptQuestion.questionExpiresAt =
          nextExpiresAt;

        const nextQuestion =
          await PrerequisiteQuestion.findById(
            nextAttemptQuestion.questionId
          ).select(
            "_id category question options marks"
          );

        await attempt.save();

        return res.status(200).json({
          success: true,

          message:
            "Time expired. Moving to the next question.",

          marksObtained: 0,

          nextQuestion: {
            questionId:
              nextQuestion._id,

            order:
              nextIndex + 1,

            category:
              nextQuestion.category,

            question:
              nextQuestion.question,

            options:
              nextQuestion.options,

            marks:
              nextQuestion.marks,

            questionStartedAt:
              nextAttemptQuestion.questionStartedAt,

            questionExpiresAt:
              nextAttemptQuestion.questionExpiresAt,
          },

          progress: {
            currentQuestion:
              nextIndex + 1,

            totalQuestions:
              attempt.questions.length,

            currentScore:
              attempt.score,
          },
        });
      }

      // ------------------------------------------------
      // If question 30 expired
      // ------------------------------------------------

      const percentage =
        (attempt.score /
          attempt.totalMarks) *
        100;

      attempt.percentage =
        Number(
          percentage.toFixed(2)
        );

      attempt.status =
        percentage >= 40
          ? "passed"
          : "failed";

      attempt.submittedAt = now;

      await attempt.save();

      return res.status(200).json({
        success: true,

        message:
          "Evaluation completed. The last question expired.",

        result: {
          attemptId:
            attempt._id,

          score:
            attempt.score,

          totalMarks:
            attempt.totalMarks,

          percentage:
            attempt.percentage,

          status:
            attempt.status,

          totalQuestions:
            attempt.questions.length,
        },

        marksObtained: 0,
      });
    }

    // --------------------------------------------------
    // 10. Save selected answer
    // --------------------------------------------------

    currentQuestion.selectedAnswer =
      selectedAnswer || null;

    currentQuestion.answeredAt =
      now;

    // --------------------------------------------------
    // 11. Find question and correct answer
    // --------------------------------------------------

    const question =
      await PrerequisiteQuestion.findById(
        questionId
      ).select(
        "correctAnswer marks category question options"
      );

    if (!question) {
      return res.status(404).json({
        success: false,
        message:
          "Question not found.",
      });
    }

    // --------------------------------------------------
    // 12. Calculate marks
    // --------------------------------------------------

    let marksObtained = 0;

    if (
      selectedAnswer &&
      selectedAnswer ===
        question.correctAnswer
    ) {
      marksObtained =
        question.marks;

      attempt.score +=
        question.marks;
    }

    // --------------------------------------------------
    // 13. Move to next question
    // --------------------------------------------------

    attempt.currentQuestionIndex +=
      1;

    const nextIndex =
      attempt.currentQuestionIndex;

    // --------------------------------------------------
    // 14. Check if evaluation completed
    // --------------------------------------------------

    if (
      nextIndex >=
      attempt.questions.length
    ) {
      const percentage =
        (attempt.score /
          attempt.totalMarks) *
        100;

      attempt.percentage =
        Number(
          percentage.toFixed(2)
        );

      attempt.status =
        percentage >= 40
          ? "passed"
          : "failed";

      attempt.submittedAt =
        now;

      await attempt.save();

      return res.status(200).json({
        success: true,

        message:
          "Evaluation completed successfully.",

        result: {
          attemptId:
            attempt._id,

          score:
            attempt.score,

          totalMarks:
            attempt.totalMarks,

          percentage:
            attempt.percentage,

          status:
            attempt.status,

          totalQuestions:
            attempt.questions.length,

          submittedAt:
            attempt.submittedAt,
        },

        marksObtained,
      });
    }

    // --------------------------------------------------
    // 15. Start next question
    // --------------------------------------------------

    const nextAttemptQuestion =
      attempt.questions[nextIndex];

    const nextStartedAt =
      new Date();

    // Get configured time per question
    const prerequisite =
      await Prerequisite.findById(
        attempt.prerequisiteId
      );

    const timePerQuestion =
      prerequisite
        ? prerequisite.timePerQuestion
        : 60;

    const nextExpiresAt =
      new Date(
        nextStartedAt.getTime() +
          timePerQuestion * 1000
      );

    nextAttemptQuestion.questionStartedAt =
      nextStartedAt;

    nextAttemptQuestion.questionExpiresAt =
      nextExpiresAt;

    // --------------------------------------------------
    // 16. Get next question
    // --------------------------------------------------

    const nextQuestion =
      await PrerequisiteQuestion.findById(
        nextAttemptQuestion.questionId
      ).select(
        "_id category question options marks"
      );

    if (!nextQuestion) {
      return res.status(404).json({
        success: false,
        message:
          "Next question not found.",
      });
    }

    // --------------------------------------------------
    // 17. Save attempt
    // --------------------------------------------------

    await attempt.save();

    // --------------------------------------------------
    // 18. Send next question
    // --------------------------------------------------

    res.status(200).json({
      success: true,

      message:
        "Answer saved successfully.",

      marksObtained,

      currentQuestion: {
        order:
          currentQuestion.order,
      },

      nextQuestion: {
        questionId:
          nextQuestion._id,

        order:
          nextIndex + 1,

        category:
          nextQuestion.category,

        question:
          nextQuestion.question,

        options:
          nextQuestion.options,

        marks:
          nextQuestion.marks,

        questionStartedAt:
          nextAttemptQuestion.questionStartedAt,

        questionExpiresAt:
          nextAttemptQuestion.questionExpiresAt,
      },

      progress: {
        currentQuestion:
          nextIndex + 1,

        totalQuestions:
          attempt.questions.length,

        currentScore:
          attempt.score,
      },
    });
  } catch (error) {
    console.error(
      "Submit answer error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================================
// HANDLE QUESTION TIMEOUT
// ======================================================

const timeoutQuestion = async (req, res) => {
  try {
    const { attemptId } = req.params;

    // --------------------------------------------------
    // 1. Find evaluation attempt
    // --------------------------------------------------

    const attempt =
      await PrerequisiteAttempt.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Evaluation attempt not found.",
      });
    }

    // --------------------------------------------------
    // 2. Check student ownership
    // --------------------------------------------------

    if (
      attempt.studentId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to access this evaluation.",
      });
    }

    // --------------------------------------------------
    // 3. Check evaluation status
    // --------------------------------------------------

    if (attempt.status !== "in_progress") {
      return res.status(400).json({
        success: false,
        message:
          "This evaluation is no longer active.",
      });
    }

    const now = new Date();

    // --------------------------------------------------
    // 4. Check overall 30-minute expiry
    // --------------------------------------------------

    if (now > attempt.expiresAt) {
      attempt.status = "expired";
      attempt.submittedAt = now;

      await attempt.save();

      return res.status(400).json({
        success: false,
        message:
          "The 30-minute evaluation time has expired.",
      });
    }

    // --------------------------------------------------
    // 5. Get current question
    // --------------------------------------------------

    const currentIndex =
      attempt.currentQuestionIndex;

    const currentQuestion =
      attempt.questions[currentIndex];

    if (!currentQuestion) {
      return res.status(400).json({
        success: false,
        message:
          "No current question found.",
      });
    }

    // --------------------------------------------------
    // 6. Check if question is already answered
    // --------------------------------------------------

    if (
      currentQuestion.selectedAnswer !== null
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This question has already been answered.",
      });
    }

    // --------------------------------------------------
    // 7. Verify that the 60-second timer expired
    // --------------------------------------------------

    if (
      !currentQuestion.questionExpiresAt ||
      now <= currentQuestion.questionExpiresAt
    ) {
      return res.status(400).json({
        success: false,
        message:
          "The current question time has not expired yet.",
        questionExpiresAt:
          currentQuestion.questionExpiresAt,
      });
    }

    // --------------------------------------------------
    // 8. Mark question as expired
    // --------------------------------------------------

    currentQuestion.isExpired = true;
    currentQuestion.answeredAt = now;

    // --------------------------------------------------
    // 9. Move to next question
    // --------------------------------------------------

    attempt.currentQuestionIndex += 1;

    const nextIndex =
      attempt.currentQuestionIndex;

    // --------------------------------------------------
    // 10. Check if all questions are completed
    // --------------------------------------------------

    if (
      nextIndex >=
      attempt.questions.length
    ) {
      const percentage =
        (attempt.score /
          attempt.totalMarks) *
        100;

      attempt.percentage =
        Number(
          percentage.toFixed(2)
        );

      // Passing score = 40
      attempt.status =
        percentage >= 40
          ? "passed"
          : "failed";

      attempt.submittedAt = now;

      await attempt.save();

      return res.status(200).json({
        success: true,

        message:
          "Evaluation completed. Last question expired.",

        marksObtained: 0,

        result: {
          attemptId:
            attempt._id,

          score:
            attempt.score,

          totalMarks:
            attempt.totalMarks,

          percentage:
            attempt.percentage,

          status:
            attempt.status,

          totalQuestions:
            attempt.questions.length,

          submittedAt:
            attempt.submittedAt,
        },
      });
    }

    // --------------------------------------------------
    // 11. Get next question
    // --------------------------------------------------

    const nextAttemptQuestion =
      attempt.questions[nextIndex];

    const nextStartedAt =
      new Date();

    // Get configured time per question
    const prerequisite =
      await Prerequisite.findById(
        attempt.prerequisiteId
      );

    const timePerQuestion =
      prerequisite
        ? prerequisite.timePerQuestion
        : 60;

    const nextExpiresAt =
      new Date(
        nextStartedAt.getTime() +
          timePerQuestion * 1000
      );

    // --------------------------------------------------
    // 12. Start next question timer
    // --------------------------------------------------

    nextAttemptQuestion.questionStartedAt =
      nextStartedAt;

    nextAttemptQuestion.questionExpiresAt =
      nextExpiresAt;

    nextAttemptQuestion.isExpired =
      false;

    // --------------------------------------------------
    // 13. Get next question data
    // --------------------------------------------------

    const nextQuestion =
      await PrerequisiteQuestion.findById(
        nextAttemptQuestion.questionId
      ).select(
        "_id category question options marks"
      );

    if (!nextQuestion) {
      return res.status(404).json({
        success: false,
        message:
          "Next question not found.",
      });
    }

    // --------------------------------------------------
    // 14. Save attempt
    // --------------------------------------------------

    await attempt.save();

    // --------------------------------------------------
    // 15. Send next question
    // --------------------------------------------------

    return res.status(200).json({
      success: true,

      message:
        "Time expired. Moving to the next question.",

      marksObtained: 0,

      nextQuestion: {
        questionId:
          nextQuestion._id,

        order:
          nextIndex + 1,

        category:
          nextQuestion.category,

        question:
          nextQuestion.question,

        options:
          nextQuestion.options,

        marks:
          nextQuestion.marks,

        questionStartedAt:
          nextAttemptQuestion.questionStartedAt,

        questionExpiresAt:
          nextAttemptQuestion.questionExpiresAt,
      },

      progress: {
        currentQuestion:
          nextIndex + 1,

        totalQuestions:
          attempt.questions.length,

        currentScore:
          attempt.score,
      },
    });
  } catch (error) {
    console.error(
      "Timeout question error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================================
// GET EVALUATION STATUS
// ======================================================

const getEvaluationStatus = async (req, res) => {
  try {
    const { attemptId } = req.params;

    // --------------------------------------------------
    // 1. Find attempt
    // --------------------------------------------------

    const attempt =
      await PrerequisiteAttempt.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Evaluation attempt not found.",
      });
    }

    // --------------------------------------------------
    // 2. Check student ownership
    // --------------------------------------------------

    if (
      attempt.studentId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to access this evaluation.",
      });
    }

    // --------------------------------------------------
    // 3. Get current question
    // --------------------------------------------------

    let currentQuestion = null;

    if (
      attempt.status === "in_progress" &&
      attempt.currentQuestionIndex <
        attempt.questions.length
    ) {
      const currentAttemptQuestion =
        attempt.questions[
          attempt.currentQuestionIndex
        ];

      const question =
        await PrerequisiteQuestion.findById(
          currentAttemptQuestion.questionId
        ).select(
          "_id category question options marks"
        );

      if (question) {
        currentQuestion = {
          questionId: question._id,

          order:
            currentAttemptQuestion.order,

          category:
            question.category,

          question:
            question.question,

          options:
            question.options,

          marks:
            question.marks,

          questionStartedAt:
            currentAttemptQuestion.questionStartedAt,

          questionExpiresAt:
            currentAttemptQuestion.questionExpiresAt,

          isExpired:
            currentAttemptQuestion.isExpired,
        };
      }
    }

    // --------------------------------------------------
    // 4. Calculate remaining time
    // --------------------------------------------------

    const now = new Date();

    let questionRemainingSeconds = 0;
    let evaluationRemainingSeconds = 0;

    if (currentQuestion) {
      const questionExpiry =
        new Date(
          currentQuestion.questionExpiresAt
        );

      questionRemainingSeconds =
        Math.max(
          0,
          Math.ceil(
            (questionExpiry.getTime() -
              now.getTime()) /
              1000
          )
        );
    }

    if (attempt.status === "in_progress") {
      evaluationRemainingSeconds =
        Math.max(
          0,
          Math.ceil(
            (attempt.expiresAt.getTime() -
              now.getTime()) /
              1000
          )
        );
    }

    // --------------------------------------------------
    // 5. Send status
    // --------------------------------------------------

    return res.status(200).json({
      success: true,

      evaluation: {
        attemptId:
          attempt._id,

        status:
          attempt.status,

        currentQuestion:
          attempt.currentQuestionIndex + 1,

        totalQuestions:
          attempt.questions.length,

        score:
          attempt.score,

        totalMarks:
          attempt.totalMarks,

        percentage:
          attempt.percentage,

        startedAt:
          attempt.startedAt,

        expiresAt:
          attempt.expiresAt,

        submittedAt:
          attempt.submittedAt,

        questionRemainingSeconds,

        evaluationRemainingSeconds,
      },

      currentQuestion,
    });
  } catch (error) {
    console.error(
      "Get evaluation status error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ======================================================
// SUBMIT EVALUATION
// ======================================================
// NOTE:
// This endpoint is kept for compatibility.
// The recommended flow is to use /answer for every question.
// ======================================================

const submitEvaluation = async (req, res) => {
  try {
    const { attemptId } =
      req.params;

    const { answers } =
      req.body;

    // --------------------------------------------------
    // 1. Validate answers
    // --------------------------------------------------

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message:
          "Answers must be provided as an array.",
      });
    }

    // --------------------------------------------------
    // 2. Find attempt
    // --------------------------------------------------

    const attempt =
      await PrerequisiteAttempt.findById(
        attemptId
      );

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message:
          "Evaluation attempt not found.",
      });
    }

    // --------------------------------------------------
    // 3. Check ownership
    // --------------------------------------------------

    if (
      attempt.studentId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to submit this evaluation.",
      });
    }

    // --------------------------------------------------
    // 4. Check status
    // --------------------------------------------------

    if (
      attempt.status !==
      "in_progress"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This evaluation has already been submitted.",
      });
    }

    const now = new Date();

    // --------------------------------------------------
    // 5. Check overall expiry
    // --------------------------------------------------

    if (
      now >
      attempt.expiresAt
    ) {
      attempt.status =
        "expired";

      attempt.submittedAt =
        now;

      await attempt.save();

      return res.status(400).json({
        success: false,
        message:
          "Evaluation time has expired.",
      });
    }

    // --------------------------------------------------
    // 6. Get question IDs
    // --------------------------------------------------

    const questionIds =
      attempt.questions.map(
        (item) =>
          item.questionId
      );

    // --------------------------------------------------
    // 7. Get correct answers
    // --------------------------------------------------

    const questions =
      await PrerequisiteQuestion.find({
        _id: {
          $in: questionIds,
        },
      }).select(
        "category correctAnswer marks"
      );

    let score = 0;

    // --------------------------------------------------
    // 8. Calculate score
    // --------------------------------------------------

    for (
      const attemptQuestion
      of attempt.questions
    ) {
      const submittedAnswer =
        answers.find(
          (answer) =>
            answer.questionId.toString() ===
            attemptQuestion.questionId.toString()
        );

      if (submittedAnswer) {
        attemptQuestion.selectedAnswer =
          submittedAnswer.selectedAnswer;

        attemptQuestion.answeredAt =
          now;
      }

      const question =
        questions.find(
          (q) =>
            q._id.toString() ===
            attemptQuestion.questionId.toString()
        );

      if (
        question &&
        submittedAnswer &&
        submittedAnswer.selectedAnswer ===
          question.correctAnswer
      ) {
        score +=
          question.marks;
      }
    }

    // --------------------------------------------------
    // 9. Calculate percentage
    // --------------------------------------------------

    const percentage =
      (score /
        attempt.totalMarks) *
      100;

    // --------------------------------------------------
    // 10. Determine result
    // --------------------------------------------------

    const status =
      percentage >= 40
        ? "passed"
        : "failed";

    // --------------------------------------------------
    // 11. Save result
    // --------------------------------------------------

    attempt.score =
      score;

    attempt.percentage =
      Number(
        percentage.toFixed(2)
      );

    attempt.status =
      status;

    attempt.submittedAt =
      now;

    await attempt.save();

    // --------------------------------------------------
    // 12. Send result
    // --------------------------------------------------

    res.status(200).json({
      success: true,

      message:
        "Evaluation submitted successfully.",

      result: {
        attemptId:
          attempt._id,

        score,

        totalMarks:
          attempt.totalMarks,

        percentage:
          attempt.percentage,

        status,

        totalQuestions:
          attempt.questions.length,

        submittedAt:
          attempt.submittedAt,
      },
    });
  } catch (error) {
    console.error(
      "Submit evaluation error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================================
// CHECK PREREQUISITE STATUS FOR LOGGED-IN STUDENT
// ======================================================

const checkPrerequisiteStatus = async (req, res) => {
  try {
    // --------------------------------------------------
    // 1. Find the latest completed prerequisite attempt
    // --------------------------------------------------

    const attempt = await PrerequisiteAttempt.findOne({
      studentId: req.user._id,
      status: {
        $in: ["passed", "failed"],
      },
    }).sort({
      submittedAt: -1,
    });

    // --------------------------------------------------
    // 2. No completed attempt found
    // --------------------------------------------------

    if (!attempt) {
      return res.status(200).json({
        success: true,
        completed: false,
        status: null,
        message: "Prerequisite assessment not completed.",
      });
    }

    // --------------------------------------------------
    // 3. Completed attempt found
    // --------------------------------------------------

    return res.status(200).json({
      success: true,
      completed: true,
      status: attempt.status,
      attemptId: attempt._id,
      score: attempt.score,
      totalMarks: attempt.totalMarks,
      percentage: attempt.percentage,
      totalQuestions: attempt.questions.length,
      submittedAt: attempt.submittedAt,
    });

  } catch (error) {
    console.error(
      "Check prerequisite status error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================================
// EXPORT CONTROLLERS
// ======================================================

module.exports = {
  createPrerequisite,
  startEvaluation,
  submitAnswer,
  timeoutQuestion,
   getEvaluationStatus,
  submitEvaluation,
  checkPrerequisiteStatus,
};