const completionData = {
  course: "Java Programming & Data Structures",
  student: "Arjun Sharma",
  date: "April 26, 2026",
  finalScore: 86,
  topicsCompleted: 12,
  topicsTotal: 12,
  quizzesCompleted: 6,
  quizzesTotal: 6,
  studyHours: 48,
  certId: "LEARNAI-2026-CSE-0042"
};
const milestones = [{
  icon: "✓",
  label: "All Topics Completed",
  val: `${completionData.topicsCompleted}/${completionData.topicsTotal}`,
  color: "#10B981"
}, {
  icon: "✓",
  label: "Smart Quizzes Passed",
  val: `${completionData.quizzesCompleted}/${completionData.quizzesTotal}`,
  color: "#10B981"
}, {
  icon: "✓",
  label: "Final Evaluation Passed",
  val: `${completionData.finalScore}%`,
  color: "#10B981"
}, {
  icon: "✓",
  label: "Required Score Achieved",
  val: "≥70% met",
  color: "#10B981"
}, {
  icon: "✓",
  label: "Certificate Unlocked",
  val: "Ready",
  color: "#4F46E5"
}];
export default function CourseComplete({
  onNav
}) {
  return <div className="p-6 max-w-3xl mx-auto">
      {/* Hero Card */}
      <div className="card p-8 text-center mb-5 slide-up overflow-hidden relative" style={{
      background: "linear-gradient(135deg, #1E1B4B, #312E81, #4F46E5)"
    }}>
        {/* Decorative circles */}
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full opacity-10" style={{
        background: "radial-gradient(circle, #06B6D4, transparent)"
      }} />
        <div className="absolute -bottom-10 -right-10 w-56 h-56 rounded-full opacity-10" style={{
        background: "radial-gradient(circle, #7C3AED, transparent)"
      }} />

        <div className="relative z-10">
          <div className="text-7xl mb-4">🎓</div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4" style={{
          background: "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.25)"
        }}>
            <span className="text-cyan-300 text-sm">✨</span>
            <span className="text-white text-sm font-semibold">Course Completed!</span>
          </div>
          <h1 className="text-3xl font-800 text-white mb-2" style={{
          fontFamily: "'DM Sans',sans-serif",
          fontWeight: 800
        }}>
            Congratulations, {completionData.student}!
          </h1>
          <p className="text-indigo-200 mb-6">
            You have successfully completed <strong className="text-white">{completionData.course}</strong>
          </p>
          <div className="text-indigo-300 text-sm">Completed on {completionData.date}</div>
        </div>
      </div>

      {/* Achievement Summary */}
      <div className="card p-5 mb-5">
        <h3 className="font-700 text-slate-900 mb-4" style={{
        fontFamily: "'DM Sans',sans-serif",
        fontWeight: 700
      }}>Achievement Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          {[{
          label: "Overall Completion",
          val: "100%",
          color: "#4F46E5",
          icon: "📊"
        }, {
          label: "Final Score",
          val: `${completionData.finalScore}%`,
          color: "#10B981",
          icon: "🎯"
        }, {
          label: "Topics Completed",
          val: `${completionData.topicsCompleted}/${completionData.topicsTotal}`,
          color: "#06B6D4",
          icon: "📚"
        }, {
          label: "Study Hours",
          val: `${completionData.studyHours}h`,
          color: "#F59E0B",
          icon: "⏱"
        }].map(s => <div key={s.label} className="text-center p-4 rounded-xl" style={{
          background: `${s.color}10`,
          border: `1px solid ${s.color}25`
        }}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-black mb-0.5" style={{
            fontFamily: "'DM Sans',sans-serif",
            color: s.color
          }}>{s.val}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>)}
        </div>

        {/* Completion Progress Bar */}
        <div className="mb-5">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold text-slate-700">Overall Learning Progress</span>
            <span className="font-bold text-indigo-600">100%</span>
          </div>
          <div className="progress-bar" style={{
          height: 12
        }}>
            <div className="progress-fill" style={{
            width: "100%",
            background: "linear-gradient(90deg, #4F46E5, #06B6D4)"
          }} />
          </div>
        </div>

        {/* Milestones Checklist */}
        <div className="space-y-2.5">
          {milestones.map(m => <div key={m.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{
              background: m.color
            }}>
                  {m.icon}
                </div>
                <span className="text-sm text-slate-700">{m.label}</span>
              </div>
              <span className="text-sm font-semibold" style={{
            color: m.color
          }}>{m.val}</span>
            </div>)}
        </div>
      </div>

      {/* Certificate CTA */}
      <div className="card p-5 mb-4" style={{
      borderLeft: "4px solid #4F46E5",
      background: "linear-gradient(135deg, #F5F3FF, #EFF6FF)"
    }}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="text-3xl">🎓</div>
            <div>
              <div className="font-700 text-indigo-950 mb-0.5" style={{
              fontFamily: "'DM Sans',sans-serif",
              fontWeight: 700
            }}>Your Certificate is Ready!</div>
              <p className="text-sm text-indigo-700">Certificate ID: <strong>{completionData.certId}</strong></p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs">✓</span>
                <span className="text-xs text-emerald-700 font-semibold">Verified &amp; Authenticated</span>
              </div>
            </div>
          </div>
          <button onClick={() => onNav("certificate-preview")} className="btn-primary py-2.5 px-5 flex-shrink-0">
            View Certificate →
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={() => onNav("certificate-preview")} className="btn-primary flex-1 justify-center py-2.5">
          🎓 View Certificate
        </button>
        <button onClick={() => onNav("certificates")} className="btn-secondary flex-1 justify-center py-2.5">
          📜 My Certificates
        </button>
        <button onClick={() => onNav("student-dashboard")} className="btn-outline flex-1 justify-center py-2.5">
          Continue Learning
        </button>
      </div>
    </div>;
}
