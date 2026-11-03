import { useEffect, useState } from "react";

export default function Profile() {
  const [student, setStudent] = useState({
    name: "Student",
    email: "",
    role: "student",
  });

  useEffect(() => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      if (user && Object.keys(user).length > 0) {
        setStudent({
          name:
            user.name ||
            "Student",
          email:
            user.email ||
            "",
          role: "student",
        });
      }
    } catch (error) {
      console.error(
        "Student profile error:",
        error
      );
    }
  }, []);

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
          My Profile
        </h2>

        <p className="text-slate-500 text-sm">
          Manage your student account information.
        </p>
      </div>

      {/* Profile */}
      <div className="card p-6">

        <div className="flex items-center gap-5 pb-6 border-b border-slate-100">

          <div className="w-20 h-20 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-700 text-3xl font-black">
            {(student.name || "S")[0].toUpperCase()}
          </div>

          <div>
            <h3
              className="text-xl text-slate-900"
              style={{
                fontFamily:
                  "'DM Sans', sans-serif",
                fontWeight: 800,
              }}
            >
              {student.name}
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Computer Science & Engineering
            </p>

            <span className="inline-block mt-2 badge bg-indigo-50 text-indigo-600">
              Student
            </span>
          </div>

        </div>

        {/* Details */}
        <div className="grid md:grid-cols-2 gap-5 mt-6">

          <ProfileField
            label="Full Name"
            value={student.name}
          />

          <ProfileField
            label="Email"
            value={
              student.email ||
              "Not available"
            }
          />

          <ProfileField
            label="Role"
            value="Student"
          />

          <ProfileField
            label="Program"
            value="B.Tech Computer Science & Engineering"
          />

        </div>

      </div>

      {/* Account Information */}
      <div className="card p-6">

        <h3
          className="text-base text-slate-900 mb-4"
          style={{
            fontFamily:
              "'DM Sans', sans-serif",
            fontWeight: 700,
          }}
        >
          Learning Account
        </h3>

        <div className="grid md:grid-cols-3 gap-4">

          <InfoCard
            title="Learning Mode"
            value="Personalized"
          />

          <InfoCard
            title="AI Support"
            value="Enabled"
          />

          <InfoCard
            title="Teacher Monitoring"
            value="Enabled"
          />

        </div>

      </div>

    </div>
  );
}

function ProfileField({
  label,
  value,
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
        {label}
      </label>

      <div className="px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700">
        {value}
      </div>
    </div>
  );
}

function InfoCard({
  title,
  value,
}) {
  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
      <div className="text-xs text-slate-400">
        {title}
      </div>

      <div className="text-sm font-semibold text-slate-800 mt-1">
        {value}
      </div>
    </div>
  );
}