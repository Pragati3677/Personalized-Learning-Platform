import { useEffect, useState } from "react";

const links = [
  {
    label: "Dashboard",
    icon: "⊞",
    view: "teacher-dashboard",
  },
  {
    label: "Students",
    icon: "👥",
    view: "student-monitoring",
  },
  {
    label: "Performance",
    icon: "📊",
    view: "student-detail",
  },
  {
    label: "At-Risk Students",
    icon: "⚠️",
    view: "at-risk",
  },
  {
    label: "Reports",
    icon: "📋",
    view: "teacher-reports",
  },

  // Teacher-specific pages
  {
    label: "Notifications",
    icon: "🔔",
    view: "teacher-notifications",
  },
  {
    label: "Profile",
    icon: "👤",
    view: "teacher-profile",
  },
  {
    label: "Settings",
    icon: "⚙️",
    view: "teacher-settings",
  },
];

export default function TeacherSidebar({
  current,
  onNav,
}) {
  const [teacher, setTeacher] = useState({
    name: "Prof. Priya Nair",
    department: "CS Department",
  });

  useEffect(() => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      if (user && user.role === "teacher") {
        setTeacher({
          name:
            user.name ||
            "Prof. Priya Nair",
          department:
            user.department ||
            "CS Department",
        });
      }
    } catch (error) {
      console.error(
        "Teacher sidebar user error:",
        error
      );
    }
  }, []);

  return (
    <aside
      className="flex flex-col bg-white border-r border-slate-200 h-screen sticky top-0"
      style={{
        width: 232,
        minWidth: 232,
      }}
    >
      {/* ==================================================
          LOGO
      ================================================== */}

      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-slate-100">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
          style={{
            background:
              "linear-gradient(135deg, #059669, #0891B2)",
          }}
        >
          T
        </div>

        <div>
          <div
            className="text-sm text-slate-800"
            style={{
              fontFamily:
                "'DM Sans', sans-serif",
              fontWeight: 700,
            }}
          >
            LearnAI
          </div>

          <div className="text-xs text-slate-400">
            Teacher Portal
          </div>
        </div>
      </div>

      {/* ==================================================
          NAVIGATION
      ================================================== */}

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {links.map((link) => (
          <button
            key={link.view}
            onClick={() =>
              onNav(link.view)
            }
            className={`sidebar-link w-full text-left ${
              current === link.view
                ? "active"
                : ""
            }`}
          >
            <span className="text-base">
              {link.icon}
            </span>

            <span className="flex-1">
              {link.label}
            </span>
          </button>
        ))}
      </nav>

      {/* ==================================================
          TEACHER PROFILE
      ================================================== */}

      <div className="p-3 border-t border-slate-100">
        <div className="flex items-center gap-2.5 px-2 py-1.5">

          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
            {(teacher.name || "P")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-800 truncate">
              {teacher.name}
            </div>

            <div className="text-xs text-slate-400 truncate">
              {teacher.department}
            </div>
          </div>

        </div>
      </div>
    </aside>
  );
}