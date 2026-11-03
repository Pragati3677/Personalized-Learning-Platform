const topics = [{
  name: "Java Loops",
  mastery: 88,
  dueLabel: "Due Today",
  urgency: "today",
  lastReview: "7 days ago"
}, {
  name: "OOP Concepts",
  mastery: 71,
  dueLabel: "Due Today",
  urgency: "today",
  lastReview: "7 days ago"
}, {
  name: "Arrays",
  mastery: 58,
  dueLabel: "Due Tomorrow",
  urgency: "tomorrow",
  lastReview: "4 days ago"
}, {
  name: "SQL Joins",
  mastery: 52,
  dueLabel: "Due in 2 days",
  urgency: "upcoming",
  lastReview: "3 days ago"
}, {
  name: "Algorithms — Sorting",
  mastery: 72,
  dueLabel: "Due in 3 days",
  urgency: "upcoming",
  lastReview: "6 days ago"
}, {
  name: "Python Functions",
  mastery: 78,
  dueLabel: "Due in 5 days",
  urgency: "later",
  lastReview: "9 days ago"
}];
const urgencyStyle = {
  today: {
    label: "Review Today",
    bg: "#FEF2F2",
    color: "#DC2626",
    border: "#FCA5A5"
  },
  tomorrow: {
    label: "Review Tomorrow",
    bg: "#FFFBEB",
    color: "#D97706",
    border: "#FDE68A"
  },
  upcoming: {
    label: "Coming Up",
    bg: "#EEF2FF",
    color: "#4338CA",
    border: "#C7D2FE"
  },
  later: {
    label: "Later",
    bg: "#F8FAFC",
    color: "#64748B",
    border: "#E2E8F0"
  }
};
export default function RevisionCenter() {
  const todayCount = topics.filter(t => t.urgency === "today").length;
  return <div className="p-6 space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-800 text-indigo-950 mb-1" style={{
          fontFamily: "'DM Sans',sans-serif",
          fontWeight: 800
        }}>Revision Center</h2>
          <p className="text-slate-500 text-sm">Spaced repetition keeps knowledge fresh. Review topics when AI schedules them.</p>
        </div>
        <div className="card px-4 py-2 text-sm text-red-700 bg-red-50 border-red-200">
          ⚠️ {todayCount} topics due today
        </div>
      </div>

      <div className="card p-4" style={{
      borderLeft: "4px solid #4F46E5"
    }}>
        <div className="ai-chip mb-2">🤖 Spaced Repetition AI</div>
        <p className="text-sm text-slate-700">
          AI schedules revisions based on the <strong>Ebbinghaus Forgetting Curve</strong> — topics are reviewed at optimal intervals (1, 3, 7, 14 days) to lock knowledge into long-term memory.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map(t => {
        const st = urgencyStyle[t.urgency];
        return <div key={t.name} className="card p-5" style={{
          borderTop: `3px solid ${st.color}`
        }}>
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-700 text-slate-900" style={{
              fontFamily: "'DM Sans',sans-serif",
              fontWeight: 700
            }}>{t.name}</h3>
                <span className="badge text-xs" style={{
              background: st.bg,
              color: st.color,
              border: `1px solid ${st.border}`
            }}>
                  {st.label}
                </span>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500">Mastery</span>
                  <span className="font-semibold" style={{
                color: t.mastery >= 75 ? "#10B981" : t.mastery >= 60 ? "#F59E0B" : "#EF4444"
              }}>{t.mastery}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{
                width: `${t.mastery}%`,
                background: t.mastery >= 75 ? "#10B981" : t.mastery >= 60 ? "#F59E0B" : "#EF4444"
              }} />
                </div>
              </div>
              <div className="text-xs text-slate-400 mb-4">Last reviewed: {t.lastReview}</div>
              <button className={`w-full justify-center text-sm py-2 ${t.urgency === "today" ? "btn-primary" : "btn-secondary"}`} style={t.urgency === "today" ? {} : {
            background: st.bg,
            color: st.color,
            borderColor: st.border
          }}>
                {t.urgency === "today" ? "Review Now →" : t.urgency === "tomorrow" ? "Preview" : "View"}
              </button>
            </div>;
      })}
      </div>
    </div>;
}
