import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5000/api";

// Convert a normal YouTube URL from the backend into an iframe-compatible URL.
const getYouTubeEmbedUrl = (url) => {
  if (!url) return "";

  try {
    const parsedUrl = new URL(url);
    let videoId = "";

    // https://www.youtube.com/watch?v=VIDEO_ID
    if (
      parsedUrl.hostname === "www.youtube.com" ||
      parsedUrl.hostname === "youtube.com"
    ) {
      if (parsedUrl.pathname === "/watch") {
        videoId = parsedUrl.searchParams.get("v") || "";
      }

      // Already an embed URL
      if (parsedUrl.pathname.startsWith("/embed/")) {
        videoId = parsedUrl.pathname.split("/embed/")[1] || "";
      }

      // YouTube Shorts URL
      if (parsedUrl.pathname.startsWith("/shorts/")) {
        videoId = parsedUrl.pathname.split("/shorts/")[1] || "";
      }
    }

    // https://youtu.be/VIDEO_ID
    if (parsedUrl.hostname === "youtu.be") {
      videoId = parsedUrl.pathname.substring(1);
    }

    if (!videoId) {
      return url;
    }

    // Remove any extra path/query information.
    videoId = videoId.split("/")[0].split("?")[0];

    return `https://www.youtube.com/embed/${videoId}`;
  } catch (error) {
    console.error("Invalid YouTube URL:", url, error);
    return url;
  }
};

const TABS = [
  {
    id: "videos",
    label: "Videos",
    icon: "🎥",
  },
  {
    id: "notes",
    label: "Notes",
    icon: "📘",
  },
  {
    id: "worksheet",
    label: "Worksheet",
    icon: "📝",
  },
  {
    id: "revision",
    label: "Revision",
    icon: "🔄",
  },
];

