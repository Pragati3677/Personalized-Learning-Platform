import { useEffect, useState } from "react";

export default function Settings({
  onNav,
}) {
  const [emailNotifications, setEmailNotifications] =
    useState(true);

  const [aiRecommendations, setAiRecommendations] =
    useState(true);

  const [quizReminders, setQuizReminders] =
    useState(true);

  const [studyReminders, setStudyReminders] =
    useState(true);

  const [saved, setSaved] =
    useState(false);

  useEffect(() => {
    try {
      const savedSettings =
        JSON.parse(
          localStorage.getItem(
            "studentSettings"
          ) || "{}"
        );

      if (
        typeof savedSettings.emailNotifications ===
        "boolean"
      ) {
        setEmailNotifications(
          savedSettings.emailNotifications
        );
      }

      if (
        typeof savedSettings.aiRecommendations ===
        "boolean"
      ) {
        setAiRecommendations(
          savedSettings.aiRecommendations
        );
      }

      if (
        typeof savedSettings.quizReminders ===
        "boolean"
      ) {
        setQuizReminders(
          savedSettings.quizReminders
        );
      }

      if (
        typeof savedSettings.studyReminders ===
        "boolean"
      ) {
        setStudyReminders(
          savedSettings.studyReminders
        );
      }
    } catch (error) {
      console.error(
        "Student settings error:",
        error
      );
    }
  }, []);

  const saveSettings = () => {
    const settings = {
      emailNotifications,
      aiRecommendations,
      quizReminders,
      studyReminders,
    };

    localStorage.setItem(
      "studentSettings",
      JSON.stringify(settings)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (
    <div className="p-6 space-y-5">

      {/* Header */}
      <div>
        <h2
          className="text-xl text-indigo-950"
          style={{
            fontFamily:
              "'DM Sans', sans-serif",
            fontWeight: 800,
          }}
        >
          Settings
        </h2>

        <p className="text-slate-500 text-sm">
          Manage your learning preferences and
          notifications.
        </p>
      </div>

      {/* Success */}
      {saved && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-sm text-emerald-600">
          ✓ Settings saved successfully.
        </div>
      )}

      {/* Learning Preferences */}
      <div className="card p-6">

        <h3
          className="text-base text-slate-900 mb-1"
          style={{
            fontFamily:
              "'DM Sans', sans-serif",
            fontWeight: 700,
          }}
        >
          Learning Preferences
        </h3>

        <p className="text-xs text-slate-500 mb-5">
          Control how LearnAI supports your learning.
        </p>

        <div className="space-y-3">

          <SettingRow
            title="AI Recommendations"
            description="Receive personalized learning recommendations."
            enabled={
              aiRecommendations
            }
            onChange={
              setAiRecommendations
            }
          />

          <SettingRow
            title="Quiz Reminders"
            description="Receive reminders when quizzes or assessments are available."
            enabled={
              quizReminders
            }
            onChange={
              setQuizReminders
            }
          />

          <SettingRow
            title="Study Plan Reminders"
            description="Receive reminders for scheduled learning activities."
            enabled={
              studyReminders
            }
            onChange={
              setStudyReminders
            }
          />

        </div>

      </div>

      {/* Notification Preferences */}
      <div className="card p-6">

        <h3
          className="text-base text-slate-900 mb-1"
          style={{
            fontFamily:
              "'DM Sans', sans-serif",
            fontWeight: 700,
          }}
        >
          Notification Preferences
        </h3>

        <p className="text-xs text-slate-500 mb-5">
          Choose how you receive important learning
          updates.
        </p>

        <SettingRow
          title="Email Notifications"
          description="Receive important learning updates through your account email."
          enabled={
            emailNotifications
          }
          onChange={
            setEmailNotifications
          }
        />

      </div>

      {/* Account */}
      <div className="card p-6">

        <h3
          className="text-base text-slate-900 mb-4"
          style={{
            fontFamily:
              "'DM Sans', sans-serif",
            fontWeight: 700,
          }}
        >
          Account
        </h3>

        <div className="flex flex-wrap gap-3">

          <button
            onClick={saveSettings}
            className="btn-primary text-sm py-2.5 px-5"
          >
            💾 Save Settings
          </button>

          <button
            onClick={() =>
              onNav &&
              onNav("profile")
            }
            className="btn-secondary text-sm py-2.5 px-5"
          >
            👤 View My Profile
          </button>

        </div>

      </div>

    </div>
  );
}

function SettingRow({
  title,
  description,
  enabled,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50">

      <div>
        <div className="text-sm font-semibold text-slate-800">
          {title}
        </div>

        <div className="text-xs text-slate-500 mt-1">
          {description}
        </div>
      </div>

      <button
        onClick={() =>
          onChange(!enabled)
        }
        className={`relative w-11 h-6 rounded-full transition-colors ${
          enabled
            ? "bg-indigo-600"
            : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
            enabled
              ? "translate-x-6"
              : "translate-x-1"
          }`}
        />
      </button>

    </div>
  );
}