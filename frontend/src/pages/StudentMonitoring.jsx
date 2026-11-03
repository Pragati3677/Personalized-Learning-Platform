import { useEffect, useState } from "react";

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
// STUDENT MONITORING
// ============================================================

export default function StudentMonitoring({ onNav }) {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================================
  // FETCH STUDENTS
  // ==========================================================

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
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
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to load students."
        );
      }

      setStudents(
        Array.isArray(data.students)
          ? data.students
          : []
      );
    } catch (err) {
      console.error(
        "Student monitoring error:",
        err
      );

      setError(
        err.message ||
          "Unable to load student data."
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
      : filter === "At Risk"
      ? students.filter(
          (student) =>
            student.risk === "High" ||
            student.risk === "Medium"
        )
      : students.filter(
          (student) =>
            student.level === filter
        );

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
  // LAST ACTIVE COLOR
  // ==========================================================

  const getLastActiveColor = (
    lastActive
  ) => {
    if (
      !lastActive ||
      lastActive === "Never"
    ) {
      return "text-slate-400";
    }

    if (
      lastActive === "Today" ||
      lastActive === "Just now" ||
      lastActive.includes("min ago") ||
      lastActive.includes("hour ago") ||
      lastActive.includes("hours ago")
    ) {
      return "text-emerald-600";
    }

    if (
      lastActive.includes("days ago")
    ) {
      return "text-red-500";
    }

    return "text-slate-500";
  };

  // ==========================================================
  // VIEW STUDENT
  // ==========================================================

  const handleViewStudent = (student) => {
    if (!student?.id) {
      console.error(
        "Student ID is missing:",
        student
      );

      return;
    }

    console.log(
      "Selected student:",
      student.name,
      student.id
    );

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
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="p-6">
        <div className="min-h-[500px] flex items-center justify-center">
          <div className="text-center">

            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />

            <p className="text-sm text-slate-500">
              Loading student data...
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
            Unable to Load Students
          </h3>

          <p className="text-sm text-red-500 mb-5">
            {error}
          </p>

          <button
            onClick={fetchStudents}
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
            Student Monitoring
          </h2>

          <p className="text-slate-500 text-sm">
            {students.length} students ·
            Real-time performance monitoring
          </p>
        </div>

        {/* ====================================================
            FILTERS
        ==================================================== */}

        <div className="flex gap-2 flex-wrap justify-end">

          {[
            "All",
            "Advanced",
            "Average",
            "Slow",
            "At Risk",
          ].map((item) => (
            <button
              key={item}
              onClick={() =>
                setFilter(item)
              }
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === item
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300"
              }`}
            >
              {item}
            </button>
          ))}

        </div>
      </div>

      {/* ======================================================
          TABLE
      ====================================================== */}

      <div className="card overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1200px]">

            {/* ==================================================
                HEADER
            ================================================== */}

            <thead>

              <tr className="border-b border-slate-200 bg-slate-50">

                {[
                  "Student",
                  "Level",
                  "Prerequisite",
                  "Score",
                  "Progress",
                  "Weak Topics",
                  "Last Active",
                  "Risk",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide"
                  >
                    {heading}
                  </th>
                ))}

              </tr>

            </thead>

            {/* ==================================================
                BODY
            ================================================== */}

            <tbody>

              {filteredStudents.length === 0 ? (
                <tr>

                  <td
                    colSpan="9"
                    className="px-4 py-12 text-center"
                  >

                    <div className="text-3xl mb-2">
                      📋
                    </div>

                    <p className="text-sm font-medium text-slate-700">
                      No students found
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      No students match the selected filter.
                    </p>

                  </td>

                </tr>
              ) : (
                filteredStudents.map(
                  (student, index) => {

                    const level =
                      student.level ||
                      "Not Available";

                    const risk =
                      student.risk ||
                      "None";

                    const levelStyle =
                      levelColors[level] ||
                      levelColors[
                        "Not Available"
                      ];

                    const riskStyle =
                      riskColors[risk] ||
                      riskColors.None;

                    const prerequisite =
                      student.prerequisite;

                    const prerequisiteStatus =
                      prerequisite?.status ||
                      "not_attempted";

                    const weakTopics =
                      Array.isArray(
                        student.weakTopics
                      )
                        ? student.weakTopics
                        : [];

                    const score =
                      student.latestAnalysis
                        ? Number(
                            student.score || 0
                          )
                        : null;

                    const progress =
                      Number(
                        student.progress || 0
                      );

                    return (
                      <tr
                        key={
                          student.id ||
                          student.email ||
                          index
                        }
                        className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                          index % 2 !== 0
                            ? "bg-slate-25"
                            : ""
                        }`}
                      >

                        {/* ==================================
                            STUDENT
                        ================================== */}

                        <td className="px-4 py-3">

                          <div className="flex items-center gap-2.5">

                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm flex-shrink-0">
                              {student.name
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "S"}
                            </div>

                            <div>

                              <div className="font-medium text-slate-800 text-sm">
                                {student.name ||
                                  "Unknown Student"}
                              </div>

                              <div className="text-[11px] text-slate-400 mt-0.5">
                                {student.email ||
                                  ""}
                              </div>

                            </div>

                          </div>

                        </td>

                        {/* ==================================
                            LEVEL
                        ================================== */}

                        <td className="px-4 py-3">

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

                        </td>

                        {/* ==================================
                            PREREQUISITE
                        ================================== */}

                        <td className="px-4 py-3">

                          {prerequisiteStatus ===
                          "not_attempted" ? (

                            <span className="badge text-xs bg-slate-100 text-slate-500">
                              Not Attempted
                            </span>

                          ) : (

                            <div className="flex flex-col gap-1">

                              <div className="flex items-center gap-2">

                                <span
                                  className="font-semibold text-sm"
                                  style={{
                                    color:
                                      getScoreColor(
                                        prerequisite?.percentage
                                      ),
                                  }}
                                >
                                  {
                                    prerequisite?.score
                                  }
                                  /
                                  {
                                    prerequisite?.totalMarks
                                  }
                                </span>

                                <span className="text-xs text-slate-500">
                                  (
                                  {
                                    prerequisite?.percentage
                                  }
                                  %)
                                </span>

                              </div>

                              <span
                                className={`badge text-xs w-fit ${
                                  prerequisiteStatus ===
                                  "passed"
                                    ? "bg-emerald-50 text-emerald-600"
                                    : "bg-red-50 text-red-600"
                                }`}
                              >
                                {prerequisiteStatus ===
                                "passed"
                                  ? "Passed"
                                  : "Failed"}
                              </span>

                            </div>

                          )}

                        </td>

                        {/* ==================================
                            SCORE
                        ================================== */}

                        <td className="px-4 py-3">

                          {score === null ? (
                            <span className="text-sm text-slate-400">
                              —
                            </span>
                          ) : (
                            <span
                              className="font-semibold text-sm"
                              style={{
                                color:
                                  getScoreColor(
                                    score
                                  ),
                              }}
                            >
                              {score}%
                            </span>
                          )}

                        </td>

                        {/* ==================================
                            PROGRESS
                        ================================== */}

                        <td className="px-4 py-3">

                          <div className="flex items-center gap-2">

                            <div
                              className="w-20 progress-bar"
                              style={{
                                height: 5,
                              }}
                            >
                              <div
                                className="progress-fill"
                                style={{
                                  width: `${Math.min(
                                    Math.max(
                                      progress,
                                      0
                                    ),
                                    100
                                  )}%`,
                                }}
                              />
                            </div>

                            <span className="text-xs text-slate-500">
                              {progress}%
                            </span>

                          </div>

                        </td>

                        {/* ==================================
                            WEAK TOPICS
                        ================================== */}

                        <td className="px-4 py-3">

                          <div className="flex flex-wrap gap-1 max-w-40">

                            {weakTopics
                              .slice(0, 2)
                              .map(
                                (
                                  weakness,
                                  weaknessIndex
                                ) => (
                                  <span
                                    key={`${weakness}-${weaknessIndex}`}
                                    className="badge bg-red-50 text-red-600 text-xs"
                                  >
                                    {weakness}
                                  </span>
                                )
                              )}

                            {weakTopics.length >
                              2 && (
                              <span className="badge bg-slate-100 text-slate-500 text-xs">
                                +
                                {weakTopics.length -
                                  2}
                              </span>
                            )}

                            {weakTopics.length ===
                              0 && (
                              <span className="text-xs text-slate-400">
                                None
                              </span>
                            )}

                          </div>

                        </td>

                        {/* ==================================
                            LAST ACTIVE
                        ================================== */}

                        <td className="px-4 py-3">

                          <span
                            className={`text-xs ${getLastActiveColor(
                              student.lastActive
                            )}`}
                          >
                            {student.lastActive ||
                              "Never"}
                          </span>

                        </td>

                        {/* ==================================
                            RISK
                        ================================== */}

                        <td className="px-4 py-3">

                          <span
                            className="badge text-xs"
                            style={{
                              background:
                                riskStyle.bg,
                              color:
                                riskStyle.color,
                            }}
                          >
                            {risk}
                          </span>

                        </td>

                        {/* ==================================
                            ACTION
                        ================================== */}

                        <td className="px-4 py-3">

                          <button
                            onClick={() =>
                              handleViewStudent(
                                student
                              )
                            }
                            className="btn-secondary text-xs py-1 px-3"
                          >
                            View
                          </button>

                        </td>

                      </tr>
                    );
                  }
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}