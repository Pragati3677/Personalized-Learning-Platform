import { useState, useEffect, useRef } from "react";

const API_URL = "http://localhost:5000/api";
const PREREQUISITE_ID = "6aaa57f0b03509e218cbeb78";

export default function PrerequisiteQuiz({ onNav }) {
  // ============================================================
  // STATES
  // ============================================================

  const [phase, setPhase] = useState("loading");

  const [questions, setQuestions] = useState([]);
  const [attemptId, setAttemptId] = useState(null);

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);

  // Stores selected option index for UI
  const [answers, setAnswers] = useState([]);

  // Frontend timer for each question
  const [questionTimes, setQuestionTimes] = useState([]);

  const [showConfirm, setShowConfirm] = useState(false);

  // Backend result
  const [resultData, setResultData] = useState(null);

  // Prevent double submission
  const [submittingAnswer, setSubmittingAnswer] =
    useState(false);

  // Prevent React StrictMode from starting two attempts
  const startedRef = useRef(false);

  // Prevent timeout API from being called repeatedly
  const timeoutHandledRef = useRef(false);

  // ============================================================
  // START PREREQUISITE EVALUATION
  // ============================================================

  const startEvaluation = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");
        setPhase("error");
        return;
      }

      const response = await fetch(
        `${API_URL}/prerequisites/${PREREQUISITE_ID}/start`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to start evaluation"
        );
      }

      console.log("Evaluation started:", data);

      // ----------------------------------------------------------
      // Convert backend questions to frontend format
      // ----------------------------------------------------------

      const backendQuestions = (data.questions || []).map(
        (item) => ({
          questionId: item.questionId,
          q: item.question,
          opts: item.options,
          topic: item.category,
          marks: item.marks,
        })
      );

      if (backendQuestions.length === 0) {
        throw new Error(
          "No questions were returned by the backend."
        );
      }

      setQuestions(backendQuestions);
      setAttemptId(data.attemptId);

      // Every question has 60 seconds
      setQuestionTimes(
        Array(backendQuestions.length).fill(60)
      );

      // Empty answer array
      setAnswers(
        Array(backendQuestions.length).fill(null)
      );

      setCurrent(0);
      setSelected(null);

      timeoutHandledRef.current = false;

      setPhase("quiz");

      console.log(
        "Questions loaded:",
        backendQuestions.length
      );

      console.log(
        "Attempt ID:",
        data.attemptId
      );
    } catch (error) {
      console.error(
        "Start evaluation error:",
        error
      );

      alert(error.message);

      setPhase("error");
    }
  };

  // ============================================================
  // AUTOMATICALLY START EVALUATION
  // ============================================================

  useEffect(() => {
    if (startedRef.current) {
      return;
    }

    startedRef.current = true;

    startEvaluation();
  }, []);

  // ============================================================
  // QUESTION TIMER
  //
  // Each question gets its own 60-second timer.
  // ============================================================

  useEffect(() => {
    if (
      phase !== "quiz" ||
      questions.length === 0 ||
      questionTimes.length === 0
    ) {
      return;
    }

    // Don't start another interval if already expired
    if (questionTimes[current] <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setQuestionTimes((previousTimes) => {
        const updatedTimes = [...previousTimes];

        const currentTime =
          updatedTimes[current];

        if (currentTime <= 1) {
          updatedTimes[current] = 0;
          return updatedTimes;
        }

        updatedTimes[current] =
          currentTime - 1;

        return updatedTimes;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [
    phase,
    current,
    questions.length,
    questionTimes.length,
  ]);

  // ============================================================
  // SUBMIT CURRENT ANSWER TO BACKEND
  //
  // Backend expects:
  // {
  //   questionId,
  //   selectedAnswer
  // }
  //
  // selectedAnswer must be the actual option text,
  // NOT the option index.
  // ============================================================

  const submitCurrentAnswer = async () => {
    if (!attemptId) {
      throw new Error("Attempt ID is missing.");
    }

    if (selected === null) {
      alert(
        "Please select an answer before continuing."
      );
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error(
        "Authentication token is missing. Please login again."
      );
    }

    const currentQuestion =
      questions[current];

    if (!currentQuestion) {
      throw new Error(
        "Current question not found."
      );
    }

    // ----------------------------------------------------------
    // IMPORTANT:
    // selected is an index such as 0,1,2,3.
    //
    // Backend needs the actual answer text.
    // ----------------------------------------------------------

    const selectedAnswer =
      currentQuestion.opts[selected];

    console.log(
      "Submitting answer:",
      {
        questionId:
          currentQuestion.questionId,
        selectedAnswer,
      }
    );

    const response = await fetch(
      `${API_URL}/prerequisites/attempt/${attemptId}/answer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questionId:
            currentQuestion.questionId,
          selectedAnswer: selectedAnswer,
        }),
      }
    );

    const data = await response.json();

    console.log(
      "Submit answer response:",
      data
    );

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to submit answer."
      );
    }

    // ----------------------------------------------------------
    // Save answer locally
    // ----------------------------------------------------------

    setAnswers((previousAnswers) => {
      const updatedAnswers = [
        ...previousAnswers,
      ];

      updatedAnswers[current] =
        selected;

      return updatedAnswers;
    });

    // ----------------------------------------------------------
    // EVALUATION COMPLETED
    //
    // Backend returns result after Q30.
    // ----------------------------------------------------------

    if (data.result) {
    const result = data.result;

    // Save prerequisite result for Student Dashboard
    localStorage.setItem(
        "prerequisiteResult",
        JSON.stringify(result)
    );

    // Save attempt ID for Evaluation Analysis
    localStorage.setItem(
  "prerequisiteAttemptId",
  result.attemptId
);

const loggedInUser = JSON.parse(
  localStorage.getItem("user") || "{}"
);

if (loggedInUser.email) {
  const completedKey =
    `prerequisiteCompleted_${loggedInUser.email}`;

  localStorage.setItem(
    completedKey,
    "true"
  );
}

    setResultData(result);
    setPhase("analyzing");
}

    // ----------------------------------------------------------
    // MOVE TO NEXT QUESTION
    // ----------------------------------------------------------

    if (data.nextQuestion) {
      const nextIndex = current + 1;

      // Backend is authoritative.
      // Normally nextIndex should match the order.
      const backendOrder =
        data.nextQuestion.order;

      const calculatedIndex =
        backendOrder
          ? backendOrder - 1
          : nextIndex;

      setCurrent(calculatedIndex);

      setSelected(null);

      // Start frontend timer for new question
      setQuestionTimes((previousTimes) => {
        const updatedTimes = [
          ...previousTimes,
        ];

        updatedTimes[calculatedIndex] =
          60;

        return updatedTimes;
      });

      timeoutHandledRef.current = false;

      return;
    }

    console.warn(
      "Backend did not return nextQuestion or result."
    );
  };

  // ============================================================
  // NEXT QUESTION
  // ============================================================

  const next = async () => {
    if (submittingAnswer) {
      return;
    }

    if (selected === null) {
      alert(
        "Please select an answer before continuing."
      );
      return;
    }

    setSubmittingAnswer(true);

    try {
      await submitCurrentAnswer();
    } catch (error) {
      console.error(
        "Next question error:",
        error
      );

      alert(error.message);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  // ============================================================
  // HANDLE QUESTION TIMEOUT
  //
  // Backend timeout endpoint does not require a request body.
  // It determines the current question from attemptId.
  // ============================================================

  const handleQuestionTimeout = async () => {
    if (timeoutHandledRef.current) {
      return;
    }

    if (!attemptId) {
      return;
    }

    timeoutHandledRef.current = true;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Authentication token is missing."
        );
      }

      console.log(
        "Question timeout. Calling backend..."
      );

      const response = await fetch(
        `${API_URL}/prerequisites/attempt/${attemptId}/timeout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log(
        "Timeout response:",
        data
      );

      // --------------------------------------------------------
      // Backend may reject if its server-side 60 seconds
      // has not expired yet.
      // --------------------------------------------------------

      if (!response.ok) {
        console.warn(
          "Timeout request rejected:",
          data.message
        );

        // Allow retry after a short delay
        timeoutHandledRef.current =
          false;

        setTimeout(() => {
          if (
            phase === "quiz" &&
            questionTimes[current] === 0
          ) {
            handleQuestionTimeout();
          }
        }, 500);

        return;
      }

      // --------------------------------------------------------
      // LAST QUESTION TIMED OUT
      // --------------------------------------------------------

      if (data.result) {
        setResultData(data.result);

        setShowConfirm(false);

        setPhase("analyzing");

        return;
      }

      // --------------------------------------------------------
      // MOVE TO NEXT QUESTION
      // --------------------------------------------------------

      if (data.nextQuestion) {
        const backendOrder =
          data.nextQuestion.order;

        const nextIndex =
          backendOrder
            ? backendOrder - 1
            : current + 1;

        setCurrent(nextIndex);

        setSelected(null);

        setQuestionTimes(
          (previousTimes) => {
            const updatedTimes = [
              ...previousTimes,
            ];

            updatedTimes[nextIndex] =
              60;

            return updatedTimes;
          }
        );

        timeoutHandledRef.current =
          false;
      }
    } catch (error) {
      console.error(
        "Timeout error:",
        error
      );

      timeoutHandledRef.current =
        false;
    }
  };

  // ============================================================
  // HANDLE TIMER EXPIRY
  // ============================================================

  useEffect(() => {
    if (
      phase !== "quiz" ||
      questions.length === 0 ||
      questionTimes.length === 0
    ) {
      return;
    }

    if (questionTimes[current] !== 0) {
      return;
    }

    handleQuestionTimeout();
  }, [
    phase,
    current,
    questionTimes,
    questions.length,
  ]);

  // ============================================================
  // ANALYZING SCREEN TIMER
  //
  // Backend result is already available.
  // We only keep this screen briefly for UI.
  // ============================================================

  useEffect(() => {
    if (phase !== "analyzing") {
      return;
    }

    const timer = setTimeout(() => {
      setPhase("result");
    }, 1800);

    return () => {
      clearTimeout(timer);
    };
  }, [phase]);

  // ============================================================
  // CURRENT QUESTION TIME
  // ============================================================

  const timeLeft =
    questionTimes[current] ?? 60;

  const mins = Math.floor(
    timeLeft / 60
  );

  const secs = timeLeft % 60;

  // ============================================================
  // PROGRESS
  // ============================================================

  const progress =
    questions.length > 0
      ? ((current + 1) /
          questions.length) *
        100
      : 0;

  // ============================================================
  // SELECT ANSWER
  // ============================================================

  const pick = (idx) => {
    // Don't allow answer after timeout
    if (timeLeft <= 0) {
      return;
    }

    // Don't allow while submitting
    if (submittingAnswer) {
      return;
    }

    setSelected(idx);

    setAnswers((previousAnswers) => {
      const updatedAnswers = [
        ...previousAnswers,
      ];

      updatedAnswers[current] =
        idx;

      return updatedAnswers;
    });
  };

  // ============================================================
  // PREVIOUS
  //
  // Disabled because backend uses sequential currentQuestionIndex.
  // ============================================================

  const prev = () => {
    return;
  };

  // ============================================================
  // SUBMIT QUIZ
  //
  // On Q30, this submits the selected answer to backend.
  // Backend returns the final result.
  // ============================================================

  const submit = async () => {
    if (submittingAnswer) {
      return;
    }

    if (selected === null) {
      alert(
        "Please select an answer before submitting."
      );
      return;
    }

    setSubmittingAnswer(true);

    try {
      await submitCurrentAnswer();
    } catch (error) {
      console.error(
        "Final submission error:",
        error
      );

      alert(error.message);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  // ============================================================
  // CURRENT QUESTION
  // ============================================================

  const q =
    questions.length > 0
      ? questions[current]
      : null;

  // ============================================================
  // LOADING SCREEN
  // ============================================================

  if (phase === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">

          <div className="text-5xl mb-4">
            ⏳
          </div>

          <h2 className="text-xl font-bold text-slate-800">
            Loading Assessment...
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Preparing your prerequisite
            questions.
          </p>

        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR SCREEN
  // ============================================================

  if (phase === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="card p-8 max-w-md w-full text-center">

          <div className="text-5xl mb-4">
            ⚠️
          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Unable to Start Assessment
          </h2>

          <p className="text-sm text-slate-500 mb-6">
            Please check your login and make
            sure the backend server is running.
          </p>

          <button
            onClick={() => {
              startedRef.current = false;
              setPhase("loading");
              startEvaluation();
            }}
            className="btn-primary w-full justify-center"
          >
            Try Again
          </button>

        </div>
      </div>
    );
  }

  // ============================================================
  // ANALYZING SCREEN
  // ============================================================

  if (phase === "analyzing") {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg,#F5F3FF,#EFF6FF)",
        }}
      >
        <div className="text-center">

          <div className="text-6xl mb-6 pulse-soft">
            🤖
          </div>

          <h2
            className="text-2xl font-bold text-indigo-950 mb-3"
            style={{
              fontFamily:
                "'DM Sans',sans-serif",
            }}
          >
            Analyzing Your Results…
          </h2>

          <p className="text-slate-500 mb-8">
            Your assessment result is being
            prepared.
          </p>

          <div className="flex gap-2 justify-center flex-wrap">

            {[
              "Evaluating answers",
              "Calculating score",
              "Checking performance",
              "Preparing result",
            ].map((s) => (
              <div
                key={s}
                className="flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full"
              >
                <span className="pulse-soft">
                  ⏳
                </span>

                {s}
              </div>
            ))}

          </div>

        </div>
      </div>
    );
  }

  // ============================================================
  // RESULT SCREEN
  // ============================================================

  if (phase === "result") {
    const score =
      resultData?.score ?? 0;

    const totalMarks =
      resultData?.totalMarks ?? 100;

    const percentage =
      resultData?.percentage ?? 0;

    const status =
      resultData?.status ??
      "failed";

    const passed =
      status === "passed";

    return (
      <div
        className="min-h-screen p-6"
        style={{
          background: "#F5F6FF",
        }}
      >
        <div className="max-w-2xl mx-auto slide-up">

          {/* Result Header */}

          <div
            className="card p-6 mb-5 text-center"
            style={{
              background:
                passed
                  ? "linear-gradient(135deg,#059669,#065F46)"
                  : "linear-gradient(135deg,#4F46E5,#312E81)",
            }}
          >

            <div
              className="text-6xl mb-4"
            >
              {passed ? "🎉" : "📚"}
            </div>

            <div
              className="text-4xl font-black text-white mb-3"
              style={{
                fontFamily:
                  "'DM Sans',sans-serif",
              }}
            >
              Assessment Complete
            </div>

            <div className="text-indigo-100 text-sm">
              Your prerequisite evaluation
              has been submitted successfully.
            </div>

          </div>

          {/* Score Card */}

          <div className="card p-6 mb-5">

            <div className="text-center mb-6">

              <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">
                Your Score
              </div>

              <div className="text-6xl font-black text-indigo-600">
                {percentage}%
              </div>

              <div className="text-sm text-slate-500 mt-2">
                {score} / {totalMarks} marks
              </div>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <div className="bg-slate-50 rounded-xl p-4 text-center">

                <div className="text-xs text-slate-400 mb-1">
                  Questions
                </div>

                <div className="text-xl font-bold text-slate-800">
                  {resultData?.totalQuestions ??
                    questions.length}
                </div>

              </div>

              <div
                className={`rounded-xl p-4 text-center ${
                  passed
                    ? "bg-green-50"
                    : "bg-red-50"
                }`}
              >

                <div className="text-xs text-slate-400 mb-1">
                  Result
                </div>

                <div
                  className={`text-xl font-bold ${
                    passed
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {passed
                    ? "PASSED"
                    : "FAILED"}
                </div>

              </div>

            </div>

          </div>

          {/* AI Insight */}

          <div className="card p-5 mb-5">

            <div className="ai-chip mb-3">
              🤖 AI Insight
            </div>

            <p className="text-sm text-slate-700 leading-relaxed">

              {passed
                ? "You have successfully completed the prerequisite evaluation. Your performance can now be used to generate your personalized learning path."
                : "Your prerequisite evaluation is complete. Your performance data can be used to identify areas that need improvement and generate a personalized learning path."}

            </p>

          </div>

          {/* Dashboard Button */}

          <button
            onClick={() =>
              onNav("student-dashboard")
            }
            className="btn-primary w-full justify-center text-base py-3"
          >
            View My Personalized Dashboard →
          </button>

        </div>
      </div>
    );
  }

  // ============================================================
  // SAFETY CHECK
  // ============================================================

  if (!q) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">
          Loading question...
        </p>
      </div>
    );
  }

  // ============================================================
  // CHECK WHETHER CURRENT QUESTION EXPIRED
  // ============================================================

  const isExpired =
    timeLeft <= 0;

  // ============================================================
  // QUIZ SCREEN
  // ============================================================

  return (
    <div
      className="min-h-screen p-6"
      style={{
        background: "#F5F6FF",
      }}
    >

      <div className="max-w-2xl mx-auto">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="card p-4 mb-5 flex items-center justify-between">

          <div>

            <div className="text-xs text-slate-400 mb-0.5">
              Prerequisite Assessment
            </div>

            <div
              className="font-bold text-slate-800"
              style={{
                fontFamily:
                  "'DM Sans',sans-serif",
              }}
            >
              Question {current + 1} of{" "}
              {questions.length}
            </div>

          </div>

          <div className="flex items-center gap-4">

            <div className="badge bg-slate-100 text-slate-600">
              {q.topic}
            </div>

            <div
              className={`font-mono text-sm font-semibold px-3 py-1.5 rounded-lg ${
                timeLeft < 10
                  ? "bg-red-100 text-red-700"
                  : "bg-indigo-100 text-indigo-700"
              }`}
            >
              ⏱ {mins}:
              {secs
                .toString()
                .padStart(2, "0")}
            </div>

          </div>

        </div>

        {/* ====================================================
            EXPIRED MESSAGE
        ==================================================== */}

        {isExpired && (
          <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium text-center">
            ⏰ Time expired for this question.
            Moving to the next question...
          </div>
        )}

        {/* ====================================================
            PROGRESS
        ==================================================== */}

        <div className="mb-5">

          <div className="progress-bar h-2">

            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

          <div className="flex justify-between text-xs text-slate-400 mt-1">

            <span>
              {
                answers.filter(
                  (a) => a !== null
                ).length
              }{" "}
              answered
            </span>

            <span>
              {
                questions.length -
                answers.filter(
                  (a) => a !== null
                ).length
              }{" "}
              remaining
            </span>

          </div>

        </div>

        {/* ====================================================
            QUESTION CARD
        ==================================================== */}

        <div className="card p-6 mb-5 slide-up">

          <div className="flex items-center justify-between mb-5">

            <div className="ai-chip">
              {q.marks} marks
            </div>

            {submittingAnswer && (
              <div className="text-xs text-indigo-600 font-medium">
                Saving answer...
              </div>
            )}

          </div>

          <p className="text-lg font-semibold text-slate-900 mb-6 leading-relaxed">
            {q.q}
          </p>

          <div className="space-y-3">

            {q.opts.map(
              (opt, i) => (
                <button
                  key={i}
                  disabled={
                    isExpired ||
                    submittingAnswer
                  }
                  onClick={() =>
                    pick(i)
                  }
                  className={`w-full text-left p-4 rounded-xl border-2 text-sm font-medium transition-all ${
                    isExpired ||
                    submittingAnswer
                      ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                      : selected === i
                      ? "border-indigo-500 bg-indigo-50 text-indigo-800"
                      : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700"
                  }`}
                >

                  <span
                    className="inline-flex w-6 h-6 rounded-full items-center justify-center text-xs mr-3 font-bold"
                    style={{
                      background:
                        !isExpired &&
                        selected === i
                          ? "#4F46E5"
                          : "#E2E8F0",

                      color:
                        !isExpired &&
                        selected === i
                          ? "white"
                          : "#64748B",
                    }}
                  >
                    {String.fromCharCode(
                      65 + i
                    )}
                  </span>

                  {opt}

                </button>
              )
            )}

          </div>

        </div>

        {/* ====================================================
            NAVIGATION
        ==================================================== */}

        <div className="flex items-center justify-between gap-3">

          {/* Previous disabled */}

          <button
            onClick={prev}
            disabled
            className="btn-outline opacity-40 cursor-not-allowed"
          >
            ← Previous
          </button>

          {/* Question indicators */}

          <div className="flex gap-1 flex-wrap justify-center">

            {questions.map(
              (_, i) => {

                const isCurrent =
                  i === current;

                const isAnswered =
                  answers[i] !== null;

                const isPast =
                  i < current;

                return (
                  <button
                    key={i}
                    disabled
                    className={`w-7 h-7 rounded text-xs font-semibold transition-all ${
                      isCurrent
                        ? "bg-indigo-600 text-white"
                        : isAnswered
                        ? "bg-emerald-100 text-emerald-700"
                        : isPast
                        ? "bg-red-100 text-red-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              }
            )}

          </div>

          {/* Next / Submit */}

          {current <
          questions.length - 1 ? (

            <button
              onClick={next}
              disabled={
                selected === null ||
                submittingAnswer ||
                isExpired
              }
              className={`btn-primary ${
                selected === null ||
                submittingAnswer ||
                isExpired
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {submittingAnswer
                ? "Saving..."
                : "Next →"}
            </button>

          ) : (

            <button
              onClick={() =>
                setShowConfirm(true)
              }
              disabled={
                selected === null ||
                submittingAnswer ||
                isExpired
              }
              className={`btn-primary ${
                selected === null ||
                submittingAnswer ||
                isExpired
                  ? "opacity-50 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              Submit Quiz ✓
            </button>

          )}

        </div>

      </div>

      {/* ======================================================
          CONFIRM MODAL
      ====================================================== */}

      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="card p-6 max-w-sm w-full mx-4">

            <div className="text-center mb-4">

              <div className="text-4xl mb-3">
                📝
              </div>

              <h3
                className="font-bold text-slate-900 mb-2"
                style={{
                  fontFamily:
                    "'DM Sans',sans-serif",
                }}
              >
                Submit Quiz?
              </h3>

            </div>

            <p className="text-sm text-slate-500 mb-5 text-center">

              You have answered{" "}
              {
                answers.filter(
                  (a) => a !== null
                ).length
              }{" "}
              of {questions.length}{" "}
              questions.

              <br />

              Your final answer will be
              submitted to the server.

            </p>

            <div className="flex gap-3">

              <button
                onClick={() =>
                  setShowConfirm(false)
                }
                disabled={
                  submittingAnswer
                }
                className="btn-outline flex-1 justify-center"
              >
                Review
              </button>

              <button
                onClick={submit}
                disabled={
                  submittingAnswer
                }
                className="btn-primary flex-1 justify-center"
              >
                {submittingAnswer
                  ? "Submitting..."
                  : "Submit"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}