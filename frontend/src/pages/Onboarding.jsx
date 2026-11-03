import { useState } from "react";

const subjects = [
  "Java Programming",
  "Data Structures",
  "Algorithms",
  "DBMS",
  "Computer Networks",
  "Operating Systems",
  "Python",
  "Machine Learning",
];

const goals = [
  "Score 80%+",
  "Crack campus placements",
  "Build projects",
  "Clear semester exams",
  "Learn from scratch",
];

export default function Onboarding({ onNav }) {
  // Get logged-in user
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // States
  const [step, setStep] = useState(1);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [studyHours, setStudyHours] = useState(2);
  const [examDate, setExamDate] = useState("");

  const totalSteps = 5;

  // Toggle subject selection
  const toggleSubject = (subject) => {
    setSelectedSubjects((previous) =>
      previous.includes(subject)
        ? previous.filter((item) => item !== subject)
        : [...previous, subject]
    );
  };

  // Toggle goal selection
  const toggleGoal = (goal) => {
    setSelectedGoals((previous) =>
      previous.includes(goal)
        ? previous.filter((item) => item !== goal)
        : [...previous, goal]
    );
  };

  // Go to next step
  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  // Go to previous step
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: "linear-gradient(135deg,#F5F3FF,#EFF6FF)",
      }}
    >
      <div className="card p-8 w-full max-w-lg slide-up">

        {/* =====================================================
            PROGRESS
        ====================================================== */}

        <div className="flex items-center gap-2 mb-8">
          {Array.from({ length: totalSteps }, (_, index) => (
            <div
              key={index}
              className="flex-1 h-1.5 rounded-full"
              style={{
                background:
                  index < step ? "#4F46E5" : "#E2E8F0",
              }}
            />
          ))}
        </div>

        <div className="text-xs text-slate-400 mb-1">
          Step {step} of {totalSteps}
        </div>

        {/* =====================================================
            STEP 1 — WELCOME
        ====================================================== */}

        {step === 1 && (
          <div className="slide-up">
            <div className="text-5xl mb-4">👋</div>

            <h2
              className="text-2xl font-bold text-indigo-950 mb-2"
              style={{
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Welcome, {user.name || "Student"}!
            </h2>

            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Let's set up your personalized learning profile.
              It takes less than 2 minutes and helps our AI build
              a personalized learning path for you.
            </p>

            <div
              className="p-4 rounded-xl text-sm text-indigo-700"
              style={{
                background: "#EEF2FF",
              }}
            >
              🤖{" "}
              <strong>Our AI will analyze:</strong> your subjects,
              goals, and available study time to create a
              customized learning plan and learning path.
            </div>
          </div>
        )}

        {/* =====================================================
            STEP 2 — SUBJECTS
        ====================================================== */}

        {step === 2 && (
          <div className="slide-up">
            <h2
              className="text-xl font-bold text-indigo-950 mb-2"
              style={{
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Choose Your Subjects
            </h2>

            <p className="text-slate-500 text-sm mb-5">
              Select subjects you want to master this semester.
            </p>

            <div className="grid grid-cols-2 gap-2">
              {subjects.map((subject) => (
                <button
                  key={subject}
                  type="button"
                  onClick={() => toggleSubject(subject)}
                  className={`p-3 rounded-lg border text-sm font-medium text-left transition-all ${
                    selectedSubjects.includes(subject)
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 text-slate-600 hover:border-indigo-300"
                  }`}
                >
                  {selectedSubjects.includes(subject) && "✓ "}
                  {subject}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================
            STEP 3 — GOALS
        ====================================================== */}

        {step === 3 && (
          <div className="slide-up">
            <h2
              className="text-xl font-bold text-indigo-950 mb-2"
              style={{
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Set Your Learning Goals
            </h2>

            <p className="text-slate-500 text-sm mb-5">
              What do you want to achieve?
            </p>

            <div className="space-y-2">
              {goals.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => toggleGoal(goal)}
                  className={`w-full p-3 rounded-lg border text-sm font-medium text-left transition-all flex items-center gap-3 ${
                    selectedGoals.includes(goal)
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 text-slate-600 hover:border-indigo-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedGoals.includes(goal)
                        ? "bg-indigo-600 border-indigo-600"
                        : "border-slate-300"
                    }`}
                  >
                    {selectedGoals.includes(goal) && (
                      <span className="text-white text-xs">
                        ✓
                      </span>
                    )}
                  </div>

                  {goal}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================
            STEP 4 — STUDY TIME
        ====================================================== */}

        {step === 4 && (
          <div className="slide-up">
            <h2
              className="text-xl font-bold text-indigo-950 mb-2"
              style={{
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Available Study Time
            </h2>

            <p className="text-slate-500 text-sm mb-6">
              How many hours can you study per day?
            </p>

            <div className="text-center mb-8">
              <div
                className="text-6xl font-black gradient-text mb-2"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {studyHours}h
              </div>

              <p className="text-slate-400 text-sm">
                hours per day
              </p>
            </div>

            <input
              type="range"
              min="1"
              max="8"
              value={studyHours}
              onChange={(event) =>
                setStudyHours(Number(event.target.value))
              }
              className="w-full accent-indigo-600"
            />

            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>1h</span>
              <span>4h</span>
              <span>8h</span>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Target Exam Date
              </label>

              <input
                type="date"
                value={examDate}
                onChange={(event) =>
                  setExamDate(event.target.value)
                }
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>
        )}

        {/* =====================================================
            STEP 5 — PREREQUISITE ASSESSMENT
        ====================================================== */}

        {step === 5 && (
          <div className="slide-up">
            <h2
              className="text-xl font-bold text-indigo-950 mb-2"
              style={{
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Prerequisite Assessment
            </h2>

            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Before AI can personalize your learning path,
              we need to understand your current knowledge.
              You will take a 30-question assessment covering
              Java Basics and Basic DSA.
            </p>

            <div className="space-y-3 mb-6">
              {[
                "30 questions covering Java Basics and Basic DSA",
                "Multiple-choice format",
                "60 seconds for each question",
                "Total assessment time: 30 minutes",
                "Total marks: 100",
                "Your results are analyzed by the AI system",
              ].map((text) => (
                <div
                  key={text}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 text-xs flex-shrink-0">
                    ✓
                  </div>

                  <span className="text-sm text-slate-600">
                    {text}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl text-sm text-amber-700 bg-amber-50 border border-amber-200">
              💡 <strong>Tip:</strong> Answer honestly. Your
              performance helps the AI system understand your
              current learning level and personalize your path.
            </div>
          </div>
        )}

        {/* =====================================================
            ACTION BUTTONS
        ====================================================== */}

        <div className="flex justify-between mt-8 gap-3">

          {/* Back button */}
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="btn-outline"
            >
              ← Back
            </button>
          ) : (
            <div />
          )}

          {/* Next / Start button */}
          {step < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn-primary"
            >
              {step === 1
                ? "Let's Begin →"
                : "Continue →"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onNav("prereq-quiz")}
              className="btn-primary"
            >
              Start Assessment 🚀
            </button>
          )}
        </div>
      </div>
    </div>
  );
}