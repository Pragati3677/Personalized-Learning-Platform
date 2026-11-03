const features = [{
  icon: "🗺️",
  title: "Personalized Learning Paths",
  desc: "AI maps a unique path based on your strengths, gaps, and goals — not a one-size-fits-all curriculum."
}, {
  icon: "✨",
  title: "AI Recommendations",
  desc: "Random Forest model continuously analyzes your performance and surfaces the most relevant resources."
}, {
  icon: "🧠",
  title: "Adaptive Smart Quizzes",
  desc: "Quizzes auto-adjust difficulty in real time based on your current mastery level."
}, {
  icon: "📅",
  title: "AI Study Planner",
  desc: "Auto-generates a daily study schedule around your exam dates and weak areas."
}, {
  icon: "📈",
  title: "Progress Analytics",
  desc: "Deep charts and insights show exactly where you stand and what moves the needle."
}, {
  icon: "⚠️",
  title: "Early Alert System",
  desc: "Teachers receive instant flags when students show signs of disengagement or performance drops."
}, {
  icon: "👩‍🏫",
  title: "Teacher Dashboard",
  desc: "Full class visibility — individual performance, weak topics, and intervention tracking."
}, {
  icon: "🚀",
  title: "Career Mentor",
  desc: "AI maps your skills to career paths and recommends certifications and projects."
}];
const steps = [{
  n: "01",
  title: "Take Assessment",
  desc: "Complete a short prerequisite quiz to establish your baseline knowledge."
}, {
  n: "02",
  title: "AI Analysis",
  desc: "Random Forest model classifies your learning level and identifies weak areas."
}, {
  n: "03",
  title: "Get Your Path",
  desc: "Receive a personalized learning roadmap tailored to your gaps and goals."
}, {
  n: "04",
  title: "Learn Adaptively",
  desc: "Study resources and quizzes adapt as your mastery improves."
}, {
  n: "05",
  title: "Track & Improve",
  desc: "Monitor progress with real-time analytics and spaced revision reminders."
}];
export default function Landing({
  onNav
}) {
  return <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{
            background: "linear-gradient(135deg,#4F46E5,#06B6D4)"
          }}>AI</div>
            <span className="text-lg font-bold text-indigo-900" style={{
            fontFamily: "'DM Sans',sans-serif"
          }}>LearnAI</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-600 font-medium">
            <a href="#features" className="hover:text-indigo-600">Features</a>
            <a href="#how" className="hover:text-indigo-600">How It Works</a>
            <a href="#benefits" className="hover:text-indigo-600">Benefits</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => onNav("login")} className="btn-outline text-sm py-2 px-4">Log In</button>
            <button onClick={() => onNav("register")} className="btn-primary text-sm py-2 px-4">Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{
      background: "linear-gradient(135deg, #F5F3FF 0%, #EFF6FF 50%, #ECFEFF 100%)"
    }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-72 h-72 rounded-full opacity-20" style={{
          background: "radial-gradient(circle, #4F46E5, transparent)"
        }} />
          <div className="absolute bottom-10 right-1/4 w-56 h-56 rounded-full opacity-15" style={{
          background: "radial-gradient(circle, #06B6D4, transparent)"
        }} />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
          <div className="slide-up">
            <div className="ai-chip mb-5">✨ Powered by Random Forest AI &amp; ML</div>
            <h1 className="text-5xl lg:text-6xl font-800 text-indigo-950 leading-tight mb-6" style={{
            fontFamily: "'DM Sans',sans-serif",
            fontWeight: 800
          }}>
              Learn Smarter.<br />
              <span className="gradient-text">Learn Your Way.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-xl">
              LearnAI continuously analyzes your performance using AI and Machine Learning to build a personalized learning path, adaptive quizzes, and a smart study plan — uniquely yours.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => onNav("register")} className="btn-primary text-base py-3 px-6">
                🚀 Get Started Free
              </button>
              <button onClick={() => onNav("student-dashboard")} className="btn-outline text-base py-3 px-6">
                Explore Platform
              </button>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-slate-500">
              <span>✓ No credit card required</span>
              <span>✓ Free for students</span>
              <span>✓ B.Tech friendly</span>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="relative flex items-center justify-center">
            <div className="card p-6 w-full max-w-md shadow-xl">
              <div className="ai-chip mb-4">🤖 AI Learning Analysis</div>
              <div className="space-y-3">
                {[{
                label: "Java Loops",
                pct: 88,
                color: "#10B981"
              }, {
                label: "Arrays",
                pct: 52,
                color: "#F59E0B"
              }, {
                label: "OOP Concepts",
                pct: 71,
                color: "#4F46E5"
              }, {
                label: "Recursion",
                pct: 38,
                color: "#EF4444"
              }].map(t => <div key={t.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-700">{t.label}</span>
                      <span className="font-semibold" style={{
                    color: t.color
                  }}>{t.pct}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{
                    width: `${t.pct}%`,
                    background: t.color
                  }} />
                    </div>
                  </div>)}
              </div>
              <div className="mt-4 p-3 rounded-lg text-sm text-indigo-700 font-medium" style={{
              background: "#EEF2FF"
            }}>
                🎯 <strong>AI says:</strong> Focus on Arrays and Recursion next. Your learning path has been updated.
              </div>
            </div>
            {/* floating badges */}
            <div className="absolute -top-4 -right-4 card px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border-emerald-200">
              ↑ 18% this week
            </div>
            <div className="absolute -bottom-4 -left-4 card px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border-indigo-200">
              📚 Next: Arrays Basics
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="ai-chip mx-auto mb-4">How It Works</div>
            <h2 className="text-4xl font-bold text-indigo-950 mb-4" style={{
            fontFamily: "'DM Sans',sans-serif"
          }}>Your AI-Powered Journey</h2>
            <p className="text-slate-500 max-w-xl mx-auto">From baseline assessment to mastery — every step intelligently guided by AI.</p>
          </div>
          <div className="grid md:grid-cols-5 gap-4">
            {steps.map((s, i) => <div key={s.n} className="relative">
                <div className="card p-5 h-full hover:shadow-md transition-shadow">
                  <div className="text-3xl font-black mb-3 gradient-text" style={{
                fontFamily: "'DM Sans',sans-serif"
              }}>{s.n}</div>
                  <h3 className="font-700 text-slate-900 mb-2" style={{
                fontFamily: "'DM Sans',sans-serif",
                fontWeight: 700
              }}>{s.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
                {i < steps.length - 1 && <div className="hidden md:flex absolute top-1/2 -right-2 text-indigo-300 text-lg z-10">→</div>}
              </div>)}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20" style={{
      background: "#F8F9FF"
    }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="ai-chip mx-auto mb-4">Platform Features</div>
            <h2 className="text-4xl font-bold text-indigo-950 mb-4" style={{
            fontFamily: "'DM Sans',sans-serif"
          }}>Everything You Need to Excel</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(f => <div key={f.title} className="card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-700 text-slate-900 mb-2 text-sm" style={{
              fontFamily: "'DM Sans',sans-serif",
              fontWeight: 700
            }}>{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12">
          <div>
            <div className="ai-chip mb-4">For Students</div>
            <h2 className="text-3xl font-bold text-indigo-950 mb-6" style={{
            fontFamily: "'DM Sans',sans-serif"
          }}>Stop Studying Harder. Start Studying Smarter.</h2>
            <div className="space-y-4">
              {["Know exactly which topics need your attention", "Get video, notes, and practice for your weak areas", "AI quizzes adapt to your current level", "Spaced revision keeps concepts fresh", "Personalized career roadmap to placement"].map(b => <div key={b} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs mt-0.5 flex-shrink-0">✓</div>
                  <span className="text-slate-700 text-sm">{b}</span>
                </div>)}
            </div>
            <button onClick={() => onNav("register")} className="btn-primary mt-8">Start Learning Free →</button>
          </div>
          <div>
            <div className="ai-chip mb-4">For Teachers</div>
            <h2 className="text-3xl font-bold text-indigo-950 mb-6" style={{
            fontFamily: "'DM Sans',sans-serif"
          }}>Full Visibility. Early Intervention. Better Outcomes.</h2>
            <div className="space-y-4">
              {["Real-time class performance overview", "Instant at-risk student alerts", "Topic-wise weak area analysis", "One-click intervention tools", "Automated performance reports"].map(b => <div key={b} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs mt-0.5 flex-shrink-0">✓</div>
                  <span className="text-slate-700 text-sm">{b}</span>
                </div>)}
            </div>
            <button onClick={() => onNav("login")} className="btn-secondary mt-8 border-emerald-300 text-emerald-700 bg-emerald-50">Teacher Login →</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-950 text-white py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{
            background: "linear-gradient(135deg,#4F46E5,#06B6D4)"
          }}>AI</div>
            <span className="font-bold" style={{
            fontFamily: "'DM Sans',sans-serif"
          }}>LearnAI</span>
          </div>
          <p className="text-indigo-300 text-sm">AI-Powered Personalized Learning Platform · B.Tech Final Year Project · EdTech + AI + ML</p>
          <p className="text-indigo-400 text-xs">© 2026 LearnAI</p>
        </div>
      </footer>
    </div>;
}
