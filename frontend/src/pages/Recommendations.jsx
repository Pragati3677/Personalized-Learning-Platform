import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5000/api";

const CATEGORIES = [
  "All",
  "Weak Areas",
  "Practice",
  "Revision",
  "Advanced",
];

const TYPE_COLORS = {
  Learn: "#4F46E5",
  Practice: "#10B981",
  Revision: "#06B6D4",
  Assessment: "#F59E0B",
  Advanced: "#7C3AED",
};

const DIFFICULTY_STYLES = {
  Beginner:
    "bg-emerald-100 text-emerald-700",
  Intermediate:
    "bg-amber-100 text-amber-700",
  Advanced:
    "bg-purple-100 text-purple-700",
};

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

function getLevel(value) {
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
// RECOMMENDATIONS
// ======================================================

export default function Recommendations({
  onNav,
}) {
  const [activeCategory, setActiveCategory] =
    useState("All");

  const [topics, setTopics] =
    useState([]);

  const [studentProgress, setStudentProgress] =
    useState([]);

  const [learningLevel, setLearningLevel] =
    useState("Average");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ====================================================
  // LOAD REAL STUDENT DATA
  // ====================================================

  useEffect(() => {
    const loadRecommendationData =
      async () => {
        const token = getToken();

        if (!token) {
          setLoading(false);
          setError(
            "Please login to view personalized recommendations."
          );
          return;
        }

        try {
          setError("");

          const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          };

          // ============================================
          // TOPICS
          // ============================================

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
              "Failed to load topics"
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

          // ============================================
          // STUDENT PROGRESS
          // ============================================

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

          // ============================================
          // AI LEARNING LEVEL
          // ============================================

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
                  getLevel(level)
                );
              }
            }
          }
        } catch (err) {
          console.error(
            "Recommendation loading error:",
            err
          );

          setError(
            "Unable to load personalized recommendations."
          );
        } finally {
          setLoading(false);
        }
      };

    loadRecommendationData();
  }, []);

  // ====================================================
  // CREATE PROGRESS MAP
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
  // TOPIC STATUS
  // ====================================================

  const topicStates = useMemo(() => {
    return topics.map((topic) => {
      const progress =
        progressMap[
          String(topic.title)
            .trim()
            .toLowerCase()
        ];

      const percentage =
        getPercentage(progress);

      const completed =
        progress?.status ===
          "completed" ||
        percentage === 100;

      const inProgress =
        progress?.status ===
        "in_progress";

      return {
        ...topic,
        progress,
        percentage,
        completed,
        inProgress,
      };
    });
  }, [topics, progressMap]);

  // ====================================================
  // CURRENT TOPIC
  // ====================================================

  const currentTopic =
    topicStates.find(
      (topic) =>
        !topic.completed &&
        topic.inProgress
    ) ||
    topicStates.find(
      (topic) => !topic.completed
    ) ||
    null;

  // ====================================================
  // NEXT TOPIC
  // ====================================================

  const nextTopic = currentTopic
    ? topicStates.find(
        (topic) =>
          Number(topic.order) ===
          Number(currentTopic.order) + 1
      )
    : null;

  // ====================================================
  // LOW PROGRESS TOPICS
  // ====================================================

  const weakTopics = useMemo(() => {
    return topicStates
      .filter(
        (topic) =>
          !topic.completed &&
          topic.percentage > 0
      )
      .sort(
        (a, b) =>
          a.percentage -
          b.percentage
      );
  }, [topicStates]);

  // ====================================================
  // COMPLETED TOPICS
  // ====================================================

  const completedTopics =
    topicStates.filter(
      (topic) => topic.completed
    );

  // ====================================================
  // BUILD RECOMMENDATIONS
  // ====================================================

  const recommendations = useMemo(() => {
    const result = [];

    // ================================================
    // 1. CURRENT TOPIC - LEARNING
    // ================================================

    if (currentTopic) {
      result.push({
        id: `learn-${currentTopic._id}`,
        category: "Practice",
        type: "📚 Learn",
        typeName: "Learning",
        topic: currentTopic.title,
        difficulty:
          learningLevel === "Advanced"
            ? "Advanced"
            : learningLevel === "Slow"
            ? "Beginner"
            : "Intermediate",
        time: "30–45 min",
        reason:
          currentTopic.percentage > 0
            ? `You are currently working on this topic with ${currentTopic.percentage}% progress. Continue learning before taking the assessment.`
            : "This is your next topic in the personalized Java learning path.",
        color:
          TYPE_COLORS.Learn,
        action: "learning",
        topicObject: currentTopic,
      });
    }

    // ================================================
    // 2. WEAK AREA
    // ================================================

    if (weakTopics.length > 0) {
      const weakTopic =
        weakTopics[0];

      result.push({
        id: `weak-${weakTopic._id}`,
        category: "Weak Areas",
        type: "💪 Practice",
        typeName: "Weak Area Practice",
        topic: weakTopic.title,
        difficulty: "Beginner",
        time: "30–45 min",
        reason:
          `Your current progress is ${weakTopic.percentage}%. Additional practice is recommended before moving ahead.`,
        color:
          "#EF4444",
        action: "learning",
        topicObject: weakTopic,
      });
    }

    // ================================================
    // 3. PRACTICE CURRENT TOPIC
    // ================================================

    if (currentTopic) {
      result.push({
        id: `practice-${currentTopic._id}`,
        category: "Practice",
        type: "💪 Practice",
        typeName: "Practice",
        topic: `${currentTopic.title} — Practice`,
        difficulty:
          learningLevel === "Slow"
            ? "Beginner"
            : "Intermediate",
        time: "30 min",
        reason:
          "Practice is recommended to strengthen your understanding before the topic assessment.",
        color:
          TYPE_COLORS.Practice,
        action: "learning",
        topicObject: currentTopic,
      });
    }

    // ================================================
    // 4. REVISION OF COMPLETED TOPIC
    // ================================================

    if (completedTopics.length > 0) {
      const revisionTopic =
        completedTopics[
          completedTopics.length - 1
        ];

      result.push({
        id: `revision-${revisionTopic._id}`,
        category: "Revision",
        type: "🔄 Revision",
        typeName: "Revision",
        topic: revisionTopic.title,
        difficulty: "Intermediate",
        time: "15–20 min",
        reason:
          `You have completed ${revisionTopic.title}. Revision helps reinforce previously learned concepts.`,
        color:
          TYPE_COLORS.Revision,
        action: "learning",
        topicObject:
          revisionTopic,
      });
    }

    // ================================================
    // 5. ASSESSMENT
    // ================================================

    if (
      currentTopic &&
      currentTopic.completed
    ) {
      result.push({
        id: `assessment-${currentTopic._id}`,
        category: "Practice",
        type: "📝 Assessment",
        typeName: "Topic Assessment",
        topic: `${currentTopic.title} — Assessment`,
        difficulty:
          learningLevel === "Advanced"
            ? "Advanced"
            : "Intermediate",
        time: "30 min",
        reason:
          "You have completed the learning resources. You can now evaluate your understanding through the topic assessment.",
        color:
          TYPE_COLORS.Assessment,
        action: "assessment",
        topicObject:
          currentTopic,
      });
    }

    // ================================================
    // 6. ADVANCED RECOMMENDATION
    // ================================================

    if (
      learningLevel === "Advanced" &&
      nextTopic
    ) {
      result.push({
        id: `advanced-${nextTopic._id}`,
        category: "Advanced",
        type: "🚀 Advanced",
        typeName: "Next-Level Learning",
        topic: nextTopic.title,
        difficulty: "Advanced",
        time: "30–45 min",
        reason:
          "Your AI learning level is Advanced. After completing the current topic, this is the next topic in your learning path.",
        color:
          TYPE_COLORS.Advanced,
        action: "learning",
        topicObject: nextTopic,
      });
    }

    // ================================================
    // 7. NEXT TOPIC PREVIEW
    // ================================================

    if (
      nextTopic &&
      learningLevel !== "Advanced"
    ) {
      result.push({
        id: `next-${nextTopic._id}`,
        category: "Revision",
        type: "👀 Preview",
        typeName: "Next Topic Preview",
        topic: nextTopic.title,
        difficulty: "Intermediate",
        time: "15 min",
        reason:
          "This is the next topic in your Java learning sequence. A short preview can prepare you for upcoming learning.",
        color:
          TYPE_COLORS.Revision,
        action: "learning",
        topicObject: nextTopic,
      });
    }

    return result;
  }, [
    currentTopic,
    nextTopic,
    weakTopics,
    completedTopics,
    learningLevel,
  ]);

  // ====================================================
  // FILTER
  // ====================================================

  const filteredRecommendations =
    activeCategory === "All"
      ? recommendations
      : recommendations.filter(
          (item) =>
            item.category ===
            activeCategory
        );

  // ====================================================
  // START RECOMMENDATION
  // ====================================================

  const handleStart = (recommendation) => {
    if (
      recommendation.action ===
      "assessment"
    ) {
      onNav?.(
        "smart-quiz",
        recommendation.topicObject
      );

      return;
    }

    onNav?.(
      "learning-resource",
      recommendation.topicObject
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

      <div>

        <div className="ai-chip mb-3">
          ✨ AI-Powered Recommendations
        </div>

        <h2
          className="text-xl text-indigo-950 mb-1"
          style={{
            fontFamily:
              "'DM Sans',sans-serif",
            fontWeight: 800,
          }}
        >
          Recommended For You
        </h2>

        <p className="text-slate-500 text-sm">
          Personalized recommendations based
          on your current topic, learning
          progress and AI learning level.
        </p>

      </div>

      {/* =================================================
          AI SUMMARY
      ================================================= */}

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

            <div className="text-xs uppercase tracking-wide font-semibold text-indigo-600">
              🤖 Your AI Learning Profile
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-2">

              <span className="px-3 py-1 rounded-full bg-white text-indigo-700 text-sm font-semibold border border-indigo-100">
                Level: {learningLevel}
              </span>

              {currentTopic && (
                <span className="px-3 py-1 rounded-full bg-white text-purple-700 text-sm font-semibold border border-purple-100">
                  Current:{" "}
                  {currentTopic.title}
                </span>
              )}

            </div>

          </div>

          <div className="text-sm text-slate-500 max-w-md">
            Recommendations adapt to your
            learning progress and current
            position in the Java learning path.
          </div>

        </div>

      </div>

      {/* =================================================
          CATEGORY TABS
      ================================================= */}

      <div className="flex gap-2 flex-wrap">

        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() =>
              setActiveCategory(
                category
              )
            }
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeCategory ===
              category
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
            }`}
          >
            {category}
          </button>
        ))}

      </div>

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div className="card p-10 text-center">

          <div className="text-4xl mb-3">
            🤖
          </div>

          <div className="font-semibold text-slate-700">
            Analyzing your learning progress...
          </div>

          <p className="text-xs text-slate-400 mt-1">
            Preparing personalized recommendations.
          </p>

        </div>
      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {!loading && error && (
        <div className="card p-6 text-center">

          <div className="text-3xl mb-2">
            ⚠️
          </div>

          <div className="text-sm text-red-500">
            {error}
          </div>

        </div>
      )}

      {/* =================================================
          NO RECOMMENDATIONS
      ================================================= */}

      {!loading &&
        !error &&
        filteredRecommendations.length ===
          0 && (
          <div className="card p-10 text-center">

            <div className="text-4xl mb-3">
              🎉
            </div>

            <div className="font-semibold text-slate-700">
              No recommendations in this category
            </div>

            <p className="text-xs text-slate-400 mt-1">
              Try another recommendation category.
            </p>

          </div>
        )}

      {/* =================================================
          RECOMMENDATION CARDS
      ================================================= */}

      {!loading &&
        !error &&
        filteredRecommendations.length >
          0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

            {filteredRecommendations.map(
              (recommendation) => (
                <div
                  key={recommendation.id}
                  className="card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all"
                >

                  {/* TOP */}

                  <div className="flex items-start justify-between mb-3">

                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{
                        background: `${recommendation.color}15`,
                      }}
                    >
                      {
                        recommendation.type.split(
                          " "
                        )[0]
                      }
                    </div>

                    <span
                      className={`badge text-xs ${
                        DIFFICULTY_STYLES[
                          recommendation
                            .difficulty
                        ]
                      }`}
                    >
                      {
                        recommendation.difficulty
                      }
                    </span>

                  </div>

                  {/* TYPE */}

                  <div className="text-xs text-slate-400 mb-1">
                    {
                      recommendation.typeName
                    }
                  </div>

                  {/* TOPIC */}

                  <h3
                    className="text-sm text-slate-900 mb-2"
                    style={{
                      fontFamily:
                        "'DM Sans',sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    {recommendation.topic}
                  </h3>

                  {/* TIME */}

                  <div className="text-xs text-slate-400 mb-3">
                    ⏱{" "}
                    {recommendation.time}
                  </div>

                  {/* REASON */}

                  <div
                    className="p-3 rounded-lg text-xs mb-4 leading-relaxed"
                    style={{
                      background: `${recommendation.color}10`,
                      color:
                        recommendation.color,
                      borderLeft: `3px solid ${recommendation.color}`,
                    }}
                  >
                    💡{" "}
                    {recommendation.reason}
                  </div>

                  {/* ACTION */}

                  <button
                    onClick={() =>
                      handleStart(
                        recommendation
                      )
                    }
                    className="btn-primary w-full justify-center text-sm py-2"
                  >
                    {recommendation.action ===
                    "assessment"
                      ? "Take Assessment →"
                      : "Start Learning →"}
                  </button>

                </div>
              )
            )}

          </div>
        )}

      {/* =================================================
          RECOMMENDATION LOGIC
      ================================================= */}

      {!loading && !error && (
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
              🧠
            </div>

            <div>

              <div className="font-semibold text-slate-800 text-sm">
                How recommendations are generated
              </div>

              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                The system checks your current
                Java topic, topic progress,
                completed topics and AI learning
                level. It then recommends the
                next suitable learning activity,
                such as learning, practice,
                revision or assessment.
              </p>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}