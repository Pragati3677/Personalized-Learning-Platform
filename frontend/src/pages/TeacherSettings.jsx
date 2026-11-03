import { useState } from "react";

export default function TeacherSettings() {
  const [emailNotifications, setEmailNotifications] =
    useState(true);

  const [studentAlerts, setStudentAlerts] =
    useState(true);

  const [inactiveAlerts, setInactiveAlerts] =
    useState(true);

  return (
    <div className="p-6 space-y-5">

      {/* Header */}
      <div>
        <h2
          className="text-xl text-indigo-950"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 800,
          }}
        >
          Teacher Settings
        </h2>

        <p className="text-slate-500 text-sm">
          Manage your teacher portal preferences.
        </p>
      </div>

      {/* Notification Settings */}
      <div className="card p-6">

        <h3
          className="text-base text-slate-900 mb-1"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
          }}
        >
          Notification Preferences
        </h3>

        <p className="text-xs text-slate-500 mb-5">
          Choose which student-related alerts you want
          to receive.
        </p>

        <div className="space-y-4">

          <SettingRow
            title="Email Notifications"
            description="Receive important teacher portal notifications."
            enabled={emailNotifications}
            onChange={setEmailNotifications}
          />

          <SettingRow
            title="Student Performance Alerts"
            description="Receive alerts when student performance requires attention."
            enabled={studentAlerts}
            onChange={setStudentAlerts}
          />

          <SettingRow
            title="Inactive Student Alerts"
            description="Receive alerts when students remain inactive."
            enabled={inactiveAlerts}
            onChange={setInactiveAlerts}
          />

        </div>

      </div>

      {/* Monitoring Rules */}
      <div className="card p-6">

        <h3
          className="text-base text-slate-900 mb-1"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
          }}
        >
          Student Monitoring
        </h3>

        <p className="text-xs text-slate-500 mb-5">
          Current monitoring indicators used by the teacher
          portal.
        </p>

        <div className="grid md:grid-cols-3 gap-4">

          <div className="p-4 rounded-xl bg-red-50 border border-red-100">
            <div className="text-sm font-semibold text-red-700">
              High Risk
            </div>

            <p className="text-xs text-slate-500 mt-1">
              Very low assessment performance or prolonged
              inactivity.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
            <div className="text-sm font-semibold text-amber-700">
              Medium Risk
            </div>

            <p className="text-xs text-slate-500 mt-1">
              Performance or learning activity requires
              monitoring.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
            <div className="text-sm font-semibold text-emerald-700">
              Low Risk
            </div>

            <p className="text-xs text-slate-500 mt-1">
              Student is progressing normally.
            </p>
          </div>

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
        onClick={() => onChange(!enabled)}
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