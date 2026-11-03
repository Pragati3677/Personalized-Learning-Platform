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

const API_URL = "http://localhost:5000/api";

// ======================================================
// HELPERS
// ======================================================

function getToken() {
  return localStorage.getItem("token");
}

function getPercentage(progress) {
  const value = Number(
    progress?.progressPercentage ?? 0
  );

  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(0, Math.round(value))
  );
}

function formatLevel(value) {
  if (!value) {
    return "Average";
  }

  const text = String(value).trim();

  return (
    text.charAt(0).toUpperCase() +
    text.slice(1).toLowerCase()
  );
}

// ======================================================
// PROGRESS
// ======================================================

export default function Progress() {
  const [topics, setTopics] = useState([]);
  const [studentProgress, setStudentProgress] =
    useState([]);

  const [learningLevel, setLearningLevel] =
    useState("Average");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ====================================================
  // LOAD DATA
  // ====================================================

  useEffect(() => {
    const loadProgressData = async () => {
      const token = getToken();

      if (!token) {
        setLoading(false);
        setError(
          "Please login to view your progress."
        );
        return;
      }

      try {
        setError("");

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        // ==============================================
        // LOAD TOPICS
        // ==============================================

        const topicsResponse =
          await fetch(
            `${API_URL}/topics`,
            {
              method: "GET",
              headers,
            }
          );

        if (!topicsResponse.ok) {
          throw new Error(
            "Failed to load topics."
          );
        }

        const topicsData =
          await topicsResponse.json();

        const backendTopics =
          Array.isArray(topicsData)
            ? topicsData
            : topicsData.topics ||
              topicsData.data ||
              [];

        const activeTopics =
          backendTopics
            .filter(
              (topic) =>
                topic.isActive !== false
            )
            .sort(
              (a, b) =>
                Number(a.order || 0) -
                Number(b.order || 0)
            );

        setTopics(activeTopics);

        // ==============================================
        // LOAD STUDENT PROGRESS
        // ==============================================

        const progressResponse =
          await fetch(
            `${API_URL}/progress`,
            {
              method: "GET",
              headers,
            }
          );

        if (progressResponse.ok) {
          const progressData =
            await progressResponse.json();

          const backendProgress =
            progressData.progress ||
            progressData.data ||
            [];

          setStudentProgress(
            Array.isArray(
              backendProgress
            )
              ? backendProgress
              : []
          );
        }

        // ==============================================
        // LOAD AI LEARNING LEVEL
        // ==============================================

        const analysisResponse =
          await fetch(
            `${API_URL}/evaluation-analysis/my-analysis`,
            {
              method: "GET",
              headers,
            }
          );

        if (analysisResponse.ok) {
          const analysisData =
            await analysisResponse.json();

          const analysis =
            analysisData.analysis ||
            analysisData.data ||
            analysisData.result;

          if (analysis) {
            const level =
              analysis.predictedLevel ||
              analysis.performanceLevel ||
              analysis.learningLevel ||
              analysis.level;

            if (level) {
              setLearningLevel(
                formatLevel(level)
              );
            }
          }
        }
      } catch (err) {
        console.error(
          "Progress loading error:",
          err
        );

        setError(
          "Unable to load your progress."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProgressData();
  }, []);

  // ====================================================
  // PROGRESS MAP
  // ====================================================

  const progressMap = useMemo(() => {
    const map = {};

    studentProgress.forEach((item) => {
      if (!item?.topic) {
        return;
      }

      map[
        String(item.topic)
          .trim()
          .toLowerCase()
      ] = item;
    });

    return map;
  }, [studentProgress]);

  // ====================================================
  // TOPIC PROGRESS
  // ====================================================

  const topicProgress = useMemo(() => {
    return topics.map((topic) => {
      const progress =
        progressMap[
          String(topic.title)
            .trim()
            .toLowerCase()
        ];

      const percentage =
        getPercentage(progress);

      let status = "Not Started";

      if (
        progress?.status ===
          "completed" ||
        percentage === 100
      ) {
        status = "Completed";
      } else if (
        progress?.status ===
          "in_progress" ||
        percentage > 0
      ) {
        status = "In Progress";
      }

      return {
        ...topic,
        progress,
        percentage,
        status,
      };
    });
  }, [topics, progressMap]);

  // ====================================================
  // SUMMARY
  // ====================================================

  const completedTopics =
    topicProgress.filter(
      (topic) =>
        topic.status === "Completed"
    );

  const inProgressTopics =
    topicProgress.filter(
      (topic) =>
        topic.status === "In Progress"
    );

  const notStartedTopics =
    topicProgress.filter(
      (topic) =>
        topic.status === "Not Started"
    );

  const totalTopics =
    topicProgress.length;

  const completedCount =
    completedTopics.length;

  const inProgressCount =
    inProgressTopics.length;

  const notStartedCount =
    notStartedTopics.length;

  const overallProgress =
    totalTopics > 0
      ? Math.round(
          (completedCount /
            totalTopics) *
            100
        )
      : 0;

  // ====================================================
  // CURRENT TOPIC
  // ====================================================

  const currentTopic =
    inProgressTopics[0] ||
    notStartedTopics[0] ||
    null;

  // ====================================================
  // AVERAGE TOPIC PROGRESS
  // ====================================================

  const averageTopicProgress =
    totalTopics > 0
      ? Math.round(
          topicProgress.reduce(
            (sum, topic) =>
              sum + topic.percentage,
            0
          ) / totalTopics
        )
      : 0;

  // ====================================================
  // CHART DATA
  // ====================================================

  const chartData = topicProgress.map(
    (topic) => ({
      name:
        topic.title.length > 18
          ? `${topic.title.slice(
              0,
              18
            )}...`
          : topic.title,
      progress: topic.percentage,
      order: topic.order,
    })
  );

  // ====================================================
  // ACHIEVEMENTS
  // ====================================================

  const achievements = [
    {
      icon: "🌱",
      name: "Getting Started",
      desc: "Start your Java learning journey",
      unlocked:
        totalTopics > 0 &&
        topicProgress.some(
          (topic) =>
            topic.percentage > 0
        ),
    },
    {
      icon: "📚",
      name: "Topic Finisher",
      desc: "Complete your first topic",
      unlocked:
        completedCount >= 1,
    },
    {
      icon: "🔥",
      name: "5 Topic Milestone",
      desc: "Complete 5 Java topics",
      unlocked:
        completedCount >= 5,
    },
    {
      icon: "🏆",
      name: "Halfway There",
      desc: "Complete half of the course",
      unlocked:
        totalTopics > 0 &&
        completedCount >=
          Math.ceil(totalTopics / 2),
    },
  ];

  // ====================================================
  // LOADING UI
  // ====================================================

  if (loading) {
    return (
      <div className="p-6">

        <div className="card p-12 text-center">

          <div className="text-4xl mb-3">
            📊
          </div>

          <div className="font-semibold text-slate-700">
            Loading your progress...
          </div>

          <p className="text-xs text-slate-400 mt-1">
            Fetching your latest learning data.
          </p>

        </div>

      </div>
    );
  }

  // ====================================================
  // MAIN UI
  // ====================================================

  return (
    <div className="p-6 space-y-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div>

        <div className="ai-chip mb-3">
          📊 Learning Progress
        </div>

        <h2
          className="text-xl text-indigo-950 mb-1"
          style={{
            fontFamily:
              "'DM Sans',sans-serif",
            fontWeight: 800,
          }}
        >
          My Progress
        </h2>

        <p className="text-sm text-slate-500">
          Track your progress across the
          personalized Java learning path.
        </p>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="card p-4 border border-red-200 bg-red-50">

          <div className="text-sm text-red-600">
            ⚠️ {error}
          </div>

        </div>
      )}

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {/* COMPLETED */}

        <div className="card p-4 text-center">

          <div
            className="text-3xl font-black mb-1"
            style={{
              fontFamily:
                "'DM Sans',sans-serif",
              color: "#4F46E5",
            }}
          >
            {completedCount}
          </div>

          <div className="text-xs font-semibold text-slate-700">
            Topics Completed
          </div>

          <div className="text-xs text-slate-400 mt-0.5">
            of {totalTopics} topics
          </div>

        </div>

        {/* IN PROGRESS */}

        <div className="card p-4 text-center">

          <div
            className="text-3xl font-black mb-1"
            style={{
              fontFamily:
                "'DM Sans',sans-serif",
              color: "#F59E0B",
            }}
          >
            {inProgressCount}
          </div>

          <div className="text-xs font-semibold text-slate-700">
            In Progress
          </div>

          <div className="text-xs text-slate-400 mt-0.5">
            currently learning
          </div>

        </div>

        {/* COURSE PROGRESS */}

        <div className="card p-4 text-center">

          <div
            className="text-3xl font-black mb-1"
            style={{
              fontFamily:
                "'DM Sans',sans-serif",
              color: "#10B981",
            }}
          >
            {overallProgress}%
          </div>

          <div className="text-xs font-semibold text-slate-700">
            Course Progress
          </div>

          <div className="text-xs text-slate-400 mt-0.5">
            {completedCount}/{totalTopics}
            {" "}completed
          </div>

        </div>

        {/* AI LEVEL */}

        <div className="card p-4 text-center">

          <div
            className="text-3xl font-black mb-1"
            style={{
              fontFamily:
                "'DM Sans',sans-serif",
              color: "#06B6D4",
            }}
          >
            🤖
          </div>

          <div className="text-xs font-semibold text-slate-700">
            AI Learning Level
          </div>

          <div className="text-xs text-slate-400 mt-0.5">
            {learningLevel}
          </div>

        </div>

      </div>

      {/* =================================================
          OVERALL COURSE PROGRESS
      ================================================= */}

      <div className="card p-5">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">

          <div>

            <h3
              className="font-bold text-slate-900"
              style={{
                fontFamily:
                  "'DM Sans',sans-serif",
              }}
            >
              Java Learning Progress
            </h3>

            <p className="text-xs text-slate-400 mt-1">
              Progress across all {totalTopics} Java
              topics.
            </p>

          </div>

          <div className="text-2xl font-black text-indigo-600">
            {overallProgress}%
          </div>

        </div>

        <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">

          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${overallProgress}%`,
              background:
                "linear-gradient(90deg,#4F46E5,#06B6D4)",
            }}
          />

        </div>

        <div className="flex justify-between text-xs text-slate-400 mt-2">

          <span>
            {completedCount} completed
          </span>

          <span>
            {notStartedCount} not started
          </span>

        </div>

      </div>

      {/* =================================================
          CURRENT LEARNING
      ================================================= */}

      {currentTopic && (
        <div
          className="rounded-2xl p-5"
          style={{
            background:
              "linear-gradient(135deg,#EEF2FF,#F5F3FF)",
            border:
              "1px solid #E0E7FF",
          }}
        >

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

            <div>

              <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                🎯 Current Learning
              </div>

              <div className="text-lg font-bold text-indigo-950 mt-1">
                {currentTopic.title}
              </div>

              <p className="text-xs text-slate-500 mt-1">
                {currentTopic.status ===
                "In Progress"
                  ? "Continue learning this topic to move towards the topic assessment."
                  : "This is your next topic in the Java learning path."}
              </p>

            </div>

            <div className="min-w-[180px]">

              <div className="flex justify-between text-xs mb-1">

                <span className="text-slate-500">
                  Topic Progress
                </span>

                <span className="font-semibold text-indigo-600">
                  {currentTopic.percentage}%
                </span>

              </div>

              <div className="w-full h-2 rounded-full bg-white overflow-hidden">

                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${currentTopic.percentage}%`,
                    background:
                      "linear-gradient(90deg,#4F46E5,#06B6D4)",
                  }}
                />

              </div>

            </div>

          </div>

        </div>
      )}

      {/* =================================================
          TOPIC PROGRESS CHART
      ================================================= */}

      <div className="card p-5">

        <div className="mb-4">

          <h3
            className="font-bold text-slate-900"
            style={{
              fontFamily:
                "'DM Sans',sans-serif",
            }}
          >
            Topic-Wise Progress
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            Your progress across the Java learning
            sequence.
          </p>

        </div>

        {chartData.length > 0 ? (
          <ResponsiveContainer
            width="100%"
            height={520}
          >
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{
                top: 5,
                right: 20,
                left: 20,
                bottom: 5,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F1F5F9"
              />

              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{
                  fontSize: 11,
                  fill: "#94A3B8",
                }}
              />

              <YAxis
                type="category"
                dataKey="name"
                width={150}
                tick={{
                  fontSize: 10,
                  fill: "#64748B",
                }}
              />

              <Tooltip
                formatter={(value) => [
                  `${value}%`,
                  "Progress",
                ]}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border:
                    "1px solid #E2E8F0",
                }}
              />

              <Bar
                dataKey="progress"
                fill="#4F46E5"
                radius={[
                  0,
                  5,
                  5,
                  0,
                ]}
              />

            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-10 text-sm text-slate-400">
            No topic progress available yet.
          </div>
        )}

      </div>

      {/* =================================================
          ALL TOPICS
      ================================================= */}

      <div className="card p-5">

        <div className="flex items-center justify-between mb-5">

          <div>

            <h3
              className="font-bold text-slate-900"
              style={{
                fontFamily:
                  "'DM Sans',sans-serif",
              }}
            >
              All Java Topics
            </h3>

            <p className="text-xs text-slate-400 mt-1">
              Detailed progress for each topic.
            </p>

          </div>

          <div className="text-xs text-slate-500">
            {totalTopics} topics
          </div>

        </div>

        <div className="space-y-4">

          {topicProgress.map(
            (topic, index) => (
              <div
                key={
                  topic._id ||
                  topic.id ||
                  topic.title
                }
                className="p-4 rounded-xl border border-slate-100 hover:border-indigo-100 transition-all"
              >

                <div className="flex items-start gap-3">

                  {/* NUMBER */}

                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      topic.status ===
                      "Completed"
                        ? "bg-emerald-100 text-emerald-700"
                        : topic.status ===
                          "In Progress"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {topic.status ===
                    "Completed"
                      ? "✓"
                      : topic.order ||
                        index + 1}
                  </div>

                  {/* TOPIC */}

                  <div className="flex-1 min-w-0">

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">

                      <div>

                        <div className="text-sm font-semibold text-slate-800">
                          {topic.title}
                        </div>

                        <div className="text-xs text-slate-400 mt-0.5">
                          Topic {topic.order ||
                            index + 1}
                        </div>

                      </div>

                      <span
                        className={`self-start text-xs px-2.5 py-1 rounded-full font-medium ${
                          topic.status ===
                          "Completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : topic.status ===
                              "In Progress"
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {topic.status}
                      </span>

                    </div>

                    {/* PROGRESS */}

                    <div className="mt-3">

                      <div className="flex justify-between text-xs mb-1">

                        <span className="text-slate-400">
                          Progress
                        </span>

                        <span className="font-semibold text-slate-600">
                          {topic.percentage}%
                        </span>

                      </div>

                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">

                        <div
                          className={`h-full rounded-full transition-all ${
                            topic.status ===
                            "Completed"
                              ? "bg-emerald-500"
                              : topic.status ===
                                "In Progress"
                              ? "bg-indigo-500"
                              : "bg-slate-300"
                          }`}
                          style={{
                            width: `${topic.percentage}%`,
                          }}
                        />

                      </div>

                    </div>

                  </div>

                </div>

              </div>
            )
          )}

        </div>

      </div>

      {/* =================================================
          PROGRESS STATUS
      ================================================= */}

      <div className="grid md:grid-cols-3 gap-4">

        {/* COMPLETED */}

        <div className="card p-5">

          <div className="flex items-center gap-3 mb-3">

            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-lg">
              ✓
            </div>

            <div>

              <div className="text-sm font-semibold text-slate-800">
                Completed
              </div>

              <div className="text-xs text-slate-400">
                Topics finished
              </div>

            </div>

          </div>

          <div className="text-2xl font-black text-emerald-600">
            {completedCount}
          </div>

        </div>

        {/* IN PROGRESS */}

        <div className="card p-5">

          <div className="flex items-center gap-3 mb-3">

            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-lg">
              📖
            </div>

            <div>

              <div className="text-sm font-semibold text-slate-800">
                In Progress
              </div>

              <div className="text-xs text-slate-400">
                Currently learning
              </div>

            </div>

          </div>

          <div className="text-2xl font-black text-indigo-600">
            {inProgressCount}
          </div>

        </div>

        {/* NOT STARTED */}

        <div className="card p-5">

          <div className="flex items-center gap-3 mb-3">

            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg">
              🔒
            </div>

            <div>

              <div className="text-sm font-semibold text-slate-800">
                Not Started
              </div>

              <div className="text-xs text-slate-400">
                Upcoming topics
              </div>

            </div>

          </div>

          <div className="text-2xl font-black text-slate-500">
            {notStartedCount}
          </div>

        </div>

      </div>

      {/* =================================================
          ACHIEVEMENTS
      ================================================= */}

      <div className="card p-5">

        <div className="mb-4">

          <h3
            className="font-bold text-slate-900"
            style={{
              fontFamily:
                "'DM Sans',sans-serif",
            }}
          >
            Achievements
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            Milestones based on your actual topic
            progress.
          </p>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

          {achievements.map(
            (achievement) => (
              <div
                key={achievement.name}
                className={`text-center p-4 rounded-xl border-2 transition-all ${
                  achievement.unlocked
                    ? "border-indigo-200 bg-indigo-50"
                    : "border-slate-100 bg-slate-50 opacity-60"
                }`}
              >

                <div className="text-4xl mb-2">
                  {achievement.icon}
                </div>

                <div
                  className={`font-semibold text-sm ${
                    achievement.unlocked
                      ? "text-indigo-900"
                      : "text-slate-500"
                  }`}
                >
                  {achievement.name}
                </div>

                <div className="text-xs text-slate-500 mt-1">
                  {achievement.desc}
                </div>

                <div className="text-[10px] mt-2 font-semibold">
                  {achievement.unlocked
                    ? "✓ Unlocked"
                    : "🔒 Locked"}
                </div>

              </div>
            )
          )}

        </div>

      </div>

      {/* =================================================
          AI PROGRESS INSIGHT
      ================================================= */}

      <div
        className="rounded-2xl p-5"
        style={{
          background:
            "linear-gradient(135deg,#F8FAFC,#EEF2FF)",
          border:
            "1px solid #E2E8F0",
        }}
      >

        <div className="flex gap-3">

          <div className="w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl flex-shrink-0">
            🤖
          </div>

          <div>

            <div className="font-semibold text-slate-800 text-sm">
              AI Learning Insight
            </div>

            <p className="text-xs text-slate-500 mt-1 leading-relaxed">

              Your current AI learning level is{" "}
              <strong className="text-indigo-600">
                {learningLevel}
              </strong>
              . You have completed{" "}
              <strong>
                {completedCount}
              </strong>{" "}
              of{" "}
              <strong>
                {totalTopics}
              </strong>{" "}
              Java topics, with an overall
              course completion of{" "}
              <strong className="text-indigo-600">
                {overallProgress}%
              </strong>
              .

              {currentTopic && (
                <>
                  {" "}
                  Your current focus is{" "}
                  <strong className="text-indigo-600">
                    {currentTopic.title}
                  </strong>
                  .
                </>
              )}

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}