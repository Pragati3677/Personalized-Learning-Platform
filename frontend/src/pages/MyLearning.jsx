import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5000/api";

const JAVA_TOPICS = [
  "Java Basics & Syntax",
  "Variables & Data Types",
  "Operators",
  "Conditional Statements",
  "Loops",
  "Arrays",
  "Strings",
  "Methods",
  "OOP Concepts",
  "Classes & Objects",
  "Inheritance",
  "Polymorphism",
  "Abstraction & Interfaces",
  "Exception Handling",
  "Collections Framework",
  "Generics",
  "File Handling",
  "Advanced Java",
];

const statusStyle = {
  completed: {
    label: "Completed",
    color: "#10B981",
    bg: "#ECFDF5",
    border: "#A7F3D0",
  },

  current: {
    label: "Current",
    color: "#4F46E5",
    bg: "#EEF2FF",
    border: "#C7D2FE",
  },

  locked: {
    label: "Locked",
    color: "#94A3B8",
    bg: "#F8FAFC",
    border: "#E2E8F0",
  },
};

// ======================================================
// HELPERS
// ======================================================

function getToken() {
  return localStorage.getItem("token");
}

function getUser() {
  try {
    return JSON.parse(
      localStorage.getItem("user") || "{}"
    );
  } catch {
    return {};
  }
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

function getMastery(progress) {
  const value = Number(
    progress?.bestQuizScore ?? 0
  );

  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(0, Math.round(value))
  );
}

function getMasteryStyle(mastery) {
  if (mastery >= 80) {
    return {
      text: "Strong",
      className:
        "bg-emerald-100 text-emerald-700",
    };
  }

  if (mastery >= 60) {
    return {
      text: "Developing",
      className:
        "bg-amber-100 text-amber-700",
    };
  }

  if (mastery > 0) {
    return {
      text: "Needs Practice",
      className:
        "bg-red-100 text-red-700",
    };
  }

  return {
    text: "Not Assessed",
    className:
      "bg-slate-100 text-slate-500",
  };
}

// ======================================================
// MY LEARNING
// ======================================================

