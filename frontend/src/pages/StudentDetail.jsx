import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

// ============================================================
// LEVEL COLORS
// ============================================================

const levelColors = {
  Advanced: {
    bg: "#ECFDF5",
    color: "#059669",
  },

  Average: {
    bg: "#EEF2FF",
    color: "#4338CA",
  },

  Slow: {
    bg: "#FEF2F2",
    color: "#DC2626",
  },

  "Not Available": {
    bg: "#F8FAFC",
    color: "#64748B",
  },
};

// ============================================================
// RISK COLORS
// ============================================================

const riskColors = {
  High: {
    bg: "#FEF2F2",
    color: "#DC2626",
  },

  Medium: {
    bg: "#FFFBEB",
    color: "#D97706",
  },

  Low: {
    bg: "#ECFDF5",
    color: "#059669",
  },

  None: {
    bg: "#F8FAFC",
    color: "#64748B",
  },
};

// ============================================================
// STUDENT DETAIL
// ============================================================

export default function StudentDetail({
  onNav,
}) {
  const [student, setStudent] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================================
  // FETCH SELECTED STUDENT
  // ==========================================================

  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      const selectedStudentId =
        localStorage.getItem(
          "teacherSelectedStudentId"
        );

      console.log(
        "Selected Student ID:",
        selectedStudentId
      );

      // ------------------------------------------------------
      // CHECK LOGIN
      // ------------------------------------------------------

      if (!token) {
        setError(
          "Teacher login session not found."
        );

        return;
      }

      // ------------------------------------------------------
      // CHECK SELECTED STUDENT
      // ------------------------------------------------------

      if (!selectedStudentId) {
        setError(
          "No student selected. Please go back to Student Monitoring and click View for a student."
        );

        return;
      }

      // ------------------------------------------------------
      // GET TEACHER DASHBOARD DATA
      // ------------------------------------------------------

      const response = await fetch(
        `${API_URL}/teacher/dashboard`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
        }
      );

      const data =
        await response.json();

      console.log(
        "Teacher dashboard response:",
        data
      );

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to load student data."
        );
      }

      // ------------------------------------------------------
      // FIND SELECTED STUDENT
      // ------------------------------------------------------

      const selectedStudent =
        Array.isArray(data.students)
          ? data.students.find(
              (item) =>
                String(item.id) ===
                String(
                  selectedStudentId
                )
            )
          : null;

      console.log(
        "Selected student data:",
        selectedStudent
      );

      if (!selectedStudent) {
        throw new Error(
          "Selected student was not found in the teacher dashboard data."
        );
      }

      setStudent(
        selectedStudent
      );
    } catch (err) {
      console.error(
        "Student detail error:",
        err
      );

      setError(
        err.message ||
          "Unable to load student details."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // BACK TO STUDENTS
  // ==========================================================

  const handleBack = () => {
    localStorage.removeItem(
      "teacherSelectedStudentId"
    );

    localStorage.removeItem(
      "teacherSelectedStudentName"
    );

    onNav("student-monitoring");
  };

  // ==========================================================
  // SCORE COLOR
  // ==========================================================

  const getScoreColor = (score) => {
    if (
      score === null ||
      score === undefined
    ) {
      return "#94A3B8";
    }

    if (score >= 70) {
      return "#059669";
    }

    if (score >= 50) {
      return "#D97706";
    }

    return "#DC2626";
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="p-6">

        <div className="min-h-[500px] flex items-center justify-center">

          <div className="text-center">

            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />

            <p className="text-sm text-slate-500">
              Loading student performance...
            </p>

          </div>

        </div>

      </div>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {
    return (
      <div className="p-6">

        <div className="card p-8 text-center">

          <div className="text-4xl mb-3">
            ⚠️
          </div>

          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            Unable to Load Student
          </h3>

          <p className="text-sm text-red-500 mb-5">
            {error}
          </p>

          <button
            onClick={handleBack}
            className="btn-secondary text-sm px-4 py-2"
          >
            ← Back to Students
          </button>

        </div>

      </div>
    );
  }

  // ==========================================================
  // SAFETY
  // ==========================================================

  if (!student) {
    return null;
  }

  // ==========================================================
  // STUDENT DATA
  // ==========================================================

  const name =
    student.name ||
    "Unknown Student";

  const email =
    student.email || "";

  const level =
    student.level ||
    "Not Available";

  const risk =
    student.risk ||
    "None";

  const progress =
    Number(
      student.progress || 0
    );

  const score =
    student.latestAnalysis
      ? Number(
          student.score || 0
        )
      : null;

  const prerequisite =
    student.prerequisite ||
    null;

  const analysis =
    student.latestAnalysis ||
    null;

  const levelStyle =
    levelColors[level] ||
    levelColors[
      "Not Available"
    ];

  const riskStyle =
    riskColors[risk] ||
    riskColors.None;

  // ==========================================================
  // PREREQUISITE
  // ==========================================================

  const prerequisiteStatus =
    prerequisite?.status ||
    "not_attempted";

  const prerequisitePercentage =
    prerequisite?.percentage !==
      null &&
    prerequisite?.percentage !==
      undefined
      ? Number(
          prerequisite.percentage
        )
      : null;

  // ==========================================================
  // STRENGTHS
  // ==========================================================

  const strengths =
    Array.isArray(
      analysis?.strengths
    )
      ? analysis.strengths
      : [];

  // ==========================================================
  // WEAKNESSES
  // ==========================================================

  const weaknesses =
    Array.isArray(
      analysis?.weaknesses
    )
      ? analysis.weaknesses
      : [];

  // ==========================================================
  // COURSE PROGRESS, ASSESSMENT HISTORY & FINAL EVALUATION
  // ==========================================================

  const topicProgress = Array.isArray(student.topicProgress)
    ? student.topicProgress
    : [];

  const completedTopics = topicProgress.filter(
    (topic) => topic.status === "completed"
  );

  const incompleteTopics = topicProgress.filter(
    (topic) => topic.status !== "completed"
  );

  const assessmentHistory = Array.isArray(student.assessmentHistory)
    ? student.assessmentHistory
    : [];

  const improvement = student.improvement || {};

  const finalEvaluation = student.finalEvaluation || {};

  const finalEvaluationAttempts = Array.isArray(
    student.finalEvaluationAttempts
  )
    ? student.finalEvaluationAttempts
    : [];

  const certificate = student.certificate || {
    eligible: Boolean(student.certificateEligible),
    status: "unknown",
    qualifyingScore: null,
    requiredMarks: 96,
  };

  const formatDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? "—"
      : date.toLocaleString();
  };

  // ==========================================================
  // PERFORMANCE CHART
  // ==========================================================

  const performanceData = [];

  if (
    prerequisitePercentage !==
    null
  ) {
    performanceData.push({
      metric: "Prerequisite",
      score:
        prerequisitePercentage,
    });
  }

  if (score !== null) {
    performanceData.push({
      metric: "Assessment",
      score,
    });
  }

  performanceData.push({
    metric: "Progress",
    score: progress,
  });

  // ==========================================================
  // AI RECOMMENDATION
  // ==========================================================

  let recommendation =
    "Continue monitoring the student's learning progress and assessment performance.";

  if (level === "Slow") {
    recommendation =
      "The student is currently classified as Slow. Provide additional practice, review weak areas, and monitor the next assessment closely.";
  }

  if (level === "Average") {
    recommendation =
      "The student is currently at an Average level. Encourage consistent practice and targeted improvement in the identified weak areas.";
  }

  if (level === "Advanced") {
    recommendation =
      "The student is currently classified as Advanced. Continue challenging the student with higher-level topics and advanced practice.";
  }

  if (weaknesses.length > 0) {
    recommendation +=
      ` Current areas identified for improvement include ${weaknesses
        .slice(0, 2)
        .join(", ")}.`;
  }

  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (
    <div className="p-6 space-y-5">

      {/* ======================================================
          BACK
      ====================================================== */}

      <button
        onClick={handleBack}
        className="text-sm text-indigo-600 hover:underline flex items-center gap-1"
      >
        ← Back to Students
      </button>

      {/* ======================================================
          STUDENT HEADER
      ====================================================== */}

      <div className="card p-5 flex items-start gap-5">

        {/* Avatar */}

        <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-black text-2xl flex-shrink-0">
          {name
            .charAt(0)
            .toUpperCase()}
        </div>

        {/* Student Information */}

        <div className="flex-1">

          <div className="flex items-center gap-3 flex-wrap mb-1">

            <h2
              className="text-xl text-indigo-950"
              style={{
                fontFamily:
                  "'DM Sans', sans-serif",
                fontWeight: 800,
              }}
            >
              {name}
            </h2>

            <span
              className="badge"
              style={{
                background:
                  levelStyle.bg,
                color:
                  levelStyle.color,
              }}
            >
              {level}
            </span>

            <span
              className="badge"
              style={{
                background:
                  riskStyle.bg,
                color:
                  riskStyle.color,
              }}
            >
              {risk} Risk
            </span>

          </div>

          <p className="text-slate-500 text-sm">
            {email}
            {" · "}
            Last active:{" "}
            {student.lastActive ||
              "Never"}
          </p>

        </div>

        {/* Actions */}

        <div className="flex gap-2">

          <button
            onClick={() =>
              onNav(
                "teacher-notifications"
              )
            }
            className="btn-secondary text-sm py-2 px-4"
          >
            💬 Send Message
          </button>

          <button
            onClick={() =>
              onNav("intervention")
            }
            className="btn-primary text-sm py-2 px-4"
          >
            🤝 Add Intervention
          </button>

        </div>

      </div>

      {/* ======================================================
          PREREQUISITE EVALUATION
      ====================================================== */}

      <div className="card p-5">

        <div className="flex items-center justify-between mb-4">

          <div>

            <h3
              className="text-base text-slate-900"
              style={{
                fontFamily:
                  "'DM Sans', sans-serif",
                fontWeight: 700,
              }}
            >
              Prerequisite Evaluation
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Initial baseline assessment
            </p>

          </div>

          <span
            className="badge text-xs"
            style={{
              background:
                prerequisiteStatus ===
                "passed"
                  ? "#ECFDF5"
                  : prerequisiteStatus ===
                    "failed"
                  ? "#FEF2F2"
                  : "#F8FAFC",

              color:
                prerequisiteStatus ===
                "passed"
                  ? "#059669"
                  : prerequisiteStatus ===
                    "failed"
                  ? "#DC2626"
                  : "#64748B",
            }}
          >
            {prerequisiteStatus ===
            "passed"
              ? "Passed"
              : prerequisiteStatus ===
                "failed"
              ? "Failed"
              : "Not Attempted"}
          </span>

        </div>

        {prerequisitePercentage !==
        null ? (

          <div className="grid grid-cols-3 gap-4">

            {/* Marks */}

            <div className="bg-slate-50 rounded-xl p-4 text-center">

              <div
                className="text-2xl font-black"
                style={{
                  color:
                    getScoreColor(
                      prerequisitePercentage
                    ),
                }}
              >
                {
                  prerequisite.score
                }
                /
                {
                  prerequisite.totalMarks
                }
              </div>

              <div className="text-xs text-slate-500 mt-1">
                Marks
              </div>

            </div>

            {/* Percentage */}

            <div className="bg-slate-50 rounded-xl p-4 text-center">

              <div
                className="text-2xl font-black"
                style={{
                  color:
                    getScoreColor(
                      prerequisitePercentage
                    ),
                }}
              >
                {
                  prerequisitePercentage
                }%
              </div>

              <div className="text-xs text-slate-500 mt-1">
                Percentage
              </div>

            </div>

            {/* Total */}

            <div className="bg-slate-50 rounded-xl p-4 text-center">

              <div className="text-2xl font-black text-indigo-600">
                {
                  prerequisite.totalMarks ||
                  100
                }
              </div>

              <div className="text-xs text-slate-500 mt-1">
                Total Marks
              </div>

            </div>

          </div>

        ) : (

          <div className="bg-slate-50 rounded-xl p-5 text-center">

            <p className="text-sm font-medium text-slate-600">
              This student has not attempted the prerequisite evaluation yet.
            </p>

          </div>

        )}

      </div>

      {/* ======================================================
          MAIN STATISTICS
      ====================================================== */}

      <div className="grid grid-cols-3 gap-4">

        {/* Assessment */}

        <div className="card p-4 text-center">

          <div
            className="text-2xl font-black mb-0.5"
            style={{
              fontFamily:
                "'DM Sans', sans-serif",

              color:
                score === null
                  ? "#94A3B8"
                  : getScoreColor(score),
            }}
          >
            {score === null
              ? "—"
              : `${score}%`}
          </div>

          <div className="text-xs text-slate-500">
            Latest Assessment
          </div>

        </div>

        {/* Progress */}

        <div className="card p-4 text-center">

          <div
            className="text-2xl font-black mb-0.5"
            style={{
              fontFamily:
                "'DM Sans', sans-serif",
              color: "#4F46E5",
            }}
          >
            {progress}%
          </div>

          <div className="text-xs text-slate-500">
            Overall Progress
          </div>

        </div>

        {/* Learning Level */}

        <div className="card p-4 text-center">

          <div
            className="text-2xl font-black mb-0.5"
            style={{
              fontFamily:
                "'DM Sans', sans-serif",
              color:
                levelStyle.color,
            }}
          >
            {level}
          </div>

          <div className="text-xs text-slate-500">
            AI Learning Level
          </div>

        </div>

      </div>

      {/* ======================================================
          PERFORMANCE OVERVIEW
      ====================================================== */}

      <div className="card p-5">

        <h3
          className="font-700 text-slate-900 mb-4"
          style={{
            fontFamily:
              "'DM Sans', sans-serif",
            fontWeight: 700,
          }}
        >
          Performance Overview
        </h3>

        {performanceData.length >
        0 ? (

          <ResponsiveContainer
            width="100%"
            height={240}
          >

            <BarChart
              data={
                performanceData
              }
            >

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F1F5F9"
              />

              <XAxis
                dataKey="metric"
                tick={{
                  fontSize: 10,
                  fill: "#94A3B8",
                }}
              />

              <YAxis
                domain={[0, 100]}
                tick={{
                  fontSize: 10,
                  fill: "#94A3B8",
                }}
              />

              <Tooltip
                formatter={(
                  value
                ) => [
                  `${value}%`,
                  "Score",
                ]}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border:
                    "1px solid #E2E8F0",
                }}
              />

              <Bar
                dataKey="score"
                fill="#4F46E5"
                radius={[
                  4,
                  4,
                  0,
                  0,
                ]}
              />

            </BarChart>

          </ResponsiveContainer>

        ) : (

          <div className="h-[240px] flex items-center justify-center text-sm text-slate-400">
            No assessment data available.
          </div>

        )}

      </div>

      {/* ======================================================
          STRENGTHS & WEAK AREAS
      ====================================================== */}

      <div className="grid grid-cols-2 gap-5">

        {/* Strengths */}

        <div className="card p-5">

          <h3
            className="font-700 text-slate-900 mb-3"
            style={{
              fontFamily:
                "'DM Sans', sans-serif",
              fontWeight: 700,
            }}
          >
            ✅ Strengths
          </h3>

          {strengths.length >
          0 ? (

            strengths.map(
              (
                strength,
                index
              ) => (

                <div
                  key={`${strength}-${index}`}
                  className="flex items-center gap-2 py-1.5 text-sm text-slate-700 border-b border-slate-100 last:border-0"
                >

                  <span className="text-emerald-500">
                    →
                  </span>

                  {strength}

                </div>

              )
            )

          ) : (

            <p className="text-sm text-slate-400">
              No strength data available yet.
            </p>

          )}

        </div>

        {/* Weak Areas */}

        <div className="card p-5">

          <h3
            className="font-700 text-slate-900 mb-3"
            style={{
              fontFamily:
                "'DM Sans', sans-serif",
              fontWeight: 700,
            }}
          >
            ⚡ Weak Areas
          </h3>

          {weaknesses.length >
          0 ? (

            weaknesses.map(
              (
                weakness,
                index
              ) => (

                <div
                  key={`${weakness}-${index}`}
                  className="flex items-center gap-2 py-1.5 text-sm text-slate-700 border-b border-slate-100 last:border-0"
                >

                  <span className="text-red-400">
                    →
                  </span>

                  {weakness}

                </div>

              )
            )

          ) : (

            <p className="text-sm text-slate-400">
              No weak areas identified yet.
            </p>

          )}

        </div>

      </div>

      {/* ======================================================
          LATEST ASSESSMENT DETAILS
      ====================================================== */}

      {analysis && (

        <div className="card p-5">

          <h3
            className="font-700 text-slate-900 mb-4"
            style={{
              fontFamily:
                "'DM Sans', sans-serif",
              fontWeight: 700,
            }}
          >
            Latest Assessment Details
          </h3>

          <div className="grid grid-cols-4 gap-4">

            {/* Correct */}

            <div className="bg-slate-50 rounded-xl p-4">

              <div className="text-lg font-bold text-indigo-600">
                {
                  analysis.correctAnswers ??
                  0
                }
              </div>

              <div className="text-xs text-slate-500">
                Correct Answers
              </div>

            </div>

            {/* Wrong */}

            <div className="bg-slate-50 rounded-xl p-4">

              <div className="text-lg font-bold text-red-500">
                {
                  analysis.wrongAnswers ??
                  0
                }
              </div>

              <div className="text-xs text-slate-500">
                Wrong Answers
              </div>

            </div>

            {/* Total */}

            <div className="bg-slate-50 rounded-xl p-4">

              <div className="text-lg font-bold text-slate-700">
                {
                  analysis.totalQuestions ??
                  0
                }
              </div>

              <div className="text-xs text-slate-500">
                Total Questions
              </div>

            </div>

            {/* Time */}

            <div className="bg-slate-50 rounded-xl p-4">

              <div className="text-lg font-bold text-amber-600">
                {
                  analysis.timeSpentMinutes ??
                  0
                }{" "}
                min
              </div>

              <div className="text-xs text-slate-500">
                Time Spent
              </div>

            </div>

          </div>

          {/* Summary */}

          {analysis.analysisSummary && (

            <div className="mt-4 p-4 bg-indigo-50 rounded-xl">

              <p className="text-sm text-slate-700">
                {
                  analysis.analysisSummary
                }
              </p>

            </div>

          )}

        </div>

      )}

      {/* ======================================================
          JAVA COURSE TOPIC PROGRESS
      ====================================================== */}

      <div className="card p-5">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div>
            <h3 className="font-700 text-slate-900">Java Course Progress</h3>
            <p className="text-xs text-slate-500 mt-1">
              Completion is based on the 18 required Java topics.
            </p>
          </div>
          <span className="badge bg-indigo-50 text-indigo-700">
            {completedTopics.length}/{topicProgress.length || 18} Completed
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-slate-100 mb-5 overflow-hidden">
          <div
            className="h-full rounded-full bg-indigo-600"
            style={{
              width: `${Math.min(
                100,
                Math.max(0, Number(student.progress) || 0)
              )}%`,
            }}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {topicProgress.length > 0 ? (
            topicProgress.map((topic, index) => {
              const isCompleted = topic.status === "completed";
              return (
                <div
                  key={`${topic.topic}-${index}`}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-100"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800">
                      {topic.topic}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {topic.completedLessons ?? 0}/
                      {topic.totalLessons ?? 0} lessons ·{" "}
                      {Number(topic.progressPercentage) || 0}%
                    </p>
                  </div>
                  <span
                    className={`badge text-xs flex-shrink-0 ${
                      isCompleted
                        ? "bg-emerald-50 text-emerald-700"
                        : topic.status === "in_progress"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {isCompleted
                      ? "Completed"
                      : topic.status === "in_progress"
                      ? "In Progress"
                      : "Not Started"}
                  </span>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-slate-400">
              Topic progress has not been recorded yet.
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="rounded-xl bg-emerald-50 p-3">
            <p className="text-2xl font-bold text-emerald-700">
              {completedTopics.length}
            </p>
            <p className="text-xs text-emerald-700">Completed Topics</p>
          </div>
          <div className="rounded-xl bg-amber-50 p-3">
            <p className="text-2xl font-bold text-amber-700">
              {incompleteTopics.length}
            </p>
            <p className="text-xs text-amber-700">Remaining Topics</p>
          </div>
        </div>
      </div>

      {/* ======================================================
          ASSESSMENT HISTORY & IMPROVEMENT
      ====================================================== */}

      <div className="card p-5">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div>
            <h3 className="font-700 text-slate-900">Assessment History</h3>
            <p className="text-xs text-slate-500 mt-1">
              Previous AI assessment results and score changes.
            </p>
          </div>
          <span className="badge bg-indigo-50 text-indigo-700">
            {assessmentHistory.length} Attempt(s)
          </span>
        </div>

        {improvement.status !== "insufficient_data" &&
        improvement.difference !== null &&
        improvement.difference !== undefined ? (
          <div className="rounded-xl bg-indigo-50 p-4 mb-4">
            <p className="text-xs text-indigo-600 font-medium">
              Score improvement
            </p>
            <p className="text-xl font-bold text-indigo-900">
              {Number(improvement.difference) > 0 ? "+" : ""}
              {improvement.difference}%
            </p>
            <p className="text-xs text-indigo-700 mt-1">
              Previous: {improvement.previousScore ?? "—"}% · Latest:{" "}
              {improvement.latestScore ?? "—"}%
            </p>
          </div>
        ) : (
          <p className="text-xs text-slate-400 mb-4">
            More than one assessment is needed to calculate improvement.
          </p>
        )}

        {assessmentHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px]">
              <thead>
                <tr className="text-left border-b border-slate-200">
                  {["Date", "Score", "Level", "Correct", "Wrong", "Time"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="py-3 px-2 text-xs text-slate-500 uppercase"
                      >
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {assessmentHistory.map((attempt, index) => (
                  <tr
                    key={`${attempt.createdAt || "attempt"}-${index}`}
                    className="border-b border-slate-100"
                  >
                    <td className="py-3 px-2 text-xs text-slate-600">
                      {formatDate(attempt.createdAt)}
                    </td>
                    <td className="py-3 px-2 text-sm font-semibold">
                      {attempt.percentage ?? "—"}%
                    </td>
                    <td className="py-3 px-2 text-xs capitalize">
                      {attempt.performanceLevel || "—"}
                    </td>
                    <td className="py-3 px-2 text-sm text-emerald-700">
                      {attempt.correctAnswers ?? 0}
                    </td>
                    <td className="py-3 px-2 text-sm text-red-600">
                      {attempt.wrongAnswers ?? 0}
                    </td>
                    <td className="py-3 px-2 text-xs text-slate-600">
                      {attempt.timeSpentMinutes ?? 0} min
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate-400">
            No assessment history is available yet.
          </p>
        )}
      </div>

      {/* ======================================================
          FINAL EVALUATION & CERTIFICATE
      ====================================================== */}

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <h3 className="font-700 text-slate-900 mb-4">
            Final Evaluation
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-2xl font-bold text-indigo-700">
                {finalEvaluation.score ?? "—"}
                <span className="text-sm text-slate-400">/100</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">Obtained Marks</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-2xl font-bold text-indigo-700">
                {finalEvaluation.percentage ?? "—"}
                {finalEvaluation.percentage != null ? "%" : ""}
              </p>
              <p className="text-xs text-slate-500 mt-1">Percentage</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xl font-bold text-emerald-700">
                {finalEvaluation.correctAnswers ?? 0}
              </p>
              <p className="text-xs text-slate-500 mt-1">Correct Answers</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xl font-bold text-red-600">
                {finalEvaluation.wrongAnswers ?? 0}
              </p>
              <p className="text-xs text-slate-500 mt-1">Wrong Answers</p>
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-500 space-y-1">
            <p>Status: <strong>{finalEvaluation.status || "not_attempted"}</strong></p>
            <p>
              Attempted: {finalEvaluation.attemptedQuestions ?? 0}/
              {finalEvaluation.totalQuestions ?? 30}
            </p>
            <p>Started: {formatDate(finalEvaluation.startedAt)}</p>
            <p>Completed: {formatDate(finalEvaluation.completedAt)}</p>
          </div>

          {finalEvaluationAttempts.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-slate-800 mb-2">
                All Final Evaluation Attempts
              </h4>
              <div className="space-y-2">
                {finalEvaluationAttempts.map((attempt, index) => (
                  <div
                    key={attempt.attemptId || attempt._id || index}
                    className="flex items-center justify-between gap-2 border border-slate-100 rounded-lg p-3"
                  >
                    <div>
                      <p className="text-xs font-medium text-slate-700">
                        Attempt {index + 1} · {attempt.status || "unknown"}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatDate(attempt.completedAt || attempt.startedAt)}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-indigo-700">
                      {attempt.score ?? attempt.obtainedMarks ?? "—"}/100
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="card p-5">
          <h3 className="font-700 text-slate-900 mb-4">
            Certificate Eligibility
          </h3>
          <div
            className={`rounded-xl p-4 ${
              certificate.eligible
                ? "bg-emerald-50"
                : "bg-slate-50"
            }`}
          >
            <p
              className={`text-lg font-bold ${
                certificate.eligible
                  ? "text-emerald-700"
                  : "text-slate-700"
              }`}
            >
              {certificate.eligible
                ? "Eligible for Certificate"
                : "Not Eligible Yet"}
            </p>
            <p className="text-xs text-slate-600 mt-2">
              Required marks: {certificate.requiredMarks ?? 96}/100
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Qualifying score: {certificate.qualifyingScore ?? "—"}
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Certificate status: {certificate.status || "unknown"}
            </p>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Eligibility requires a completed final evaluation with at least
            96 marks. Eligibility does not necessarily mean the certificate
            has already been issued.
          </p>
        </div>
      </div>

      {/* ======================================================
          AI RECOMMENDATION
      ====================================================== */}

      <div
        className="card p-4"
        style={{
          borderLeft:
            "4px solid #4F46E5",
        }}
      >

        <div className="ai-chip mb-2">
          🤖 AI Recommended Intervention
        </div>

        <p className="text-sm text-slate-700">
          {recommendation}
        </p>

      </div>

    </div>
  );
}