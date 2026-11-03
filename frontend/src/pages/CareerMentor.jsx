import { useEffect, useMemo, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const normalizeArray = (data, key) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.[key])) {
    return data[key];
  }

  return [];
};

export default function CareerMentor() {
  const [topics, setTopics] = useState([]);
  const [progress, setProgress] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // =====================================================
  // FETCH CAREER MENTOR DATA
  // =====================================================

  useEffect(() => {
    fetchCareerData();
  }, []);

  const fetchCareerData = async () => {
    try {
      setLoading(true);
      setError("");

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const [
        topicsResponse,
        progressResponse,
        analysisResponse,
        recommendationsResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/topics`, {
          headers,
        }),

        fetch(`${API_URL}/progress`, {
          headers,
        }),

        fetch(`${API_URL}/evaluation-analysis/my-analysis`, {
          headers,
        }),

        fetch(
          `${API_URL}/learning-recommendations/my-recommendations`,
          {
            headers,
          }
        ),
      ]);

      // -------------------------------------------------
      // CHECK RESPONSES
      // -------------------------------------------------

      if (!topicsResponse.ok) {
        throw new Error("Unable to load topics.");
      }

      if (!progressResponse.ok) {
        throw new Error("Unable to load learning progress.");
      }

      if (!analysisResponse.ok) {
        throw new Error("Unable to load evaluation analysis.");
      }

      if (!recommendationsResponse.ok) {
        throw new Error(
          "Unable to load AI recommendations."
        );
      }

      // -------------------------------------------------
      // PARSE RESPONSES
      // -------------------------------------------------

      const topicsData =
        await topicsResponse.json();

      const progressData =
        await progressResponse.json();

      const analysisData =
        await analysisResponse.json();

      const recommendationsData =
        await recommendationsResponse.json();

      // -------------------------------------------------
      // TOPICS
      // -------------------------------------------------

      setTopics(
        normalizeArray(
          topicsData,
          "topics"
        )
      );

      // -------------------------------------------------
      // PROGRESS
      // -------------------------------------------------

      setProgress(
        normalizeArray(
          progressData,
          "progress"
        )
      );

      // -------------------------------------------------
      // EVALUATION ANALYSIS
      //
      // Backend returns:
      // {
      //   success: true,
      //   count: ...,
      //   analysis: [...]
      // }
      //
      // Backend sorts newest first.
      // Therefore analysis[0] = latest analysis.
      // -------------------------------------------------

      if (
        Array.isArray(
          analysisData?.analysis
        )
      ) {
        setAnalysis(
          analysisData.analysis[0] || null
        );
      } else {
        setAnalysis(null);
      }

      // -------------------------------------------------
      // AI RECOMMENDATIONS
      // -------------------------------------------------

      setRecommendations(
        normalizeArray(
          recommendationsData,
          "recommendations"
        )
      );
    } catch (err) {
      console.error(
        "Career Mentor error:",
        err
      );

      setError(
        err.message ||
          "Unable to load Career Mentor data."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // TOPIC PROGRESS
  // =====================================================

  const topicData = useMemo(() => {
    return topics.map((topic) => {
      const topicProgress =
        progress.find(
          (item) =>
            item.topic === topic.title ||
            item.topicId?._id === topic._id ||
            item.topicId === topic._id
        );

      const percentage = Number(
        topicProgress?.progressPercentage || 0
      );

      let status = "not_started";

      if (percentage >= 100) {
        status = "completed";
      } else if (percentage > 0) {
        status = "in_progress";
      }

      return {
        ...topic,
        progress: percentage,
        status,
      };
    });
  }, [topics, progress]);

  // =====================================================
  // COMPLETED TOPICS
  // =====================================================

  const completedTopics = topicData.filter(
    (topic) => topic.progress >= 100
  );

  // =====================================================
  // WEAK TOPICS
  // =====================================================

  const weakTopics = topicData
    .filter(
      (topic) => topic.progress < 60
    )
    .sort(
      (a, b) => a.progress - b.progress
    );

  // =====================================================
  // CURRENT TOPIC
  // =====================================================

  const currentTopic =
    topicData.find(
      (topic) =>
        topic.progress > 0 &&
        topic.progress < 100
    ) ||
    topicData.find(
      (topic) => topic.progress === 0
    ) ||
    null;

  // =====================================================
  // AI LEARNING LEVEL
  // =====================================================

  const learningLevel =
    analysis?.performanceLevel ||
    "not_available";

  const formattedLevel =
    learningLevel === "not_available"
      ? "Not Available"
      : learningLevel
          .charAt(0)
          .toUpperCase() +
        learningLevel.slice(1);

  // =====================================================
  // SKILL ANALYSIS
  // =====================================================

  const skillData = useMemo(() => {
    return topicData.map((topic) => {
      let status = "Gap";

      if (topic.progress >= 80) {
        status = "Strong";
      } else if (topic.progress >= 60) {
        status = "Moderate";
      }

      return {
        name: topic.title,
        level: topic.progress,
        status,
      };
    });
  }, [topicData]);

  // =====================================================
  // CAREER FOCUS
  // =====================================================

  const careerFocus = useMemo(() => {
    if (weakTopics.length >= 3) {
      return {
        title: "Build Core Technical Skills",
        description:
          "Strengthen your current Java learning areas before moving to advanced placement preparation.",
      };
    }

    if (
      learningLevel === "advanced" &&
      completedTopics.length >= 12
    ) {
      return {
        title: "Advanced Placement Preparation",
        description:
          "Your learning progress supports moving towards advanced problem solving, projects and interview preparation.",
      };
    }

    if (
      completedTopics.length >= 6
    ) {
      return {
        title: "Strengthen Skills for Placement",
        description:
          "Continue improving your Java, problem-solving and practical development skills.",
      };
    }

    return {
      title: "Build Core Technical Skills",
      description:
        "Strengthen your Java fundamentals and complete more learning topics before moving to advanced placement preparation.",
    };
  }, [
    weakTopics,
    learningLevel,
    completedTopics,
  ]);

  // =====================================================
  // CAREER ROADMAP
  // =====================================================

  const roadmap = [
    {
      step: "Current Skills",
      desc:
        completedTopics.length > 0
          ? `${completedTopics.length} Java topics completed`
          : "Begin Java learning path",
    },

    {
      step: "Skill Gaps",
      desc:
        weakTopics.length > 0
          ? weakTopics
              .slice(0, 2)
              .map(
                (topic) => topic.title
              )
              .join(", ")
          : "No major topic gaps detected",
    },

    {
      step: "Recommended Learning",
      desc:
        currentTopic
          ? `Continue ${currentTopic.title}`
          : "Continue with the next available topic",
    },

    {
      step: "Practice",
      desc:
        "Complete topic assessments and advanced practice",
    },

    {
      step: "Projects",
      desc:
        "Build Java, backend and full-stack projects",
    },

    {
      step: "Placement Prep",
      desc:
        "Practice DSA, coding and technical interviews",
    },
  ];

  // =====================================================
  // PROJECT SUGGESTIONS
  // =====================================================

  const projectSuggestions = [
    "Java + MySQL Management System",
    "REST API using Node.js + Express",
    "AI-Powered Learning Platform",
    "Java DSA Problem-Solving Portfolio",
  ];

  // =====================================================
  // PLACEMENT PREPARATION
  // =====================================================

  const placementPreparation = [
    "Practice DSA regularly",
    "Strengthen OOP and Java fundamentals",
    "Revise DBMS and SQL concepts",
    "Practice coding interview questions",
    "Prepare project explanations",
    "Practice technical mock interviews",
  ];

  // =====================================================
  // RECOMMENDATION TOPIC
  // =====================================================

  const getRecommendationTopic = (
    recommendation
  ) => {
    if (
      recommendation?.topicId &&
      typeof recommendation.topicId ===
        "object"
    ) {
      return (
        recommendation.topicId.title ||
        "Current Topic"
      );
    }

    return "Current Learning Topic";
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="p-6">
        <div className="card p-8 text-center">
          <div className="text-3xl mb-3">
            🚀
          </div>

          <div className="font-semibold text-slate-700">
            Loading Career Mentor...
          </div>

          <div className="text-sm text-slate-400 mt-1">
            Analyzing your learning progress and
            AI recommendations.
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="p-6 space-y-5">

      {/* =================================================
          HEADER
      ================================================= */}

      <div>
        <div className="ai-chip mb-2">
          🚀 AI Career & Placement Mentor
        </div>

        <h2
          className="text-xl text-indigo-950 mb-1"
          style={{
            fontFamily:
              "'DM Sans',sans-serif",
            fontWeight: 800,
          }}
        >
          Your Career Roadmap
        </h2>

        <p className="text-slate-500 text-sm">
          Career guidance based on your actual
          learning progress, AI evaluation and
          identified skill gaps.
        </p>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* =================================================
          AI CAREER INSIGHT
      ================================================= */}

      <div
        className="card p-4"
        style={{
          borderLeft:
            "4px solid #4F46E5",
        }}
      >
        <div className="ai-chip mb-2">
          🤖 AI Career Insight
        </div>

        <p className="text-sm text-slate-700">
          Your current AI learning level is{" "}
          <strong>
            {formattedLevel}
          </strong>
          . You have completed{" "}
          <strong>
            {completedTopics.length}
          </strong>{" "}
          of{" "}
          <strong>
            {topicData.length || 18}
          </strong>{" "}
          Java topics.
          {currentTopic && (
            <>
              {" "}
              Your current learning focus is{" "}
              <strong>
                {currentTopic.title}
              </strong>
              .
            </>
          )}
        </p>

        {weakTopics.length > 0 && (
          <p className="text-sm text-slate-700 mt-2">
            Current skill gaps include{" "}
            <strong>
              {weakTopics
                .slice(0, 3)
                .map(
                  (topic) =>
                    topic.title
                )
                .join(", ")}
            </strong>
            . Focus on these areas before moving
            to more advanced placement preparation.
          </p>
        )}
      </div>

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="grid md:grid-cols-3 gap-4">

        {/* AI LEVEL */}

        <div className="card p-4">
          <div className="text-xs text-slate-400">
            AI Learning Level
          </div>

          <div className="text-xl font-bold text-indigo-700 mt-1">
            {formattedLevel}
          </div>
        </div>

        {/* TOPICS */}

        <div className="card p-4">
          <div className="text-xs text-slate-400">
            Topics Completed
          </div>

          <div className="text-xl font-bold text-emerald-600 mt-1">
            {completedTopics.length}/
            {topicData.length || 18}
          </div>
        </div>

        {/* CURRENT TOPIC */}

        <div className="card p-4">
          <div className="text-xs text-slate-400">
            Current Focus
          </div>

          <div className="text-sm font-bold text-slate-800 mt-2">
            {currentTopic?.title ||
              "Complete your first topic"}
          </div>
        </div>
      </div>

      {/* =================================================
          SKILL ANALYSIS + CAREER FOCUS
      ================================================= */}

      <div className="grid lg:grid-cols-2 gap-5">

        {/* SKILL ANALYSIS */}

        <div className="card p-5">

          <h3
            className="text-slate-900 mb-4"
            style={{
              fontFamily:
                "'DM Sans',sans-serif",
              fontWeight: 700,
            }}
          >
            Skill Analysis
          </h3>

          {skillData.length === 0 ? (
            <div className="text-sm text-slate-500">
              Start learning topics to build
              your skill analysis.
            </div>
          ) : (
            <div className="space-y-4">

              {skillData.map(
                (skill) => (
                  <div key={skill.name}>

                    <div className="flex justify-between items-center mb-1">

                      <span className="text-sm font-medium text-slate-700">
                        {skill.name}
                      </span>

                      <div className="flex items-center gap-2">

                        <span className="text-sm font-semibold">
                          {skill.level}%
                        </span>

                        <span
                          className={`badge text-xs ${
                            skill.status ===
                            "Strong"
                              ? "bg-emerald-100 text-emerald-700"
                              : skill.status ===
                                "Gap"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {skill.status}
                        </span>
                      </div>
                    </div>

                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${skill.level}%`,
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* CAREER FOCUS */}

        <div className="card p-5">

          <h3
            className="text-slate-900 mb-4"
            style={{
              fontFamily:
                "'DM Sans',sans-serif",
              fontWeight: 700,
            }}
          >
            Career Focus
          </h3>

          <div className="p-4 rounded-xl border-2 border-indigo-200 bg-indigo-50">

            <div className="flex items-center justify-between mb-2">

              <div className="font-semibold text-indigo-950">
                {careerFocus.title}
              </div>

              <span className="badge bg-indigo-600 text-white text-xs">
                AI Guided
              </span>
            </div>

            <p className="text-sm text-slate-600">
              {careerFocus.description}
            </p>
          </div>

          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200">

            <div className="text-xs text-slate-400">
              Placement Readiness Focus
            </div>

            <div className="text-sm font-semibold text-slate-800 mt-1">
              Java + DSA + Problem Solving
            </div>

            <p className="text-xs text-slate-500 mt-1">
              Continue building strong programming
              fundamentals and practical development
              skills.
            </p>
          </div>
        </div>
      </div>

      {/* =================================================
          AI LEARNING RECOMMENDATIONS
      ================================================= */}

      <div className="card p-5">

        <h3
          className="text-slate-900 mb-1"
          style={{
            fontFamily:
              "'DM Sans',sans-serif",
            fontWeight: 700,
          }}
        >
          AI Learning Recommendations
        </h3>

        <p className="text-xs text-slate-500 mb-4">
          Recommendations generated from your
          evaluation analysis.
        </p>

        {recommendations.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-500">
            Complete a topic evaluation to generate
            personalized AI recommendations.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">

            {recommendations
              .slice(0, 4)
              .map(
                (
                  recommendation,
                  index
                ) => (
                  <div
                    key={
                      recommendation._id ||
                      index
                    }
                    className="p-4 rounded-xl border border-slate-200"
                  >

                    <div className="flex items-center justify-between mb-2">

                      <span className="text-sm font-semibold text-slate-800">
                        {getRecommendationTopic(
                          recommendation
                        )}
                      </span>

                      <span className="badge bg-indigo-100 text-indigo-700 text-xs capitalize">
                        {recommendation.performanceLevel ||
                          "AI"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mb-3">
                      {recommendation.recommendationReason ||
                        "Personalized learning recommendation"}
                    </p>

                    {Array.isArray(
                      recommendation.recommendedActivities
                    ) &&
                      recommendation
                        .recommendedActivities
                        .slice(0, 3)
                        .map(
                          (
                            activity
                          ) => (
                            <div
                              key={
                                activity
                              }
                              className="flex items-start gap-2 py-1 text-xs text-slate-600"
                            >
                              <span className="text-indigo-500">
                                →
                              </span>

                              <span>
                                {activity}
                              </span>
                            </div>
                          )
                        )}
                  </div>
                )
              )}
          </div>
        )}
      </div>

      {/* =================================================
          CAREER ROADMAP
      ================================================= */}

      <div className="card p-5">

        <h3
          className="text-slate-900 mb-5"
          style={{
            fontFamily:
              "'DM Sans',sans-serif",
            fontWeight: 700,
          }}
        >
          Career Roadmap
        </h3>

        <div className="flex flex-wrap gap-0">

          {roadmap.map(
            (item, index) => (
              <div
                key={item.step}
                className="flex items-center"
              >

                <div className="text-center px-3">

                  <div
                    className="w-10 h-10 rounded-full mx-auto flex items-center justify-center text-white text-sm font-bold mb-2"
                    style={{
                      background:
                        index === 0
                          ? "#10B981"
                          : index === 1
                          ? "#EF4444"
                          : "#4F46E5",
                    }}
                  >
                    {index + 1}
                  </div>

                  <div className="text-xs font-semibold text-slate-800 w-24">
                    {item.step}
                  </div>

                  <div className="text-xs text-slate-500 mt-0.5 w-24">
                    {item.desc}
                  </div>
                </div>

                {index <
                  roadmap.length - 1 && (
                  <div className="text-slate-300 text-xl mb-8 mx-1">
                    →
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* =================================================
          PROJECTS + PLACEMENT
      ================================================= */}

      <div className="grid md:grid-cols-2 gap-4">

        {/* PROJECTS */}

        <div className="card p-4">

          <h4
            className="font-bold text-slate-900 mb-3"
            style={{
              fontFamily:
                "'DM Sans',sans-serif",
            }}
          >
            🛠 Suggested Projects
          </h4>

          {projectSuggestions.map(
            (project) => (
              <div
                key={project}
                className="flex items-center gap-2 py-2 border-b border-slate-100 last:border-0 text-sm text-slate-700"
              >
                <span className="text-emerald-500">
                  →
                </span>

                {project}
              </div>
            )
          )}
        </div>

        {/* PLACEMENT */}

        <div className="card p-4">

          <h4
            className="font-bold text-slate-900 mb-3"
            style={{
              fontFamily:
                "'DM Sans',sans-serif",
            }}
          >
            🎯 Placement Preparation
          </h4>

          {placementPreparation.map(
            (item) => (
              <div
                key={item}
                className="flex items-center gap-2 py-2 border-b border-slate-100 last:border-0 text-sm text-slate-700"
              >
                <span className="text-indigo-500">
                  →
                </span>

                {item}
              </div>
            )
          )}
        </div>
      </div>

      {/* =================================================
          NEXT STEP
      ================================================= */}

      <div className="card p-5 bg-indigo-50 border border-indigo-100">

        <div className="flex items-start gap-3">

          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
            🚀
          </div>

          <div>

            <h3 className="font-bold text-indigo-950">
              Recommended Next Step
            </h3>

            <p className="text-sm text-slate-600 mt-1">
              {currentTopic
                ? `Continue learning "${currentTopic.title}" and complete its assessment before moving to the next topic.`
                : completedTopics.length ===
                    topicData.length &&
                  topicData.length > 0
                ? "You have completed the available Java topics. Focus on advanced practice and placement preparation."
                : "Start your Java learning path to build your technical skill profile."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}