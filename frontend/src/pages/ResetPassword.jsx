
import { useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function ResetPassword({ token, onNav }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Reset Password Function
  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Validate empty fields
    if (!password || !confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    // Validate password matching
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Validate reset token
    if (!token) {
      setError(
        "Invalid reset link. Please request a new password reset email."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/auth/reset-password/${encodeURIComponent(token)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password,
            confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(
          data.message ||
            "Unable to reset password. Please try again."
        );
      }

      setSuccess(
        data.message ||
          "Password reset successfully. Please log in."
      );

      setPassword("");
      setConfirmPassword("");
      setShowPassword(false);
      setShowConfirmPassword(false);

    } catch (err) {
      setError(
        err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Eye Icon
  const EyeIcon = ({ visible }) => (
    visible ? (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 3l18 18" />
        <path d="M10.6 10.6a2 2 0 002.8 2.8" />
        <path d="M9.9 5.2A10.8 10.8 0 0121 12s-1.5 3-4.5 4.5" />
        <path d="M6.6 6.6A11 11 0 013 12s3 6 9 6c1.2 0 2.3-.2 3.3-.6" />
      </svg>
    ) : (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-10">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">

        {/* HEADER */}
        <div className="text-center mb-7">

          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center text-3xl">
            🔐
          </div>

          <h1 className="text-2xl font-bold text-gray-800">
            Reset Your Password
          </h1>

          <p className="text-gray-500 text-sm mt-2">
            Enter your new password below to secure your Edu-Path AI account.
          </p>

        </div>

        {/* SUCCESS MESSAGE */}
        {success ? (

          <div className="space-y-5">

            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm text-center">

              <div className="text-2xl mb-2">
                ✓
              </div>

              {success}

            </div>

            <button
              type="button"
              onClick={() => onNav("login")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Go to Login
            </button>

          </div>

        ) : (

          /* RESET PASSWORD FORM */
          <form
            onSubmit={handleResetPassword}
            className="space-y-5"
          >

            {/* NEW PASSWORD */}
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  minLength={6}
                  required
                  autoComplete="new-password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  <EyeIcon visible={showPassword} />
                </button>

              </div>

            </div>

            {/* CONFIRM PASSWORD */}
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>

              <div className="relative">

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Confirm your new password"
                  minLength={6}
                  required
                  autoComplete="new-password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  <EyeIcon visible={showConfirmPassword} />
                </button>

              </div>

            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading
                ? "Updating Password..."
                : "Reset Password"}
            </button>

            <p className="text-center text-xs text-gray-500">
              Your password must contain at least 6 characters.
            </p>

          </form>

        )}

      </div>

    </div>
  );
}