export default function LearningResource({
  onNav,
  topic,
}) {
  // ======================================================
  // TOPIC
  // ======================================================

  const topicId = topic?._id;

  const topicTitle =
    topic?.title || "Selected Topic";

  const topicDescription =
    topic?.description ||
    "Learn the concepts, practice the topic, and complete the assessment.";

  const subject =
    topic?.subject || "Java";

  // ======================================================
  // STATE
  // ======================================================

  const [activeTab, setActiveTab] =
    useState("videos");

  const [resources, setResources] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // Completion tracking
  const [completedVideos, setCompletedVideos] =
    useState([]);

  const [completedNotes, setCompletedNotes] =
    useState([]);

  const [worksheetCompleted, setWorksheetCompleted] =
    useState(false);

  const [topicCompleted, setTopicCompleted] =
    useState(false);

  // ======================================================
  // TOKEN
  // ======================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ======================================================
  // FETCH TOPIC RESOURCES
  // ======================================================

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        setError("");

        if (!topicId) {
          setError(
            "No topic selected. Please return to Learning Path and select a topic."
          );
          return;
        }

        const token = getToken();

        if (!token) {
          setError("Please login again.");
          return;
        }

        console.log(
          "Loading resources for topic:",
          topicId
        );

        const response = await fetch(
          `${API_URL}/resources/topic/${topicId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log(
          "Topic resources response:",
          data
        );

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Unable to load learning resources."
          );
        }

        setResources(data.resources || []);
      } catch (err) {
        console.error(
          "Fetch learning resources error:",
          err
        );

        setError(
          err.message ||
            "Unable to load learning resources."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [topicId]);

  // ======================================================
  // RESET PROGRESS WHEN TOPIC CHANGES
  // ======================================================

  useEffect(() => {
    setActiveTab("videos");

    setCompletedVideos([]);

    setCompletedNotes([]);

    setWorksheetCompleted(false);

    setTopicCompleted(false);
  }, [topicId]);

  // ======================================================
  // RESOURCE FILTERING
  // ======================================================

  const videos = useMemo(() => {
    return resources
      .filter(
        (resource) =>
          resource.type === "video"
      )
      .sort(
        (a, b) =>
          (a.order || 0) -
          (b.order || 0)
      );
  }, [resources]);

  const notes = useMemo(() => {
    return resources
      .filter(
        (resource) =>
          resource.type === "note"
      )
      .sort(
        (a, b) =>
          (a.order || 0) -
          (b.order || 0)
      );
  }, [resources]);

  const worksheets = useMemo(() => {
    return resources
      .filter(
        (resource) =>
          resource.type === "worksheet"
      )
      .sort(
        (a, b) =>
          (a.order || 0) -
          (b.order || 0)
      );
  }, [resources]);

  // ======================================================
  // COMPLETION STATUS
  // ======================================================

  const allVideosCompleted =
    videos.length === 0 ||
    completedVideos.length ===
      videos.length;

  const allNotesCompleted =
    notes.length === 0 ||
    completedNotes.length ===
      notes.length;

  const canOpenNotes =
    allVideosCompleted;

  const canOpenWorksheet =
    allVideosCompleted &&
    allNotesCompleted;

  const canOpenRevision =
    allVideosCompleted &&
    allNotesCompleted &&
    worksheetCompleted;

  const canTakeAssessment =
    canOpenRevision &&
    topicCompleted;

  // ======================================================
  // PROGRESS
  // ======================================================

  const totalLearningSteps =
    videos.length +
    notes.length +
    1 +
    1;

  const completedLearningSteps =
    completedVideos.length +
    completedNotes.length +
    (worksheetCompleted ? 1 : 0) +
    (topicCompleted ? 1 : 0);

  const progress =
    totalLearningSteps > 0
      ? Math.round(
          (completedLearningSteps /
            totalLearningSteps) *
            100
        )
      : 0;

  // ======================================================
  // MARK VIDEO COMPLETE
  // ======================================================

  const completeVideo = (
    resourceId
  ) => {
    setCompletedVideos((previous) => {
      if (previous.includes(resourceId)) {
        return previous;
      }

      return [
        ...previous,
        resourceId,
      ];
    });
  };

  // ======================================================
  // MARK NOTE COMPLETE
  // ======================================================

  const completeNote = (
    resourceId
  ) => {
    setCompletedNotes((previous) => {
      if (previous.includes(resourceId)) {
        return previous;
      }

      return [
        ...previous,
        resourceId,
      ];
    });
  };

  // ======================================================
  // OPEN TAB
  // ======================================================

  const openTab = (tabId) => {
    if (tabId === "videos") {
      setActiveTab("videos");
      return;
    }

    if (
      tabId === "notes" &&
      canOpenNotes
    ) {
      setActiveTab("notes");
      return;
    }

    if (
      tabId === "worksheet" &&
      canOpenWorksheet
    ) {
      setActiveTab("worksheet");
      return;
    }

    if (
      tabId === "revision" &&
      canOpenRevision
    ) {
      setActiveTab("revision");
    }
  };

  // ======================================================
  // MARK TOPIC COMPLETE
  // ======================================================

 const markTopicComplete = async () => {
  if (!canOpenRevision || topicCompleted) {
    return;
  }

  const token = getToken();

  if (!token) {
    setError("Please log in again to save your progress.");
    return;
  }

  try {
    setError("");

    // Create a progress record if this topic has not been started.
    const createResponse = await fetch(`${API_URL}/progress`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        topic: topicTitle,
        totalLessons: videos.length + notes.length + 1,
      }),
    });

    // An existing record may already be present.
    if (!createResponse.ok && createResponse.status !== 409) {
      const result = await createResponse.json().catch(() => ({}));

      // Continue if the backend reports that this record already exists.
      if (
        !String(result.message || result.error || "")
          .toLowerCase()
          .includes("already")
      ) {
        throw new Error(
          result.message || result.error || "Could not create topic progress."
        );
      }
    }

    // Save topic completion to the database.
    const response = await fetch(`${API_URL}/progress/complete-topic`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        topic: topicTitle,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message || data.error || "Could not save topic completion."
      );
    }

    setTopicCompleted(true);
  } catch (err) {
    console.error("Topic completion error:", err);
    setError(err.message || "Failed to save topic completion.");
  }
};
  // ======================================================
  // TAKE TOPIC ASSESSMENT
  // ======================================================

  const takeAssessment = () => {
    if (!canTakeAssessment) {
      return;
    }

    // IMPORTANT:
    // Pass the same topic object to SmartQuiz.
    onNav("smart-quiz", topic);
  };

  // ======================================================
  // NO TOPIC
  // ======================================================

  if (!topicId) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <div className="card p-6 text-center">

          <div className="text-4xl mb-4">
            📚
          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-2">
            No Topic Selected
          </h2>

          <p className="text-sm text-slate-500 mb-5">
            Please return to Learning Path and
            select a topic.
          </p>

          <button
            onClick={() =>
              onNav("learning-path")
            }
            className="btn-primary"
          >
            ← Back to Learning Path
          </button>

        </div>
      </div>
    );
  }

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <div className="card p-8 text-center">

          <div className="text-4xl mb-4">
            📚
          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Loading Learning Resources...
          </h2>

          <p className="text-sm text-slate-500">
            Loading resources for{" "}
            <strong>{topicTitle}</strong>
          </p>

        </div>
      </div>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (error) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <div className="card p-6 text-center">

          <div className="text-4xl mb-4">
            ⚠️
          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Unable to Load Resources
          </h2>

          <p className="text-sm text-slate-500 mb-5">
            {error}
          </p>

          <button
            onClick={() =>
              window.location.reload()
            }
            className="btn-primary"
          >
            Try Again
          </button>

        </div>
      </div>
    );
  }

  // ======================================================
  // CURRENT TAB CONTENT
  // ======================================================

  const renderVideos = () => {
    if (videos.length === 0) {
      return (
        <EmptyResource
          icon="🎥"
          title="No Videos Available"
          message="No video resources have been added for this topic yet."
        />
      );
    }

    return (
      <div className="space-y-5">

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Topic Videos
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Watch the topic videos before moving
            to the notes section.
          </p>
        </div>

        {videos.map(
          (video, index) => {
            const completed =
              completedVideos.includes(
                video._id
              );

            return (
              <div
                key={video._id}
                className="card p-5"
              >

                <div className="flex items-start gap-4">

                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-lg flex-shrink-0">
                    🎥
                  </div>

                  <div className="flex-1">

                    <div className="text-xs text-indigo-500 font-semibold mb-1">
                      Video {index + 1}
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">
                      {video.title}
                    </h3>

                    {video.description && (
                      <p className="text-sm text-slate-500 mt-1">
                        {video.description}
                      </p>
                    )}

                  </div>

                  {completed && (
                    <span className="text-xs font-semibold text-emerald-600">
                      ✓ Completed
                    </span>
                  )}

                </div>

                {/* VIDEO */}

                {video.url ? (
                  <div className="mt-5">

                    <div className="rounded-xl overflow-hidden bg-slate-100 border border-slate-200">

                      <iframe
                        src={getYouTubeEmbedUrl(video.url)}
                        title={video.title}
                        className="w-full h-64"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />

                    </div>

                  </div>
                ) : video.content ? (
                  <div className="mt-5 p-4 rounded-xl bg-slate-50 text-sm text-slate-700 whitespace-pre-line">
                    {video.content}
                  </div>
                ) : (
                  <div className="mt-5 p-4 rounded-xl bg-amber-50 text-amber-700 text-sm">
                    Video link is not available yet.
                  </div>
                )}

                {/* COMPLETE VIDEO */}

                <div className="mt-5 flex justify-end">

                  <button
                    onClick={() =>
                      completeVideo(
                        video._id
                      )
                    }
                    disabled={completed}
                    className={
                      completed
                        ? "btn-outline opacity-70 cursor-not-allowed"
                        : "btn-primary"
                    }
                  >
                    {completed
                      ? "✓ Video Completed"
                      : "Mark Video as Watched"}
                  </button>

                </div>

              </div>
            );
          }
        )}

        {/* NEXT STEP */}

        {allVideosCompleted && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">

            <div className="font-semibold text-emerald-800">
              ✓ All videos completed
            </div>

            <p className="text-sm text-emerald-700 mt-1">
              The Notes section is now unlocked.
            </p>

            <button
              onClick={() =>
                setActiveTab("notes")
              }
              className="btn-primary mt-3"
            >
              Continue to Notes →
            </button>

          </div>
        )}

      </div>
    );
  };

  // ======================================================
  // NOTES
  // ======================================================

  const renderNotes = () => {
    if (!canOpenNotes) {
      return (
        <LockedResource
          icon="🔒"
          title="Notes Locked"
          message="Complete all topic videos before opening the notes."
          action="Go to Videos"
          onClick={() =>
            setActiveTab("videos")
          }
        />
      );
    }

    if (notes.length === 0) {
      return (
        <EmptyResource
          icon="📘"
          title="No Notes Available"
          message="No note resources have been added for this topic yet."
        />
      );
    }

    return (
      <div className="space-y-5">

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Learning Notes
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Read and understand the important
            concepts of {topicTitle}.
          </p>
        </div>

        {notes.map(
          (note, index) => {
            const completed =
              completedNotes.includes(
                note._id
              );

            return (
              <div
                key={note._id}
                className="card p-6"
              >

                <div className="flex items-start justify-between gap-4 mb-4">

                  <div>

                    <div className="text-xs text-indigo-500 font-semibold mb-1">
                      Note {index + 1}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">
                      {note.title}
                    </h3>

                  </div>

                  {completed && (
                    <span className="text-xs font-semibold text-emerald-600">
                      ✓ Completed
                    </span>
                  )}

                </div>

                {note.description && (
                  <p className="text-sm text-slate-500 mb-4">
                    {note.description}
                  </p>
                )}

                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">

                  {note.content ? (
                    <div className="text-sm text-slate-700 leading-7 whitespace-pre-line">
                      {note.content}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">
                      Note content is not available yet.
                    </p>
                  )}

                </div>

                <div className="flex justify-end mt-5">

                  <button
                    onClick={() =>
                      completeNote(
                        note._id
                      )
                    }
                    disabled={completed}
                    className={
                      completed
                        ? "btn-outline opacity-70 cursor-not-allowed"
                        : "btn-primary"
                    }
                  >
                    {completed
                      ? "✓ Note Completed"
                      : "Mark Note as Completed"}
                  </button>

                </div>

              </div>
            );
          }
        )}

        {allNotesCompleted && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">

            <div className="font-semibold text-emerald-800">
              ✓ All notes completed
            </div>

            <p className="text-sm text-emerald-700 mt-1">
              The Worksheet section is now unlocked.
            </p>

            <button
              onClick={() =>
                setActiveTab("worksheet")
              }
              className="btn-primary mt-3"
            >
              Continue to Worksheet →
            </button>

          </div>
        )}

      </div>
    );
  };

  // ======================================================
  // WORKSHEET
  // ======================================================

  const renderWorksheet = () => {
    if (!canOpenWorksheet) {
      return (
        <LockedResource
          icon="🔒"
          title="Worksheet Locked"
          message="Complete all videos and notes before opening the worksheet."
          action="Go to Notes"
          onClick={() =>
            setActiveTab("notes")
          }
        />
      );
    }

    if (worksheets.length === 0) {
      return (
        <EmptyResource
          icon="📝"
          title="No Worksheet Available"
          message="No worksheet has been added for this topic yet."
        />
      );
    }

    return (
      <div className="space-y-5">

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Topic Worksheet
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Practice the concepts of{" "}
            {topicTitle} before attempting the
            assessment.
          </p>
        </div>

        {worksheets.map(
          (worksheet, index) => (
            <div
              key={worksheet._id}
              className="card p-6"
            >

              <div className="flex items-start gap-4">

                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-xl">
                  📝
                </div>

                <div className="flex-1">

                  <div className="text-xs text-indigo-500 font-semibold mb-1">
                    Worksheet {index + 1}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">
                    {worksheet.title}
                  </h3>

                  {worksheet.description && (
                    <p className="text-sm text-slate-500 mt-1">
                      {worksheet.description}
                    </p>
                  )}

                </div>

              </div>

              {worksheet.content && (
                <div className="mt-5 p-5 rounded-xl bg-slate-50 border border-slate-200">

                  <div className="text-sm text-slate-700 leading-7 whitespace-pre-line">
                    {worksheet.content}
                  </div>

                </div>
              )}

              {worksheet.url && (
                <div className="mt-5">

                  <a
                    href={worksheet.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-outline inline-flex"
                  >
                    📄 Open Worksheet
                  </a>

                </div>
              )}

            </div>
          )
        )}

        {!worksheetCompleted ? (
          <div className="p-5 rounded-xl bg-indigo-50 border border-indigo-200">

            <h3 className="font-semibold text-indigo-900">
              Have you completed the worksheet?
            </h3>

            <p className="text-sm text-indigo-700 mt-1">
              Complete the worksheet before
              continuing to the revision section.
            </p>

            <button
              onClick={() =>
                setWorksheetCompleted(true)
              }
              className="btn-primary mt-4"
            >
              ✓ Mark Worksheet Complete
            </button>

          </div>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">

            <div className="font-semibold text-emerald-800">
              ✓ Worksheet completed
            </div>

            <p className="text-sm text-emerald-700 mt-1">
              The Revision section is now unlocked.
            </p>

            <button
              onClick={() =>
                setActiveTab("revision")
              }
              className="btn-primary mt-3"
            >
              Continue to Revision →
            </button>

          </div>
        )}

      </div>
    );
  };

  // ======================================================
  // REVISION
  // ======================================================

  const renderRevision = () => {
    if (!canOpenRevision) {
      return (
        <LockedResource
          icon="🔒"
          title="Revision Locked"
          message="Complete the videos, notes, and worksheet before starting revision."
          action="Go to Worksheet"
          onClick={() =>
            setActiveTab("worksheet")
          }
        />
      );
    }

    return (
      <div className="space-y-5">

        <div className="card p-6">

          <div className="ai-chip mb-4">
            🔄 Revision
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Revise {topicTitle}
          </h2>

          <p className="text-sm text-slate-500 leading-6">
            Before starting the topic assessment,
            revise the important concepts you have
            learned from the videos, notes, and
            worksheet.
          </p>

          <div className="mt-5 p-5 rounded-xl bg-slate-50 border border-slate-200">

            <h3 className="font-bold text-slate-900 mb-3">
              📚 Revision Checklist
            </h3>

            <div className="space-y-3 text-sm">

              <div className="flex items-center gap-3">
                <span className="text-emerald-600">
                  ✓
                </span>
                <span>
                  Topic videos completed
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-emerald-600">
                  ✓
                </span>
                <span>
                  Learning notes completed
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-emerald-600">
                  ✓
                </span>
                <span>
                  Worksheet completed
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* MARK TOPIC COMPLETE */}

        {!topicCompleted ? (
          <div className="card p-6">

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Complete Learning
            </h3>

            <p className="text-sm text-slate-500 mb-5">
              If you have completed the learning
              activities and revision, mark this
              topic as complete.
            </p>

            <button
              onClick={markTopicComplete}
              className="btn-primary w-full justify-center py-3"
            >
              ✓ Mark Topic as Completed
            </button>

          </div>
        ) : (
          <div className="card p-6">

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 mb-5">

              <div className="font-bold text-emerald-800">
                ✓ {topicTitle} completed
              </div>

              <p className="text-sm text-emerald-700 mt-1">
                You have completed the learning
                activities for this topic.
              </p>

            </div>

            {/* ASSESSMENT */}

            <div className="p-5 rounded-xl bg-indigo-50 border border-indigo-200">

              <div className="text-2xl mb-2">
                🎯
              </div>

              <h3 className="text-lg font-bold text-indigo-950">
                Ready for Topic Assessment?
              </h3>

              <p className="text-sm text-indigo-700 mt-1 mb-4">
                The assessment contains 30 questions
                worth 100 marks and is based only on{" "}
                <strong>{topicTitle}</strong>.
              </p>

              <button
                onClick={takeAssessment}
                disabled={!canTakeAssessment}
                className="btn-primary w-full justify-center py-3 disabled:opacity-50"
              >
                Take Topic Assessment →
              </button>

            </div>

          </div>
        )}

      </div>
    );
  };

  // ======================================================
  // RENDER ACTIVE TAB
  // ======================================================

  const renderActiveContent = () => {
    switch (activeTab) {
      case "videos":
        return renderVideos();

      case "notes":
        return renderNotes();

      case "worksheet":
        return renderWorksheet();

      case "revision":
        return renderRevision();

      default:
        return renderVideos();
    }
  };

  // ======================================================
  // MAIN PAGE
  // ======================================================

  return (
    <div className="p-6">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="flex items-center justify-between mb-6">

        <div>

          <div className="text-sm text-slate-500 mb-1">
            My Learning
            <span className="mx-2">›</span>
            {subject}
            <span className="mx-2">›</span>

            <span className="text-slate-800 font-medium">
              {topicTitle}
            </span>
          </div>

          <h1
            className="text-3xl font-bold text-indigo-950"
            style={{
              fontFamily:
                "'DM Sans',sans-serif",
            }}
          >
            Learning Resource
          </h1>

          <p className="text-slate-500 mt-1">
            {topicTitle}
          </p>

        </div>

      </div>

      {/* ==================================================
          TOPIC DESCRIPTION
      ================================================== */}

      <div className="card p-5 mb-6">

        <div className="flex flex-wrap items-center gap-3 mb-3">

          <span className="px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold">
            {subject}
          </span>

          <span className="text-sm text-slate-500">
            ⏱ Learn at your own pace
          </span>

          <span className="text-sm text-slate-500">
            📚 Learning Resources
          </span>

        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {topicTitle}
        </h2>

        <p className="text-slate-500 leading-6">
          {topicDescription}
        </p>

      </div>

      {/* ==================================================
          PROGRESS CARD
      ================================================== */}

      <div className="card p-5 mb-6">

        <div className="flex items-center justify-between mb-3">

          <div>
            <h3 className="font-bold text-slate-900">
              Topic Learning Progress
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Complete each learning stage in order.
            </p>
          </div>

          <div className="text-2xl font-black text-indigo-600">
            {progress}%
          </div>

        </div>

        <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">

          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </div>

      {/* ==================================================
          TABS
      ================================================== */}

      <div className="card p-2 mb-6">

        <div className="flex flex-wrap gap-2">

          {TABS.map((tab) => {

            const locked =
              (tab.id === "notes" &&
                !canOpenNotes) ||
              (tab.id === "worksheet" &&
                !canOpenWorksheet) ||
              (tab.id === "revision" &&
                !canOpenRevision);

            const active =
              activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() =>
                  openTab(tab.id)
                }
                disabled={locked}
                className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? "bg-indigo-600 text-white"
                    : locked
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >

                <span className="mr-2">
                  {locked
                    ? "🔒"
                    : tab.icon}
                </span>

                {tab.label}

              </button>
            );
          })}

        </div>

      </div>

      {/* ==================================================
          MAIN CONTENT + SIDEBAR
      ================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* MAIN */}

        <div className="lg:col-span-2">

          {renderActiveContent()}

        </div>

        {/* SIDEBAR */}

        <div className="space-y-5">

          {/* PROGRESS */}

          <div className="card p-5">

            <h3 className="font-bold text-slate-900 mb-4">
              Your Progress
            </h3>

            <div className="text-5xl font-black text-indigo-600 mb-1">
              {progress}%
            </div>

            <p className="text-sm text-slate-500 mb-4">
              Topic Completion
            </p>

            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden mb-5">

              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

            <div className="space-y-3 text-sm">

              <ProgressRow
                label="Videos"
                completed={allVideosCompleted}
              />

              <ProgressRow
                label="Notes"
                completed={allNotesCompleted}
              />

              <ProgressRow
                label="Worksheet"
                completed={
                  worksheetCompleted
                }
              />

              <ProgressRow
                label="Revision"
                completed={
                  canOpenRevision
                }
              />

              <ProgressRow
                label="Topic Complete"
                completed={
                  topicCompleted
                }
              />

            </div>

          </div>

          {/* TOPIC INFORMATION */}

          <div className="card p-5">

            <h3 className="font-bold text-slate-900 mb-4">
              Topic Information
            </h3>

            <div className="space-y-4 text-sm">

              <InfoRow
                label="Topic"
                value={topicTitle}
              />

              <InfoRow
                label="Subject"
                value={subject}
              />

              <InfoRow
                label="Assessment"
                value="30 Questions / 100 Marks"
              />

              <InfoRow
                label="Time Limit"
                value="30 Minutes"
              />

            </div>

          </div>

          {/* ASSESSMENT STATUS */}

          <div className="card p-5">

            <h3 className="font-bold text-slate-900 mb-3">
              Assessment
            </h3>

            {canTakeAssessment ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">

                <div className="font-semibold text-emerald-800">
                  ✓ Assessment Unlocked
                </div>

                <p className="text-xs text-emerald-700 mt-1">
                  You can now start the topic
                  assessment.
                </p>

              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">

                <div className="font-semibold text-slate-700">
                  🔒 Assessment Locked
                </div>

                <p className="text-xs text-slate-500 mt-1">
                  Complete the learning activities
                  and mark the topic complete first.
                </p>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

// ======================================================
// PROGRESS ROW
// ======================================================

function ProgressRow({
  label,
  completed,
}) {
  return (
    <div className="flex items-center justify-between">

      <span className="text-slate-600">
        {label}
      </span>

      <span
        className={
          completed
            ? "text-emerald-600 font-semibold"
            : "text-slate-400"
        }
      >
        {completed
          ? "✓ Completed"
          : "Pending"}
      </span>

    </div>
  );
}

// ======================================================
// INFO ROW
// ======================================================

function InfoRow({
  label,
  value,
}) {
  return (
    <div>

      <div className="text-xs text-slate-400 mb-1">
        {label}
      </div>

      <div className="font-semibold text-slate-800">
        {value}
      </div>

    </div>
  );
}

// ======================================================
// LOCKED RESOURCE
// ======================================================

function LockedResource({
  icon,
  title,
  message,
  action,
  onClick,
}) {
  return (
    <div className="card p-8 text-center">

      <div className="text-5xl mb-4">
        {icon}
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-2">
        {title}
      </h2>

      <p className="text-sm text-slate-500 mb-5">
        {message}
      </p>

      <button
        onClick={onClick}
        className="btn-outline"
      >
        ← {action}
      </button>

    </div>
  );
}

// ======================================================
// EMPTY RESOURCE
// ======================================================

function EmptyResource({
  icon,
  title,
  message,
}) {
  return (
    <div className="card p-8 text-center">

      <div className="text-5xl mb-4">
        {icon}
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-2">
        {title}
      </h2>

      <p className="text-sm text-slate-500">
        {message}
      </p>

    </div>
  );
}