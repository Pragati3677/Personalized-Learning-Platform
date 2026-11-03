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

// ======================================================
// HELPERS
// ======================================================

function getAuthToken() {
  return localStorage.getItem("token");
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
}

function capitalizeLevel(value) {
  if (!value) return "Average";

  const text = String(value).trim();

  return (
    text.charAt(0).toUpperCase() +
    text.slice(1).toLowerCase()
  );
}

function getProgressPercentage(progress) {
  const value = Number(
    progress?.progressPercentage ?? 0
  );

  if (!Number.isFinite(value)) return 0;

  return Math.min(
    100,
    Math.max(0, Math.round(value))
  );
}

// ======================================================
// STUDENT DASHBOARD
// ======================================================

export default function StudentDashboard({ onNav }) {
  const [user, setUser] = useState({});

  // Backend data
  const [topics, setTopics] = useState([]);
  const [studentProgress, setStudentProgress] =
    useState([]);

  // AI analysis
  const [learningLevel, setLearningLevel] =
    useState("Average");

  const [learningScore, setLearningScore] =
    useState(0);

  const [analysisAvailable, setAnalysisAvailable] =
    useState(false);

  // Loading
  const [loadingDashboard, setLoadingDashboard] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  // ====================================================
  // LOAD DASHBOARD DATA
  // ====================================================

  useEffect(() => {
    const loadDashboard = async () => {
      const storedUser = getStoredUser();

      setUser(storedUser);

      const token = getAuthToken();

      if (!token) {
        setLoadingDashboard(false);
        return;
      }

      try {
        setErrorMessage("");

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        // =================================================
        // 1. LOAD TOPICS
        // =================================================

        const topicsResponse = await fetch(
          `${API_URL}/topics`,
          {
            method: "GET",
            headers,
          }
        );

        if (topicsResponse.ok) {
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
        } else {
          console.log(
            "Topics could not be loaded."
          );
        }

        // =================================================
        // 2. LOAD STUDENT PROGRESS
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
        } else {
          console.log(
            "Student progress is not available yet."
          );
        }

        // =================================================
        // 3. LOAD AI EVALUATION ANALYSIS
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

            const score =
              analysis.percentage ??
              analysis.score ??
              analysis.prerequisiteScore;

            if (level) {
              setLearningLevel(
                capitalizeLevel(level)
              );

              setAnalysisAvailable(true);
            }

            if (
              score !== undefined &&
              score !== null
            ) {
              const numericScore =
                Number(score);

              if (Number.isFinite(numericScore)) {
                setLearningScore(
                  Math.round(numericScore)
                );
              }
            }
          }
        } else {
          console.log(
            "Evaluation analysis is not available yet."
          );
        }
      } catch (error) {
        console.error(
          "Dashboard loading error:",
          error
        );

        setErrorMessage(
          "Some dashboard data could not be loaded."
        );
      } finally {
        setLoadingDashboard(false);
      }
    };

    loadDashboard();
  }, []);

  // ====================================================
  // ORDERED TOPICS
  // ====================================================

  const orderedTopics = useMemo(() => {
    if (topics.length > 0) {
      return topics;
    }

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
  // GET TOPIC PROGRESS
  // ====================================================

  const getTopicProgress = (topic) => {
    if (!topic?.title) return null;

    return (
      progressMap[
        String(topic.title)
          .trim()
          .toLowerCase()
      ] || null
    );
  };

  // ====================================================
  // COMPLETED TOPICS
  // ====================================================

  const completedTopics =
    orderedTopics.filter((topic) => {
      const progress =
        getTopicProgress(topic);

      return (
        progress?.status === "completed" ||
        getProgressPercentage(progress) === 100
      );
    });

  // ====================================================
  // IN-PROGRESS TOPICS
  // ====================================================

  const inProgressTopics =
    orderedTopics.filter((topic) => {
      const progress =
        getTopicProgress(topic);

      return (
        progress?.status === "in_progress" &&
        getProgressPercentage(progress) < 100
      );
    });

  // ====================================================
  // CURRENT TOPIC
  // ====================================================

  const currentTopic = useMemo(() => {
    // First priority:
    // topic currently in progress
    if (inProgressTopics.length > 0) {
      return inProgressTopics[0];
    }

    // Otherwise first topic not completed
    return (
      orderedTopics.find((topic) => {
        const progress =
          getTopicProgress(topic);

        return !(
          progress?.status === "completed" ||
          getProgressPercentage(progress) === 100
        );
      }) || null
    );
  }, [
    orderedTopics,
    inProgressTopics,
    progressMap,
  ]);

  // ====================================================
  // CURRENT TOPIC PROGRESS
  // ====================================================

  const currentTopicProgress =
    currentTopic
      ? getTopicProgress(currentTopic)
      : null;

  const currentTopicPercentage =
    getProgressPercentage(
      currentTopicProgress
    );

  // ====================================================
  // OVERALL PROGRESS
  // ====================================================

  const totalTopics =
    orderedTopics.length || 18;

  const completedCount =
    completedTopics.length;

    
console.log("Total topics:", orderedTopics.length);
console.log("Progress records:", studentProgress);

console.table(
  orderedTopics.map((topic) => {
    const progress = getTopicProgress(topic);

    return {
      topic: topic.title,
      status: progress?.status ?? "NO RECORD",
      progressPercentage: progress?.progressPercentage ?? 0,
      completed:
        progress?.status === "completed" ||
        getProgressPercentage(progress) === 100,
    };
  })
);

  const overallProgress =
    totalTopics > 0
      ? Math.round(
          (completedCount / totalTopics) * 100
        )
      : 0;

  // ====================================================
  // QUIZ STATISTICS
  // ====================================================

  const quizAttempts =
    studentProgress.reduce(
      (total, item) =>
        total +
        Number(item?.quizAttempts || 0),
      0
    );

  const quizScores =
    studentProgress
      .map((item) =>
        Number(item?.bestQuizScore || 0)
      )
      .filter((score) => score > 0);

  const averageQuizScore =
    quizScores.length > 0
      ? Math.round(
          quizScores.reduce(
            (sum, score) =>
              sum + score,
            0
          ) / quizScores.length
        )
      : 0;

  const resourcesUsed =
    studentProgress.reduce(
      (total, item) =>
        total +
        Number(
          item?.completedLessons || 0
        ),
      0
    );

  // ====================================================
  // COURSE COMPLETION
  // ====================================================

  const courseCompleted =
    totalTopics > 0 &&
    completedCount === totalTopics;

  // ====================================================
  // LEVEL INDICATOR
  // ====================================================

  const levelIndex =
    learningLevel.toLowerCase() ===
    "slow"
      ? 0
      : learningLevel.toLowerCase() ===
        "advanced"
      ? 2
      : 1;

  // ====================================================
  // GREETING
  // ====================================================

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 17
      ? "Good afternoon"
      : "Good evening";

  const studentName =
    user?.name || "Student";

  // ====================================================
  // CONTINUE LEARNING
  // ====================================================

  const continueTopic =
    currentTopic?.title ||
    "Start your Java learning journey";

  const continueDescription =
    currentTopicPercentage > 0
      ? `Java Programming · ${currentTopicPercentage}% complete`
      : "Java Programming · Ready to start";

  // ====================================================
  // NEXT MILESTONE
  // ====================================================

  const nextTopicNumber =
    Math.min(
      completedCount + 1,
      totalTopics
    );

  // ====================================================
  // AI MESSAGE
  // ====================================================

  const aiMessage =
    learningLevel === "Advanced"
      ? "Excellent progress! Keep challenging yourself with the next topic and advanced practice."
      : learningLevel === "Slow"
      ? "Let's strengthen your fundamentals. Focus on the current topic before moving ahead."
      : "You're building a solid foundation. Continue learning consistently and complete your current topic.";

  // ====================================================
  // HANDLE CONTINUE LEARNING
  // ====================================================

  const handleContinueLearning = () => {
    if (!currentTopic) {
      onNav("learning-path");
      return;
    }

    onNav(
      "learning-resource",
      currentTopic
    );
  };

  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="p-6 space-y-6">

      {/* ==================================================
          GREETING
      ================================================== */}

      <div className="flex items-start justify-between">

        <div>
          <h2
            className="text-2xl font-800 text-indigo-950"
            style={{
              fontFamily:
                "'DM Sans', sans-serif",
              fontWeight: 800,
            }}
          >
            {greeting}, {studentName} 👋
          </h2>

          <p className="text-slate-500 mt-1">
            Your personalized AI learning
            journey continues.
            {loadingDashboard
              ? " Loading your latest progress..."
              : ` You have completed ${completedCount} of ${totalTopics} topics.`}
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
          🔥 Keep learning
        </div>

      </div>

      {/* ==================================================
          COURSE PROGRESS CARD
      ================================================== */}

      <div
        className="card p-5 overflow-hidden relative"
        style={{
          background:
            "linear-gradient(135deg, #1E1B4B, #312E81)",
        }}
      >

        <div
          className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, #06B6D4, transparent)",
          }}
        />

        <div className="relative flex items-center justify-between gap-4">

          <div className="flex items-center gap-4">

            <div className="text-4xl">
              {courseCompleted
                ? "🎓"
                : "📚"}
            </div>

            <div>

              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full mb-1.5"
                style={{
                  background:
                    courseCompleted
                      ? "rgba(16,185,129,0.2)"
                      : "rgba(59,130,246,0.2)",
                  border:
                    "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <span className="text-xs font-semibold text-white">
                  {courseCompleted
                    ? "Course Completed!"
                    : "Learning In Progress"}
                </span>
              </div>

              <div
                className="font-700 text-white text-base"
                style={{
                  fontFamily:
                    "'DM Sans', sans-serif",
                  fontWeight: 700,
                }}
              >
                Java Programming
                & Data Structures
              </div>

              <div className="flex items-center gap-4 mt-1 flex-wrap">

                <span className="text-indigo-300 text-sm">
                  {overallProgress}% Complete
                </span>

                <span className="text-indigo-300 text-sm">
                  Topics:{" "}
                  <strong className="text-white">
                    {completedCount}/
                    {totalTopics}
                  </strong>
                </span>

                <span className="text-indigo-300 text-sm">
                  Quiz Attempts:{" "}
                  <strong className="text-white">
                    {quizAttempts}
                  </strong>
                </span>

              </div>

            </div>

          </div>

          {courseCompleted ? (
            <button
              onClick={() =>
                onNav(
                  "certificate-preview"
                )
              }
              className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background:
                  "rgba(255,255,255,0.15)",
                border:
                  "1px solid rgba(255,255,255,0.25)",
                color: "white",
              }}
            >
              View Certificate →
            </button>
          ) : (
            <button
              onClick={() =>
                onNav("learning-path")
              }
              className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background:
                  "rgba(255,255,255,0.15)",
                border:
                  "1px solid rgba(255,255,255,0.25)",
                color: "white",
              }}
            >
              View Learning Path →
            </button>
          )}

        </div>

        <div className="relative mt-4">

          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">

            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${overallProgress}%`,
                background:
                  "linear-gradient(90deg,#22D3EE,#34D399)",
              }}
            />

          </div>

        </div>

      </div>

      {/* ==================================================
          TOP STATISTICS
      ================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* AI CLASSIFICATION */}

        <div
          className="card p-5"
          style={{
            background:
              "linear-gradient(135deg,#4F46E5,#312E81)",
            color: "white",
          }}
        >

          <div
            className="ai-chip mb-3"
            style={{
              background:
                "rgba(255,255,255,0.15)",
              color: "white",
              borderColor:
                "rgba(255,255,255,0.3)",
            }}
          >
            🤖 AI Classification
          </div>

          <div
            className="text-3xl font-black mb-1"
            style={{
              fontFamily:
                "'DM Sans', sans-serif",
            }}
          >
            {loadingDashboard
              ? "Analyzing..."
              : learningLevel}
          </div>

          <div className="text-indigo-200 text-sm mb-3">
            {analysisAvailable
              ? `AI Score: ${learningScore}/100`
              : "Waiting for evaluation analysis"}
          </div>

          <div className="flex gap-1">

            {[
              "Slow",
              "Average",
              "Advanced",
            ].map((level, index) => (
              <div
                key={level}
                className={`flex-1 h-1.5 rounded-full ${
                  index === levelIndex
                    ? "bg-cyan-400"
                    : "bg-white/20"
                }`}
              />
            ))}

          </div>

          <p className="text-indigo-200 text-xs mt-2">
            Based on your latest learning
            performance and AI evaluation.
          </p>

        </div>

        {/* OVERALL PROGRESS */}

        <div className="card p-5">

          <div className="text-sm font-semibold text-slate-500 mb-3">
            Overall Progress
          </div>

          <div className="flex items-end justify-between mb-4">

            <div
              className="text-3xl font-black text-indigo-900"
              style={{
                fontFamily:
                  "'DM Sans', sans-serif",
              }}
            >
              {overallProgress}%
            </div>

            <div className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
              {completedCount} completed
            </div>

          </div>

          <div className="space-y-2">

            <div className="flex justify-between text-xs text-slate-500">
              <span>Topics Completed</span>

              <span className="font-semibold">
                {completedCount} /{" "}
                {totalTopics}
              </span>
            </div>

            <div className="flex justify-between text-xs text-slate-500">
              <span>Avg Quiz Score</span>

              <span className="font-semibold">
                {averageQuizScore}%
              </span>
            </div>

            <div className="flex justify-between text-xs text-slate-500">
              <span>Lessons Completed</span>

              <span className="font-semibold">
                {resourcesUsed}
              </span>
            </div>

          </div>

        </div>

        {/* CONTINUE LEARNING */}

        <div className="card p-5">

          <div className="text-sm font-semibold text-slate-500 mb-2">
            Continue Learning
          </div>

          <div className="flex items-center gap-2 mb-3">

            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-xl">
              📘
            </div>

            <div className="min-w-0">

              <div className="font-semibold text-slate-800 text-sm truncate">
                {continueTopic}
              </div>

              <div className="text-xs text-slate-400">
                {continueDescription}
              </div>

            </div>

          </div>

          <div className="progress-bar mb-3">

            <div
              className="progress-fill"
              style={{
                width: `${currentTopicPercentage}%`,
              }}
            />

          </div>

          <button
            onClick={handleContinueLearning}
            className="btn-primary w-full justify-center text-sm py-2"
          >
            {currentTopicPercentage > 0
              ? "Continue →"
              : "Start Learning →"}
          </button>

        </div>

      </div>

      {/* ==================================================
          AI LEARNING INSIGHTS
      ================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* AI INSIGHT */}

        <div
          className="lg:col-span-2 rounded-2xl p-6 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg,#EEF2FF,#F5F3FF,#ECFEFF)",
            border:
              "1px solid #E0E7FF",
          }}
        >

          <div
            className="absolute -right-16 -top-16 w-44 h-44 rounded-full opacity-40"
            style={{
              background:
                "radial-gradient(circle,#818CF8,transparent)",
            }}
          />

          <div
            className="absolute -left-10 -bottom-16 w-32 h-32 rounded-full opacity-30"
            style={{
              background:
                "radial-gradient(circle,#22D3EE,transparent)",
            }}
          />

          <div className="relative">

            <div className="flex items-center justify-between mb-5">

              <div>

                <div className="flex items-center gap-2 mb-1">

                  <span className="text-xl">
                    ✨
                  </span>

                  <h3
                    className="font-800 text-indigo-950 text-lg"
                    style={{
                      fontFamily:
                        "'DM Sans', sans-serif",
                      fontWeight: 800,
                    }}
                  >
                    AI Learning Insights
                  </h3>

                </div>

                <p className="text-xs text-slate-500">
                  Personalized insight from your
                  learning activity
                </p>

              </div>

              <div className="px-3 py-1.5 rounded-full bg-white border border-indigo-100 text-xs font-semibold text-indigo-600">
                🤖 AI Powered
              </div>

            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white mb-5">

              <div className="flex gap-3">

                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-xl flex-shrink-0">
                  💡
                </div>

                <div>

                  <div className="font-semibold text-slate-800 text-sm">
                    {learningLevel ===
                    "Advanced"
                      ? "You're progressing strongly!"
                      : learningLevel ===
                        "Slow"
                      ? "Let's strengthen your fundamentals."
                      : "You're building a solid foundation."}
                  </div>

                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {aiMessage}
                  </p>

                </div>

              </div>

            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

              <div className="bg-white rounded-xl p-3 border border-slate-100">
                <div className="text-xs text-slate-400">
                  AI Level
                </div>

                <div className="font-bold text-indigo-700 mt-1">
                  {learningLevel}
                </div>
              </div>

              <div className="bg-white rounded-xl p-3 border border-slate-100">
                <div className="text-xs text-slate-400">
                  Progress
                </div>

                <div className="font-bold text-indigo-700 mt-1">
                  {overallProgress}%
                </div>
              </div>

              <div className="bg-white rounded-xl p-3 border border-slate-100">
                <div className="text-xs text-slate-400">
                  Quiz Score
                </div>

                <div className="font-bold text-emerald-600 mt-1">
                  {averageQuizScore}%
                </div>
              </div>

              <div className="bg-white rounded-xl p-3 border border-slate-100">
                <div className="text-xs text-slate-400">
                  Topics
                </div>

                <div className="font-bold text-purple-600 mt-1">
                  {completedCount}/
                  {totalTopics}
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* LEARNING STREAK */}

        <div
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(145deg,#FFF7ED,#FFFBEB)",
            border:
              "1px solid #FED7AA",
          }}
        >

          <div
            className="absolute -right-8 -top-8 w-28 h-28 rounded-full"
            style={{
              background:
                "radial-gradient(circle,#FDBA74,transparent)",
              opacity: 0.5,
            }}
          />

          <div className="relative">

            <div className="flex items-center justify-between mb-4">

              <div>

                <div className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
                  Keep Going
                </div>

                <h3
                  className="text-lg font-800 text-orange-950 mt-1"
                  style={{
                    fontFamily:
                      "'DM Sans', sans-serif",
                    fontWeight: 800,
                  }}
                >
                  🔥 Learning Streak
                </h3>

              </div>

              <div className="text-3xl">
                🔥
              </div>

            </div>

            <div className="flex items-end gap-2 mb-1">

              <span
                className="text-5xl font-black text-orange-600"
                style={{
                  fontFamily:
                    "'DM Sans', sans-serif",
                }}
              >
                {completedCount}
              </span>

              <span className="text-sm text-orange-700 mb-2">
                topics completed
              </span>

            </div>

            <p className="text-xs text-orange-700 mb-5">
              Every completed topic moves you
              closer to your learning goal.
            </p>

            <div className="bg-white/70 rounded-xl p-3 border border-orange-100">

              <div className="flex justify-between text-xs mb-2">

                <span className="text-slate-500">
                  Learning progress
                </span>

                <span className="font-semibold text-orange-600">
                  {overallProgress}%
                </span>

              </div>

              <div className="w-full h-2 rounded-full bg-orange-100 overflow-hidden">

                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${overallProgress}%`,
                    background:
                      "linear-gradient(90deg,#F97316,#F59E0B)",
                  }}
                />

              </div>

            </div>

            <div className="mt-4 text-xs text-orange-700">
              💪 Stay consistent and keep learning!
            </div>

          </div>

        </div>

      </div>

      {/* ==================================================
          NEXT MILESTONE
      ================================================== */}

      <div
        className="rounded-2xl p-5"
        style={{
          background:
            "linear-gradient(135deg,#1E1B4B,#312E81)",
        }}
      >

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

          <div className="flex items-center gap-4">

            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{
                background:
                  "rgba(255,255,255,0.12)",
              }}
            >
              🎯
            </div>

            <div>

              <div className="text-xs text-indigo-300 uppercase tracking-wide font-semibold">
                Your Next Milestone
              </div>

              <div className="text-white font-bold text-base mt-1">

                {courseCompleted
                  ? "Learning journey completed! 🎉"
                  : currentTopic
                  ? `Complete "${currentTopic.title}"`
                  : "Start your learning journey"}

              </div>

              <div className="text-indigo-300 text-xs mt-1">

                {courseCompleted
                  ? "Review your performance and certificate."
                  : `Topic ${nextTopicNumber} of ${totalTopics}`}

              </div>

            </div>

          </div>

          {!courseCompleted &&
            currentTopic && (
              <button
                onClick={handleContinueLearning}
                className="px-5 py-2.5 rounded-lg bg-white text-indigo-700 text-sm font-semibold hover:bg-indigo-50 transition-all"
              >
                Continue Learning →
              </button>
            )}

        </div>

      </div>

      {/* ==================================================
          QUICK ACTIONS
      ================================================== */}

      <div className="card p-5">

        <div className="mb-4">

          <h3
            className="font-800 text-slate-900 text-lg"
            style={{
              fontFamily:
                "'DM Sans', sans-serif",
              fontWeight: 800,
            }}
          >
            ⚡ Quick Actions
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            Access your learning tools quickly
          </p>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

          {/* Continue Learning */}

          <button
            onClick={handleContinueLearning}
            className="text-left p-4 rounded-xl border border-indigo-100 bg-indigo-50 hover:bg-indigo-100 hover:-translate-y-1 transition-all"
          >

            <div className="text-2xl mb-2">
              📚
            </div>

            <div className="font-semibold text-sm text-indigo-950">
              Continue Learning
            </div>

            <div className="text-xs text-indigo-500 mt-1 truncate">
              {currentTopic
                ? currentTopic.title
                : "Start learning"}
            </div>

          </button>

          {/* Smart Quiz */}

          <button
            onClick={() =>
              onNav("smart-quiz")
            }
            className="text-left p-4 rounded-xl border border-pink-100 bg-pink-50 hover:bg-pink-100 hover:-translate-y-1 transition-all"
          >

            <div className="text-2xl mb-2">
              🧠
            </div>

            <div className="font-semibold text-sm text-pink-950">
              Smart Quiz
            </div>

            <div className="text-xs text-pink-500 mt-1">
              Test your knowledge
            </div>

          </button>

          {/* Performance */}

          <button
            onClick={() =>
              onNav("performance")
            }
            className="text-left p-4 rounded-xl border border-emerald-100 bg-emerald-50 hover:bg-emerald-100 hover:-translate-y-1 transition-all"
          >

            <div className="text-2xl mb-2">
              📊
            </div>

            <div className="font-semibold text-sm text-emerald-950">
              Performance
            </div>

            <div className="text-xs text-emerald-600 mt-1">
              View your analysis
            </div>

          </button>

          {/* AI Recommendations */}

          <button
            onClick={() =>
              onNav("recommendations")
            }
            className="text-left p-4 rounded-xl border border-purple-100 bg-purple-50 hover:bg-purple-100 hover:-translate-y-1 transition-all"
          >

            <div className="text-2xl mb-2">
              ✨
            </div>

            <div className="font-semibold text-sm text-purple-950">
              AI Recommendations
            </div>

            <div className="text-xs text-purple-500 mt-1">
              Personalized for you
            </div>

          </button>

        </div>

      </div>

      {/* ==================================================
          LEARNING JOURNEY
      ================================================== */}

      <div className="card p-5">

        <div className="flex items-center justify-between mb-5">

          <div>

            <h3
              className="font-800 text-slate-900 text-lg"
              style={{
                fontFamily:
                  "'DM Sans', sans-serif",
                fontWeight: 800,
              }}
            >
              🗺️ Your Learning Journey
            </h3>

            <p className="text-xs text-slate-400 mt-1">
              Your progress through the
              personalized Java path
            </p>

          </div>

          <button
            onClick={() =>
              onNav("learning-path")
            }
            className="text-xs text-indigo-600 hover:underline"
          >
            Open Full Path →
          </button>

        </div>

        <div className="relative">

          {/* Progress line */}

          <div className="absolute left-5 right-5 top-5 h-1 bg-slate-100 rounded-full">

            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${overallProgress}%`,
                background:
                  "linear-gradient(90deg,#4F46E5,#06B6D4)",
              }}
            />

          </div>

          <div className="relative flex justify-between">

            {/* START */}

            <div className="flex flex-col items-center">

              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold border-4 border-white shadow-sm"
                style={{
                  background:
                    completedCount > 0
                      ? "#10B981"
                      : "#CBD5E1",
                }}
              >
                {completedCount > 0
                  ? "✓"
                  : "1"}
              </div>

              <div className="text-xs font-semibold text-slate-700 mt-2">
                Started
              </div>

            </div>

            {/* CURRENT */}

            <div className="flex flex-col items-center">

              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold border-4 border-white shadow-sm"
                style={{
                  background:
                    "#4F46E5",
                }}
              >
                →
              </div>

              <div className="text-xs font-semibold text-indigo-700 mt-2">
                Current
              </div>

            </div>

            {/* MIDWAY */}

            <div className="flex flex-col items-center">

              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-white shadow-sm"
                style={{
                  background:
                    overallProgress >= 50
                      ? "#06B6D4"
                      : "#E2E8F0",
                  color:
                    overallProgress >= 50
                      ? "white"
                      : "#94A3B8",
                }}
              >
                9
              </div>

              <div className="text-xs font-semibold text-slate-500 mt-2">
                Midway
              </div>

            </div>

            {/* COMPLETE */}

            <div className="flex flex-col items-center">

              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-white shadow-sm"
                style={{
                  background:
                    courseCompleted
                      ? "#10B981"
                      : "#E2E8F0",
                  color:
                    courseCompleted
                      ? "white"
                      : "#94A3B8",
                }}
              >
                🏆
              </div>

              <div className="text-xs font-semibold text-slate-500 mt-2">
                Complete
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ==================================================
          ERROR / INFORMATION
      ================================================== */}

      {errorMessage && (
        <div className="text-xs text-slate-400 text-center">
          {errorMessage}
        </div>
      )}

    </div>
  );
}