export default function MyLearning({ onNav }) {
  const [user, setUser] = useState({});

  const [topics, setTopics] = useState([]);

  const [studentProgress, setStudentProgress] =
    useState([]);

  const [learningLevel, setLearningLevel] =
    useState("Average");

  const [expandedTopic, setExpandedTopic] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ====================================================
  // LOAD DATA
  // ====================================================

  useEffect(() => {
    const loadMyLearning = async () => {
      const token = getToken();

      setUser(getUser());

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setError("");

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        // =================================================
        // LOAD TOPICS
        // =================================================

        const topicsResponse = await fetch(
          `${API_URL}/topics`,
          {
            method: "GET",
            headers,
          }
        );

        if (!topicsResponse.ok) {
          throw new Error(
            "Unable to load topics."
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

        // =================================================
        // LOAD STUDENT PROGRESS
        // =================================================

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
            Array.isArray(backendProgress)
              ? backendProgress
              : []
          );
        }

        // =================================================
        // LOAD AI LEVEL
        // =================================================

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
              const text =
                String(level);

              setLearningLevel(
                text.charAt(0).toUpperCase() +
                  text.slice(1).toLowerCase()
              );
            }
          }
        }
      } catch (err) {
        console.error(
          "My Learning loading error:",
          err
        );

        setError(
          "Unable to load your learning data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadMyLearning();
  }, []);

  // ====================================================
  // USE BACKEND TOPICS
  // ====================================================

  const orderedTopics = useMemo(() => {
    if (topics.length > 0) {
      return topics;
    }

    // Fallback only if backend does not return topics
    return JAVA_TOPICS.map(
      (title, index) => ({
        _id: `fallback-${index}`,
        title,
        order: index + 1,
      })
    );
  }, [topics]);

  // ====================================================
  // PROGRESS MAP
  // ====================================================

  const progressMap = useMemo(() => {
    const map = {};

    studentProgress.forEach((item) => {
      if (!item?.topic) return;

      map[
        String(item.topic)
          .trim()
          .toLowerCase()
      ] = item;
    });

    return map;
  }, [studentProgress]);

  // ====================================================
  // BUILD TOPIC STATUS
  // ====================================================

  const learningTopics = useMemo(() => {
    let foundCurrent = false;

    return orderedTopics.map(
      (topic, index) => {
        const progress =
          progressMap[
            String(topic.title)
              .trim()
              .toLowerCase()
          ];

        const percentage =
          getPercentage(progress);

        const isCompleted =
          progress?.status ===
            "completed" ||
          percentage === 100;

        const isInProgress =
          progress?.status ===
            "in_progress";

        let status = "locked";

        if (isCompleted) {
          status = "completed";
        } else if (
          isInProgress ||
          !foundCurrent
        ) {
          status = "current";
          foundCurrent = true;
        }

        return {
          ...topic,
          index,
          progress,
          percentage,
          mastery:
            getMastery(progress),
          status,
        };
      }
    );
  }, [
    orderedTopics,
    progressMap,
  ]);

  // ====================================================
  // STATISTICS
  // ====================================================

  const completedTopics =
    learningTopics.filter(
      (topic) =>
        topic.status === "completed"
    );

  const currentTopics =
    learningTopics.filter(
      (topic) =>
        topic.status === "current"
    );

  const lockedTopics =
    learningTopics.filter(
      (topic) =>
        topic.status === "locked"
    );

  const completedCount =
    completedTopics.length;

  const currentTopic =
    currentTopics[0] || null;

  const totalTopics =
    learningTopics.length;

  const overallProgress =
    totalTopics > 0
      ? Math.round(
          (completedCount /
            totalTopics) *
            100
        )
      : 0;

  const totalQuizAttempts =
    studentProgress.reduce(
      (sum, item) =>
        sum +
        Number(
          item?.quizAttempts || 0
        ),
      0
    );

  const assessedTopics =
    learningTopics.filter(
      (topic) =>
        topic.mastery > 0
    );

  const averageMastery =
    assessedTopics.length > 0
      ? Math.round(
          assessedTopics.reduce(
            (sum, topic) =>
              sum + topic.mastery,
            0
          ) /
            assessedTopics.length
        )
      : 0;

  // ====================================================
  // EXPAND CURRENT TOPIC BY DEFAULT
  // ====================================================

  useEffect(() => {
    if (
      currentTopic &&
      expandedTopic === null
    ) {
      setExpandedTopic(
        currentTopic._id
      );
    }
  }, [
    currentTopic,
    expandedTopic,
  ]);

  // ====================================================
  // NAVIGATION
  // ====================================================

  const openTopic = (topic) => {
    if (
      topic.status === "locked"
    ) {
      return;
    }

    onNav(
      "learning-resource",
      topic
    );
  };

  // ====================================================
  // GET ICON
  // ====================================================

  const getTopicIcon = (index) => {
    const icons = [
      "☕",
      "🔢",
      "➗",
      "🔀",
      "🔁",
      "📦",
      "🔤",
      "⚙️",
      "🧩",
      "🏛️",
      "🧬",
      "🎭",
      "🎯",
      "⚠️",
      "🗂️",
      "🧬",
      "📄",
      "🚀",
    ];

    return (
      icons[index] || "📘"
    );
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="p-6 space-y-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>

          <div className="flex items-center gap-2">

            <h2
              className="text-2xl font-800 text-indigo-950"
              style={{
                fontFamily:
                  "'DM Sans',sans-serif",
                fontWeight: 800,
              }}
            >
              My Learning
            </h2>

            <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
              ☕ Java
            </span>

          </div>

          <p className="text-slate-500 text-sm mt-1">
            Your personalized Java learning
            journey, powered by your progress.
          </p>

        </div>

        <button
          onClick={() =>
            onNav("learning-path")
          }
          className="btn-primary text-sm px-4 py-2"
        >
          🗺️ View Learning Path →
        </button>

      </div>

      {/* =================================================
          LEARNING OVERVIEW
      ================================================= */}

      <div
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg,#1E1B4B,#312E81)",
        }}
      >

        <div
          className="absolute -right-16 -top-16 w-48 h-48 rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle,#22D3EE,transparent)",
          }}
        />

        <div className="relative">

          <div className="flex flex-col lg:flex-row lg:items-center gap-6">

            {/* COURSE INFO */}

            <div className="flex items-center gap-4 flex-1">

              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                style={{
                  background:
                    "rgba(255,255,255,0.12)",
                }}
              >
                ☕
              </div>

              <div>

                <div className="text-indigo-300 text-xs uppercase tracking-wide font-semibold">
                  Current Course
                </div>

                <div className="text-white text-xl font-bold mt-1">
                  Java Programming
                </div>

                <div className="text-indigo-300 text-xs mt-1">
                  {totalTopics} topics ·
                  Personalized learning path
                </div>

              </div>

            </div>

            {/* PROGRESS */}

            <div className="lg:w-80">

              <div className="flex justify-between text-xs mb-2">

                <span className="text-indigo-300">
                  Overall Progress
                </span>

                <span className="text-white font-semibold">
                  {overallProgress}%
                </span>

              </div>

              <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">

                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${overallProgress}%`,
                    background:
                      "linear-gradient(90deg,#22D3EE,#34D399)",
                  }}
                />

              </div>

              <div className="text-indigo-300 text-xs mt-2">
                {completedCount} of{" "}
                {totalTopics} topics completed
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Completed */}

        <div className="card p-4">

          <div className="flex items-center justify-between">

            <div>

              <div className="text-xs text-slate-400">
                Completed
              </div>

              <div className="text-2xl font-black text-emerald-600 mt-1">
                {completedCount}
              </div>

              <div className="text-xs text-slate-400 mt-1">
                topics
              </div>

            </div>

            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-xl">
              ✓
            </div>

          </div>

        </div>

        {/* Current */}

        <div className="card p-4">

          <div className="flex items-center justify-between">

            <div>

              <div className="text-xs text-slate-400">
                Current
              </div>

              <div className="text-2xl font-black text-indigo-600 mt-1">
                {currentTopic
                  ? currentTopic.index + 1
                  : "-"}
              </div>

              <div className="text-xs text-slate-400 mt-1">
                topic
              </div>

            </div>

            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl">
              →
            </div>

          </div>

        </div>

        {/* Mastery */}

        <div className="card p-4">

          <div className="flex items-center justify-between">

            <div>

              <div className="text-xs text-slate-400">
                Avg Mastery
              </div>

              <div className="text-2xl font-black text-purple-600 mt-1">
                {averageMastery}%
              </div>

              <div className="text-xs text-slate-400 mt-1">
                assessed topics
              </div>

            </div>

            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-xl">
              🎯
            </div>

          </div>

        </div>

        {/* AI Level */}

        <div className="card p-4">

          <div className="flex items-center justify-between">

            <div>

              <div className="text-xs text-slate-400">
                AI Level
              </div>

              <div className="text-xl font-black text-cyan-600 mt-1">
                {learningLevel}
              </div>

              <div className="text-xs text-slate-400 mt-1">
                personalized
              </div>

            </div>

            <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-xl">
              🤖
            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          CURRENT LEARNING
      ================================================= */}

      {currentTopic && (
        <div
          className="rounded-2xl p-5 border"
          style={{
            background:
              "linear-gradient(135deg,#EEF2FF,#F5F3FF)",
            borderColor:
              "#C7D2FE",
          }}
        >

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-sm">
                {getTopicIcon(
                  currentTopic.index
                )}
              </div>

              <div>

                <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                  Continue Learning
                </div>

                <div className="font-bold text-indigo-950 text-lg mt-1">
                  {currentTopic.title}
                </div>

                <div className="text-xs text-slate-500 mt-1">
                  Topic{" "}
                  {currentTopic.index + 1}{" "}
                  of {totalTopics} ·{" "}
                  {currentTopic.percentage}%
                  complete
                </div>

              </div>

            </div>

            <button
              onClick={() =>
                openTopic(currentTopic)
              }
              className="btn-primary px-5 py-2.5"
            >
              {currentTopic.percentage > 0
                ? "Continue →"
                : "Start Learning →"}
            </button>

          </div>

          <div className="mt-4">

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
                className="h-full rounded-full transition-all"
                style={{
                  width: `${currentTopic.percentage}%`,
                  background:
                    "linear-gradient(90deg,#4F46E5,#06B6D4)",
                }}
              />

            </div>

          </div>

        </div>
      )}

      {/* =================================================
          TOPIC LIST
      ================================================= */}

      <div>

        <div className="flex items-center justify-between mb-3">

          <div>

            <h3
              className="text-lg font-800 text-slate-900"
              style={{
                fontFamily:
                  "'DM Sans',sans-serif",
                fontWeight: 800,
              }}
            >
              📚 Java Learning Topics
            </h3>

            <p className="text-xs text-slate-400 mt-1">
              Complete each topic to unlock the
              next stage of your learning path.
            </p>

          </div>

          <div className="text-xs text-slate-500">
            {lockedTopics.length} locked
          </div>

        </div>

        <div className="space-y-3">

          {loading ? (

            <div className="card p-8 text-center">

              <div className="text-3xl mb-2">
                ⏳
              </div>

              <div className="text-sm text-slate-500">
                Loading your learning journey...
              </div>

            </div>

          ) : (

            learningTopics.map(
              (topic) => {
                const status =
                  statusStyle[
                    topic.status
                  ];

                const masteryStyle =
                  getMasteryStyle(
                    topic.mastery
                  );

                const isExpanded =
                  expandedTopic ===
                  topic._id;

                return (
                  <div
                    key={topic._id}
                    className={`card overflow-hidden transition-all ${
                      topic.status ===
                      "current"
                        ? "ring-2 ring-indigo-100"
                        : ""
                    }`}
                  >

                    {/* =================================
                        TOPIC HEADER
                    ================================= */}

                    <button
                      onClick={() => {
                        if (
                          topic.status ===
                          "locked"
                        ) {
                          return;
                        }

                        setExpandedTopic(
                          isExpanded
                            ? null
                            : topic._id
                        );
                      }}
                      className={`w-full p-5 flex items-center gap-4 text-left transition-colors ${
                        topic.status ===
                        "locked"
                          ? "cursor-default"
                          : "hover:bg-slate-50"
                      }`}
                    >

                      {/* NUMBER / ICON */}

                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{
                          background:
                            status.bg,
                          color:
                            status.color,
                          border:
                            `1px solid ${status.border}`,
                        }}
                      >
                        {topic.status ===
                        "completed"
                          ? "✓"
                          : topic.status ===
                            "current"
                          ? getTopicIcon(
                              topic.index
                            )
                          : "🔒"}
                      </div>

                      {/* INFO */}

                      <div className="flex-1 min-w-0">

                        <div className="flex items-center gap-2 flex-wrap">

                          <span className="text-xs text-slate-400 font-medium">
                            Topic{" "}
                            {topic.index + 1}
                          </span>

                          <h3
                            className={`font-700 ${
                              topic.status ===
                              "locked"
                                ? "text-slate-400"
                                : "text-slate-900"
                            }`}
                            style={{
                              fontFamily:
                                "'DM Sans',sans-serif",
                              fontWeight: 700,
                            }}
                          >
                            {topic.title}
                          </h3>

                        </div>

                        <div className="flex items-center gap-2 mt-2 flex-wrap">

                          <span
                            className="badge text-xs"
                            style={{
                              background:
                                status.bg,
                              color:
                                status.color,
                            }}
                          >
                            {status.label}
                          </span>

                          {topic.status ===
                            "current" && (
                            <span className="badge bg-indigo-100 text-indigo-700 text-xs">
                              Current Focus
                            </span>
                          )}

                          {topic.mastery >
                            0 && (
                            <span
                              className={`badge text-xs ${masteryStyle.className}`}
                            >
                              Mastery{" "}
                              {topic.mastery}%
                            </span>
                          )}

                        </div>

                      </div>

                      {/* PROGRESS */}

                      <div className="hidden md:block w-32 flex-shrink-0">

                        <div className="flex justify-between text-xs mb-1">

                          <span className="text-slate-400">
                            Progress
                          </span>

                          <span className="font-semibold text-slate-600">
                            {topic.percentage}%
                          </span>

                        </div>

                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${topic.percentage}%`,
                              background:
                                topic.status ===
                                "completed"
                                  ? "#10B981"
                                  : undefined,
                            }}
                          />
                        </div>

                      </div>

                      {/* ACTION */}

                      <div className="flex items-center gap-2 flex-shrink-0">

                        {topic.status !==
                          "locked" && (
                          <button
                            onClick={(event) => {
                              event.stopPropagation();

                              openTopic(
                                topic
                              );
                            }}
                            className={
                              topic.status ===
                              "completed"
                                ? "btn-secondary text-xs py-1.5 px-3"
                                : "btn-primary text-xs py-1.5 px-3"
                            }
                          >
                            {topic.status ===
                            "completed"
                              ? "Review"
                              : topic.percentage >
                                0
                              ? "Continue"
                              : "Start"}
                          </button>
                        )}

                        {topic.status !==
                          "locked" && (
                          <span className="text-slate-400 text-sm">
                            {isExpanded
                              ? "▲"
                              : "▼"}
                          </span>
                        )}

                      </div>

                    </button>

                    {/* =================================
                        EXPANDED DETAILS
                    ================================= */}

                    {isExpanded &&
                      topic.status !==
                        "locked" && (
                        <div className="border-t border-slate-100 bg-slate-50/50">

                          <div className="p-5">

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                              {/* Progress */}

                              <div className="bg-white rounded-xl p-4 border border-slate-100">

                                <div className="text-xs text-slate-400">
                                  Topic Progress
                                </div>

                                <div className="text-xl font-bold text-indigo-700 mt-1">
                                  {topic.percentage}%
                                </div>

                                <div className="progress-bar mt-3">

                                  <div
                                    className="progress-fill"
                                    style={{
                                      width: `${topic.percentage}%`,
                                      background:
                                        topic.status ===
                                        "completed"
                                          ? "#10B981"
                                          : undefined,
                                    }}
                                  />

                                </div>

                              </div>

                              {/* Lessons */}

                              <div className="bg-white rounded-xl p-4 border border-slate-100">

                                <div className="text-xs text-slate-400">
                                  Lessons Completed
                                </div>

                                <div className="text-xl font-bold text-purple-700 mt-1">
                                  {Number(
                                    topic
                                      .progress
                                      ?.completedLessons ||
                                      0
                                  )}
                                </div>

                                <div className="text-xs text-slate-400 mt-1">
                                  learning resources
                                </div>

                              </div>

                              {/* Quiz */}

                              <div className="bg-white rounded-xl p-4 border border-slate-100">

                                <div className="text-xs text-slate-400">
                                  Quiz Attempts
                                </div>

                                <div className="text-xl font-bold text-emerald-700 mt-1">
                                  {Number(
                                    topic
                                      .progress
                                      ?.quizAttempts ||
                                      0
                                  )}
                                </div>

                                <div className="text-xs text-slate-400 mt-1">
                                  best score{" "}
                                  {topic.mastery}%
                                </div>

                              </div>

                            </div>

                            {/* Topic action */}

                            <div className="mt-4 flex items-center justify-between gap-4">

                              <div>

                                <div className="text-sm font-semibold text-slate-700">
                                  {topic.status ===
                                  "completed"
                                    ? "Topic completed 🎉"
                                    : "Continue your learning journey"}
                                </div>

                                <div className="text-xs text-slate-400 mt-1">
                                  {topic.status ===
                                  "completed"
                                    ? "You can review the learning resources and assessment."
                                    : "Study the resources before taking the topic assessment."}
                                </div>

                              </div>

                              <button
                                onClick={() =>
                                  openTopic(
                                    topic
                                  )
                                }
                                className={
                                  topic.status ===
                                  "completed"
                                    ? "btn-secondary text-sm px-4 py-2"
                                    : "btn-primary text-sm px-4 py-2"
                                }
                              >
                                {topic.status ===
                                "completed"
                                  ? "Review Topic →"
                                  : "Open Topic →"}
                              </button>

                            </div>

                          </div>

                        </div>
                      )}

                  </div>
                );
              }
            )

          )}

        </div>

      </div>

      {/* =================================================
          LEARNING STATUS
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

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm">
              🤖
            </div>

            <div>

              <div className="font-semibold text-slate-800 text-sm">
                AI Personalized Learning
              </div>

              <div className="text-xs text-slate-500 mt-1">
                Your current level is{" "}
                <span className="font-semibold text-indigo-600">
                  {learningLevel}
                </span>
                . The learning path adapts as
                your performance changes.
              </div>

            </div>

          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">

            <span>
              {completedCount}/
              {totalTopics} completed
            </span>

            <span>•</span>

            <span>
              {totalQuizAttempts} quiz attempts
            </span>

          </div>

        </div>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="text-xs text-red-500 text-center">
          {error}
        </div>
      )}

    </div>
  );
}