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

export default function TeacherDashboard({ onNav }) {
  // ============================================================
  // STATE
  // ============================================================

  const [dashboardData, setDashboardData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ============================================================
  // FETCH TEACHER DASHBOARD DATA
  // ============================================================

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Teacher authentication token not found."
        );
      }

      const response = await fetch(
        `${API_URL}/teacher/dashboard`,
        {
          method: "GET",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to load teacher dashboard."
        );
      }

      setDashboardData(data);
    } catch (err) {
      console.error(
        "Teacher dashboard error:",
        err
      );

      setError(
        err.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="p-6">
        <div className="card p-8 text-center">
          <div className="text-3xl mb-3">
            ⏳
          </div>

          <p className="text-sm text-slate-500">
            Loading real student data...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <div className="p-6">
        <div className="card p-6 border border-red-200 bg-red-50">
          <h3 className="font-bold text-red-700 mb-2">
            Unable to load Teacher Dashboard
          </h3>

          <p className="text-sm text-red-600 mb-4">
            {error}
          </p>

          <button
            onClick={fetchDashboardData}
            className="btn-primary text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // DATA
  // ============================================================

  const summary =
    dashboardData?.summary || {};

  const students =
    dashboardData?.students || [];

  const atRiskStudents =
    dashboardData?.atRiskStudents || [];

  const performanceDistribution =
    dashboardData?.performanceDistribution || {};

  // ============================================================
  // SUMMARY VALUES
  // ============================================================

  const totalStudents =
    summary.totalStudents ?? 0;

  const classAverage =
    summary.classAverage ?? 0;

  const needSupport =
    summary.needSupport ?? 0;

  const completionRate =
    summary.completionRate ?? 0;

  // ============================================================
  // PERFORMANCE DISTRIBUTION
  // ============================================================

  const performanceData = [
    {
      level: "Advanced",
      students:
        performanceDistribution.advanced || 0,
    },
    {
      level: "Average",
      students:
        performanceDistribution.average || 0,
    },
    {
      level: "Slow",
      students:
        performanceDistribution.slow || 0,
    },
    {
      level: "Not Available",
      students:
        performanceDistribution.notAvailable ||
        0,
    },
  ];

  // ============================================================
  // STUDENT SCORE DATA
  // Only students who have assessment data
  // ============================================================

  const studentScoreData = students
    .filter(
      (student) =>
        student.latestAnalysis !== null
    )
    .map((student) => ({
      name:
        student.name.length > 12
          ? `${student.name.substring(
              0,
              12
            )}...`
          : student.name,

      score: Number(
        student.score || 0
      ),
    }));

  // ============================================================
  // GET AT-RISK ISSUE
  // ============================================================

  const getStudentIssue = (student) => {
    if (
      student.latestAnalysis
        ?.weaknesses?.length
    ) {
      return student.latestAnalysis
        .weaknesses[0];
    }

    if (
      student.lastActive === "Never"
    ) {
      return "No learning activity recorded";
    }

    if (student.progress < 20) {
      return "Low learning progress";
    }

    if (student.score < 50) {
      return "Low assessment performance";
    }

    return "Requires monitoring";
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="p-6 space-y-5">

      {/* ======================================================
          HEADER
      ======================================================= */}

      <div>
        <h2
          className="text-2xl font-800 text-indigo-950"
          style={{
            fontFamily:
              "'DM Sans',sans-serif",
            fontWeight: 800,
          }}
        >
          Good morning, Prof. Priya 👋
        </h2>

        <p className="text-slate-500 text-sm mt-1">
          Real-time overview of student
          learning progress and performance
        </p>
      </div>

      {/* ======================================================
          TOP STATS
      ======================================================= */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {/* TOTAL STUDENTS */}

        <div className="card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-2xl">
              👥
            </div>

            <div
              className="text-3xl font-black"
              style={{
                fontFamily:
                  "'DM Sans',sans-serif",
                color: "#4F46E5",
              }}
            >
              {totalStudents}
            </div>
          </div>

          <div className="text-xs text-slate-500">
            Total Students
          </div>
        </div>

        {/* CLASS AVERAGE */}

        <div className="card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-2xl">
              📊
            </div>

            <div
              className="text-3xl font-black"
              style={{
                fontFamily:
                  "'DM Sans',sans-serif",
                color: "#06B6D4",
              }}
            >
              {classAverage}%
            </div>
          </div>

          <div className="text-xs text-slate-500">
            Class Average
          </div>
        </div>

        {/* NEED SUPPORT */}

        <div className="card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-2xl">
              ⚠️
            </div>

            <div
              className="text-3xl font-black"
              style={{
                fontFamily:
                  "'DM Sans',sans-serif",
                color: "#EF4444",
              }}
            >
              {needSupport}
            </div>
          </div>

          <div className="text-xs text-slate-500">
            Need Support
          </div>
        </div>

        {/* COMPLETION RATE */}

        <div className="card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-2xl">
              ✅
            </div>

            <div
              className="text-3xl font-black"
              style={{
                fontFamily:
                  "'DM Sans',sans-serif",
                color: "#10B981",
              }}
            >
              {completionRate}%
            </div>
          </div>

          <div className="text-xs text-slate-500">
            Completion Rate
          </div>
        </div>
      </div>

      {/* ======================================================
          REAL PERFORMANCE CHARTS
      ======================================================= */}

      <div className="grid lg:grid-cols-2 gap-5">

        {/* PERFORMANCE DISTRIBUTION */}

        <div className="card p-5">

          <h3
            className="font-700 text-slate-900 mb-4"
            style={{
              fontFamily:
                "'DM Sans',sans-serif",
              fontWeight: 700,
            }}
          >
            Student Learning Level
          </h3>

          <ResponsiveContainer
            width="100%"
            height={220}
          >
            <BarChart
              data={performanceData}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F1F5F9"
              />

              <XAxis
                dataKey="level"
                tick={{
                  fontSize: 10,
                  fill: "#94A3B8",
                }}
              />

              <YAxis
                allowDecimals={false}
                tick={{
                  fontSize: 11,
                  fill: "#94A3B8",
                }}
              />

              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border:
                    "1px solid #E2E8F0",
                }}
              />

              <Bar
                dataKey="students"
                fill="#06B6D4"
                radius={[
                  4,
                  4,
                  0,
                  0,
                ]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* STUDENT SCORE OVERVIEW */}

        <div className="card p-5">

          <h3
            className="font-700 text-slate-900 mb-4"
            style={{
              fontFamily:
                "'DM Sans',sans-serif",
              fontWeight: 700,
            }}
          >
            Student Assessment Scores
          </h3>

          {studentScoreData.length ===
          0 ? (
            <div className="h-[220px] flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl mb-2">
                  📊
                </div>

                <p className="text-sm text-slate-500">
                  No assessment data
                  available yet.
                </p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer
              width="100%"
              height={220}
            >
              <BarChart
                data={studentScoreData}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#F1F5F9"
                />

                <XAxis
                  dataKey="name"
                  tick={{
                    fontSize: 9,
                    fill: "#94A3B8",
                  }}
                />

                <YAxis
                  domain={[0, 100]}
                  tick={{
                    fontSize: 11,
                    fill: "#94A3B8",
                  }}
                />

                <Tooltip
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
          )}
        </div>
      </div>

      {/* ======================================================
          AT-RISK STUDENTS
      ======================================================= */}

      <div className="card p-5">

        <div className="flex items-center justify-between mb-4">

          <h3
            className="font-700 text-slate-900"
            style={{
              fontFamily:
                "'DM Sans',sans-serif",
              fontWeight: 700,
            }}
          >
            ⚠️ At-Risk Students Requiring
            Attention
          </h3>

          <button
            onClick={() =>
              onNav("at-risk")
            }
            className="text-xs text-indigo-600 hover:underline"
          >
            View All
          </button>
        </div>

        {/* NO AT-RISK STUDENTS */}

        {atRiskStudents.length ===
        0 ? (
          <div className="text-center py-8">

            <div className="text-4xl mb-2">
              ✅
            </div>

            <p className="text-sm text-slate-500">
              No students currently
              require attention.
            </p>
          </div>
        ) : (
          <div className="space-y-3">

            {atRiskStudents
              .slice(0, 5)
              .map((student) => (

                <div
                  key={student.id}
                  className="flex items-center gap-4 p-3 rounded-xl border border-slate-200 hover:border-red-300 hover:bg-red-50/30 transition-all"
                >

                  {/* AVATAR */}

                  <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center font-bold text-red-600">
                    {student.name
                      ? student.name[0]
                        .toUpperCase()
                      : "S"}
                  </div>

                  {/* STUDENT INFORMATION */}

                  <div className="flex-1 min-w-0">

                    <div className="font-semibold text-slate-800 text-sm">
                      {student.name}
                    </div>

                    <div className="text-xs text-slate-500">
                      {getStudentIssue(
                        student
                      )}
                    </div>

                  </div>

                  {/* LEVEL */}

                  <span
                    className={`badge ${
                      student.level ===
                      "Slow"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {student.level}
                  </span>

                  {/* RISK */}

                  <span className="badge bg-red-100 text-red-700">
                    {student.risk} Risk
                  </span>

                  {/* SCORE */}

                  <span className="text-sm font-bold text-red-600">
                    {student.score}%
                  </span>

                  {/* VIEW */}

                  <button
                    onClick={() =>
                      onNav(
                        "student-detail"
                      )
                    }
                    className="btn-secondary text-xs py-1.5 px-3"
                  >
                    View
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* ======================================================
          QUICK ACTIONS
      ======================================================= */}

      <div className="grid md:grid-cols-4 gap-3">

        <button
          onClick={() =>
            onNav(
              "student-monitoring"
            )
          }
          className="card p-4 text-center hover:shadow-md hover:border-indigo-300 transition-all"
        >
          <div className="text-3xl mb-2">
            👥
          </div>

          <div className="text-sm font-semibold text-slate-700">
            View All Students
          </div>
        </button>

        <button
          onClick={() =>
            onNav("teacher-reports")
          }
          className="card p-4 text-center hover:shadow-md hover:border-indigo-300 transition-all"
        >
          <div className="text-3xl mb-2">
            📋
          </div>

          <div className="text-sm font-semibold text-slate-700">
            Generate Report
          </div>
        </button>

        <button
          onClick={() =>
            onNav(
              "teacher-notifications"
            )
          }
          className="card p-4 text-center hover:shadow-md hover:border-indigo-300 transition-all"
        >
          <div className="text-3xl mb-2">
            🔔
          </div>

          <div className="text-sm font-semibold text-slate-700">
            Send Notification
          </div>
        </button>

        <button
          onClick={() =>
            onNav("at-risk")
          }
          className="card p-4 text-center hover:shadow-md hover:border-indigo-300 transition-all"
        >
          <div className="text-3xl mb-2">
            ⚠️
          </div>

          <div className="text-sm font-semibold text-slate-700">
            At-Risk Alerts
          </div>
        </button>

      </div>
    </div>
  );
}