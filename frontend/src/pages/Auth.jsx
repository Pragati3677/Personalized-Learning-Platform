import { useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

export default function Auth({
  mode,
  onNav,
  onLogin,
}) {
  const [role, setRole] = useState("student");

  const [screen, setScreen] = useState("main");

  const [registerMode, setRegisterMode] = useState(
    mode === "register"
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ============================================================
  // LOGIN / REGISTER
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // ========================================================
      // STUDENT REGISTRATION ONLY
      // ========================================================

      if (registerMode && role !== "student") {
        throw new Error(
          "Teacher accounts are created by the system administrator. Please use Teacher Login."
        );
      }

      // ========================================================
      // API ENDPOINT
      // ========================================================

      const endpoint = registerMode
        ? `${API_URL}/auth/register`
        : `${API_URL}/auth/login`;

      // ========================================================
      // REQUEST BODY
      // ========================================================

      const body = registerMode
        ? {
            // Registration is ALWAYS student registration
            name,
            email,
            password,
          }
        : {
            // Login includes the selected role
            email,
            password,
            role,
          };

      // ========================================================
      // AUTHENTICATION REQUEST
      // ========================================================

      const response = await fetch(endpoint, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Authentication failed."
        );
      }

      // ========================================================
      // REGISTRATION SUCCESS
      // ========================================================

      if (registerMode) {
        alert(
          "Student registration successful. Please login."
        );

        setRegisterMode(false);
        setRole("student");
        setPassword("");

        return;
      }

      // ========================================================
      // LOGIN SUCCESS
      // ========================================================

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Update application role
      onLogin(data.user.role);

      // ========================================================
      // STUDENT LOGIN
      // ========================================================

      if (data.user.role === "student") {
        try {
          // ----------------------------------------------------
          // CHECK PREREQUISITE STATUS
          // ----------------------------------------------------

          const statusResponse = await fetch(
            `${API_URL}/prerequisites/status`,
            {
              method: "GET",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization: `Bearer ${data.token}`,
              },
            }
          );

          const statusData =
            await statusResponse.json();

          if (
            !statusResponse.ok ||
            !statusData.success
          ) {
            throw new Error(
              statusData.message ||
                "Unable to check prerequisite status."
            );
          }

          // ----------------------------------------------------
          // PREREQUISITE COMPLETED
          // ----------------------------------------------------

          if (
            statusData.completed === true
          ) {
            const completedKey =
              `prerequisiteCompleted_${data.user.email}`;

            localStorage.setItem(
              completedKey,
              "true"
            );

            onNav("student-dashboard");
          }

          // ----------------------------------------------------
          // PREREQUISITE NOT COMPLETED
          // ----------------------------------------------------

          else {
            const completedKey =
              `prerequisiteCompleted_${data.user.email}`;

            localStorage.removeItem(
              completedKey
            );

            onNav("onboarding");
          }
        } catch (statusError) {
          console.error(
            "Prerequisite status check failed:",
            statusError
          );

          setError(
            "Login successful, but we could not verify your prerequisite status. Please try again."
          );
        }

        return;
      }

      // ========================================================
      // TEACHER LOGIN
      // ========================================================

      if (data.user.role === "teacher") {
        onNav("teacher-dashboard");
        return;
      }

      // ========================================================
      // UNKNOWN ROLE
      // ========================================================

      setError(
        "Your account role is not recognized."
      );
    } catch (err) {
      console.error(
        "Authentication error:",
        err
      );

      setError(
        err.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // SWITCH LOGIN / REGISTER
  // ============================================================

  const handleRegisterLoginSwitch = () => {
    setError("");
    setPassword("");
    setScreen("main");

    const nextRegisterMode =
      !registerMode;

    setRegisterMode(
      nextRegisterMode
    );

    // Registration is always student registration.
    if (nextRegisterMode) {
      setRole("student");
    }
  };

  // ============================================================
  // ROLE CHANGE
  // ============================================================

  const handleRoleChange = (selectedRole) => {
    setError("");

    // Teacher registration is not allowed.
    if (
      registerMode &&
      selectedRole === "teacher"
    ) {
      setError(
        "Teacher registration is not available. Please use Teacher Login."
      );

      return;
    }

    setRole(selectedRole);
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div
      className="min-h-screen flex"
      style={{
        background:
          "linear-gradient(135deg,#F5F3FF,#EFF6FF)",
      }}
    >
      {/* ======================================================
          LEFT PANEL
      ======================================================= */}

      <div
        className="hidden lg:flex flex-col justify-between w-2/5 p-12"
        style={{
          background:
            "linear-gradient(160deg, #4F46E5, #312E81)",
        }}
      >
        {/* Logo */}

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold">
            AI
          </div>

          <span
            className="text-white text-xl font-bold"
            style={{
              fontFamily:
                "'DM Sans',sans-serif",
            }}
          >
            LearnAI
          </span>
        </div>

        {/* Main message */}

        <div>
          <h2
            className="text-3xl font-800 text-white mb-4 leading-tight"
            style={{
              fontFamily:
                "'DM Sans',sans-serif",
              fontWeight: 800,
            }}
          >
            Your AI learning companion adapts
            to you every day.
          </h2>

          <div className="space-y-4">
            {[
              "Personalized learning path built by AI",
              "Adaptive quizzes that match your level",
              "Smart study planner for exam prep",
              "Real-time progress & career guidance",
            ].map((text) => (
              <div
                key={text}
                className="flex items-center gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center text-white text-xs">
                  ✓
                </div>

                <span className="text-indigo-200 text-sm">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}

        <div className="text-indigo-300 text-xs">
          B.Tech Final Year Project · EdTech +
          AI/ML · React + Node.js + MongoDB
        </div>
      </div>

      {/* ======================================================
          RIGHT PANEL
      ======================================================= */}

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="card p-8 w-full max-w-md slide-up">

          {/* ==================================================
              MAIN AUTH SCREEN
          =================================================== */}

          {screen === "main" && (
            <>
              <h1
                className="text-2xl font-800 text-indigo-950 mb-1"
                style={{
                  fontFamily:
                    "'DM Sans',sans-serif",
                  fontWeight: 800,
                }}
              >
                {registerMode
                  ? "Create Your Account"
                  : "Welcome Back"}
              </h1>

              <p className="text-slate-500 text-sm mb-6">
                {registerMode
                  ? "Create your student account and start your personalized learning journey."
                  : "Sign in to continue your learning journey."}
              </p>

              {/* ==================================================
                  ROLE TOGGLE
              =================================================== */}

              <div className="flex rounded-lg border border-slate-200 p-1 mb-6 bg-slate-50">

                {/* STUDENT */}

                <button
                  type="button"
                  onClick={() =>
                    handleRoleChange(
                      "student"
                    )
                  }
                  className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${
                    role === "student"
                      ? "bg-white shadow text-indigo-700 border border-slate-200"
                      : "text-slate-500"
                  }`}
                >
                  👨‍🎓 Student
                </button>

                {/* TEACHER */}

                <button
                  type="button"
                  onClick={() =>
                    handleRoleChange(
                      "teacher"
                    )
                  }
                  className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${
                    role === "teacher"
                      ? "bg-white shadow text-indigo-700 border border-slate-200"
                      : "text-slate-500"
                  }`}
                >
                  👩‍🏫 Teacher
                </button>
              </div>

              {/* Teacher registration information */}

              {registerMode &&
                role === "student" && (
                  <div className="mb-4 p-3 rounded-lg bg-indigo-50 border border-indigo-100 text-xs text-indigo-700">
                    Student registration is open.
                    Teacher accounts are managed
                    separately by the system.
                  </div>
                )}

              {/* ==================================================
                  FORM
              =================================================== */}

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {/* FULL NAME */}

                {registerMode && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Full Name
                    </label>

                    <input
                      value={name}
                      onChange={(e) =>
                        setName(
                          e.target.value
                        )
                      }
                      className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      placeholder="Your Full Name"
                      required
                    />
                  </div>
                )}

                {/* EMAIL */}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                {/* PASSWORD */}

                <div>
                  <div className="flex justify-between items-center mb-1">

                    <label className="text-sm font-medium text-slate-700">
                      Password
                    </label>

                    {!registerMode && (
                      <button
                        type="button"
                        onClick={() =>
                          setScreen(
                            "forgot"
                          )
                        }
                        className="text-xs text-indigo-600 hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>

                  <input
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="••••••••"
                    required
                  />
                </div>

                {/* STUDENT REGISTRATION */}

                {registerMode &&
                  role === "student" && (
                    <>
                      <div className="grid grid-cols-2 gap-3">

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            College
                          </label>

                          <input
                            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            placeholder="College Name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Department
                          </label>

                          <select className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                            <option>
                              Computer Science
                            </option>

                            <option>
                              IT
                            </option>

                            <option>
                              ECE
                            </option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Learning Interests
                        </label>

                        <div className="flex flex-wrap gap-2">
                          {[
                            "Java",
                            "Python",
                            "DSA",
                            "ML",
                            "Web Dev",
                            "DBMS",
                          ].map(
                            (text) => (
                              <button
                                key={text}
                                type="button"
                                className="px-3 py-1 rounded-full border border-slate-200 text-xs font-medium text-slate-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                              >
                                {text}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    </>
                  )}

                {/* ERROR */}

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                    {error}
                  </div>
                )}

                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center py-2.5 mt-2"
                >
                  {loading
                    ? "Please wait..."
                    : registerMode
                    ? "Create Student Account"
                    : `Login as ${
                        role === "teacher"
                          ? "Teacher"
                          : "Student"
                      }`}
                </button>
              </form>

              {/* LOGIN / REGISTER SWITCH */}

              <p className="text-center text-sm text-slate-500 mt-5">
                {registerMode
                  ? "Already have an account? "
                  : "Don't have an account? "}

                <button
                  type="button"
                  onClick={
                    handleRegisterLoginSwitch
                  }
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  {registerMode
                    ? "Log In"
                    : "Register"}
                </button>
              </p>
            </>
          )}

          {/* ==================================================
              FORGOT PASSWORD
          =================================================== */}

          {screen === "forgot" && (
            <>
              <button
                type="button"
                onClick={() =>
                  setScreen("main")
                }
                className="text-sm text-indigo-600 mb-4 hover:underline"
              >
                ← Back to login
              </button>

              <h1
                className="text-2xl font-bold text-indigo-950 mb-2"
                style={{
                  fontFamily:
                    "'DM Sans',sans-serif",
                }}
              >
                Reset Password
              </h1>

              <p className="text-slate-500 text-sm mb-6">
                Enter your email and we'll
                send a reset link.
              </p>

              <input
                type="email"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="your@email.com"
              />

              <button
                type="button"
                onClick={() =>
                  setScreen("reset")
                }
                className="btn-primary w-full justify-center"
              >
                Send Reset Link
              </button>
            </>
          )}

          {/* ==================================================
              RESET SCREEN
          =================================================== */}

          {screen === "reset" && (
            <>
              <div className="text-center mb-6">

                <div className="text-5xl mb-3">
                  📧
                </div>

                <h1
                  className="text-xl font-bold text-indigo-950"
                  style={{
                    fontFamily:
                      "'DM Sans',sans-serif",
                  }}
                >
                  Check Your Email
                </h1>

                <p className="text-slate-500 text-sm mt-2">
                  We sent a password reset
                  link to your email.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setScreen("main")
                }
                className="btn-primary w-full justify-center"
              >
                Back to Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}