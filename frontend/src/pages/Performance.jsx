import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API_URL = "http://localhost:5000/api";

export default function Performance() {
  const [analyses, setAnalyses] = useState([]);
  const [latestAnalysis, setLatestAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creatingAnalysis, setCreatingAnalysis] = useState(false);
  const [error, setError] = useState("");

  // ======================================================
  // GET TOKEN
  // ======================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ======================================================
  // FETCH MY ANALYSIS
  // ======================================================

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError("Please login again.");
        return;
      }

      const response = await fetch(
        `${API_URL}/evaluation-analysis/my-analysis`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch analysis.");
      }

      const analysisList = data.analysis || [];

      setAnalyses(analysisList);

      if (analysisList.length > 0) {
        setLatestAnalysis(analysisList[0]);
      }
    } catch (err) {
      console.error("Fetch analysis error:", err);
      setError(err.message || "Unable to load performance data.");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // CREATE ANALYSIS FOR LATEST COMPLETED ATTEMPT
  // ======================================================

  const createLatestAnalysis = async () => {
    try {
      setCreatingAnalysis(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError("Please login again.");
        return;
      }

      /*
       * We need an EngagementAttempt ID here.
       *
       * The Performance page should not invent an attempt ID.
       * Therefore, if there is already an analysis, we simply
       * display it.
       *
       * New analysis creation should normally happen immediately
       * after completing the Smart Engagement Evaluation.
       */
      await fetchAnalysis();
    } catch (err) {
      console.error("Create analysis error:", err);
      setError(err.message || "Unable to create analysis.");
    } finally {
      setCreatingAnalysis(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, []);

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-4xl mb-3">📊</div>
          <div className="font-semibold text-slate-700">
            Loading your performance...
          </div>
          <div className="text-sm text-slate-400 mt-1">
            Fetching your AI learning analysis
          </div>
        </div>
      </div>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (error) {
    return (
      <div className="p-6">
        <div className="card p-6 text-center">
          <div className="text-4xl mb-3">⚠️</div>

          <h3
            className="text-lg font-bold text-slate-800 mb-2"
            style={{ fontFamily: "'DM Sans',sans-serif" }}
          >
            Unable to Load Performance
          </h3>

          <p className="text-sm text-slate-500 mb-4">{error}</p>

          <button
            onClick={fetchAnalysis}
            className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ======================================================
  // NO ANALYSIS
  // ======================================================

  if (!latestAnalysis) {
    return (
      <div className="p-6">
        <div className="card p-8 text-center">
          <div className="text-5xl mb-4">📊</div>

          <h2
            className="text-xl font-bold text-slate-800 mb-2"
            style={{ fontFamily: "'DM Sans',sans-serif" }}
          >
            No Performance Analysis Yet
          </h2>

          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Complete the Smart Engagement Evaluation to generate your AI-powered
            learning performance analysis.
          </p>

          <button
            onClick={createLatestAnalysis}
            disabled={creatingAnalysis}
            className="mt-5 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50"
          >
            {creatingAnalysis ? "Checking..." : "Refresh Analysis"}
          </button>
        </div>
      </div>
    );
  }

  // ======================================================
  // REAL DATA
  // ======================================================

  const score = Number(latestAnalysis.percentage || 0);

  const performanceLevel =
    latestAnalysis.performanceLevel || "average";

  const level =
    performanceLevel.toLowerCase() === "advanced"
      ? "Advanced Learner"
      : performanceLevel.toLowerCase() === "slow"
      ? "Slow Learner"
      : "Average Learner";

  const correctAnswers = latestAnalysis.correctAnswers || 0;
  const wrongAnswers = latestAnalysis.wrongAnswers || 0;
  const totalQuestions = latestAnalysis.totalQuestions || 0;
  const timeSpent = latestAnalysis.timeSpentMinutes || 0;

  // ======================================================
  // HISTORY DATA
  // ======================================================

  const quizHistory = [...analyses]
    .reverse()
    .map((item, index) => ({
      date: item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          })
        : `Test ${index + 1}`,
      score: Number(item.percentage || 0),
    }));

  // ======================================================
  // TOPIC PERFORMANCE
  // ======================================================

  const topicScores = analyses
    .filter((item) => item.topicId)
    .map((item) => ({
      topic:
        typeof item.topicId === "object"
          ? item.topicId.title || "Topic"
          : "Topic",
      score: Number(item.percentage || 0),
    }))
    .slice(0, 8);

  // ======================================================
  // CLASSIFICATION FACTORS
  // ======================================================

  const classificationFactors = [
    {
      factor: "Evaluation Performance",
      value: `${score}%`,
      impact: score >= 80 ? "High" : score >= 50 ? "Medium" : "Negative",
      icon: "🧠",
    },
    {
      factor: "Correct Answers",
      value: `${correctAnswers}/${totalQuestions}`,
      impact:
        correctAnswers > wrongAnswers
          ? "Positive"
          : "Negative",
      icon: "✅",
    },
    {
      factor: "Incorrect Answers",
      value: `${wrongAnswers}/${totalQuestions}`,
      impact:
        wrongAnswers > correctAnswers
          ? "Negative"
          : "Positive",
      icon: "❌",
    },
    {
      factor: "Time Spent",
      value: `${timeSpent} min`,
      impact: timeSpent <= 5 ? "Positive" : "Medium",
      icon: "⏱️",
    },
    {
      factor: "AI Classification",
      value: level,
      impact:
        performanceLevel === "advanced"
          ? "High"
          : performanceLevel === "slow"
          ? "Negative"
          : "Medium",
      icon: "🤖",
    },
  ];

  // ======================================================
  // STRENGTHS / WEAKNESSES
  // ======================================================

  const strengths = latestAnalysis.strengths || [];
  const weaknesses = latestAnalysis.weaknesses || [];

  return (
    <div className="p-6 space-y-6">

      {/* ==================================================
          STATS ROW
      ================================================== */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <div className="card p-4 text-center">
          <div
            className="text-3xl font-black mb-1"
            style={{
              fontFamily: "'DM Sans',sans-serif",
              color: "#4F46E5",
            }}
          >
            {score}
            <span className="text-base font-normal">/100</span>
          </div>

          <div className="text-xs text-slate-500">
            Overall Score
          </div>
        </div>

        <div className="card p-4 text-center">
          <div
            className="text-3xl font-black mb-1"
            style={{
              fontFamily: "'DM Sans',sans-serif",
              color: "#06B6D4",
            }}
          >
            {correctAnswers}
          </div>

          <div className="text-xs text-slate-500">
            Correct Answers
          </div>
        </div>

        <div className="card p-4 text-center">
          <div
            className="text-3xl font-black mb-1"
            style={{
              fontFamily: "'DM Sans',sans-serif",
              color: "#10B981",
            }}
          >
            {totalQuestions}
          </div>

          <div className="text-xs text-slate-500">
            Total Questions
          </div>
        </div>

        <div className="card p-4 text-center">
          <div
            className="text-3xl font-black mb-1"
            style={{
              fontFamily: "'DM Sans',sans-serif",
              color: "#F59E0B",
            }}
          >
            {timeSpent}
            <span className="text-base font-normal"> min</span>
          </div>

          <div className="text-xs text-slate-500">
            Time Spent
          </div>
        </div>

      </div>

      {/* ==================================================
          AI CLASSIFICATION
      ================================================== */}

      <div className="card p-5">

        <div className="flex items-center gap-3 mb-5">
          <div className="ai-chip">
            🤖 Random Forest AI Classification
          </div>

          <h3
            className="text-slate-900"
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontWeight: 700,
            }}
          >
            Your Current Learning Level
          </h3>
        </div>

        <div className="flex gap-3 mb-5">

          {[
            {
              label: "Slow Learner",
              range: "Slow",
              value: "slow",
            },
            {
              label: "Average Learner",
              range: "Average",
              value: "average",
            },
            {
              label: "Advanced Learner",
              range: "Advanced",
              value: "advanced",
            },
          ].map((item) => {

            const active =
              performanceLevel.toLowerCase() === item.value;

            return (
              <div
                key={item.value}
                className={`flex-1 p-4 rounded-xl border-2 text-center transition-all ${
                  active
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-slate-200 bg-slate-50 opacity-50"
                }`}
              >

                {active && (
                  <div className="text-xs text-indigo-600 font-semibold mb-1">
                    ← YOU ARE HERE
                  </div>
                )}

                <div
                  className={`text-base font-bold ${
                    active
                      ? "text-indigo-900"
                      : "text-slate-500"
                  }`}
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  {item.label}
                </div>

                <div
                  className={`text-xs mt-0.5 ${
                    active
                      ? "text-indigo-600"
                      : "text-slate-400"
                  }`}
                >
                  {item.range}
                </div>

              </div>
            );
          })}

        </div>

        {/* Classification Factors */}

        <div className="bg-slate-50 rounded-xl p-4">

          <div className="font-semibold text-slate-800 text-sm mb-3">
            🔍 Why was I classified this way?
          </div>

          <div className="grid md:grid-cols-5 gap-3">

            {classificationFactors.map((factor) => (
              <div
                key={factor.factor}
                className="text-center p-3 bg-white rounded-lg border border-slate-200"
              >

                <div className="text-2xl mb-1">
                  {factor.icon}
                </div>

                <div className="text-xs font-semibold text-slate-700">
                  {factor.factor}
                </div>

                <div className="text-xs text-slate-500 mt-0.5">
                  {factor.value}
                </div>

                <div
                  className={`badge text-xs mt-1 ${
                    factor.impact === "Positive" ||
                    factor.impact === "High"
                      ? "bg-emerald-100 text-emerald-700"
                      : factor.impact === "Negative"
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {factor.impact}
                </div>

              </div>
            ))}

          </div>
        </div>
      </div>

      {/* ==================================================
          CHARTS
      ================================================== */}

      <div className="grid lg:grid-cols-2 gap-5">

        {/* Quiz History */}

        <div className="card p-5">

          <h3
            className="text-slate-900 mb-4"
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontWeight: 700,
            }}
          >
            Evaluation Score Trend
          </h3>

          {quizHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={quizHistory}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#F1F5F9"
                />

                <XAxis
                  dataKey="date"
                  tick={{
                    fontSize: 11,
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
                    border: "1px solid #E2E8F0",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#4F46E5"
                  strokeWidth={2.5}
                  dot={{
                    fill: "#4F46E5",
                    r: 4,
                  }}
                />

              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-sm text-slate-400">
              No history available
            </div>
          )}

        </div>

        {/* Topic Performance */}

        <div className="card p-5">

          <h3
            className="text-slate-900 mb-4"
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontWeight: 700,
            }}
          >
            Topic-Wise Performance
          </h3>

          {topicScores.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={topicScores}
                layout="vertical"
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#F1F5F9"
                />

                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{
                    fontSize: 10,
                    fill: "#94A3B8",
                  }}
                />

                <YAxis
                  dataKey="topic"
                  type="category"
                  tick={{
                    fontSize: 10,
                    fill: "#64748B",
                  }}
                  width={100}
                />

                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: "1px solid #E2E8F0",
                  }}
                />

                <Bar
                  dataKey="score"
                  radius={4}
                  fill="#4F46E5"
                />

              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-sm text-slate-400">
              No topic performance available
            </div>
          )}

        </div>

      </div>

      {/* ==================================================
          AI INSIGHT
      ================================================== */}

      <div
        className="card p-5"
        style={{
          borderLeft: "4px solid #06B6D4",
        }}
      >

        <div className="ai-chip mb-3">
          🤖 AI Learning Insight
        </div>

        <p className="text-sm text-slate-700 leading-relaxed">
          {latestAnalysis.analysisSummary}
        </p>

        {/* Strengths */}

        {strengths.length > 0 && (
          <div className="mt-5">

            <h4 className="text-sm font-bold text-emerald-700 mb-2">
              💪 Strengths
            </h4>

            <ul className="space-y-1">
              {strengths.map((item, index) => (
                <li
                  key={index}
                  className="text-sm text-slate-600"
                >
                  • {item}
                </li>
              ))}
            </ul>

          </div>
        )}

        {/* Weaknesses */}

        {weaknesses.length > 0 && (
          <div className="mt-4">

            <h4 className="text-sm font-bold text-red-700 mb-2">
              ⚠️ Areas to Improve
            </h4>

            <ul className="space-y-1">
              {weaknesses.map((item, index) => (
                <li
                  key={index}
                  className="text-sm text-slate-600"
                >
                  • {item}
                </li>
              ))}
            </ul>

          </div>
        )}

      </div>

    </div>
  );
}