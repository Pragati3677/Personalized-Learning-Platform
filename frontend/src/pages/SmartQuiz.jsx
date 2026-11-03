import { useEffect, useRef, useState } from "react";



const API_URL = "http://localhost:5000/api";



const QUESTION_TIME = 60;

const TOTAL_TIME = 30 * 60;



export default function SmartQuiz({ onNav, topic }) {

  // =====================================================

  // STATE

  // =====================================================



  const [phase, setPhase] = useState("intro");

  // intro -> quiz -> locked (after 3 tab switches) -> submit -> result



  const [questions, setQuestions] = useState([]);



  const [attemptId, setAttemptId] = useState(null);



  const [current, setCurrent] = useState(0);



  const [selected, setSelected] = useState(null);



  const [answers, setAnswers] = useState([]);



  const [questionTime, setQuestionTime] =

    useState(QUESTION_TIME);



  const [overallTime, setOverallTime] =

    useState(TOTAL_TIME);



  const [result, setResult] = useState(null);



  const [loading, setLoading] = useState(false);



  const [submitting, setSubmitting] =

    useState(false);



  const [error, setError] = useState("");

  const [violationCount, setViolationCount] = useState(0);
  const [warningMessage, setWarningMessage] = useState("");
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const tabSwitchCountRef = useRef(0);
  const lastViolationTimeRef = useRef(0);



  // =====================================================

  // REFS

  // =====================================================



  const currentRef = useRef(0);



  const selectedRef = useRef(null);



  const answersRef = useRef([]);



  const attemptIdRef = useRef(null);



  const startTimeRef = useRef(null);



  // Exact timeout for current question

  const questionTimeoutRef = useRef(null);



  // Display countdown interval

  const questionDisplayRef = useRef(null);



  // Overall timer

  const overallTimeoutRef = useRef(null);



  const overallDisplayRef = useRef(null);



  // Prevent duplicate question transition

  const transitionRef = useRef(false);



  // Prevent duplicate final submission

  const submitLockRef = useRef(false);



  // =====================================================

  // TOPIC

  // =====================================================



  const topicId = topic?._id;



  const topicTitle =

    topic?.title || "Selected Topic";



  // =====================================================

  // TOKEN

  // =====================================================



  const getToken = () => {

    return localStorage.getItem("token");

  };



  // =====================================================

  // FORMAT TIME

  // =====================================================



  const formatTime = (seconds) => {

    const safeSeconds = Math.max(

      0,

      Math.floor(seconds)

    );



    const minutes = Math.floor(

      safeSeconds / 60

    );



    const secs = safeSeconds % 60;



    return `${String(minutes).padStart(

      2,

      "0"

    )}:${String(secs).padStart(2, "0")}`;

  };



  // =====================================================

  // CLEAR QUESTION TIMERS

  // =====================================================



  const clearQuestionTimers = () => {

    if (questionTimeoutRef.current) {

      clearTimeout(

        questionTimeoutRef.current

      );



      questionTimeoutRef.current = null;

    }



    if (questionDisplayRef.current) {

      clearInterval(

        questionDisplayRef.current

      );



      questionDisplayRef.current = null;

    }

  };



  // =====================================================

  // CLEAR OVERALL TIMERS

  // =====================================================



  const clearOverallTimers = () => {

    if (overallTimeoutRef.current) {

      clearTimeout(

        overallTimeoutRef.current

      );



      overallTimeoutRef.current = null;

    }



    if (overallDisplayRef.current) {

      clearInterval(

        overallDisplayRef.current

      );



      overallDisplayRef.current = null;

    }

  };



  // =====================================================

  // CLEAR ALL TIMERS

  // =====================================================



  const stopAllTimers = () => {

    clearQuestionTimers();

    clearOverallTimers();

  };



  // =====================================================

  // RESET WHEN TOPIC CHANGES

  // =====================================================



  useEffect(() => {

    stopAllTimers();



    setPhase("intro");



    setQuestions([]);



    setAttemptId(null);



    setCurrent(0);



    setSelected(null);



    setAnswers([]);



    setQuestionTime(

      QUESTION_TIME

    );



    setOverallTime(

      TOTAL_TIME

    );



    setResult(null);



    setLoading(false);



    setSubmitting(false);



    setError("");
    setViolationCount(0);
    setWarningMessage("");
    setTabSwitchCount(0);
    tabSwitchCountRef.current = 0;
    lastViolationTimeRef.current = 0;

    currentRef.current = 0;



    selectedRef.current = null;



    answersRef.current = [];



    attemptIdRef.current = null;



    transitionRef.current = false;



    submitLockRef.current = false;



    startTimeRef.current = null;

  }, [topicId]);



  // =====================================================

  // COMPONENT CLEANUP

  // =====================================================



  useEffect(() => {

    return () => {

      stopAllTimers();

    };

  }, []);

  



  // =====================================================

  // =====================================================
  // ANTI-CHEATING / FOCUS MONITORING
  // =====================================================

  const recordViolation = (message) => {
    const now = Date.now();
    if (now - lastViolationTimeRef.current < 700) {
      setWarningMessage(message);
      return;
    }
    lastViolationTimeRef.current = now;
    setViolationCount((count) => count + 1);
    setWarningMessage(message);
  };

  useEffect(() => {
    if (phase !== "quiz" || submitting) return;

    const preventClipboard = (event) => {
      event.preventDefault();
      event.stopPropagation();
      recordViolation("Copy, cut, and paste are disabled during the assessment.");
    };
    const preventContextMenu = (event) => {
      event.preventDefault();
      recordViolation("Right-click is disabled during the assessment.");
    };
    const preventTextSelection = (event) => event.preventDefault();
    const preventDrag = (event) => event.preventDefault();

    const preventRestrictedShortcuts = (event) => {
      const key = event.key?.toLowerCase();
      const modifier = event.ctrlKey || event.metaKey;
      if (modifier && ["c", "x", "v", "a", "p", "s", "u"].includes(key)) {
        event.preventDefault();
        event.stopPropagation();
        recordViolation("Copy, cut, paste, select-all, and browser shortcuts are disabled during the assessment.");
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState !== "hidden") {
        if (tabSwitchCountRef.current >= 3) {
          setWarningMessage(
            "Assessment locked: you reached the maximum of 3 tab switches. Your test has NOT been submitted. Please contact your teacher or invigilator."
          );
        }
        return;
      }

      // Count each time the assessment tab becomes hidden.
      const nextCount = tabSwitchCountRef.current + 1;
      tabSwitchCountRef.current = nextCount;
      setTabSwitchCount(nextCount);
      setViolationCount((count) => count + 1);

      if (nextCount >= 3) {
        const lockMessage =
          "Assessment locked after 3 tab switches. Your test has NOT been submitted automatically. Please contact your teacher or invigilator.";
        setWarningMessage(lockMessage);

        // Stop the assessment immediately without calling the submit API.
        stopAllTimers();
        setPhase("locked");
        return;
      }

      setWarningMessage(
        `Warning ${nextCount}/3: You switched tabs or minimized the assessment. Please return to the test and keep this tab active.`
      );
    };

    const onWindowBlur = () => {
      if (!document.hidden) {
        recordViolation("The assessment window lost focus. Please keep the test window active.");
      }
    };

    document.addEventListener("copy", preventClipboard, true);
    document.addEventListener("cut", preventClipboard, true);
    document.addEventListener("paste", preventClipboard, true);
    document.addEventListener("contextmenu", preventContextMenu, true);
    document.addEventListener("selectstart", preventTextSelection, true);
    document.addEventListener("dragstart", preventDrag, true);
    document.addEventListener("keydown", preventRestrictedShortcuts, true);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onWindowBlur);

    return () => {
      document.removeEventListener("copy", preventClipboard, true);
      document.removeEventListener("cut", preventClipboard, true);
      document.removeEventListener("paste", preventClipboard, true);
      document.removeEventListener("contextmenu", preventContextMenu, true);
      document.removeEventListener("selectstart", preventTextSelection, true);
      document.removeEventListener("dragstart", preventDrag, true);
      document.removeEventListener("keydown", preventRestrictedShortcuts, true);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onWindowBlur);
    };
  }, [phase, submitting]);

  // START QUIZ

  // =====================================================



  const startQuiz = async () => {

    try {

      setLoading(true);

      setError("");



      const token = getToken();



      if (!token) {

        setError(

          "Please login again."

        );

        return;

      }



      if (!topicId) {

        setError(

          "No topic selected. Please return to Learning Path and select a topic."

        );

        return;

      }



      console.log(

        "Starting assessment for:",

        topicTitle

      );



      const response = await fetch(

        `${API_URL}/engagement-evaluation/start`,

        {

          method: "POST",



          headers: {

            "Content-Type":

              "application/json",



            Authorization:

              `Bearer ${token}`,

          },



          body: JSON.stringify({

            topicId,

          }),

        }

      );



      const data =

        await response.json();



      console.log(

        "Start assessment response:",

        data

      );



      if (

        !response.ok ||

        !data.success

      ) {

        throw new Error(

          data.message ||

            "Unable to start Topic Assessment."

        );

      }



      const receivedQuestions =

        data.questions || [];



      if (

        receivedQuestions.length === 0

      ) {

        throw new Error(

          "No questions are available for this topic."

        );

      }



      // -------------------------------------------------

      // QUESTIONS

      // -------------------------------------------------



      setQuestions(

        receivedQuestions

      );



      // -------------------------------------------------

      // ATTEMPT

      // -------------------------------------------------



      setAttemptId(

        data.attemptId

      );



      attemptIdRef.current =

        data.attemptId;



      // -------------------------------------------------

      // ANSWERS

      // -------------------------------------------------



      const emptyAnswers =

        new Array(

          receivedQuestions.length

        ).fill(null);



      setAnswers(emptyAnswers);



      answersRef.current =

        emptyAnswers;



      // -------------------------------------------------

      // FIRST QUESTION

      // -------------------------------------------------



      setCurrent(0);



      currentRef.current = 0;



      setSelected(null);



      selectedRef.current = null;



      // -------------------------------------------------

      // TIMERS

      // -------------------------------------------------



      setQuestionTime(

        QUESTION_TIME

      );



      setOverallTime(

        TOTAL_TIME

      );



      // -------------------------------------------------

      // OTHER STATE

      // -------------------------------------------------



      setResult(null);



      setError("");



      setSubmitting(false);



      transitionRef.current = false;



      submitLockRef.current = false;



      startTimeRef.current =

        Date.now();



      // -------------------------------------------------

      // OPEN QUIZ

      // -------------------------------------------------


      setViolationCount(0);
      setWarningMessage("");
      setTabSwitchCount(0);
      tabSwitchCountRef.current = 0;
      lastViolationTimeRef.current = 0;

      setPhase("quiz");

    } catch (err) {

      console.error(

        "Start quiz error:",

        err

      );



      setError(

        err.message ||

          "Unable to start Topic Assessment."

      );

    } finally {

      setLoading(false);

    }

  };



  // =====================================================

  // SELECT / CHANGE ANSWER

  // =====================================================



  const pick = (index) => {

    if (submitting) {

      return;

    }



    if (

      transitionRef.current

    ) {

      return;

    }



    setSelected(index);



    selectedRef.current = index;

  };



  // =====================================================

  // SAVE CURRENT ANSWER

  // =====================================================



  const saveCurrentAnswer = () => {

    const question =

      questions[

        currentRef.current

      ];



    if (!question) {

      return answersRef.current;

    }



    const selectedIndex =

      selectedRef.current;



    let selectedAnswer = null;



    if (

      selectedIndex !== null &&

      selectedIndex !== undefined &&

      question.options &&

      question.options[

        selectedIndex

      ] !== undefined

    ) {

      selectedAnswer =

        question.options[

          selectedIndex

        ];

    }



    const updatedAnswers = [

      ...answersRef.current,

    ];



    updatedAnswers[

      currentRef.current

    ] = {

      questionId:

        question._id,



      selectedAnswer,

    };



    answersRef.current =

      updatedAnswers;



    setAnswers(

      updatedAnswers

    );



    console.log(

      `Question ${

        currentRef.current + 1

      } saved:`,

      selectedAnswer

    );



    return updatedAnswers;

  };



  // =====================================================

  // QUESTION TIMEOUT

  // =====================================================



  const handleQuestionTimeout =

    () => {

      /*

       * This lock is extremely important.

       * It guarantees one timeout = one transition.

       */



      if (

        transitionRef.current

      ) {

        return;

      }



      transitionRef.current = true;



      clearQuestionTimers();



      // Save current answer

      saveCurrentAnswer();



      const currentIndex =

        currentRef.current;



      const lastIndex =

        questions.length - 1;



      console.log(

        `Question ${

          currentIndex + 1

        } timeout`

      );



      // =================================================

      // Q1 - Q29

      // =================================================



      if (

        currentIndex < lastIndex

      ) {

        const nextIndex =

          currentIndex + 1;



        console.log(

          `Opening ONLY Question ${

            nextIndex + 1

          }`

        );



        // Update refs first

        currentRef.current =

          nextIndex;



        selectedRef.current =

          null;



        // Update state

        setCurrent(

          nextIndex

        );



        setSelected(null);



        /*

         * Fresh 60 seconds.

         */



        setQuestionTime(

          QUESTION_TIME

        );



        /*

         * Unlock.

         *

         * The useEffect below will now

         * create exactly one new timer

         * for the new question.

         */



        transitionRef.current =

          false;



        return;

      }



      // =================================================

      // Q30

      // =================================================



      console.log(

        "Question 30 finished."

      );



      console.log(

        "Showing Submit Test screen."

      );



      /*

       * DO NOT submit automatically.

       */



      setPhase("submit");



      transitionRef.current =

        false;

    };



  // =====================================================

  // EXACT QUESTION TIMER

  // =====================================================



  useEffect(() => {

    if (phase !== "quiz") {

      return;

    }



    if (

      questions.length === 0

    ) {

      return;

    }



    if (submitting) {

      return;

    }



    /*

     * Clear previous timer before

     * creating the new question timer.

     */



    clearQuestionTimers();



    const questionStartedAt =

      Date.now();



    const questionDeadline =

      questionStartedAt +

      QUESTION_TIME * 1000;



    /*

     * Start display countdown.

     */



    questionDisplayRef.current =

      setInterval(() => {

        const remainingMs =

          questionDeadline -

          Date.now();



        const remainingSeconds =

          Math.max(

            0,

            Math.ceil(

              remainingMs / 1000

            )

          );



        setQuestionTime(

          remainingSeconds

        );



        /*

         * The exact timeout is handled

         * by setTimeout below.

         */

      }, 250);



    /*

     * EXACTLY ONE timeout.

     *

     * This is the important part.

     */



    questionTimeoutRef.current =

      setTimeout(() => {

        setQuestionTime(0);



        handleQuestionTimeout();

      }, QUESTION_TIME * 1000);



    console.log(

      `Timer started for Question ${

        current + 1

      }: exactly 60 seconds`

    );



    // -------------------------------------------------

    // CLEANUP

    // -------------------------------------------------



    return () => {

      clearQuestionTimers();

    };

  }, [

    phase,

    current,

    questions.length,

    submitting,

  ]);



  // =====================================================

  // OVERALL 30-MINUTE TIMER

  // =====================================================



  useEffect(() => {

    if (phase !== "quiz") {

      return;

    }



    if (

      questions.length === 0

    ) {

      return;

    }



    if (submitting) {

      return;

    }



    clearOverallTimers();



    const overallStartedAt =

      startTimeRef.current ||

      Date.now();



    const overallDeadline =

      overallStartedAt +

      TOTAL_TIME * 1000;



    // -------------------------------------------------

    // DISPLAY

    // -------------------------------------------------



    overallDisplayRef.current =

      setInterval(() => {

        const remainingMs =

          overallDeadline -

          Date.now();



        const remainingSeconds =

          Math.max(

            0,

            Math.ceil(

              remainingMs / 1000

            )

          );



        setOverallTime(

          remainingSeconds

        );

      }, 250);



    // -------------------------------------------------

    // EXACT OVERALL TIMEOUT

    // -------------------------------------------------



    overallTimeoutRef.current =

      setTimeout(() => {

        console.log(

          "Overall 30-minute timer expired."

        );



        clearOverallTimers();



        clearQuestionTimers();



        saveCurrentAnswer();



        setOverallTime(0);



        /*

         * Show Submit Test.

         */



        setPhase("submit");

      }, TOTAL_TIME * 1000);



    return () => {

      clearOverallTimers();

    };

  }, [

    phase,

    questions.length,

    submitting,

  ]);



  // =====================================================

  // SUBMIT TEST

  // =====================================================



  const submitTest = async () => {

    /*

     * Prevent double-click submission.

     */



    if (submitLockRef.current) {

      return;

    }



    if (submitting) {

      return;

    }



    submitLockRef.current = true;



    try {

      setSubmitting(true);



      setError("");

      stopAllTimers();



      const token = getToken();



      if (!token) {

        setError(

          "Please login again."

        );



        submitLockRef.current = false;



        setSubmitting(false);



        return;

      }



      const finalAttemptId =

        attemptIdRef.current ||

        attemptId;



      if (!finalAttemptId) {

        setError(

          "Evaluation attempt not found."

        );



        submitLockRef.current = false;



        setSubmitting(false);



        return;

      }



      const finalAnswers =

        answersRef.current;



      const endTime =

        Date.now();



      const startedAt =

        startTimeRef.current ||

        endTime;



      const timeSpentMinutes =

        Math.max(

          1,

          Math.round(

            (

              endTime -

              startedAt

            ) / 60000

          )

        );



      console.log(

        "Submitting final test..."

      );



      console.log(

        "Attempt ID:",

        finalAttemptId

      );



      console.log(

        "Answers:",

        finalAnswers

      );



      // =================================================

      // BACKEND SUBMISSION

      // =================================================



      const response =

        await fetch(

          `${API_URL}/engagement-evaluation/submit/${finalAttemptId}`,

          {

            method: "POST",



            headers: {

              "Content-Type":

                "application/json",



              Authorization:

                `Bearer ${token}`,

            },



            body: JSON.stringify({

              answers:

                finalAnswers,



              timeSpentMinutes,

            }),

          }

        );



      const data =

        await response.json();



      console.log(

        "Submit test response:",

        data

      );



      if (

        !response.ok ||

        !data.success

      ) {

        throw new Error(

          data.message ||

            "Unable to submit Topic Assessment."

        );

      }



      // =================================================

      // RESULT

      // =================================================



      const evaluationResult =

        data.result;



      setResult(

        evaluationResult

      );



      // =================================================

      // EVALUATION ANALYSIS

      // =================================================



      try {

        const analysisResponse =

          await fetch(

            `${API_URL}/evaluation-analysis/create`,

            {

              method: "POST",



              headers: {

                "Content-Type":

                  "application/json",



                Authorization:

                  `Bearer ${token}`,

              },



              body: JSON.stringify({

                attemptId:

                  evaluationResult.attemptId,

              }),

            }

          );



        const analysisData =

          await analysisResponse.json();



        console.log(

          "Analysis response:",

          analysisData

        );



        if (

          !analysisResponse.ok &&

          analysisResponse.status !== 409

        ) {

          console.warn(

            "Analysis could not be created:",

            analysisData.message

          );

        }

      } catch (analysisError) {

        console.error(

          "Analysis error:",

          analysisError

        );

      }



      // =================================================

      // RESULT SCREEN

      // =================================================



      setPhase("result");

    } catch (err) {

      console.error(

        "Submit test error:",

        err

      );



      setError(

        err.message ||

          "Unable to submit Topic Assessment."

      );



      submitLockRef.current =

        false;

    } finally {

      setSubmitting(false);

    }

  };



  // =====================================================

  // INTRO SCREEN

  // =====================================================



  if (phase === "intro") {

    return (

      <div className="p-6 max-w-xl mx-auto">



        <div className="card p-6 text-center">



          <div className="ai-chip mx-auto mb-4">

            🧠 Topic Assessment

          </div>



          <div className="text-5xl mb-4">

            🎯

          </div>



          <h2 className="text-2xl font-bold text-indigo-950 mb-2">

            {topicTitle}

          </h2>



          <p className="text-slate-500 text-sm mb-6 leading-relaxed">

            Complete the assessment

            for{" "}

            <strong>

              {topicTitle}

            </strong>

            .

          </p>



          {/* INFO */}



          <div className="grid grid-cols-3 gap-4 mb-6">



            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">

              <div className="text-xl font-black gradient-text">

                30

              </div>



              <div className="text-xs text-slate-500">

                Questions

              </div>

            </div>



            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">

              <div className="text-xl font-black gradient-text">

                100

              </div>



              <div className="text-xs text-slate-500">

                Marks

              </div>

            </div>



            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">

              <div className="text-xl font-black gradient-text">

                30

              </div>



              <div className="text-xs text-slate-500">

                Minutes

              </div>

            </div>



          </div>



          {/* RULES */}



          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-left mb-6">



            <div className="font-semibold text-amber-800 mb-2">

              ⏱️ Assessment Rules

            </div>



            <ul className="text-xs text-amber-700 space-y-1">



              <li>

                • Each question has

                exactly 1 minute.

              </li>



              <li>

                • You can change your

                answer during the minute.

              </li>



              <li>

                • After 60 seconds,

                the next question opens

                automatically.

              </li>



              <li>• Wait at least 15 seconds before clicking Next.</li>
                  <li>• If you do not click Next, the next question opens automatically after 60 seconds.</li>



              <li>

                • There is no Previous

                button.

              </li>



              <li>

                • Unanswered questions

                receive 0 marks.

              </li>



              <li>

                • After Question 30

                times out, Submit Test

                appears.

              </li>



            </ul>



          </div>



          {/* ERROR */}



          {error && (

            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-sm">

              {error}

            </div>

          )}



          {/* START */}



          <button

            onClick={startQuiz}

            disabled={

              loading ||

              !topicId

            }

            className="btn-primary w-full justify-center py-3 disabled:opacity-50"

          >

            {loading

              ? "Starting Assessment..."

              : "Start Topic Assessment →"}

          </button>



        </div>



      </div>

    );

  }



  // =====================================================

  // SUBMIT TEST SCREEN

  // =====================================================



  // =====================================================
  // LOCKED SCREEN — THREE TAB SWITCHES
  // =====================================================

  if (phase === "locked") {
    return (
      <div className="min-h-[70vh] p-6 flex items-center justify-center">
        <div
          role="alert"
          aria-live="assertive"
          className="card w-full max-w-xl p-8 text-center border-2 border-red-300"
        >
          <div className="text-5xl mb-4" aria-hidden="true">🔒</div>
          <h2 className="text-2xl font-bold text-red-700 mb-3">
            Assessment Locked
          </h2>
          <p className="text-slate-700 mb-4">
            You switched away from the assessment tab 3 times. The test is now
            locked, and you cannot continue answering questions.
          </p>
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 mb-5">
            <p className="font-semibold">
              Your test has NOT been submitted automatically.
            </p>
            <p className="mt-2">
              Your answers have not been submitted for scoring. Please contact
              your teacher or invigilator for assistance.
            </p>
          </div>
          <p className="text-xs text-slate-500">
            Tab switches detected: {tabSwitchCount}/3
          </p>
        </div>
      </div>
    );
  }


  if (phase === "submit") {

    return (

      <div className="p-6 max-w-xl mx-auto">



        <div className="card p-7 text-center">



          <div className="text-5xl mb-4">

            🎉

          </div>



          <h2 className="text-2xl font-bold text-indigo-950 mb-2">

            Assessment Completed

          </h2>



          <p className="text-slate-500 text-sm mb-6">

            You have completed all

            30 questions for{" "}

            <strong>

              {topicTitle}

            </strong>

            .

          </p>



          <div className="p-5 rounded-xl bg-indigo-50 border border-indigo-200 mb-6">



            <div className="text-lg font-bold text-indigo-800 mb-2">

              All 30 Questions Completed

            </div>



            <div className="text-sm text-indigo-600">

              The final question has

              timed out. Your answers

              are ready to submit.

            </div>



          </div>



          <button

            onClick={submitTest}

            disabled={submitting}

            className="btn-primary w-full justify-center py-3 text-base disabled:opacity-50"

          >

            {submitting

              ? "Submitting Test..."

              : "Submit Test"}

          </button>



          <p className="text-xs text-slate-400 mt-4">

            Click Submit Test to

            calculate your score.

          </p>



          {error && (

            <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-700 text-sm">

              {error}

            </div>

          )}



        </div>



      </div>

    );

  }



  // =====================================================

  // RESULT SCREEN

  // =====================================================



  if (

    phase === "result" &&

    result

  ) {

    const score =

      Number(

        result.percentage || 0

      );



    const correct =

      result.correctAnswers || 0;



    const total =

      result.totalQuestions ||

      questions.length ||

      30;



    const level =

      score >= 80

        ? "Advanced"

        : score >= 50

        ? "Average"

        : "Slow";



    return (

      <div className="p-6 max-w-2xl mx-auto">



        <div

          className="card p-6 mb-5"

          style={{

            background:

              score >= 80

                ? "linear-gradient(135deg,#059669,#047857)"

                : score >= 50

                ? "linear-gradient(135deg,#4F46E5,#312E81)"

                : "linear-gradient(135deg,#DC2626,#B91C1C)",

            color: "white",

          }}

        >



          <div className="ai-chip mb-4">

            🧠 {topicTitle} Results

          </div>



          <div className="text-6xl font-black mb-2">

            {score}%

          </div>



          <p className="text-white/80 text-sm">

            {correct}/{total}

            {" "}

            questions correct

          </p>



        </div>



        <div className="grid grid-cols-2 gap-4 mb-5">



          <div className="card p-4">



            <div className="text-sm font-semibold text-slate-700 mb-3">

              Evaluation Result

            </div>



            <div className="space-y-3">



              <div className="flex justify-between text-xs gap-3">

                <span className="text-slate-500">

                  Topic

                </span>



                <span className="font-semibold text-right">

                  {topicTitle}

                </span>

              </div>



              <div className="flex justify-between text-xs">

                <span className="text-slate-500">

                  Questions

                </span>



                <span className="font-semibold">

                  {total}

                </span>

              </div>



              <div className="flex justify-between text-xs">

                <span className="text-slate-500">

                  Correct

                </span>



                <span className="font-semibold">

                  {correct}

                </span>

              </div>



              <div className="flex justify-between text-xs">

                <span className="text-slate-500">

                  Percentage

                </span>



                <span className="font-semibold">

                  {score}%

                </span>

              </div>



            </div>



          </div>



          <div className="card p-4">



            <div className="text-sm font-semibold text-slate-700 mb-3">

              Learning Level

            </div>



            <div className="text-2xl font-black gradient-text mb-2">

              {level}

            </div>



            <p className="text-xs text-slate-500">

              Your topic performance

              is used for adaptive

              learning.

            </p>



          </div>



        </div>



        <div className="card p-4 mb-5">



          <div className="text-sm font-semibold text-slate-700 mb-3">

            Performance Classification

          </div>



          <div className="grid grid-cols-3 gap-3 text-center">



            <div className="p-3 rounded-xl bg-red-50">

              <div className="font-bold text-red-700">

                Slow

              </div>



              <div className="text-xs text-red-500">

                0–49%

              </div>

            </div>



            <div className="p-3 rounded-xl bg-indigo-50">

              <div className="font-bold text-indigo-700">

                Average

              </div>



              <div className="text-xs text-indigo-500">

                50–79%

              </div>

            </div>



            <div className="p-3 rounded-xl bg-emerald-50">

              <div className="font-bold text-emerald-700">

                Advanced

              </div>



              <div className="text-xs text-emerald-500">

                80–100%

              </div>

            </div>



          </div>



        </div>



        <div className="flex gap-3">



          <button

            onClick={() =>

              onNav(

                "performance",

                topic

              )

            }

            className="btn-primary flex-1 justify-center"

          >

            View Performance Analysis

          </button>



          <button

            onClick={() =>

              onNav("learning-path")

            }

            className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"

          >

            Learning Path

          </button>



        </div>



      </div>

    );

  }



  // =====================================================

  // QUIZ SCREEN

  // =====================================================



  if (

    phase === "quiz" &&

    questions.length > 0

  ) {

    const question =

      questions[current];



    if (!question) {

      return null;

    }



    const questionTimerDanger =

      questionTime <= 15;



    const overallTimerDanger =

      overallTime <= 60;



    return (

      <div className="p-6 max-w-2xl mx-auto" style={{ userSelect: "none", WebkitUserSelect: "none" }}>



        {/* HEADER */}



        <div className="flex items-center justify-between mb-4">



          <div className="ai-chip">

            🧠 {topicTitle}

          </div>



          <div className="text-xs text-slate-500">

            Question{" "}

            {current + 1}

            {" / "}

            {questions.length}

          </div>



        </div>



        {/* PROGRESS */}



        <div className="progress-bar mb-5">



          <div

            className="progress-fill"

            style={{

              width: `${

                ((current + 1) /

                  questions.length) *

                100

              }%`,

            }}

          />



        </div>



        {/* TIMERS */}



        <div className="grid grid-cols-2 gap-3 mb-5">



          {/* QUESTION TIMER */}



          <div

            className={`p-4 rounded-xl border text-center ${

              questionTimerDanger

                ? "bg-red-50 border-red-300"

                : "bg-indigo-50 border-indigo-200"

            }`}

          >



            <div className="text-xs text-slate-500 mb-1">

              Current Question Time

            </div>



            <div

              className={`text-2xl font-black ${

                questionTimerDanger

                  ? "text-red-600"

                  : "text-indigo-700"

              }`}

            >

              {formatTime(

                questionTime

              )}

            </div>



            <div className="text-xs mt-1 text-slate-500">

              Auto moves after 60

              seconds

            </div>



          </div>



          {/* OVERALL TIMER */}



          <div

            className={`p-4 rounded-xl border text-center ${

              overallTimerDanger

                ? "bg-red-50 border-red-300"

                : "bg-slate-50 border-slate-200"

            }`}

          >



            <div className="text-xs text-slate-500 mb-1">

              Overall Assessment Time

            </div>



            <div

              className={`text-2xl font-black ${

                overallTimerDanger

                  ? "text-red-600"

                  : "text-slate-700"

              }`}

            >

              {formatTime(

                overallTime

              )}

            </div>



            <div className="text-xs mt-1 text-slate-500">

              Maximum 30 minutes

            </div>



          </div>



        </div>



        {/* INSTRUCTION */}

        {/* ANTI-CHEATING WARNING */}
{(warningMessage || violationCount > 0) && (
  <div
    role="alert"
    aria-live="polite"
    className="mb-5 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700"
  >
    <p className="font-bold">
      Assessment Security Warning
    </p>

    {warningMessage && (
      <p className="mt-1">{warningMessage}</p>
    )}

    <p className="mt-2">
      Detected events: {violationCount}
    </p>
    <p className="mt-1">
      Tab switches: {tabSwitchCount}/3
    </p>
    {tabSwitchCount >= 3 && (
      <p className="mt-2 font-bold">
        Please return to the test. Your assessment has not been submitted automatically.
      </p>
    )}

    <p className="mt-1 text-xs">
      Stay on the assessment page and follow the assessment rules.
    </p>
  </div>
)}



        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs text-center mb-5">



          ⏱️ You have exactly{" "}

          <strong>

            1 minute

          </strong>{" "}

          for this question.



          <br />



          When the timer reaches

          00:00, the next question

          opens automatically.



        </div>



        {/* QUESTION */}



        <div className="card p-6">



          <div className="flex items-center justify-between mb-3">



            <div className="text-xs text-indigo-500 font-semibold">

              {topicTitle}

              {" — Topic Question"}

            </div>



            <div className="px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-600">

              {question.marks || 0}

              {" marks"}

            </div>



          </div>



          <p className="text-lg font-semibold text-slate-900 mb-6 leading-relaxed">

            {question.question}

          </p>



          {/* OPTIONS */}



          <div className="space-y-3">



            {(question.options || []).map(

              (option, index) => {

                const isSelected =

                  selected === index;



                return (

                  <button

                    key={index}

                    onClick={() =>

                      pick(index)

                    }

                    disabled={

                      submitting

                    }

                    className={`w-full text-left p-4 rounded-xl border-2 text-sm font-medium transition-all ${

                      isSelected

                        ? "border-indigo-500 bg-indigo-50"

                        : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"

                    }`}

                  >



                    <span

                      className={`inline-flex w-7 h-7 rounded-full items-center justify-center text-xs mr-3 font-bold ${

                        isSelected

                          ? "bg-indigo-600 text-white"

                          : "bg-slate-100 text-slate-600"

                      }`}

                    >

                      {String.fromCharCode(

                        65 + index

                      )}

                    </span>



                    {option}



                  </button>

                );

              }

            )}



          </div>



          {/* ANSWER STATUS */}



          <div className="mt-6 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-center">



            {selected !== null ? (

              <span className="text-indigo-600">

                ✓ Answer selected.

                You can change it until

                the timer reaches 00:00.

              </span>

            ) : (

              <span className="text-slate-500">

                No answer selected.

                This question receives

                0 marks if unanswered.

              </span>

            )}



          </div>



        </div>



        {/* FLOW INFO */}



        <div className="mt-4 text-center text-xs text-slate-400">



          Question{" "}

          {current + 1}

          {" of "}

          {questions.length}



          {" • "}



          Next is available after 15 seconds



        </div>
          {/* NEXT BUTTON */}
          <div className="mt-5">
            <button
              type="button"
              onClick={handleQuestionTimeout}
              disabled={questionTime > QUESTION_TIME - 15 || submitting}
              className="btn-primary w-full justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {current === questions.length - 1
                ? "Next → Submit Test"
                : "Next Question →"}
            </button>

            {questionTime > QUESTION_TIME - 15 && (
              <p className="text-xs text-center text-slate-500 mt-2">
                You can continue after 15 seconds.
              </p>
            )}
            {questionTime <= QUESTION_TIME - 15 && (
              <p className="text-xs text-center text-slate-500 mt-2">
                You can move to the next question now.
              </p>
            )}
          </div>





        {/* ERROR */}



        {error && (

          <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-700 text-sm">

            {error}

          </div>

        )}



      </div>

    );

  }



  return null;

}