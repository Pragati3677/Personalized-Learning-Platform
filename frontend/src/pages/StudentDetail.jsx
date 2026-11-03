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