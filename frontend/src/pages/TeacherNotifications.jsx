import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function TeacherNotifications({ onNav }) {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const [loadingStudents, setLoadingStudents] = useState(true);
  const [sending, setSending] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ============================================================
  // GET STUDENT ID
  // ============================================================

  const getStudentId = (student) => {
    return (
      student?._id ||
      student?.studentId ||
      student?.userId ||
      student?.id ||
      ""
    );
  };

  // ============================================================
  // LOAD REAL STUDENTS
  // ============================================================

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Teacher login session not found.");
        return;
      }

      const response = await fetch(
        `${API_URL}/teacher/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load students."
        );
      }

      console.log(
        "Teacher dashboard students:",
        data.students
      );

      const loadedStudents = data.students || [];

      // Keep only students that have a usable ID
      const validStudents = loadedStudents.filter(
        (student) => getStudentId(student)
      );

      console.log(
        "Students with valid IDs:",
        validStudents
      );

      setStudents(validStudents);
    } catch (err) {
      console.error(
        "Fetch students error:",
        err
      );

      setError(
        err.message ||
          "Unable to load students."
      );
    } finally {
      setLoadingStudents(false);
    }
  };

  // ============================================================
  // SEND NOTIFICATION
  // ============================================================

  const handleSendNotification = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    if (!selectedStudent) {
      setError("Please select a student.");
      return;
    }

    if (!title.trim()) {
      setError(
        "Please enter a notification title."
      );
      return;
    }

    if (!message.trim()) {
      setError(
        "Please enter a message."
      );
      return;
    }

    try {
      setSending(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setError(
          "Teacher login session not found."
        );
        return;
      }

      // Make sure the selected value is actually an ID
      console.log(
        "Sending notification to student ID:",
        selectedStudent
      );

      const response = await fetch(
        `${API_URL}/notifications/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            studentId: selectedStudent,
            title: title.trim(),
            message: message.trim(),
            type: "teacher_message",
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Send notification response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to send notification."
        );
      }

      setSuccess(
        "Notification sent successfully to the student."
      );

      // Clear form
      setTitle("");
      setMessage("");
      setSelectedStudent("");
    } catch (err) {
      console.error(
        "Send notification error:",
        err
      );

      setError(
        err.message ||
          "Unable to send notification."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6 space-y-5">

      {/* ======================================================
          HEADER
      ======================================================= */}

      <div>
        <h2
          className="text-xl text-indigo-950"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 800,
          }}
        >
          Teacher Notifications
        </h2>

        <p className="text-slate-500 text-sm">
          Send messages and learning guidance to students.
        </p>
      </div>

      {/* ======================================================
          SEND NOTIFICATION CARD
      ======================================================= */}

      <div className="card p-6">

        <div className="mb-5">
          <h3
            className="text-base text-slate-900 mb-1"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
            }}
          >
            Send Notification
          </h3>

          <p className="text-xs text-slate-500">
            Send a personalized message directly to a student.
          </p>
        </div>

        {/* SUCCESS */}

        {success && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
            ✓ {success}
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSendNotification}
          className="space-y-5"
        >

          {/* ==================================================
              SELECT STUDENT
          =================================================== */}

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Select Student
            </label>

            <select
              value={selectedStudent}
              onChange={(e) => {
                setSelectedStudent(e.target.value);
                setError("");
                setSuccess("");
              }}
              disabled={
                loadingStudents || sending
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">
                {loadingStudents
                  ? "Loading students..."
                  : "Select a student"}
              </option>

              {students.map((student) => {
                const studentId =
                  getStudentId(student);

                return (
                  <option
                    key={studentId}
                    value={studentId}
                  >
                    {student.name} — {student.email}
                  </option>
                );
              })}
            </select>

            {!loadingStudents &&
              students.length === 0 && (
                <p className="text-xs text-red-500 mt-2">
                  No students with valid IDs were found.
                </p>
              )}
          </div>

          {/* ==================================================
              TITLE
          =================================================== */}

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Notification Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="e.g. Performance Improvement"
              disabled={sending}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* ==================================================
              MESSAGE
          =================================================== */}

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Message
            </label>

            <textarea
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder="Write your message or learning guidance..."
              rows={5}
              disabled={sending}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* ==================================================
              SEND BUTTON
          =================================================== */}

          <div className="flex justify-end">

            <button
              type="submit"
              disabled={
                sending ||
                loadingStudents ||
                students.length === 0
              }
              className={`px-6 py-3 rounded-xl text-sm font-semibold text-white transition ${
                sending ||
                loadingStudents ||
                students.length === 0
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {sending
                ? "Sending..."
                : "🔔 Send Notification"}
            </button>

          </div>

        </form>
      </div>

      {/* ======================================================
          INFORMATION CARD
      ======================================================= */}

      <div className="card p-6">

        <h3
          className="text-base text-slate-900 mb-1"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
          }}
        >
          Teacher Guidance
        </h3>

        <p className="text-xs text-slate-500 mb-4">
          Use notifications to guide students when their
          performance or learning activity requires attention.
        </p>

        <div className="grid md:grid-cols-3 gap-4">

          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
            <div className="text-sm font-semibold text-indigo-700">
              Performance
            </div>

            <p className="text-xs text-slate-500 mt-1">
              Inform students when they need to improve
              assessment performance.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
            <div className="text-sm font-semibold text-amber-700">
              Learning Activity
            </div>

            <p className="text-xs text-slate-500 mt-1">
              Remind students to continue their learning
              activities.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
            <div className="text-sm font-semibold text-emerald-700">
              Guidance
            </div>

            <p className="text-xs text-slate-500 mt-1">
              Provide personalized guidance before the
              student's next assessment.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}