
const links = [
  { label: "Dashboard", icon: "⊞", view: "student-dashboard" },
  { label: "My Learning", icon: "📚", view: "my-learning" },
  { label: "Learning Path", icon: "🗺️", view: "learning-path" },
  { label: "Study Planner", icon: "📅", view: "study-planner" },
  { label: "Smart Quizzes", icon: "🧠", view: "smart-quiz" },
  { label: "Performance Analysis", icon: "📊", view: "performance" },
  { label: "AI Recommendations", icon: "✨", view: "recommendations" },
  { label: "Progress", icon: "📈", view: "progress" },
  { label: "Certificates", icon: "🎓", view: "certificates" },
  { label: "Career Mentor", icon: "🚀", view: "career" },
  { label: "Notifications", icon: "🔔", view: "notifications" },
  { label: "Profile", icon: "👤", view: "profile" },
  { label: "Settings", icon: "⚙️", view: "settings" },
];

function getStoredUser() {
  if (typeof window === "undefined") return null;

  // Check common localStorage keys used by login systems.
  const possibleKeys = ["user", "student", "currentUser", "loggedInUser"];

  for (const key of possibleKeys) {
    try {
      const storedValue = localStorage.getItem(key);

      if (!storedValue) continue;

      const parsedValue = JSON.parse(storedValue);

      // Some APIs store the user inside a nested object.
      const user =
        parsedValue?.user ||
        parsedValue?.student ||
        parsedValue;

      if (
        user &&
        typeof user === "object" &&
        (user.name ||
          user.fullName ||
          user.username ||
          user.email)
      ) {
        return user;
      }
    } catch {
      // Ignore values that are not valid JSON.
    }
  }

  return null;
}

export default function StudentSidebar({
  current,
  onNav,
  collapsed,
  user: userProp,
}) {
  const storedUser = getStoredUser();

  // Prefer the user passed from the parent component.
  const user = userProp || storedUser || {};

  const studentName =
    user.name ||
    user.fullName ||
    user.username ||
    user.email?.split("@")[0] ||
    "Student";

  const studentInitial = studentName.trim().charAt(0).toUpperCase() || "S";

  const department =
    user.department ||
    user.branch ||
    user.course ||
    "";

  const semester =
    user.semester
      ? `Sem ${user.semester}`
      : user.year
        ? user.year
        : "";

  const studentDetails = [department, semester]
    .filter(Boolean)
    .join(" — ");

  return (
    <aside
      className="flex flex-col bg-white border-r border-slate-200 h-screen sticky top-0"
      style={{
        width: collapsed ? 64 : 232,
        minWidth: collapsed ? 64 : 232,
        transition: "width 0.2s",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-slate-100">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
          style={{
            background: "linear-gradient(135deg, #4F46E5, #06B6D4)",
          }}
        >
          AI
        </div>

        {!collapsed && (
          <div>
            <div
              className="text-sm text-indigo-900"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
              }}
            >
              LearnAI
            </div>

            <div className="text-xs text-slate-400">
              Adaptive Platform
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {links.map((link) => (
          <button
            key={link.view}
            onClick={() => onNav(link.view)}
            className={`sidebar-link w-full text-left ${
              current === link.view ? "active" : ""
            }`}
          >
            <span className="text-base">{link.icon}</span>

            {!collapsed && (
              <span className="flex-1">{link.label}</span>
            )}

            {!collapsed && link.badge && (
              <span
                className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full"
                style={{
                  background:
                    current === link.view
                      ? "rgba(255,255,255,0.25)"
                      : "#4F46E5",
                  color: "white",
                  minWidth: 18,
                  textAlign: "center",
                }}
              >
                {link.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Logged-in Student Profile */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-100">
          <div className="flex items-center gap-2.5 px-2 py-1.5 min-w-0">
            <div className="w-8 h-8 shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
              {studentInitial}
            </div>

            <div className="min-w-0 flex-1">
              <div
                className="text-sm text-slate-800 truncate"
                style={{ fontWeight: 600 }}
                title={studentName}
              >
                {studentName}
              </div>

              <div className="text-xs text-slate-400 truncate">
                {studentDetails || user.email || "Student"}
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
