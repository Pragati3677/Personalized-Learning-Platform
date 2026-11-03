import { useEffect, useMemo, useState } from "react";
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

const reportTypes = [
  "Class Performance",
  "Individual Student",
  "Subject Report",
  "Quiz Performance",
  "At-Risk Students",
];

export default function TeacherReports() {
  const [type, setType] =
    useState("Class Performance");

  const [students, setStudents] = useState([]);

  const [summary, setSummary] = useState({
    totalStudents: 0,
    classAverage: 0,
    needSupport: 0,
    completionRate: 0,
  });

  const [performanceDistribution, setPerformanceDistribution] =
    useState({
      advanced: 0,
      average: 0,
      slow: 0,
      notAvailable: 0,
    });

  const [selectedStudentId, setSelectedStudentId] =
    useState("");

  const [includeCharts, setIncludeCharts] =
    useState(true);

  const [includeAI, setIncludeAI] =
    useState(true);

  const [generated, setGenerated] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =====================================================
     LOAD REAL TEACHER DATA
  ===================================================== */

  useEffect(() => {
    fetchTeacherReportData();
  }, []);

  const fetchTeacherReportData = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        sessionStorage.getItem("token") ||
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Teacher authentication token not found."
        );
      }

      const response = await fetch(
        `${API_URL}/teacher/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to load teacher report data."
        );
      }

      setStudents(data.students || []);

      setSummary(
        data.summary || {
          totalStudents: 0,
          classAverage: 0,
          needSupport: 0,
          completionRate: 0,
        }
      );

      setPerformanceDistribution(
        data.performanceDistribution || {
          advanced: 0,
          average: 0,
          slow: 0,
          notAvailable: 0,
        }
      );

      if (
        data.students &&
        data.students.length > 0
      ) {
        setSelectedStudentId(
          data.students[0].id
        );
      }
    } catch (err) {
      console.error(
        "Teacher reports error:",
        err
      );

      setError(
        err.message ||
          "Unable to load report data."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     REAL CALCULATIONS
  ===================================================== */

  const studentsWithScores = useMemo(() => {
    return students.filter(
      (student) =>
        typeof student.score === "number"
    );
  }, [students]);

  const passRate = useMemo(() => {
    if (studentsWithScores.length === 0) {
      return 0;
    }

    const passed =
      studentsWithScores.filter(
        (student) => student.score >= 40
      ).length;

    return Math.round(
      (passed /
        studentsWithScores.length) *
        100
    );
  }, [studentsWithScores]);

  const highRiskCount = useMemo(() => {
    return students.filter(
      (student) => student.risk === "High"
    ).length;
  }, [students]);

  const mediumRiskCount = useMemo(() => {
    return students.filter(
      (student) => student.risk === "Medium"
    ).length;
  }, [students]);

  const atRiskStudents = useMemo(() => {
    return students.filter(
      (student) =>
        student.risk === "High" ||
        student.risk === "Medium"
    );
  }, [students]);

  /* =====================================================
     STUDENT PERFORMANCE CHART
  ===================================================== */

  const studentScoreData = useMemo(() => {
    return studentsWithScores
      .slice(0, 12)
      .map((student) => ({
        name:
          student.name.length > 12
            ? student.name.substring(0, 12) +
              "..."
            : student.name,
        score: Number(student.score || 0),
      }));
  }, [studentsWithScores]);

  /* =====================================================
     LEVEL DISTRIBUTION
  ===================================================== */

  const performanceData = [
    {
      level: "Advanced",
      students:
        performanceDistribution.advanced ||
        0,
    },
    {
      level: "Average",
      students:
        performanceDistribution.average ||
        0,
    },
    {
      level: "Slow",
      students:
        performanceDistribution.slow ||
        0,
    },
    {
      level: "Not Available",
      students:
        performanceDistribution.notAvailable ||
        0,
    },
  ];

  /* =====================================================
     SELECTED STUDENT
  ===================================================== */

  const selectedStudent = useMemo(() => {
    return students.find(
      (student) =>
        student.id === selectedStudentId
    );
  }, [students, selectedStudentId]);

  /* =====================================================
     REAL STRENGTHS
  ===================================================== */

  const classStrengths = useMemo(() => {
    return studentsWithScores
      .filter(
        (student) =>
          student.score >= 70
      )
      .sort(
        (a, b) =>
          b.score - a.score
      )
      .slice(0, 5);
  }, [studentsWithScores]);

  /* =====================================================
     REAL WEAK AREAS
  ===================================================== */

  const classWeakAreas = useMemo(() => {
    return students
      .filter(
        (student) =>
          student.weakTopics &&
          student.weakTopics.length > 0
      )
      .slice(0, 5);
  }, [students]);

  /* =====================================================
     GENERATE REPORT
  ===================================================== */

  const handleGenerateReport = () => {
    if (
      type === "Individual Student" &&
      !selectedStudentId
    ) {
      alert(
        "Please select a student first."
      );
      return;
    }

    setGenerated(true);
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="p-6">
        <div className="card p-10 text-center">
          <div className="text-3xl mb-3">
            📊
          </div>

          <h3 className="text-lg font-bold text-slate-800">
            Loading Reports
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Fetching real student performance data...
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <div className="p-6">
        <div className="card p-8 text-center">
          <div className="text-4xl mb-3">
            ⚠️
          </div>

          <h3 className="text-lg font-bold text-slate-800">
            Unable to Load Reports
          </h3>

          <p className="text-sm text-red-500 mt-2">
            {error}
          </p>

          <button
            onClick={fetchTeacherReportData}
            className="btn-primary mt-5"
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div>
        <h2
          className="text-xl font-800 text-indigo-950"
          style={{
            fontFamily:
              "'DM Sans',sans-serif",
            fontWeight: 800,
          }}
        >
          Report Generation
        </h2>

        <p className="text-slate-500 text-sm">
          Generate detailed reports using
          real student learning and
          performance data.
        </p>
      </div>

      {/* =================================================
          REPORT BUILDER
      ================================================= */}

      <div className="card p-5">

        <h3
          className="font-700 text-slate-900 mb-5"
          style={{
            fontFamily:
              "'DM Sans',sans-serif",
            fontWeight: 700,
          }}
        >
          Configure Report
        </h3>

        <div className="grid md:grid-cols-2 gap-5">

          {/* REPORT TYPE */}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Report Type
            </label>

            <div className="space-y-2">
              {reportTypes.map((report) => (
                <label
                  key={report}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    type === report
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-slate-200 hover:border-indigo-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="report"
                    value={report}
                    checked={
                      type === report
                    }
                    onChange={() => {
                      setType(report);
                      setGenerated(false);
                    }}
                    className="accent-indigo-600"
                  />

                  <span className="text-sm font-medium text-slate-700">
                    {report}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* OPTIONS */}

          <div className="space-y-4">

            {/* DATE RANGE */}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Report Period
              </label>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />

                <input
                  type="date"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>

            {/* SUBJECT */}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Subject
              </label>

              <select className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                <option>
                  Java Programming
                </option>
              </select>

              <p className="text-xs text-slate-400 mt-1">
                Current platform learning data
                is based on the Java curriculum.
              </p>
            </div>

            {/* INDIVIDUAL STUDENT */}

            {type ===
              "Individual Student" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Student
                </label>

                <select
                  value={
                    selectedStudentId
                  }
                  onChange={(e) =>
                    setSelectedStudentId(
                      e.target.value
                    )
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  {students.map(
                    (student) => (
                      <option
                        key={student.id}
                        value={student.id}
                      >
                        {student.name}
                      </option>
                    )
                  )}
                </select>
              </div>
            )}

            {/* CHECKBOXES */}

            <div className="flex flex-wrap gap-4">

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCharts}
                  onChange={(e) =>
                    setIncludeCharts(
                      e.target.checked
                    )
                  }
                  className="accent-indigo-600"
                />

                Include Charts
              </label>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeAI}
                  onChange={(e) =>
                    setIncludeAI(
                      e.target.checked
                    )
                  }
                  className="accent-indigo-600"
                />

                AI Insights
              </label>

            </div>

            {/* GENERATE */}

            <button
              onClick={
                handleGenerateReport
              }
              className="btn-primary w-full justify-center py-2.5"
            >
              📊 Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* =================================================
          REPORT PREVIEW
      ================================================= */}

      {generated && (
        <div className="card p-6 slide-up">

          {/* REPORT HEADER */}

          <div className="flex items-center justify-between mb-5">

            <div>
              <h3
                className="font-800 text-slate-900 text-lg"
                style={{
                  fontFamily:
                    "'DM Sans',sans-serif",
                  fontWeight: 800,
                }}
              >
                {type} Report
              </h3>

              <p className="text-slate-500 text-sm">
                Real-time data from the
                LearnAI student database.
              </p>
            </div>

            <button
              onClick={() =>
                alert(
                  "PDF export can be connected next."
                )
              }
              className="btn-secondary text-sm py-2 px-4"
            >
              📥 Download PDF
            </button>

          </div>

          {/* =================================================
              INDIVIDUAL STUDENT HEADER
          ================================================= */}

          {type ===
            "Individual Student" &&
            selectedStudent && (
              <div className="mb-5 p-4 rounded-xl bg-indigo-50 border border-indigo-100">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                    {selectedStudent.name
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <div className="font-semibold text-slate-800">
                      {selectedStudent.name}
                    </div>

                    <div className="text-xs text-slate-500">
                      {selectedStudent.email}
                    </div>
                  </div>

                </div>

              </div>
            )}

          {/* =================================================
              SUMMARY
          ================================================= */}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">

            <ReportStat
              label="Total Students"
              value={
                summary.totalStudents
              }
            />

            <ReportStat
              label="Class Average"
              value={`${Math.round(
                summary.classAverage || 0
              )}%`}
            />

            <ReportStat
              label="Pass Rate"
              value={`${passRate}%`}
            />

            <ReportStat
              label="Need Support"
              value={
                summary.needSupport || 0
              }
            />

          </div>

          {/* =================================================
              INDIVIDUAL STUDENT SUMMARY
          ================================================= */}

          {type ===
            "Individual Student" &&
            selectedStudent && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">

                <ReportStat
                  label="Assessment Score"
                  value={
                    typeof selectedStudent.score ===
                    "number"
                      ? `${selectedStudent.score}%`
                      : "N/A"
                  }
                />

                <ReportStat
                  label="Learning Level"
                  value={
                    selectedStudent.level ||
                    "Not Available"
                  }
                />

                <ReportStat
                  label="Progress"
                  value={`${selectedStudent.progress || 0}%`}
                />

                <ReportStat
                  label="Risk"
                  value={
                    selectedStudent.risk ||
                    "Not Available"
                  }
                />

              </div>
            )}

          {/* =================================================
              CHARTS
          ================================================= */}

          {includeCharts && (
            <div className="grid lg:grid-cols-2 gap-5 mb-5">

              {/* LEVEL DISTRIBUTION */}

              <div>
                <h4 className="font-semibold text-slate-800 mb-3">
                  Learning Level Distribution
                </h4>

                <ResponsiveContainer
                  width="100%"
                  height={220}
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
                      dataKey="level"
                      tick={{
                        fontSize: 10,
                        fill: "#94A3B8",
                      }}
                    />

                    <YAxis
                      allowDecimals={false}
                      tick={{
                        fontSize: 10,
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
              </div>

              {/* STUDENT SCORES */}

              <div>
                <h4 className="font-semibold text-slate-800 mb-3">
                  Student Assessment Scores
                </h4>

                {studentScoreData.length >
                0 ? (
                  <ResponsiveContainer
                    width="100%"
                    height={220}
                  >
                    <BarChart
                      data={
                        studentScoreData
                      }
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
                        domain={[
                          0,
                          100,
                        ]}
                        tick={{
                          fontSize: 10,
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
                        fill="#6366F1"
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
                  <div className="h-[220px] flex items-center justify-center text-sm text-slate-400">
                    No assessment scores
                    available.
                  </div>
                )}
              </div>

            </div>
          )}

          {/* =================================================
              STUDENT TABLE
          ================================================= */}

          {type ===
            "Class Performance" && (
            <div className="mb-5">

              <h4 className="font-semibold text-slate-800 mb-3">
                Student Performance
              </h4>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">

                <table className="w-full">

                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">

                      {[
                        "Student",
                        "Level",
                        "Score",
                        "Progress",
                        "Risk",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase"
                        >
                          {heading}
                        </th>
                      ))}

                    </tr>
                  </thead>

                  <tbody>

                    {students.map(
                      (student) => (
                        <tr
                          key={student.id}
                          className="border-b border-slate-100 last:border-0"
                        >

                          <td className="px-4 py-3 text-sm font-medium text-slate-800">
                            {student.name}
                          </td>

                          <td className="px-4 py-3">
                            <span className="badge bg-indigo-50 text-indigo-600 text-xs">
                              {student.level ||
                                "Not Available"}
                            </span>
                          </td>

                          <td className="px-4 py-3 text-sm font-semibold">
                            {typeof student.score ===
                            "number"
                              ? `${student.score}%`
                              : "—"}
                          </td>

                          <td className="px-4 py-3 text-sm text-slate-600">
                            {student.progress ||
                              0}
                            %
                          </td>

                          <td className="px-4 py-3">

                            <span
                              className={`badge text-xs ${
                                student.risk ===
                                "High"
                                  ? "bg-red-50 text-red-600"
                                  : student.risk ===
                                    "Medium"
                                  ? "bg-amber-50 text-amber-600"
                                  : "bg-emerald-50 text-emerald-600"
                              }`}
                            >
                              {student.risk ||
                                "Low"}
                            </span>

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>
                </table>

              </div>

            </div>
          )}

          {/* =================================================
              CLASS STRENGTHS & WEAK AREAS
          ================================================= */}

          {type !==
            "Individual Student" && (
            <div className="grid grid-cols-2 gap-4 mb-5">

              {/* STRENGTHS */}

              <div>

                <div className="font-semibold text-slate-800 text-sm mb-2">
                  Class Strength Indicators
                </div>

                {classStrengths.length >
                0 ? (
                  classStrengths.map(
                    (student) => (
                      <div
                        key={student.id}
                        className="flex items-center gap-2 text-xs text-slate-600 py-1.5 border-b border-slate-100 last:border-0"
                      >
                        <span className="text-emerald-500">
                          ✓
                        </span>

                        <span>
                          {student.name}{" "}
                          ({student.score}%)
                        </span>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-xs text-slate-400">
                    No strength data
                    available.
                  </p>
                )}

              </div>

              {/* WEAK AREAS */}

              <div>

                <div className="font-semibold text-slate-800 text-sm mb-2">
                  Identified Weak Areas
                </div>

                {classWeakAreas.length >
                0 ? (
                  classWeakAreas.map(
                    (student) => (
                      <div
                        key={student.id}
                        className="flex items-start gap-2 text-xs text-slate-600 py-1.5 border-b border-slate-100 last:border-0"
                      >
                        <span className="text-red-400">
                          ⚠
                        </span>

                        <span>
                          <strong>
                            {student.name}:
                          </strong>{" "}
                          {student.weakTopics
                            ?.slice(0, 2)
                            .join(
                              ", "
                            )}
                        </span>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-xs text-slate-400">
                    No weak-area data
                    available.
                  </p>
                )}

              </div>

            </div>
          )}

          {/* =================================================
              AT-RISK REPORT
          ================================================= */}

          {type ===
            "At-Risk Students" && (
            <div className="mb-5">

              <h4 className="font-semibold text-slate-800 mb-3">
                Students Requiring Attention
              </h4>

              {atRiskStudents.length >
              0 ? (
                <div className="space-y-2">

                  {atRiskStudents.map(
                    (student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-slate-200"
                      >

                        <div>
                          <div className="text-sm font-semibold text-slate-800">
                            {student.name}
                          </div>

                          <div className="text-xs text-slate-500">
                            Score:{" "}
                            {typeof student.score ===
                            "number"
                              ? `${student.score}%`
                              : "N/A"}{" "}
                            · Progress:{" "}
                            {student.progress ||
                              0}
                            %
                          </div>
                        </div>

                        <span
                          className={`badge text-xs ${
                            student.risk ===
                            "High"
                              ? "bg-red-50 text-red-600"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {student.risk}
                        </span>

                      </div>
                    )
                  )}

                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  No at-risk students found.
                </p>
              )}

            </div>
          )}

          {/* =================================================
              AI INSIGHTS
          ================================================= */}

          {includeAI && (
            <div
              className="p-4 rounded-xl text-sm text-indigo-700"
              style={{
                background:
                  "#EEF2FF",
              }}
            >
              🤖{" "}
              <strong>
                AI Insight:
              </strong>{" "}

              {summary.needSupport > 0
                ? `The current class data identifies ${summary.needSupport} student${
                    summary.needSupport >
                    1
                      ? "s"
                      : ""
                  } requiring additional support. Teachers can review their assessment scores, learning levels, progress, and weak areas for targeted intervention.`
                : "Current assessment and progress data does not identify students requiring immediate additional support."}
            </div>
          )}

        </div>
      )}
    </div>
  );
}

/* =========================================================
   REPORT STAT COMPONENT
========================================================= */

function ReportStat({
  label,
  value,
}) {
  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">

      <div
        className="text-2xl font-black text-indigo-600"
        style={{
          fontFamily:
            "'DM Sans',sans-serif",
        }}
      >
        {value}
      </div>

      <div className="text-xs text-slate-500 mt-0.5">
        {label}
      </div>

    </div>
  );
}