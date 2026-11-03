import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5000/api";

const DAYS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

const TYPE_COLORS = {
  Learn: "#4F46E5",
  Notes: "#8B5CF6",
  Practice: "#10B981",
  Revision: "#06B6D4",
  Assessment: "#F59E0B",
};

const PRIORITY_COLORS = {
  High: "#EF4444",
  Medium: "#F59E0B",
  Low: "#10B981",
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

  return Math.min(100, Math.max(0, Math.round(value)));
}

function capitalizeLevel(value) {
  if (!value) {
    return "Average";
  }

  const text = String(value).trim();

  return (
    text.charAt(0).toUpperCase() +
    text.slice(1).toLowerCase()
  );
}

function getTodayShortName() {
  const map = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  return map[new Date().getDay()];
}

function createEmptySchedule() {
  return DAYS.reduce((result, day) => {
    result[day] = [];
    return result;
  }, {});
}

// ======================================================
// STUDY PLANNER
// ======================================================

export default function StudyPlanner({ onNav }) {
  const [topics, setTopics] = useState([]);
  const [studentProgress, setStudentProgress] = useState([]);

  const [learningLevel, setLearningLevel] =
    useState("Average");

  const [activeDay, setActiveDay] =
    useState(getTodayShortName());

  const [tasks, setTasks] =
    useState(createEmptySchedule());

  const [studyHours, setStudyHours] =
    useState(3);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [planGenerated, setPlanGenerated] =
    useState(false);

  // Used to create a different plan every time
  const [planVersion, setPlanVersion] =
    useState(0);

  // ====================================================
  // LOAD BACKEND DATA
  // ====================================================

  useEffect(() => {
    const loadPlannerData = async () => {
      const token = getToken();

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

        // ==================================================
        // LOAD TOPICS
        // ==================================================

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
        }

        // ==================================================
        // LOAD STUDENT PROGRESS
        // ==================================================

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

        // ==================================================
        // LOAD AI LEARNING LEVEL
        // ==================================================

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
                capitalizeLevel(level)
              );
            }
          }
        }
      } catch (err) {
        console.error(
          "Study Planner loading error:",
          err
        );

        setError(
          "Unable to load planner data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPlannerData();
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
  // TOPIC STATES
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
        progress?.status === "completed" ||
        percentage === 100;

      return {
        ...topic,
        progress,
        percentage,
        completed,
      };
    });
  }, [topics, progressMap]);

  const completedTopics =
    topicStates.filter(
      (topic) => topic.completed
    );

  const currentTopic =
    topicStates.find(
      (topic) =>
        !topic.completed &&
        topic.progress?.status ===
          "in_progress"
    ) ||
    topicStates.find(
      (topic) => !topic.completed
    ) ||
    null;

  const nextTopic = currentTopic
    ? topicStates.find(
        (topic) =>
          Number(topic.order) ===
          Number(currentTopic.order) + 1
      )
    : null;

  const totalTopics =
    topicStates.length;

  const overallProgress =
    totalTopics > 0
      ? Math.round(
          (completedTopics.length /
            totalTopics) *
            100
        )
      : 0;

  // ====================================================
  // CREATE TASK
  // ====================================================

  const createTask = (
    time,
    task,
    type,
    priority,
    duration,
    topic
  ) => {
    return {
      time,
      task,
      type,
      priority,
      duration,
      topic,
      done: false,
    };
  };

  // ====================================================
  // GENERATE PERSONALIZED PLAN
  // ====================================================

  const generatePlan = () => {
    if (!currentTopic) {
      setTasks(createEmptySchedule());
      setPlanGenerated(true);
      setPlanVersion((previous) => previous + 1);
      return;
    }

    const newVersion = planVersion + 1;

    const schedule = createEmptySchedule();

    const currentTitle =
      currentTopic.title;

    const nextTitle =
      nextTopic?.title ||
      currentTitle;

    // ==================================================
    // VARIATION
    //
    // Every click rotates between 3 different plans.
    // ==================================================

    const variation =
      newVersion % 3;

    // ==================================================
    // SLOW LEVEL
    // ==================================================

    if (learningLevel === "Slow") {
      if (variation === 1) {
        schedule.Mon = [
          createTask(
            "9:00 AM",
            `${currentTitle} — Learn Fundamentals`,
            "Learn",
            "High",
            "45 min",
            currentTopic
          ),
          createTask(
            "11:00 AM",
            `${currentTitle} — Notes Review`,
            "Notes",
            "High",
            "30 min",
            currentTopic
          ),
        ];

        schedule.Tue = [
          createTask(
            "9:00 AM",
            `${currentTitle} — Guided Practice`,
            "Practice",
            "High",
            "45 min",
            currentTopic
          ),
        ];

        schedule.Wed = [
          createTask(
            "9:00 AM",
            `${currentTitle} — Concept Revision`,
            "Revision",
            "High",
            "40 min",
            currentTopic
          ),
        ];

        schedule.Thu = [
          createTask(
            "9:00 AM",
            `${currentTitle} — Practice`,
            "Practice",
            "High",
            "45 min",
            currentTopic
          ),
        ];

        schedule.Fri = [
          createTask(
            "10:00 AM",
            `${currentTitle} — Topic Assessment`,
            "Assessment",
            "High",
            "30 min",
            currentTopic
          ),
        ];

        schedule.Sat = [
          createTask(
            "10:00 AM",
            `${currentTitle} — Extra Practice`,
            "Practice",
            "Medium",
            "45 min",
            currentTopic
          ),
        ];

        schedule.Sun = [
          createTask(
            "11:00 AM",
            "Weekly Learning Review",
            "Revision",
            "Low",
            "30 min",
            currentTopic
          ),
        ];
      } else if (variation === 2) {
        schedule.Mon = [
          createTask(
            "10:00 AM",
            `${currentTitle} — Concept Reading`,
            "Notes",
            "High",
            "40 min",
            currentTopic
          ),
          createTask(
            "3:00 PM",
            `${currentTitle} — Basic Practice`,
            "Practice",
            "High",
            "40 min",
            currentTopic
          ),
        ];

        schedule.Tue = [
          createTask(
            "9:00 AM",
            `${currentTitle} — Video Learning`,
            "Learn",
            "High",
            "45 min",
            currentTopic
          ),
        ];

        schedule.Wed = [
          createTask(
            "10:00 AM",
            `${currentTitle} — Revision`,
            "Revision",
            "Medium",
            "35 min",
            currentTopic
          ),
        ];

        schedule.Thu = [
          createTask(
            "9:00 AM",
            `${currentTitle} — Guided Questions`,
            "Practice",
            "High",
            "45 min",
            currentTopic
          ),
        ];

        schedule.Fri = [
          createTask(
            "10:00 AM",
            `${currentTitle} — Topic Assessment`,
            "Assessment",
            "High",
            "30 min",
            currentTopic
          ),
        ];

        schedule.Sat = [
          createTask(
            "10:00 AM",
            `${currentTitle} — Weak Area Revision`,
            "Revision",
            "High",
            "45 min",
            currentTopic
          ),
        ];

        schedule.Sun = [
          createTask(
            "11:00 AM",
            "Weekly Performance Review",
            "Revision",
            "Low",
            "30 min",
            currentTopic
          ),
        ];
      } else {
        schedule.Mon = [
          createTask(
            "9:00 AM",
            `${currentTitle} — Learn`,
            "Learn",
            "High",
            "45 min",
            currentTopic
          ),
        ];

        schedule.Tue = [
          createTask(
            "10:00 AM",
            `${currentTitle} — Notes`,
            "Notes",
            "High",
            "30 min",
            currentTopic
          ),
        ];

        schedule.Wed = [
          createTask(
            "9:00 AM",
            `${currentTitle} — Practice`,
            "Practice",
            "High",
            "45 min",
            currentTopic
          ),
        ];

        schedule.Thu = [
          createTask(
            "10:00 AM",
            `${currentTitle} — Revision`,
            "Revision",
            "Medium",
            "30 min",
            currentTopic
          ),
        ];

        schedule.Fri = [
          createTask(
            "10:00 AM",
            `${currentTitle} — Assessment`,
            "Assessment",
            "High",
            "30 min",
            currentTopic
          ),
        ];

        schedule.Sat = [
          createTask(
            "10:00 AM",
            `${currentTitle} — Remedial Practice`,
            "Practice",
            "High",
            "45 min",
            currentTopic
          ),
        ];

        schedule.Sun = [
          createTask(
            "11:00 AM",
            "Weekly Progress Review",
            "Revision",
            "Low",
            "30 min",
            currentTopic
          ),
        ];
      }
    }

    // ==================================================
    // ADVANCED LEVEL
    // ==================================================

    else if (learningLevel === "Advanced") {
      if (variation === 1) {
        schedule.Mon = [
          createTask(
            "9:00 AM",
            `${currentTitle} — Quick Learning`,
            "Learn",
            "High",
            "30 min",
            currentTopic
          ),
          createTask(
            "11:00 AM",
            `${currentTitle} — Advanced Practice`,
            "Practice",
            "High",
            "45 min",
            currentTopic
          ),
        ];

        schedule.Tue = [
          createTask(
            "10:00 AM",
            `${currentTitle} — Topic Assessment`,
            "Assessment",
            "High",
            "30 min",
            currentTopic
          ),
        ];

        schedule.Wed = [
          createTask(
            "9:00 AM",
            `${nextTitle} — Start Next Topic`,
            "Learn",
            "Medium",
            "45 min",
            nextTopic || currentTopic
          ),
        ];

        schedule.Thu = [
          createTask(
            "10:00 AM",
            `${nextTitle} — Practice`,
            "Practice",
            "Medium",
            "45 min",
            nextTopic || currentTopic
          ),
        ];

        schedule.Fri = [
          createTask(
            "10:00 AM",
            `${nextTitle} — Revision`,
            "Revision",
            "Medium",
            "30 min",
            nextTopic || currentTopic
          ),
        ];

        schedule.Sat = [
          createTask(
            "10:00 AM",
            "Advanced Java Practice",
            "Practice",
            "Medium",
            "60 min",
            currentTopic
          ),
        ];

        schedule.Sun = [
          createTask(
            "11:00 AM",
            "Weekly Performance Review",
            "Revision",
            "Low",
            "25 min",
            currentTopic
          ),
        ];
      } else if (variation === 2) {
        schedule.Mon = [
          createTask(
            "9:00 AM",
            `${currentTitle} — Advanced Concepts`,
            "Learn",
            "High",
            "35 min",
            currentTopic
          ),
        ];

        schedule.Tue = [
          createTask(
            "10:00 AM",
            `${currentTitle} — Challenging Problems`,
            "Practice",
            "High",
            "60 min",
            currentTopic
          ),
        ];

        schedule.Wed = [
          createTask(
            "10:00 AM",
            `${currentTitle} — Assessment`,
            "Assessment",
            "High",
            "30 min",
            currentTopic
          ),
        ];

        schedule.Thu = [
          createTask(
            "9:00 AM",
            `${nextTitle} — Preview`,
            "Learn",
            "Medium",
            "40 min",
            nextTopic || currentTopic
          ),
        ];

        schedule.Fri = [
          createTask(
            "10:00 AM",
            `${nextTitle} — Practice`,
            "Practice",
            "Medium",
            "45 min",
            nextTopic || currentTopic
          ),
        ];

        schedule.Sat = [
          createTask(
            "10:00 AM",
            "Java Problem Solving",
            "Practice",
            "Medium",
            "60 min",
            currentTopic
          ),
        ];

        schedule.Sun = [
          createTask(
            "11:00 AM",
            "Weekly Learning Review",
            "Revision",
            "Low",
            "25 min",
            currentTopic
          ),
        ];
      } else {
        schedule.Mon = [
          createTask(
            "9:00 AM",
            `${currentTitle} — Concepts`,
            "Learn",
            "High",
            "35 min",
            currentTopic
          ),
        ];

        schedule.Tue = [
          createTask(
            "10:00 AM",
            `${currentTitle} — Coding Practice`,
            "Practice",
            "High",
            "50 min",
            currentTopic
          ),
        ];

        schedule.Wed = [
          createTask(
            "10:00 AM",
            `${currentTitle} — Assessment`,
            "Assessment",
            "High",
            "30 min",
            currentTopic
          ),
        ];

        schedule.Thu = [
          createTask(
            "9:00 AM",
            `${nextTitle} — Learn`,
            "Learn",
            "Medium",
            "45 min",
            nextTopic || currentTopic
          ),
        ];

        schedule.Fri = [
          createTask(
            "10:00 AM",
            `${nextTitle} — Practice`,
            "Practice",
            "Medium",
            "45 min",
            nextTopic || currentTopic
          ),
        ];

        schedule.Sat = [
          createTask(
            "10:00 AM",
            "Advanced Java Revision",
            "Revision",
            "Medium",
            "45 min",
            currentTopic
          ),
        ];

        schedule.Sun = [
          createTask(
            "11:00 AM",
            "Weekly Performance Review",
            "Revision",
            "Low",
            "25 min",
            currentTopic
          ),
        ];
      }
    }

    // ==================================================
    // AVERAGE LEVEL
    // ==================================================

    else {
      if (variation === 1) {
        schedule.Mon = [
          createTask(
            "9:00 AM",
            `${currentTitle} — Learn Concepts`,
            "Learn",
            "High",
            "40 min",
            currentTopic
          ),
          createTask(
            "11:00 AM",
            `${currentTitle} — Notes`,
            "Notes",
            "Medium",
            "30 min",
            currentTopic
          ),
        ];

        schedule.Tue = [
          createTask(
            "9:00 AM",
            `${currentTitle} — Practice`,
            "Practice",
            "High",
            "45 min",
            currentTopic
          ),
        ];

        schedule.Wed = [
          createTask(
            "10:00 AM",
            `${currentTitle} — Revision`,
            "Revision",
            "Medium",
            "30 min",
            currentTopic
          ),
        ];

        schedule.Thu = [
          createTask(
            "10:00 AM",
            `${currentTitle} — Practice Session`,
            "Practice",
            "High",
            "45 min",
            currentTopic
          ),
        ];

        schedule.Fri = [
          createTask(
            "10:00 AM",
            `${currentTitle} — Topic Assessment`,
            "Assessment",
            "High",
            "30 min",
            currentTopic
          ),
        ];

        schedule.Sat = [
          createTask(
            "10:00 AM",
            `${nextTitle} — Preview`,
            "Learn",
            "Low",
            "30 min",
            nextTopic || currentTopic
          ),
        ];

        schedule.Sun = [
          createTask(
            "11:00 AM",
            "Weekly Progress Review",
            "Revision",
            "Low",
            "25 min",
            currentTopic
          ),
        ];
      } else if (variation === 2) {
        schedule.Mon = [
          createTask(
            "10:00 AM",
            `${currentTitle} — Video Learning`,
            "Learn",
            "High",
            "45 min",
            currentTopic
          ),
        ];

        schedule.Tue = [
          createTask(
            "9:00 AM",
            `${currentTitle} — Practice`,
            "Practice",
            "High",
            "45 min",
            currentTopic
          ),
          createTask(
            "3:00 PM",
            `${currentTitle} — Notes Review`,
            "Notes",
            "Medium",
            "30 min",
            currentTopic
          ),
        ];

        schedule.Wed = [
          createTask(
            "10:00 AM",
            `${currentTitle} — Revision`,
            "Revision",
            "Medium",
            "30 min",
            currentTopic
          ),
        ];

        schedule.Thu = [
          createTask(
            "9:00 AM",
            `${currentTitle} — Guided Practice`,
            "Practice",
            "High",
            "45 min",
            currentTopic
          ),
        ];

        schedule.Fri = [
          createTask(
            "10:00 AM",
            `${currentTitle} — Assessment`,
            "Assessment",
            "High",
            "30 min",
            currentTopic
          ),
        ];

        schedule.Sat = [
          createTask(
            "10:00 AM",
            `${nextTitle} — Preview`,
            "Learn",
            "Low",
            "30 min",
            nextTopic || currentTopic
          ),
        ];

        schedule.Sun = [
          createTask(
            "11:00 AM",
            "Weekly Performance Review",
            "Revision",
            "Low",
            "25 min",
            currentTopic
          ),
        ];
      } else {
        schedule.Mon = [
          createTask(
            "9:00 AM",
            `${currentTitle} — Fundamentals`,
            "Learn",
            "High",
            "40 min",
            currentTopic
          ),
        ];

        schedule.Tue = [
          createTask(
            "10:00 AM",
            `${currentTitle} — Practice`,
            "Practice",
            "High",
            "45 min",
            currentTopic
          ),
        ];

        schedule.Wed = [
          createTask(
            "10:00 AM",
            `${currentTitle} — Notes`,
            "Notes",
            "Medium",
            "30 min",
            currentTopic
          ),
        ];

        schedule.Thu = [
          createTask(
            "9:00 AM",
            `${currentTitle} — Revision`,
            "Revision",
            "Medium",
            "35 min",
            currentTopic
          ),
        ];

        schedule.Fri = [
          createTask(
            "10:00 AM",
            `${currentTitle} — Topic Assessment`,
            "Assessment",
            "High",
            "30 min",
            currentTopic
          ),
        ];

        schedule.Sat = [
          createTask(
            "10:00 AM",
            `${nextTitle} — Introduction`,
            "Learn",
            "Low",
            "30 min",
            nextTopic || currentTopic
          ),
        ];

        schedule.Sun = [
          createTask(
            "11:00 AM",
            "Weekly Progress Review",
            "Revision",
            "Low",
            "25 min",
            currentTopic
          ),
        ];
      }
    }

    // ==================================================
    // APPLY DAILY STUDY TIME
    // ==================================================

    // If student selects more study hours,
    // add an additional practice session.

    if (studyHours >= 5) {
      schedule.Sat.push(
        createTask(
          "3:00 PM",
          `${currentTitle} — Extended Practice`,
          "Practice",
          "Medium",
          "60 min",
          currentTopic
        )
      );
    }

    if (studyHours >= 6) {
      schedule.Sun.push(
        createTask(
          "3:00 PM",
          `${currentTitle} — Extra Revision`,
          "Revision",
          "Medium",
          "45 min",
          currentTopic
        )
      );
    }

    // ==================================================
    // SAVE PLAN
    // ==================================================

    setTasks(schedule);
    setPlanGenerated(true);
    setPlanVersion(newVersion);
  };

  // ====================================================
  // GENERATE INITIAL PLAN
  // ====================================================

  useEffect(() => {
    if (
      !loading &&
      currentTopic &&
      !planGenerated
    ) {
      generatePlan();
    }
  }, [
    loading,
    currentTopic,
    learningLevel,
    planGenerated,
  ]);

  // ====================================================
  // REGENERATE WHEN STUDY HOURS CHANGE
  // ====================================================

  const handleStudyHoursChange = (value) => {
    setStudyHours(value);
  };

  // ====================================================
  // TOGGLE TASK
  // ====================================================

  const toggleTask = (taskIndex) => {
    setTasks((previous) => ({
      ...previous,

      [activeDay]:
        previous[activeDay].map(
          (task, index) =>
            index === taskIndex
              ? {
                  ...task,
                  done: !task.done,
                }
              : task
        ),
    }));
  };

  // ====================================================
  // START TASK
  // ====================================================

  const startTask = (task) => {
    if (task.type === "Assessment") {
      onNav?.(
        "smart-quiz",
        task.topic || currentTopic
      );

      return;
    }

    onNav?.(
      "learning-resource",
      task.topic || currentTopic
    );
  };

  // ====================================================
  // CURRENT DAY STATS
  // ====================================================

  const todayTasks =
    tasks[activeDay] || [];

  const doneCount =
    todayTasks.filter(
      (task) => task.done
    ).length;

  const dayPercentage =
    todayTasks.length > 0
      ? Math.round(
          (doneCount /
            todayTasks.length) *
            100
        )
      : 0;

  // ====================================================
  // WEEK STATS
  // ====================================================

  const allWeekTasks =
    DAYS.flatMap(
      (day) => tasks[day] || []
    );

  const weekDone =
    allWeekTasks.filter(
      (task) => task.done
    ).length;

  const weekPercentage =
    allWeekTasks.length > 0
      ? Math.round(
          (weekDone /
            allWeekTasks.length) *
            100
        )
      : 0;

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
          <h2
            className="text-2xl text-indigo-950"
            style={{
              fontFamily:
                "'DM Sans',sans-serif",
              fontWeight: 800,
            }}
          >
            Study Planner
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Your personalized weekly
            learning schedule.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 border border-indigo-100">

          <span>🤖</span>

          <span className="text-xs font-semibold text-indigo-700">
            AI Personalized Plan
          </span>

        </div>

      </div>

      {/* =================================================
          HERO
      ================================================= */}

      <div
        className="rounded-2xl p-6 relative overflow-hidden"
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

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">

          <div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-indigo-100 mb-3">
              ✨ Personalized with AI
            </div>

            <h3 className="text-xl font-bold text-white">
              Your Weekly Learning Plan
            </h3>

            <p className="text-indigo-200 text-sm mt-2 max-w-2xl">
              Your plan is adapted to your{" "}
              <strong className="text-white">
                {learningLevel}
              </strong>{" "}
              learning level and current
              learning progress.
            </p>

            {currentTopic && (
              <div className="flex items-center gap-2 mt-3 text-sm">

                <span className="text-indigo-300">
                  Current focus:
                </span>

                <span className="font-semibold text-cyan-300">
                  {currentTopic.title}
                </span>

              </div>
            )}

          </div>

          <button
            onClick={generatePlan}
            disabled={loading || !currentTopic}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex-shrink-0 ${
              loading || !currentTopic
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-white text-indigo-700 hover:bg-indigo-50"
            }`}
          >
            ✨ Regenerate Plan
          </button>

        </div>

      </div>

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="card p-4">

          <div className="flex items-center justify-between">

            <div>
              <div className="text-xs text-slate-400">
                AI Level
              </div>

              <div className="text-xl font-bold text-indigo-700 mt-1">
                {learningLevel}
              </div>
            </div>

            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl">
              🤖
            </div>

          </div>

        </div>

        <div className="card p-4">

          <div className="flex items-center justify-between gap-2">

            <div className="min-w-0">

              <div className="text-xs text-slate-400">
                Current Topic
              </div>

              <div className="text-sm font-bold text-purple-700 mt-1 truncate">
                {currentTopic?.title ||
                  "Course Complete"}
              </div>

            </div>

            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-xl flex-shrink-0">
              📚
            </div>

          </div>

        </div>

        <div className="card p-4">

          <div className="flex items-center justify-between">

            <div>
              <div className="text-xs text-slate-400">
                Week Progress
              </div>

              <div className="text-xl font-bold text-emerald-600 mt-1">
                {weekPercentage}%
              </div>
            </div>

            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-xl">
              📈
            </div>

          </div>

        </div>

        <div className="card p-4">

          <div className="flex items-center justify-between">

            <div>
              <div className="text-xs text-slate-400">
                Course Progress
              </div>

              <div className="text-xl font-bold text-cyan-600 mt-1">
                {overallProgress}%
              </div>
            </div>

            <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-xl">
              🎯
            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          DAY SELECTOR
      ================================================= */}

      <div className="card p-4">

        <div className="flex items-center justify-between mb-3">

          <div>

            <h3
              className="font-bold text-slate-900"
              style={{
                fontFamily:
                  "'DM Sans',sans-serif",
              }}
            >
              Weekly Schedule
            </h3>

            <p className="text-xs text-slate-400 mt-1">
              Select a day to view your
              personalized activities.
            </p>

          </div>

          <div className="text-xs text-slate-500">
            {weekDone}/{allWeekTasks.length} tasks completed
          </div>

        </div>

        <div className="grid grid-cols-7 gap-2">

          {DAYS.map((day) => {
            const dayTasks =
              tasks[day] || [];

            const completed =
              dayTasks.filter(
                (task) =>
                  task.done
              ).length;

            const isActive =
              day === activeDay;

            const isToday =
              day ===
              getTodayShortName();

            return (
              <button
                key={day}
                onClick={() =>
                  setActiveDay(day)
                }
                className={`relative flex flex-col items-center px-3 py-3 rounded-xl border-2 transition-all ${
                  isActive
                    ? "border-indigo-500 bg-indigo-600 text-white shadow-md"
                    : "border-slate-100 bg-white text-slate-700 hover:border-indigo-200"
                }`}
              >

                {isToday && (
                  <span
                    className={`text-[9px] uppercase font-bold mb-1 ${
                      isActive
                        ? "text-cyan-200"
                        : "text-indigo-500"
                    }`}
                  >
                    Today
                  </span>
                )}

                <span className="text-sm font-semibold">
                  {day}
                </span>

                <span
                  className={`text-xs mt-1 ${
                    isActive
                      ? "text-indigo-200"
                      : "text-slate-400"
                  }`}
                >
                  {completed}/{dayTasks.length}
                </span>

              </button>
            );
          })}

        </div>

      </div>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="grid lg:grid-cols-3 gap-5">

        {/* =================================================
            TASK LIST
        ================================================= */}

        <div className="lg:col-span-2 space-y-3">

          <div className="flex items-center justify-between">

            <div>

              <h3
                className="font-bold text-slate-900"
                style={{
                  fontFamily:
                    "'DM Sans',sans-serif",
                }}
              >
                {activeDay}'s Learning Plan
              </h3>

              <div className="text-xs text-slate-400 mt-1">
                {doneCount} of{" "}
                {todayTasks.length} activities completed
              </div>

            </div>

            <div className="text-sm font-bold text-indigo-600">
              {dayPercentage}%
            </div>

          </div>

          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">

            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${dayPercentage}%`,
                background:
                  "linear-gradient(90deg,#4F46E5,#06B6D4)",
              }}
            />

          </div>

          {/* LOADING */}

          {loading ? (

            <div className="card p-8 text-center">

              <div className="text-3xl mb-2">
                ⏳
              </div>

              <div className="text-sm text-slate-500">
                Creating your personalized plan...
              </div>

            </div>

          ) : todayTasks.length === 0 ? (

            <div className="card p-8 text-center">

              <div className="text-4xl mb-3">
                🌿
              </div>

              <div className="font-semibold text-slate-700">
                Light Learning Day
              </div>

              <p className="text-xs text-slate-400 mt-1">
                No activities are planned
                for this day.
              </p>

            </div>

          ) : (

            todayTasks.map(
              (task, index) => (
                <div
                  key={`${task.task}-${index}`}
                  className={`card p-4 transition-all ${
                    task.done
                      ? "opacity-70 bg-slate-50"
                      : "hover:shadow-md"
                  }`}
                >

                  <div className="flex items-start gap-4">

                    {/* CHECKBOX */}

                    <button
                      onClick={() =>
                        toggleTask(index)
                      }
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                        task.done
                          ? "bg-emerald-500 border-emerald-500"
                          : "border-slate-300 hover:border-indigo-400"
                      }`}
                    >
                      {task.done && (
                        <span className="text-white text-xs">
                          ✓
                        </span>
                      )}
                    </button>

                    {/* TASK INFO */}

                    <div className="flex-1 min-w-0">

                      <div
                        className={`font-semibold text-sm ${
                          task.done
                            ? "line-through text-slate-400"
                            : "text-slate-800"
                        }`}
                      >
                        {task.task}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap mt-2">

                        <span className="text-xs text-slate-400">
                          ⏰ {task.time}
                        </span>

                        <span className="text-xs text-slate-400">
                          ⏱ {task.duration}
                        </span>

                        <span
                          className="badge text-xs"
                          style={{
                            background: `${TYPE_COLORS[task.type]}18`,
                            color:
                              TYPE_COLORS[
                                task.type
                              ],
                          }}
                        >
                          {task.type}
                        </span>

                        <span
                          className="badge text-xs"
                          style={{
                            background: `${PRIORITY_COLORS[task.priority]}15`,
                            color:
                              PRIORITY_COLORS[
                                task.priority
                              ],
                          }}
                        >
                          {task.priority}
                        </span>

                      </div>

                    </div>

                    {/* START */}

                    {!task.done && (
                      <button
                        onClick={() =>
                          startTask(task)
                        }
                        className="btn-primary text-xs py-1.5 px-3 flex-shrink-0"
                      >
                        Start →
                      </button>
                    )}

                  </div>

                </div>
              )
            )

          )}

        </div>

        {/* =================================================
            SIDEBAR
        ================================================= */}

        <div className="space-y-4">

          {/* CURRENT GOAL */}

          <div
            className="rounded-2xl p-5"
            style={{
              background:
                "linear-gradient(145deg,#EEF2FF,#F5F3FF)",
              border:
                "1px solid #E0E7FF",
            }}
          >

            <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
              🎯 Current Goal
            </div>

            <div className="font-bold text-indigo-950 mt-2">
              {currentTopic
                ? currentTopic.title
                : "Course Complete"}
            </div>

            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              {currentTopic
                ? "Complete the learning resources, practice and topic assessment before moving forward."
                : "You have completed all available Java topics."}
            </p>

            {currentTopic && (
              <button
                onClick={() =>
                  onNav?.(
                    "learning-resource",
                    currentTopic
                  )
                }
                className="btn-primary w-full justify-center text-xs py-2 mt-4"
              >
                Continue Topic →
              </button>
            )}

          </div>

          {/* WEEK OVERVIEW */}

          <div className="card p-4">

            <h4
              className="font-bold text-slate-900 mb-3"
              style={{
                fontFamily:
                  "'DM Sans',sans-serif",
              }}
            >
              📊 Week Overview
            </h4>

            {DAYS.map((day) => {
              const dayTasks =
                tasks[day] || [];

              const completed =
                dayTasks.filter(
                  (task) =>
                    task.done
                ).length;

              const percentage =
                dayTasks.length > 0
                  ? Math.round(
                      (completed /
                        dayTasks.length) *
                        100
                    )
                  : 0;

              return (
                <div
                  key={day}
                  className="mb-3"
                >

                  <div className="flex justify-between text-xs mb-1">

                    <span
                      className={`font-medium ${
                        day === activeDay
                          ? "text-indigo-600"
                          : "text-slate-600"
                      }`}
                    >
                      {day}
                    </span>

                    <span className="text-slate-400">
                      {completed}/
                      {dayTasks.length}
                    </span>

                  </div>

                  <div
                    className="progress-bar"
                    style={{
                      height: 5,
                    }}
                  >

                    <div
                      className="progress-fill"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />

                  </div>

                </div>
              );
            })}

          </div>

          {/* PLAN SETTINGS */}

          <div className="card p-4">

            <h4
              className="font-bold text-slate-900 mb-4"
              style={{
                fontFamily:
                  "'DM Sans',sans-serif",
              }}
            >
              ⚙️ Plan Settings
            </h4>

            <div className="space-y-4">

              <div>

                <div className="flex justify-between mb-2">

                  <label className="text-xs text-slate-500">
                    Daily Study Time
                  </label>

                  <span className="text-xs font-semibold text-indigo-600">
                    {studyHours}{" "}
                    {studyHours === 1
                      ? "hour"
                      : "hours"}
                  </span>

                </div>

                <input
                  type="range"
                  min="1"
                  max="8"
                  value={studyHours}
                  onChange={(event) =>
                    handleStudyHoursChange(
                      Number(
                        event.target.value
                      )
                    )
                  }
                  className="w-full accent-indigo-600"
                />

                <p className="text-[11px] text-slate-400 mt-1">
                  Adjust your available daily
                  study time and regenerate the
                  plan.
                </p>

              </div>

              {/* LEARNING LEVEL */}

              <div className="p-3 rounded-xl bg-slate-50">

                <div className="text-xs text-slate-400">
                  AI Learning Level
                </div>

                <div className="text-sm font-semibold text-slate-800 mt-1">
                  🤖 {learningLevel}
                </div>

              </div>

              {/* PLAN VERSION */}

              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">

                <div className="text-xs text-indigo-500">
                  Current Plan
                </div>

                <div className="text-sm font-semibold text-indigo-800 mt-1">
                  Personalized Plan #
                  {planVersion || 1}
                </div>

              </div>

              {/* REGENERATE */}

              <button
                onClick={generatePlan}
                disabled={
                  loading ||
                  !currentTopic
                }
                className={`w-full justify-center text-xs py-2 rounded-lg font-semibold transition-all ${
                  loading ||
                  !currentTopic
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "btn-primary"
                }`}
              >
                🔄 Generate New Study Plan
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          AI EXPLANATION
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
            ✨
          </div>

          <div>

            <div className="font-semibold text-slate-800 text-sm">
              How your personalized plan works
            </div>

            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              The planner uses your current
              Java topic, student progress and
              AI learning level to organize
              learning, notes, practice,
              revision and assessment
              activities. You can regenerate the
              plan whenever you want a different
              study schedule.
            </p>

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