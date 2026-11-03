import { useEffect, useState } from "react";

// ============================================================
// STATUS CONFIGURATION
// ============================================================

const statusConfig = {
  done: {
    label: "Completed",
    color: "#10B981",
    bg: "#ECFDF5",
    icon: "✓",
  },

  current: {
    label: "Current",
    color: "#4F46E5",
    bg: "#EEF2FF",
    icon: "→",
  },

  locked: {
    label: "Locked",
    color: "#94A3B8",
    bg: "#F8FAFC",
    icon: "🔒",
  },
};

// ============================================================
// API
// ============================================================

const API_URL = "http://localhost:5000/api";

// ============================================================
// LEARNING PATH COMPONENT
// ============================================================

export default function LearningPath({ onNav }) {
  const [topics, setTopics] = useState([]);
  const [progress, setProgress] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // FETCH TOPICS + STUDENT PROGRESS
  // ============================================================

  useEffect(() => {
    const fetchLearningPath = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setError(
            "Authentication token not found. Please login again."
          );
          setLoading(false);
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        // ------------------------------------------------------
        // FETCH TOPICS
        // ------------------------------------------------------

        const topicsResponse = await fetch(
          `${API_URL}/topics`,
          {
            method: "GET",
            headers,
          }
        );

        const topicsData = await topicsResponse.json();

        if (!topicsResponse.ok) {
          throw new Error(
            topicsData.message || "Failed to fetch topics."
          );
        }

        // ------------------------------------------------------
        // FETCH STUDENT PROGRESS
        // ------------------------------------------------------

        const progressResponse = await fetch(
          `${API_URL}/progress`,
          {
            method: "GET",
            headers,
          }
        );

        const progressData = await progressResponse.json();

        if (!progressResponse.ok) {
          throw new Error(
            progressData.message ||
              "Failed to fetch student progress."
          );
        }

        // ------------------------------------------------------
        // STORE DATA
        // ------------------------------------------------------

        const fetchedTopics = topicsData.topics || [];
        const fetchedProgress = progressData.progress || [];

        // Make sure topics are in correct order
        fetchedTopics.sort(
          (a, b) => (a.order || 0) - (b.order || 0)
        );

        setTopics(fetchedTopics);
        setProgress(fetchedProgress);

        console.log("📚 Topics:", fetchedTopics);
        console.log("📊 Student Progress:", fetchedProgress);
      } catch (err) {
        console.error(
          "Learning path fetch error:",
          err
        );

        setError(
          err.message ||
            "Unable to load your learning path."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPath();
  }, []);

  // ============================================================
  // CHECK WHETHER TOPIC IS COMPLETED
  // ============================================================

  const isTopicCompleted = (topic) => {
    const topicProgress = progress.find(
      (item) =>
        item.topic?.trim().toLowerCase() ===
        topic.title?.trim().toLowerCase()
    );

    if (!topicProgress) {
      return false;
    }

    return (
      topicProgress.status === "completed" ||
      Number(topicProgress.progressPercentage) >= 100
    );
  };

  // ============================================================
  // GET TOPIC STATUS
  // ============================================================

  const getTopicStatus = (topic, index) => {
    // ----------------------------------------------------------
    // 1. Completed topic
    // ----------------------------------------------------------

    if (isTopicCompleted(topic)) {
      return "done";
    }

    // ----------------------------------------------------------
    // 2. Find first incomplete topic
    // ----------------------------------------------------------

    const firstIncompleteIndex = topics.findIndex(
      (item) => !isTopicCompleted(item)
    );

    // ----------------------------------------------------------
    // 3. First incomplete topic = CURRENT
    // ----------------------------------------------------------

    if (index === firstIncompleteIndex) {
      return "current";
    }

    // ----------------------------------------------------------
    // 4. Everything after current = LOCKED
    // ----------------------------------------------------------

    return "locked";
  };

  // ============================================================
  // HANDLE TOPIC CLICK
  // ============================================================

  const handleTopicClick = (topic, status) => {
    if (status === "locked") {
      return;
    }

    // Send complete topic object to App.jsx
    onNav("learning-resource", topic);
  };

  // ============================================================
  // REFRESH LEARNING PATH
  // ============================================================

  const refreshLearningPath = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      const response = await fetch(
        `${API_URL}/progress`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setProgress(data.progress || []);
      }
    } catch (error) {
      console.error(
        "Refresh progress error:",
        error
      );
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-3xl mx-auto">
          <div className="card p-8 text-center">
            <div className="text-3xl mb-3">
              ⏳
            </div>

            <h3 className="font-bold text-slate-900">
              Loading your learning path...
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Fetching topics and your learning progress.
            </p>
          </div>
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
        <div className="max-w-3xl mx-auto">
          <div className="card p-8 text-center">
            <div className="text-3xl mb-3">
              ⚠️
            </div>

            <h3 className="font-bold text-red-700">
              Unable to load learning path
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              {error}
            </p>

            <button
              onClick={() =>
                window.location.reload()
              }
              className="btn-primary mt-4"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // CALCULATE STATISTICS
  // ============================================================

  const completedCount = topics.filter(
    (topic) => isTopicCompleted(topic)
  ).length;

  const currentCount =
    topics.length > 0 &&
    completedCount < topics.length
      ? 1
      : 0;

  const lockedCount = Math.max(
    topics.length -
      completedCount -
      currentCount,
    0
  );

  // Final evaluation is available only after all 18 Java topics are completed.
  const REQUIRED_TOPIC_COUNT = 18;
  const allTopicsCompleted =
    topics.length === REQUIRED_TOPIC_COUNT &&
    completedCount === REQUIRED_TOPIC_COUNT;

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">

        {/* ======================================================
            AI EXPLANATION
        ======================================================= */}

        <div
          className="card p-4 mb-6"
          style={{
            borderLeft:
              "4px solid #4F46E5",
          }}
        >
          <div className="ai-chip mb-2">
            🤖 AI Path Builder
          </div>

          <p className="text-sm text-slate-700">
            Your personalized Java learning path
            contains{" "}
            <strong>
              {topics.length} topics
            </strong>
            . Complete each topic, practice the
            concepts, and then take the topic
            assessment to measure your mastery.
          </p>
        </div>

        {/* ======================================================
            STATISTICS
        ======================================================= */}

        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            {
              label: "Completed",
              val: completedCount,
              color: "#10B981",
            },
            {
              label: "Current",
              val: currentCount,
              color: "#4F46E5",
            },
            {
              label: "Locked",
              val: lockedCount,
              color: "#94A3B8",
            },
            {
              label: "Total Topics",
              val: topics.length,
              color: "#06B6D4",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="card p-3 text-center"
            >
              <div
                className="text-2xl font-black"
                style={{
                  fontFamily:
                    "'DM Sans', sans-serif",
                  color: item.color,
                }}
              >
                {item.val}
              </div>

              <div className="text-xs text-slate-500 mt-0.5">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* ======================================================
            TOPIC PATH
        ======================================================= */}

        <div className="relative">

          {topics.map((topic, index) => {
            const status =
              getTopicStatus(topic, index);

            const config =
              statusConfig[status];

            const isCurrent =
              status === "current";

            const isCompleted =
              status === "done";

            return (
              <div
                key={topic._id}
                className="relative flex gap-4 mb-0"
              >

                {/* ==================================================
                    CONNECTOR
                =================================================== */}

                <div className="flex flex-col items-center">

                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 z-10 border-2"
                    style={{
                      background:
                        config.bg,

                      borderColor:
                        config.color,

                      color:
                        config.color,

                      boxShadow:
                        isCurrent
                          ? `0 0 0 4px ${config.color}25`
                          : "none",
                    }}
                  >
                    {isCompleted
                      ? "✓"
                      : index + 1}
                  </div>

                  {index <
                    topics.length - 1 && (
                    <div
                      className="w-0.5 flex-1 min-h-8"
                      style={{
                        background:
                          isCompleted
                            ? "#10B981"
                            : "#E2E8F0",
                      }}
                    />
                  )}
                </div>

                {/* ==================================================
                    TOPIC CARD
                =================================================== */}

                <div
                  className={`card p-4 flex-1 mb-4 ${
                    isCurrent
                      ? "border-2 border-indigo-400 shadow-md"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">

                    {/* ==================================================
                        TOPIC INFORMATION
                    =================================================== */}

                    <div className="flex-1">

                      <div className="flex items-center gap-2 flex-wrap mb-1">

                        {/* STATUS */}

                        <span
                          className="badge text-xs"
                          style={{
                            background:
                              config.bg,

                            color:
                              config.color,
                          }}
                        >
                          {config.label}
                        </span>

                        {/* TOPIC NUMBER */}

                        <span className="badge bg-slate-100 text-slate-600">
                          Topic {topic.order}
                        </span>

                        {/* CURRENT FOCUS */}

                        {isCurrent && (
                          <span className="ai-chip text-xs">
                            Current Focus
                          </span>
                        )}

                      </div>

                      {/* TOPIC TITLE */}

                      <h3
                        className="font-700 text-slate-900 mb-0.5"
                        style={{
                          fontFamily:
                            "'DM Sans', sans-serif",
                          fontWeight: 700,
                        }}
                      >
                        {topic.title}
                      </h3>

                      {/* DESCRIPTION */}

                      <p className="text-xs text-slate-500">
                        {topic.description ||
                          "Learn this Java topic and test your understanding through the topic assessment."}
                      </p>

                      {/* TOPIC INFORMATION */}

                      <div className="flex items-center gap-3 mt-2">

                        <span className="text-xs text-slate-400">
                          📚 {topic.subject}
                        </span>

                        <span className="text-xs text-slate-400">
                          📝 30 Questions
                        </span>

                        <span className="text-xs text-slate-400">
                          🎯 100 Marks
                        </span>

                      </div>

                      {/* COMPLETED INFORMATION */}

                      {isCompleted && (
                        <div className="text-xs text-emerald-600 font-medium mt-2">
                          ✓ Topic completed
                        </div>
                      )}

                    </div>

                    {/* ==================================================
                        ACTION BUTTON
                    =================================================== */}

                    {isCurrent && (
                      <button
                        onClick={() =>
                          handleTopicClick(
                            topic,
                            status
                          )
                        }
                        className="btn-primary text-xs py-1.5 px-3 flex-shrink-0"
                      >
                        Start Learning →
                      </button>
                    )}

                    {isCompleted && (
                      <button
                        onClick={() =>
                          handleTopicClick(
                            topic,
                            status
                          )
                        }
                        className="btn-secondary text-xs py-1.5 px-3 flex-shrink-0"
                      >
                        Review →
                      </button>
                    )}

                    {status === "locked" && (
                      <button
                        disabled
                        className="btn-secondary text-xs py-1.5 px-3 flex-shrink-0 opacity-60 cursor-not-allowed"
                      >
                        🔒 Locked
                      </button>
                    )}

                  </div>
                </div>
              </div>
            );
          })}

        </div>

        {/* ======================================================
            EMPTY STATE
        ======================================================= */}

        {topics.length === 0 && (
          <div className="card p-8 text-center">

            <div className="text-4xl mb-3">
              📚
            </div>

            <h3 className="font-bold text-slate-900">
              No topics available
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              No active learning topics were found.
            </p>

          </div>
        )}

        {/* ======================================================
            FINAL EVALUATION
        ======================================================= */}

        <div
          className="mt-6 card p-5 sm:p-6"
          style={{
            borderLeft: "4px solid #059669",
            background: "linear-gradient(135deg, #F0FDF4, #ECFDF5)",
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="flex items-start gap-3 min-w-0">
              <div className="text-3xl flex-shrink-0" aria-hidden="true">
                🎓
              </div>

              <div className="min-w-0">
                <h2
                  className="text-lg font-bold text-slate-900 mb-1"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Final Step: Java Course Evaluation
                </h2>

                <p className="text-sm text-slate-600">
                  Complete all 18 Java topics to unlock the final evaluation.
                  Earn your Certificate of Completion by scoring at least 96
                  out of 100 marks.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                  {[
                    { label: "Java MCQs", value: "20 × 3 = 60" },
                    { label: "Java Coding", value: "10 × 4 = 40" },
                    { label: "Total Marks", value: "100" },
                    { label: "Certificate Pass Mark", value: "96/100" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg border border-emerald-100 bg-white/80 p-3"
                    >
                      <div className="text-sm font-bold text-emerald-700">
                        {item.value}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs text-slate-600">
                  <span>📚 {completedCount}/18 topics completed</span>
                  <span>
                    {allTopicsCompleted ? "✓ Ready to start" : "🔒 Complete all 18 topics first"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 w-full lg:w-auto">
              <button
                type="button"
                onClick={() => {
                  if (allTopicsCompleted && typeof onNav === "function") {
                    onNav("final-evaluation");
                  }
                }}
                disabled={!allTopicsCompleted}
                className={`btn-primary w-full lg:w-auto py-3 px-5 ${
                  !allTopicsCompleted
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                style={{ background: "#059669" }}
              >
                {allTopicsCompleted
                  ? "Start Final Evaluation →"
                  : "🔒 Complete All 18 Topics"}
              </button>

              {!allTopicsCompleted && (
                <p className="text-xs text-slate-500 mt-2 text-center lg:max-w-56">
                  Finish every Java topic and its required assessment to continue.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ======================================================
            DEBUG / REFRESH
            Remove later if not needed
        ======================================================= */}

        <div className="text-center mt-4">

          <button
            onClick={refreshLearningPath}
            className="text-xs text-slate-400 hover:text-indigo-600"
          >
            ↻ Refresh Progress
          </button>

        </div>

      </div>
    </div>
  );
}