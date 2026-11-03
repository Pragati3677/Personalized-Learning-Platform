import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

// ============================================================
// RISK COLORS
// ============================================================

const riskColors = {
  High: {
    bg: "#FEF2F2",
    color: "#DC2626",
    border: "#EF4444",
  },

  Medium: {
    bg: "#FFFBEB",
    color: "#D97706",
    border: "#F59E0B",
  },

  Low: {
    bg: "#ECFDF5",
    color: "#059669",
    border: "#10B981",
  },
};

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
// AT-RISK STUDENTS
// ============================================================

export default function AtRisk({ onNav }) {
  const [students, setStudents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [filter, setFilter] =
    useState("All");

  // ==========================================================
  // FETCH REAL DATA
  // ==========================================================

  useEffect(() => {
    fetchAtRiskStudents();
  }, []);

  const fetchAtRiskStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        setError(
          "Teacher login session not found."
        );
        return;
      }

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

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to load at-risk students."
        );
      }

      // ------------------------------------------------------
      // Prefer backend atRiskStudents
      // ------------------------------------------------------

      let riskStudents =
        Array.isArray(
          data.atRiskStudents
        )
          ? data.atRiskStudents
          : [];

      // ------------------------------------------------------
      // Fallback:
      // Filter students returned in dashboard
      // ------------------------------------------------------

      if (riskStudents.length === 0) {
        riskStudents =
          Array.isArray(data.students)
            ? data.students.filter(
                (student) =>
                  student.risk ===
                    "High" ||
                  student.risk ===
                    "Medium"
              )
            : [];
      }

      setStudents(
        riskStudents
      );
    } catch (err) {
      console.error(
        "At-risk students error:",
        err
      );

      setError(
        err.message ||
          "Unable to load at-risk students."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // FILTER
  // ==========================================================

  const filteredStudents =
    filter === "All"
      ? students
      : students.filter(
          (student) =>
            student.risk === filter
        );

  // ==========================================================
  // COUNTS
  // ==========================================================

  const highCount =
    students.filter(
      (student) =>
        student.risk === "High"
    ).length;

  const mediumCount =
    students.filter(
      (student) =>
        student.risk === "Medium"
    ).length;

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
  // GENERATE REALISTIC RECOMMENDATION
  // FROM AVAILABLE REAL DATA
  // ==========================================================

  const getRecommendation = (
    student
  ) => {
    const level =
      student.level ||
      "Not Available";

    const score =
      Number(student.score || 0);

    const progress =
      Number(
        student.progress || 0
      );

    const weakTopics =
      Array.isArray(
        student.weakTopics
      )
        ? student.weakTopics
        : [];

    if (level === "Slow") {
      if (
        weakTopics.length > 0
      ) {
        return `Provide targeted practice in ${weakTopics
          .slice(0, 2)
          .join(
            " and "
          )} and reassess the student after remediation.`;
      }

      return "Provide additional guided practice and reassess the student before moving to the next topic.";
    }

    if (score < 50) {
      return "Review the student's recent assessment performance and provide targeted remedial practice.";
    }

    if (progress < 20) {
      return "The student has low learning progress. Encourage regular study activity and monitor progress closely.";
    }

    if (level === "Average") {
      if (
        weakTopics.length > 0
      ) {
        return `Encourage focused practice on ${weakTopics
          .slice(0, 2)
          .join(
            " and "
          )} to improve the student's performance.`;
      }

      return "Encourage consistent study activity and monitor the next assessment.";
    }

    return "Continue monitoring the student's learning activity and assessment performance.";
  };

  // ==========================================================
  // VIEW STUDENT
  // ==========================================================

  const handleViewStudent = (
    student
  ) => {
    if (!student?.id) {
      console.error(
        "Student ID is missing:",
        student
      );
      return;
    }

    localStorage.setItem(
      "teacherSelectedStudentId",
      String(student.id)
    );

    localStorage.setItem(
      "teacherSelectedStudentName",
      student.name || ""
    );

    onNav("student-detail");
  };

  // ==========================================================
  // MESSAGE STUDENT
  // ==========================================================

  const handleMessage = (
    student
  ) => {
    if (!student?.id) {
      return;
    }

    localStorage.setItem(
      "teacherSelectedStudentId",
      String(student.id)
    );

    localStorage.setItem(
      "teacherSelectedStudentName",
      student.name || ""
    );

    onNav(
      "teacher-notifications"
    );
  };

  // ==========================================================
  // INTERVENTION
  // ==========================================================

  const handleIntervention = (
    student
  ) => {
    if (!student?.id) {
      return;
    }

    localStorage.setItem(
      "teacherSelectedStudentId",
      String(student.id)
    );

    localStorage.setItem(
      "teacherSelectedStudentName",
      student.name || ""
    );

    onNav("intervention");
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
              Loading at-risk students...
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
            Unable to Load Early Alerts
          </h3>

          <p className="text-sm text-red-500 mb-5">
            {error}
          </p>

          <button
            onClick={
              fetchAtRiskStudents
            }
            className="btn-secondary text-sm px-4 py-2"
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (
    <div className="p-6">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex items-center justify-between mb-5">

        <div>

          <h2
            className="text-xl text-indigo-950"
            style={{
              fontFamily:
                "'DM Sans', sans-serif",
              fontWeight: 800,
            }}
          >
            Early Alert System
          </h2>

          <p className="text-slate-500 text-sm">
            AI-detected students who need
            teacher attention or intervention.
          </p>

        </div>

        {/* ====================================================
            SUMMARY
        ==================================================== */}

        <div className="flex gap-2">

          <div className="px-4 py-2 bg-white border border-red-100 rounded-xl shadow-sm">

            <span className="text-red-500 mr-2">
              🚨
            </span>

            <span className="text-sm font-semibold text-red-600">
              {highCount}
            </span>

            <span className="text-xs text-slate-500 ml-1">
              High Priority
            </span>

          </div>

          <div className="px-4 py-2 bg-white border border-amber-100 rounded-xl shadow-sm">

            <span className="text-amber-500 mr-2">
              ⚠️
            </span>

            <span className="text-sm font-semibold text-amber-600">
              {mediumCount}
            </span>

            <span className="text-xs text-slate-500 ml-1">
              Medium
            </span>

          </div>

        </div>

      </div>

      {/* ======================================================
          AI INFORMATION CARD
      ====================================================== */}

      <div
        className="card p-5 mb-5"
        style={{
          borderLeft:
            "4px solid #4F46E5",
        }}
      >

        <div className="ai-chip mb-2">
          🤖 AI Early Alert Model
        </div>

        <p className="text-sm text-slate-700 leading-relaxed">
          Students are flagged based on available
          learning performance indicators such as
          assessment score, learning level,
          progress, weak areas, and recent activity.
          Teachers can review the student's details
          and provide targeted support.
        </p>

      </div>

      {/* ======================================================
          FILTERS
      ====================================================== */}

      <div className="flex items-center gap-2 mb-4">

        {[
          "All",
          "High",
          "Medium",
        ].map((item) => (

          <button
            key={item}
            onClick={() =>
              setFilter(item)
            }
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === item
                ? "bg-indigo-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300"
            }`}
          >
            {item === "All"
              ? `All (${students.length})`
              : item === "High"
              ? `High (${highCount})`
              : `Medium (${mediumCount})`}
          </button>

        ))}

      </div>

      {/* ======================================================
          EMPTY STATE
      ====================================================== */}

      {filteredStudents.length ===
      0 ? (

        <div className="card p-10 text-center">

          <div className="text-4xl mb-3">
            ✅
          </div>

          <h3 className="text-lg font-semibold text-slate-800">
            No Students in This Category
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            There are currently no students
            matching this risk category.
          </p>

        </div>

      ) : (

        /* ====================================================
           STUDENT ALERT CARDS
        ===================================================== */

        <div className="space-y-4">

          {filteredStudents.map(
            (student, index) => {

              const risk =
                student.risk ||
                "Medium";

              const level =
                student.level ||
                "Not Available";

              const score =
                student.latestAnalysis
                  ? Number(
                      student.score ||
                        0
                    )
                  : null;

              const progress =
                Number(
                  student.progress ||
                    0
                );

              const weakTopics =
                Array.isArray(
                  student.weakTopics
                )
                  ? student.weakTopics
                  : [];

              const riskStyle =
                riskColors[risk] ||
                riskColors.Medium;

              const levelStyle =
                levelColors[level] ||
                levelColors[
                  "Not Available"
                ];

              return (

                <div
                  key={
                    student.id ||
                    student.email ||
                    index
                  }
                  className="card overflow-hidden"
                  style={{
                    borderLeft: `4px solid ${riskStyle.border}`,
                  }}
                >

                  <div className="p-5">

                    {/* ========================================
                        TOP SECTION
                    ======================================== */}

                    <div className="flex items-start justify-between gap-5">

                      <div className="flex-1">

                        <div className="flex items-center gap-3 flex-wrap">

                          {/* Risk */}

                          <span
                            className="badge text-xs font-semibold"
                            style={{
                              background:
                                riskStyle.bg,
                              color:
                                riskStyle.color,
                            }}
                          >
                            {risk ===
                            "High"
                              ? "🚨 HIGH PRIORITY"
                              : "⚠️ MEDIUM PRIORITY"}
                          </span>

                          {/* Name */}

                          <h3 className="text-base font-bold text-slate-900">
                            {student.name ||
                              "Unknown Student"}
                          </h3>

                          {/* Level */}

                          <span
                            className="badge text-xs"
                            style={{
                              background:
                                levelStyle.bg,
                              color:
                                levelStyle.color,
                            }}
                          >
                            {level}
                          </span>

                          {/* Last Active */}

                          <span className="text-xs text-slate-400">
                            Last active:{" "}
                            {student.lastActive ||
                              "Never"}
                          </span>

                        </div>

                        {/* ======================================
                            EMAIL
                        ====================================== */}

                        <p className="text-xs text-slate-400 mt-2">
                          {student.email ||
                            ""}
                        </p>

                        {/* ======================================
                            PERFORMANCE SUMMARY
                        ====================================== */}

                        <div className="flex flex-wrap gap-6 mt-4">

                          <div>

                            <div className="text-xs text-slate-400">
                              Assessment
                            </div>

                            <div
                              className="text-lg font-bold"
                              style={{
                                color:
                                  getScoreColor(
                                    score
                                  ),
                              }}
                            >
                              {score ===
                              null
                                ? "—"
                                : `${score}%`}
                            </div>

                          </div>

                          <div>

                            <div className="text-xs text-slate-400">
                              Progress
                            </div>

                            <div className="text-lg font-bold text-indigo-600">
                              {progress}%
                            </div>

                          </div>

                          <div>

                            <div className="text-xs text-slate-400">
                              Risk
                            </div>

                            <div
                              className="text-lg font-bold"
                              style={{
                                color:
                                  riskStyle.color,
                              }}
                            >
                              {risk}
                            </div>

                          </div>

                        </div>

                        {/* ======================================
                            WEAK AREAS
                        ====================================== */}

                        <div className="mt-4">

                          <div className="text-xs font-semibold text-slate-500 mb-2">
                            Weak Areas
                          </div>

                          <div className="flex flex-wrap gap-1.5">

                            {weakTopics.length >
                            0 ? (

                              weakTopics
                                .slice(
                                  0,
                                  4
                                )
                                .map(
                                  (
                                    topic,
                                    topicIndex
                                  ) => (

                                    <span
                                      key={`${topic}-${topicIndex}`}
                                      className="badge bg-red-50 text-red-600 text-xs"
                                    >
                                      {topic}
                                    </span>

                                  )
                                )

                            ) : (

                              <span className="text-xs text-slate-400">
                                No specific weak area available
                              </span>

                            )}

                          </div>

                        </div>

                        {/* ======================================
                            AI RECOMMENDATION
                        ====================================== */}

                        <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg">

                          <div className="text-xs font-semibold text-indigo-700 mb-1">
                            🤖 AI Recommendation
                          </div>

                          <p className="text-sm text-slate-700">
                            {getRecommendation(
                              student
                            )}
                          </p>

                        </div>

                      </div>

                      {/* ========================================
                          ACTIONS
                      ======================================== */}

                      <div className="flex flex-col gap-2 w-32 flex-shrink-0">

                        <button
                          onClick={() =>
                            handleViewStudent(
                              student
                            )
                          }
                          className="btn-secondary text-xs py-2 px-3"
                        >
                          View Student
                        </button>

                        <button
                          onClick={() =>
                            handleMessage(
                              student
                            )
                          }
                          className="btn-secondary text-xs py-2 px-3"
                        >
                          💬 Message
                        </button>

                        <button
                          onClick={() =>
                            handleIntervention(
                              student
                            )
                          }
                          className="btn-primary text-xs py-2 px-3"
                        >
                          🤝 Intervene
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              );
            }
          )}

        </div>

      )}

    </div>
  );
}