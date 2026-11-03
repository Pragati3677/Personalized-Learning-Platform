
import { useCallback, useEffect, useRef, useState } from "react";

const API_BASE = "http://localhost:5000/api";
const COMPILER_URL = `${API_BASE}/java-compiler/run`;
const FINAL_API = `${API_BASE}/final-evaluation`;
const PASS_MARK = 96;

const normalise = (value) =>
  String(value ?? "")
    .replace(/\r\n/g, "\n")
    .trim()
    .replace(/\s+/g, " ");

function getToken() {
  return localStorage.getItem("token");
}

async function apiRequest(url, options = {}) {
  const token = getToken();

  if (!token) {
    throw new Error("Please log in again. Your login token was not found.");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

function CodePanel({
  question,
  code,
  setCode,
  onPass,
  locked,
}) {
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [passed, setPassed] = useState(false);
  const [summary, setSummary] = useState("");

  useEffect(() => {
    setOutput("");
    setStatus("");
    setPassed(false);
    setSummary("");
  }, [question._id]);

  const runCode = async () => {
    if (!code.trim() || busy || locked) return;

    setBusy(true);
    setOutput("");
    setStatus("");
    setSummary("");
    setPassed(false);
    onPass(false);

    try {
      const tests = question.testCases || [];

      if (tests.length === 0) {
        throw new Error("No sample tests are available for this question.");
      }

      const results = [];

      for (const test of tests) {
        const data = await apiRequest(COMPILER_URL, {
          method: "POST",
          body: JSON.stringify({
            sourceCode: code,
            stdin: test.input || "",
          }),
          signal: AbortSignal.timeout(65000),
        });

        const result = data.result;
        const accepted =
          result.status === "Accepted" &&
          normalise(result.output) ===
            normalise(test.expectedOutput);

        results.push(accepted);

        setOutput(
          result.output ||
            result.compileOutput ||
            result.error ||
            result.status
        );

        if (result.status !== "Accepted") break;
      }

      const allPassed =
        results.length === tests.length &&
        results.every(Boolean);

      setPassed(allPassed);
      setSummary(
        `${results.filter(Boolean).length}/${tests.length} sample tests passed`
      );
      setStatus(
        allPassed
          ? "All visible sample tests passed."
          : "Some sample tests failed. Check your code."
      );

      onPass(allPassed);
    } catch (error) {
      setStatus(error.message || "Unable to run Java code.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card p-5 space-y-4">
      <div>
        <div className="text-lg font-bold text-indigo-950">
          {question.topic}
        </div>
        <p className="text-sm text-slate-600 mt-1">
          {question.question}
        </p>
      </div>

      <label className="block text-sm font-semibold">
        Java source code
        <textarea
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
            setPassed(false);
            onPass(false);
          }}
          spellCheck={false}
          disabled={locked}
          className="mt-2 w-full min-h-64 rounded-lg border border-slate-300 bg-slate-950 p-4 font-mono text-sm text-green-300"
        />
      </label>

      <button
        type="button"
        onClick={runCode}
        disabled={busy || locked || !code.trim()}
        className="btn-primary justify-center disabled:opacity-50"
      >
        {busy ? "Running sample tests..." : "▶ Run Code & Test Samples"}
      </button>

      {status && (
        <div
          className={`rounded-lg p-3 text-sm ${
            passed
              ? "bg-emerald-50 text-emerald-800"
              : "bg-amber-50 text-amber-800"
          }`}
        >
          <strong>{status}</strong>
          {summary && <div>{summary}</div>}
        </div>
      )}

      {output && (
        <div>
          <div className="text-sm font-semibold mb-1">
            Latest output / message
          </div>
          <pre className="whitespace-pre-wrap break-words rounded bg-slate-950 p-3 text-sm text-green-300">
            {output}
          </pre>
        </div>
      )}

      <p className="text-xs text-slate-500">
        Visible sample tests help you check your solution. Final coding
        marks are calculated separately by the backend using stored tests.
      </p>
    </div>
  );
}

export default function FinalEvaluation({ onNav }) {
  const [phase, setPhase] = useState("intro");
  const [questions, setQuestions] = useState([]);
  const [attemptId, setAttemptId] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [codes, setCodes] = useState({});
  const [codingPassed, setCodingPassed] = useState({});
  const [questionSeconds, setQuestionSeconds] = useState(60);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [results, setResults] = useState(null);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);

  const currentRef = useRef(0);
  const phaseRef = useRef("intro");
  const lastViolationRef = useRef(0);
  const violationBusyRef = useRef(false);
  const advancingRef = useRef(false);

  const question = questions[current];
  const isCoding = question?.questionType === "coding";
  const totalQuestions = questions.length;
  const questionDuration = isCoding ? 300 : 60;
  const elapsed = questionDuration - questionSeconds;

  const canAdvance = isCoding
    ? elapsed >= 60 && codingPassed[question?._id] === true
    : elapsed >= 15;

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const recordViolation = useCallback(async () => {
    if (
      phaseRef.current !== "quiz" ||
      !attemptId ||
      violationBusyRef.current
    ) {
      return;
    }

    const now = Date.now();

    // Avoid duplicate events for one browser focus change.
    if (now - lastViolationRef.current < 1500) return;

    lastViolationRef.current = now;
    violationBusyRef.current = true;

    try {
      const data = await apiRequest(
        `${FINAL_API}/violation/${attemptId}`,
        { method: "POST", body: JSON.stringify({}) }
      );

      setTabSwitchCount(data.tabSwitchCount);

      if (data.isLocked) {
        phaseRef.current = "locked";
        setPhase("locked");
        setNotice(data.message);
      } else {
        setNotice(
          `Warning: tab-switch violation ${data.tabSwitchCount} of 3.`
        );
      }
    } catch (error) {
      setNotice(
        `Could not record the violation: ${error.message}`
      );
    } finally {
      violationBusyRef.current = false;
    }
  }, [attemptId]);

  // Restrictions are deterrents; they cannot prevent every way of
  // accessing browser content. Do not force fullscreen.
  useEffect(() => {
    if (phase !== "quiz") return;

    const preventContextMenu = (event) => event.preventDefault();

    const preventClipboard = (event) => {
      event.preventDefault();
      setNotice("Copy, cut and paste are disabled during the assessment.");
    };

    const preventSelection = (event) => {
      if (event.target?.tagName !== "TEXTAREA") {
        event.preventDefault();
      }
    };

    const preventShortcuts = (event) => {
      const key = event.key.toLowerCase();
      const blocked =
        (event.ctrlKey || event.metaKey) &&
        ["c", "x", "v", "a", "p", "s", "u"].includes(key);

      if (blocked || key === "f12") {
        event.preventDefault();
        setNotice("This keyboard shortcut is disabled during the assessment.");
      }
    };

    const visibilityHandler = () => {
      if (document.hidden) recordViolation();
    };

    document.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("copy", preventClipboard);
    document.addEventListener("cut", preventClipboard);
    document.addEventListener("paste", preventClipboard);
    document.addEventListener("selectstart", preventSelection);
    document.addEventListener("keydown", preventShortcuts);
    document.addEventListener("visibilitychange", visibilityHandler);

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("copy", preventClipboard);
      document.removeEventListener("cut", preventClipboard);
      document.removeEventListener("paste", preventClipboard);
      document.removeEventListener("selectstart", preventSelection);
      document.removeEventListener("keydown", preventShortcuts);
      document.removeEventListener("visibilitychange", visibilityHandler);
    };
  }, [phase, recordViolation]);

  const start = async () => {
    setBusy(true);
    setNotice("");

    try {
      const data = await apiRequest(`${FINAL_API}/start`, {
        method: "POST",
        body: JSON.stringify({}),
      });

      setQuestions(data.questions);
      setAttemptId(data.attemptId);
      setAnswers({});
      setCodes(
        Object.fromEntries(
          data.questions
            .filter((item) => item.questionType === "coding")
            .map((item) => [item._id, item.starterCode || ""])
        )
      );
      setCodingPassed({});
      setCurrent(0);
      setTabSwitchCount(0);
      setResults(null);
      setPhase("quiz");
    } catch (error) {
      setNotice(error.message || "Unable to start the assessment.");
    } finally {
      setBusy(false);
    }
  };

  const advance = useCallback(() => {
    if (advancingRef.current || phaseRef.current !== "quiz") return;

    advancingRef.current = true;
    setNotice("");

    if (currentRef.current >= questions.length - 1) {
      setShowConfirm(true);
    } else {
      setCurrent((value) => value + 1);
    }

    // Reset the guard after the state transition.
    setTimeout(() => {
      advancingRef.current = false;
    }, 0);
  }, [questions.length]);

  useEffect(() => {
    if (phase !== "quiz") return;

    setQuestionSeconds(
      questions[current]?.questionType === "coding" ? 300 : 60
    );

    const timer = setInterval(() => {
      setQuestionSeconds((remaining) => Math.max(0, remaining - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, current, questions]);

  useEffect(() => {
    if (phase !== "quiz" || questionSeconds !== 0) return;

    setNotice("Time expired. This question receives zero if unanswered.");
    advance();
  }, [questionSeconds, phase, advance]);

  const chooseAnswer = (option) => {
    if (!question || isCoding) return;

    setAnswers((previous) => ({
      ...previous,
      [question._id]: option,
    }));
  };

  const finish = async () => {
    if (busy || !attemptId) return;

    setBusy(true);
    setNotice("");

    const submissionAnswers = questions.map((item) => ({
      questionId: item._id,
      selectedAnswer:
        item.questionType === "mcq" ? answers[item._id] || "" : "",
      submittedCode:
        item.questionType === "coding" ? codes[item._id] || "" : "",
    }));

    try {
      const data = await apiRequest(
        `${FINAL_API}/submit/${attemptId}`,
        {
          method: "POST",
          body: JSON.stringify({
            answers: submissionAnswers,
            // Server-side violation endpoint maintains the authoritative count.
            tabSwitchCount,
          }),
        }
      );

      setResults(data.result);
      setShowConfirm(false);
      setPhase("result");
    } catch (error) {
      setNotice(error.message || "Unable to submit the assessment.");
    } finally {
      setBusy(false);
    }
  };

  const minutes = Math.floor(questionSeconds / 60);
  const seconds = questionSeconds % 60;

  if (phase === "intro") {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="card p-8 text-center">
          <div className="text-6xl mb-4">📝</div>
          <div className="ai-chip mx-auto mb-4">
            Final Step — Java Course Evaluation
          </div>
          <h2 className="text-2xl font-extrabold text-indigo-950 mb-3">
            Final Evaluation
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            Complete all 18 Java topics first. This assessment covers Java only.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              ["MCQs", "20 × 3 = 60"],
              ["Coding", "10 × 4 = 40"],
              ["Total", "100 marks"],
              ["Certificate", "96/100+"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl bg-slate-50 border border-slate-200 p-3"
              >
                <div className="font-bold text-indigo-700">{value}</div>
                <div className="text-xs text-slate-500 mt-1">{label}</div>
              </div>
            ))}
          </div>

          <div className="text-left rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800 mb-6">
            MCQs: 60 seconds each. Coding: 5 minutes each. The overall
            assessment deadline is enforced by the server. Three recorded
            tab-switch violations lock the assessment.
          </div>

          {notice && (
            <div className="rounded-lg bg-red-50 text-red-700 p-3 mb-4 text-sm">
              {notice}
            </div>
          )}

          <button
            className="btn-primary w-full justify-center py-3 disabled:opacity-50"
            onClick={start}
            disabled={busy}
          >
            {busy ? "Checking eligibility..." : "Begin Final Evaluation 🚀"}
          </button>
        </div>
      </div>
    );
  }

  if (phase === "locked") {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="card p-8 text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-red-700 mb-3">
            Assessment Locked
          </h2>
          <p className="text-slate-600 mb-4">
            {notice || "The assessment was locked after three tab switches."}
          </p>
          <p className="text-sm text-slate-500 mb-6">
            Your attempt has not been automatically submitted. Please contact
            your teacher for further instructions.
          </p>
          <button
            className="btn-secondary justify-center"
            onClick={() => onNav?.("student-dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (phase === "result") {
    const passed = results?.certificateEligible === true;

    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div
          className="card p-8 text-center mb-5"
          style={{
            background: passed
              ? "linear-gradient(135deg,#059669,#047857)"
              : "linear-gradient(135deg,#DC2626,#B91C1C)",
            color: "white",
          }}
        >
          <div className="text-6xl mb-4">{passed ? "🎉" : "😟"}</div>
          <div className="text-5xl font-black mb-2">
            {results?.obtainedMarks ?? 0}/100
          </div>
          <div className="text-white/90">
            {passed
              ? "Certificate eligibility achieved."
              : `You need ${Math.max(0, PASS_MARK - (results?.obtainedMarks ?? 0))} more marks to reach ${PASS_MARK}.`}
          </div>
        </div>

        <div className="card p-5 mb-5 space-y-3">
          <div className="flex justify-between">
            <span>Percentage</span>
            <strong>{results?.percentage ?? 0}%</strong>
          </div>
          <div className="flex justify-between">
            <span>Correct questions</span>
            <strong>{results?.correctAnswers ?? 0}</strong>
          </div>
          <div className="flex justify-between">
            <span>Attempted questions</span>
            <strong>{results?.attemptedQuestions ?? 0}/30</strong>
          </div>
          <div className="flex justify-between">
            <span>Certificate eligible</span>
            <strong>{passed ? "Yes" : "No"}</strong>
          </div>
          <p className="text-xs text-slate-500">
            This result was calculated and saved by the backend. Certificate
            eligibility does not itself issue a certificate.
          </p>
        </div>

        <button
          className="btn-secondary w-full justify-center"
          onClick={() => onNav?.("student-dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="p-6">
        <div className="card p-6">
          No questions are available. Please return to the dashboard and try
          again.
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-4 md:p-6 max-w-4xl mx-auto space-y-4"
      onContextMenu={(event) => event.preventDefault()}
    >
      <div className="card p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs text-slate-400 mb-1">
            Final Evaluation · Java Programming
          </div>
          <div className="font-bold text-slate-800">
            Question {current + 1} of {totalQuestions}
          </div>
          <div className="text-xs text-slate-500">
            {isCoding ? "Coding question · 4 marks" : "MCQ · 3 marks"}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="badge bg-slate-100 text-slate-600">
            {question.topic}
          </span>
          <div
            className={`font-mono text-sm font-semibold px-3 py-2 rounded-lg ${
              questionSeconds <= 30
                ? "bg-red-100 text-red-700"
                : "bg-indigo-100 text-indigo-700"
            }`}
          >
            ⏱ {minutes}:{String(seconds).padStart(2, "0")}
          </div>
        </div>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${((current + 1) / totalQuestions) * 100}%`,
          }}
        />
      </div>

      {notice && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
          {notice}
        </div>
      )}

      {!isCoding ? (
        <div className="card p-6">
          <p className="text-base font-semibold text-slate-900 mb-6">
            {question.question}
          </p>
          <div className="space-y-3">
            {(question.options || []).map((option, index) => (
              <button
                key={`${question._id}-${index}`}
                onClick={() => chooseAnswer(option)}
                className={`w-full text-left p-4 rounded-xl border-2 text-sm font-medium ${
                  answers[question._id] === option
                    ? "border-indigo-500 bg-indigo-50 text-indigo-800"
                    : "border-slate-200 hover:border-indigo-300 text-slate-700"
                }`}
              >
                <span className="inline-flex w-6 h-6 rounded-full items-center justify-center text-xs mr-3 font-bold bg-slate-100">
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Next unlocks after 15 seconds. The question advances when its timer
            expires.
          </p>
        </div>
      ) : (
        <CodePanel
          question={question}
          code={codes[question._id] || ""}
          setCode={(value) =>
            setCodes((previous) => ({
              ...previous,
              [question._id]: value,
            }))
          }
          onPass={(value) =>
            setCodingPassed((previous) => ({
              ...previous,
              [question._id]: value,
            }))
          }
          locked={busy}
        />
      )}

      <div className="card p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-slate-500">
          {isCoding
            ? codingPassed[question._id]
              ? "Visible sample tests passed"
              : "Pass visible sample tests and wait at least 1 minute"
            : answers[question._id]
              ? "Answer selected"
              : "Not answered"}
        </div>

        {current === totalQuestions - 1 ? (
          <button
            className="btn-primary justify-center disabled:opacity-50"
            onClick={() => setShowConfirm(true)}
            disabled={!canAdvance || busy}
          >
            Submit Evaluation ✓
          </button>
        ) : (
          <button
            className="btn-primary justify-center disabled:opacity-50"
            onClick={advance}
            disabled={!canAdvance || busy}
          >
            Next →
          </button>
        )}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="card p-6 max-w-sm w-full mx-4">
            <h3 className="font-bold text-slate-900 mb-2">
              Submit final evaluation?
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              The backend will grade your answers, save your result, and
              determine certificate eligibility. Unanswered questions receive
              zero marks.
            </p>
            {notice && (
              <p className="text-sm text-red-700 mb-3">{notice}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="btn-outline flex-1 justify-center"
                disabled={busy}
              >
                Continue
              </button>
              <button
                onClick={finish}
                className="btn-primary flex-1 justify-center disabled:opacity-50"
                disabled={busy}
              >
                {busy ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
