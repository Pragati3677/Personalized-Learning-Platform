import { useCallback, useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

// ============================================================
// TIME AGO
// ============================================================

const getTimeAgo = (date) => {
  if (!date) return "";

  const now = new Date();
  const created = new Date(date);
  const diffMs = now - created;

  const minutes = Math.floor(diffMs / (1000 * 60));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  return created.toLocaleDateString();
};

// ============================================================
// NOTIFICATION ICON
// ============================================================

const getNotificationIcon = (type) => {
  switch (type) {
    case "teacher_message":
      return "👩‍🏫";

    case "intervention":
      return "🤝";

    case "performance_alert":
      return "⚠️";

    case "general":
      return "🔔";

    default:
      return "🔔";
  }
};

// ============================================================
// NOTIFICATION STYLE
// ============================================================

const getNotificationStyle = (type) => {
  switch (type) {
    case "teacher_message":
      return {
        background: "#EEF2FF",
      };

    case "intervention":
      return {
        background: "#ECFDF5",
      };

    case "performance_alert":
      return {
        background: "#FFF7ED",
      };

    default:
      return {
        background: "#F8FAFC",
      };
  }
};

// ============================================================
// NOTIFICATIONS PAGE
// ============================================================

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // ============================================================
  // FETCH NOTIFICATIONS
  // ============================================================

  const fetchNotifications = useCallback(
    async (showLoader = true) => {
      try {
        if (showLoader) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login again.");
          return;
        }

        const response = await fetch(
          `${API_URL}/notifications/my`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Failed to load notifications."
          );
        }

        setNotifications(
          Array.isArray(data.notifications)
            ? data.notifications
            : []
        );
      } catch (error) {
        console.error(
          "Notification fetch error:",
          error
        );

        setError(
          error.message ||
            "Failed to load notifications."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  // ============================================================
  // INITIAL LOAD
  // + REFRESH WHEN PAGE BECOMES VISIBLE
  // ============================================================

  useEffect(() => {
    fetchNotifications(true);

    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible"
      ) {
        fetchNotifications(false);
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [fetchNotifications]);

  // ============================================================
  // MANUAL REFRESH
  // ============================================================

  const handleRefresh = () => {
    fetchNotifications(false);
  };

  // ============================================================
  // MARK ONE NOTIFICATION AS READ
  // ============================================================

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login again.");
        return;
      }

      const response = await fetch(
        `${API_URL}/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to mark notification as read."
        );
      }

      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error(
        "Mark notification error:",
        error
      );

      setError(
        error.message ||
          "Unable to mark notification as read."
      );
    }
  };

  // ============================================================
  // MARK ALL AS READ
  // ============================================================

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login again.");
        return;
      }

      const response = await fetch(
        `${API_URL}/notifications/read-all`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to mark all notifications as read."
        );
      }

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error(
        "Mark all notifications error:",
        error
      );

      setError(
        error.message ||
          "Unable to mark all notifications as read."
      );
    }
  };

  // ============================================================
  // UNREAD COUNT
  // ============================================================

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="p-6">
        <div className="card p-10 text-center">
          <div className="text-indigo-600 text-sm">
            Loading notifications...
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
        <div className="card p-8 text-center">

          <div className="text-3xl mb-3">
            ⚠️
          </div>

          <h3 className="font-bold text-slate-800 mb-2">
            Unable to Load Notifications
          </h3>

          <p className="text-sm text-red-500 mb-4">
            {error}
          </p>

          <button
            onClick={() => {
              setError("");
              fetchNotifications(true);
            }}
            className="btn-primary px-4 py-2"
          >
            Try Again
          </button>

        </div>
      </div>
    );
  }

  // ============================================================
  // MAIN PAGE
  // ============================================================

  return (
    <div className="p-6">

      {/* ======================================================
          HEADER
      ======================================================= */}

      <div className="flex items-center justify-between mb-5">

        <div>
          <h2
            className="text-xl font-800 text-indigo-950"
            style={{
              fontFamily:
                "'DM Sans', sans-serif",
              fontWeight: 800,
            }}
          >
            Notifications
          </h2>

          <p className="text-slate-500 text-sm">
            {unreadCount} unread notification
            {unreadCount !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center gap-2">

          {/* REFRESH BUTTON */}

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-secondary text-sm py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {refreshing
              ? "Refreshing..."
              : "🔄 Refresh"}
          </button>

          {/* MARK ALL READ */}

          {notifications.length > 0 &&
            unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="btn-secondary text-sm py-2 px-4"
              >
                Mark All Read
              </button>
            )}

        </div>
      </div>

      {/* ======================================================
          EMPTY STATE
      ======================================================= */}

      {notifications.length === 0 ? (
        <div className="card p-12 text-center">

          <div className="text-4xl mb-3">
            🔔
          </div>

          <h3 className="font-bold text-slate-800 mb-1">
            No Notifications
          </h3>

          <p className="text-sm text-slate-500">
            You don't have any notifications yet.
          </p>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-primary mt-5 px-4 py-2 disabled:opacity-50"
          >
            {refreshing
              ? "Refreshing..."
              : "🔄 Check Again"}
          </button>

        </div>
      ) : (

        /* ====================================================
           NOTIFICATION LIST
        ===================================================== */

        <div className="space-y-3">

          {notifications.map(
            (notification) => {
              const icon =
                getNotificationIcon(
                  notification.type
                );

              const style =
                getNotificationStyle(
                  notification.type
                );

              return (
                <div
                  key={notification._id}
                  onClick={() =>
                    !notification.isRead &&
                    markAsRead(
                      notification._id
                    )
                  }
                  className={`card p-4 flex items-start gap-4 transition-all cursor-pointer ${
                    !notification.isRead
                      ? "border-indigo-200"
                      : ""
                  }`}
                >

                  {/* ICON */}

                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={style}
                  >
                    {icon}
                  </div>

                  {/* CONTENT */}

                  <div className="flex-1 min-w-0">

                    <div className="flex items-center justify-between gap-3">

                      <div className="flex items-center gap-2">

                        <h3 className="font-semibold text-slate-800 text-sm">
                          {notification.title}
                        </h3>

                        {!notification.isRead && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600" />
                        )}

                      </div>

                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {getTimeAgo(
                          notification.createdAt
                        )}
                      </span>

                    </div>

                    <p className="text-sm text-slate-600 mt-1">
                      {notification.message}
                    </p>

                    {/* TEACHER */}

                    {notification.teacherId
                      ?.name && (
                      <p className="text-xs text-slate-400 mt-2">
                        From:{" "}
                        {
                          notification
                            .teacherId.name
                        }
                      </p>
                    )}

                    {/* INTERVENTION LABEL */}

                    {notification.type ===
                      "intervention" && (
                      <span className="inline-block mt-2 text-xs font-medium px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">
                        🤝 Teacher Intervention
                      </span>
                    )}

                  </div>

                </div>
              );
            }
          )}

        </div>
      )}

    </div>
  );
}