import { useEffect, useState } from "react";

export default function TeacherProfile() {
  const [teacher, setTeacher] = useState({
    name: "Prof. Priya Nair",
    email: "teacher@learnai.com",
    role: "Teacher",
    department: "Computer Science & Engineering",
  });

  useEffect(() => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      if (user && Object.keys(user).length > 0) {
        setTeacher((prev) => ({
          ...prev,
          ...user,
          role: "Teacher",
        }));
      }
    } catch (error) {
      console.error("Profile load error:", error);
    }
  }, []);

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
          Teacher Profile
        </h2>

        <p className="text-slate-500 text-sm">
          Manage your teacher account information.
        </p>
      </div>

      {/* Profile Card */}
      <div className="card p-6">

        <div className="flex items-center gap-5 pb-6 border-b border-slate-100">

          <div className="w-20 h-20 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 text-3xl font-black">
            {(teacher.name || "P")[0].toUpperCase()}
          </div>

          <div>
            <h3
              className="text-xl text-slate-900"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 800,
              }}
            >
              {teacher.name}
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              {teacher.department}
            </p>

            <span className="inline-block mt-2 badge bg-indigo-50 text-indigo-600">
              Teacher
            </span>
          </div>

        </div>

        {/* Details */}
        <div className="grid md:grid-cols-2 gap-5 mt-6">

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Full Name
            </label>

            <div className="px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700">
              {teacher.name || "Not available"}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Email
            </label>

            <div className="px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700">
              {teacher.email || "Not available"}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Role
            </label>

            <div className="px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700">
              Teacher
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Department
            </label>

            <div className="px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700">
              {teacher.department}
            </div>
          </div>

        </div>

      </div>

      {/* Teacher Responsibilities */}
      <div className="card p-6">

        <h3
          className="text-base text-slate-900 mb-4"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
          }}
        >
          Teacher Portal Responsibilities
        </h3>

        <div className="grid md:grid-cols-2 gap-3">

          {[
            "Monitor student learning progress",
            "Review student performance",
            "Identify at-risk students",
            "Review weak learning areas",
            "Send student notifications",
            "Provide targeted interventions",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100"
            >
              <span className="text-emerald-500">
                ✓
              </span>

              <span className="text-sm text-slate-700">
                {item}
              </span>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}