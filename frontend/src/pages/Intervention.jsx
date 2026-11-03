import { useEffect, useMemo, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

// ============================================================
// INTERVENTION TYPES
// ============================================================

const interventionTypes = [
  {
    value: "resource",
    label: "Resource",
  },
  {
    value: "practice",
    label: "Targeted Practice",
  },
  {
    value: "study_session",
    label: "Study Session",
  },
  {
    value: "remedial",
    label: "Remedial Support",
  },
  {
    value: "follow_up",
    label: "Follow-up",
  },
];

// ============================================================
// STATUS COLORS
// ============================================================

const statusColors = {
  Pending: {
    bg: "#FFFBEB",
    color: "#D97706",
  },

  Completed: {
    bg: "#ECFDF5",
    color: "#059669",
  },
};

// ============================================================
// INTERVENTION PAGE
// ============================================================

export default function Intervention({ onNav }) {
  const [students, setStudents] = useState([]);

  const [selectedStudentId, setSelectedStudentId] =
    useState(
      localStorage.getItem(
        "teacherSelectedStudentId"
      ) || ""
    );

  const [selectedStudent, setSelectedStudent] =
    useState(null);

  const [interventionType, setInterventionType] =
    useState("resource");

  const [note, setNote] = useState("");

  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
  // FETCH STUDENTS
  // ============================================================

  useEffect(() => {
    fetchStudents();
    loadLocalHistory();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        setError(
          "Teacher login session not found."
        );
        return;
      }

      const response = await fetch(
        `${API_URL}/teacher/dashboard`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to load students."
        );
      }

      const studentList =
        Array.isArray(data.students)
          ? data.students
          : [];

      // Keep only students having a valid ID
      const validStudents =
        studentList.filter(
          (student) =>
            getStudentId(student)
        );

      console.log(
        "Intervention students:",
        validStudents
      );

      setStudents(validStudents);

      // Restore selected student
      const storedId =
        localStorage.getItem(
          "teacherSelectedStudentId"
        );

      if (storedId) {
        const matchedStudent =
          validStudents.find(
            (student) =>
              String(
                getStudentId(student)
              ) === String(storedId)
          );

        if (matchedStudent) {
          setSelectedStudent(
            matchedStudent
          );

          setSelectedStudentId(
            String(
              getStudentId(
                matchedStudent
              )
            )
          );

          return;
        }
      }

      setSelectedStudent(null);
    } catch (err) {
      console.error(
        "Intervention student error:",
        err
      );

      setError(
        err.message ||
          "Unable to load student data."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // LOAD LOCAL INTERVENTION HISTORY
  // ============================================================

  const loadLocalHistory = () => {
    try {
      const saved =
        JSON.parse(
          localStorage.getItem(
            "teacherInterventions"
          ) || "[]"
        );

      setHistory(
        Array.isArray(saved)
          ? saved
          : []
      );
    } catch (err) {
      console.error(
        "Intervention history error:",
        err
      );

      setHistory([]);
    }
  };

  // ============================================================
  // SELECT STUDENT
  // ============================================================

  const handleStudentChange = (event) => {
    const id = event.target.value;

    setSelectedStudentId(id);
    setSuccess("");
    setError("");

    const student =
      students.find(
        (item) =>
          String(
            getStudentId(item)
          ) === String(id)
      );

    setSelectedStudent(
      student || null
    );

    if (student) {
      const studentId =
        getStudentId(student);

      localStorage.setItem(
        "teacherSelectedStudentId",
        String(studentId)
      );

      localStorage.setItem(
        "teacherSelectedStudentName",
        student.name || ""
      );
    }
  };

  // ============================================================
  // WEAK TOPICS
  // ============================================================

  const weakTopics = useMemo(() => {
    if (!selectedStudent) {
      return [];
    }

    if (
      Array.isArray(
        selectedStudent.weakTopics
      )
    ) {
      return selectedStudent.weakTopics;
    }

    if (
      Array.isArray(
        selectedStudent.latestAnalysis
          ?.weaknesses
      )
    ) {
      return selectedStudent
        .latestAnalysis
        .weaknesses;
    }

    return [];
  }, [selectedStudent]);

  // ============================================================
  // RECOMMENDED INTERVENTION
  // ============================================================

  const recommendedAction =
    useMemo(() => {
      if (!selectedStudent) {
        return "";
      }

      const level =
        selectedStudent.level ||
        "Not Available";

      const score =
        selectedStudent.score !== null &&
        selectedStudent.score !== undefined
          ? Number(
              selectedStudent.score
            )
          : null;

      if (level === "Slow") {
        if (weakTopics.length > 0) {
          return `Provide targeted remediation for ${weakTopics
            .slice(0, 2)
            .join(
              " and "
            )} and reassess the student.`;
        }

        return "Provide guided remedial practice and reassess the student.";
      }

      if (
        score !== null &&
        score < 50
      ) {
        return "Provide targeted practice based on the latest assessment and monitor the next attempt.";
      }

      if (
        Number(
          selectedStudent.progress || 0
        ) < 20
      ) {
        return "Encourage regular learning activity and follow up on study progress.";
      }

      if (level === "Average") {
        return "Provide focused practice in the identified weak areas and monitor improvement.";
      }

      return "Continue monitoring the student's progress and provide support when required.";
    }, [
      selectedStudent,
      weakTopics,
    ]);

  // ============================================================
  // SAVE INTERVENTION LOCALLY
  // ============================================================

  const handleSave = () => {
    setSuccess("");
    setError("");

    if (!selectedStudent) {
      setError(
        "Please select a student first."
      );
      return;
    }

    if (!note.trim()) {
      setError(
        "Please enter an intervention note."
      );
      return;
    }

    try {
      setSaving(true);

      const studentId =
        getStudentId(
          selectedStudent
        );

      const selectedType =
        interventionTypes.find(
          (item) =>
            item.value ===
            interventionType
        );

      const newIntervention = {
        id: Date.now(),

        studentId,

        studentName:
          selectedStudent.name,

        studentEmail:
          selectedStudent.email,

        interventionType,

        interventionTypeLabel:
          selectedType?.label ||
          "Resource",

        note: note.trim(),

        weakTopics:
          weakTopics.slice(0, 5),

        status: "Pending",

        createdAt:
          new Date().toISOString(),
      };

      const existing =
        JSON.parse(
          localStorage.getItem(
            "teacherInterventions"
          ) || "[]"
        );

      const updated = [
        newIntervention,
        ...(Array.isArray(existing)
          ? existing
          : []),
      ];

      localStorage.setItem(
        "teacherInterventions",
        JSON.stringify(updated)
      );

      setHistory(updated);

      setSuccess(
        `Intervention saved for ${selectedStudent.name}.`
      );
    } catch (err) {
      console.error(
        "Save intervention error:",
        err
      );

      setError(
        "Unable to save intervention."
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // SEND INTERVENTION TO STUDENT
  // ============================================================

  const handleSendIntervention = async () => {
    setSuccess("");
    setError("");

    if (!selectedStudent) {
      setError(
        "Please select a student first."
      );
      return;
    }

    if (!note.trim()) {
      setError(
        "Please enter an intervention note."
      );
      return;
    }

    const studentId =
      getStudentId(
        selectedStudent
      );

    if (!studentId) {
      setError(
        "Student ID is missing. Please select the student again."
      );
      return;
    }

    try {
      setSending(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        setError(
          "Teacher login session not found."
        );
        return;
      }

      const selectedType =
        interventionTypes.find(
          (item) =>
            item.value ===
            interventionType
        );

      const notificationTitle =
        `Intervention: ${
          selectedType?.label ||
          "Support"
        }`;

      const notificationMessage =
        note.trim();

      console.log(
        "Sending intervention to student ID:",
        studentId
      );

      const response = await fetch(
        `${API_URL}/notifications/send`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            studentId: String(studentId),

            title:
              notificationTitle,

            message:
              notificationMessage,

            type: "intervention",
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        "Intervention notification response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to send intervention."
        );
      }

      // Also save the intervention locally
      const newIntervention = {
        id: Date.now(),

        studentId: String(
          studentId
        ),

        studentName:
          selectedStudent.name,

        studentEmail:
          selectedStudent.email,

        interventionType,

        interventionTypeLabel:
          selectedType?.label ||
          "Resource",

        note: note.trim(),

        weakTopics:
          weakTopics.slice(0, 5),

        status: "Pending",

        createdAt:
          new Date().toISOString(),

        sentToStudent: true,
      };

      const existing =
        JSON.parse(
          localStorage.getItem(
            "teacherInterventions"
          ) || "[]"
        );

      const updated = [
        newIntervention,
        ...(Array.isArray(existing)
          ? existing
          : []),
      ];

      localStorage.setItem(
        "teacherInterventions",
        JSON.stringify(updated)
      );

      setHistory(updated);

      setSuccess(
        `Intervention sent successfully to ${selectedStudent.name}.`
      );

      setNote("");
    } catch (err) {
      console.error(
        "Send intervention error:",
        err
      );

      setError(
        err.message ||
          "Unable to send intervention."
      );
    } finally {
      setSending(false);
    }
  };

  // ============================================================
  // DELETE LOCAL INTERVENTION
  // ============================================================

  const handleDelete = (
    interventionId
  ) => {
    const updated =
      history.filter(
        (item) =>
          item.id !==
          interventionId
      );

    setHistory(updated);

    localStorage.setItem(
      "teacherInterventions",
      JSON.stringify(updated)
    );
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="p-6">
        <div className="min-h-[500px] flex items-center justify-center">
          <div className="text-center">

            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />

            <p className="text-sm text-slate-500">
              Loading intervention data...
            </p>

          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // MAIN
  // ============================================================

  return (
    <div className="p-6 space-y-5">

      {/* ======================================================
          HEADER
      ======================================================= */}

      <div>
        <h2
          className="text-xl text-indigo-950"
          style={{
            fontFamily:
              "'DM Sans', sans-serif",
            fontWeight: 800,
          }}
        >
          Teacher Interventions
        </h2>

        <p className="text-slate-500 text-sm">
          Add targeted support actions,
          guidance, and follow-up notes for
          students.
        </p>
      </div>

      {/* ERROR */}

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* SUCCESS */}

      {success && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-sm text-emerald-600">
          ✓ {success}
        </div>
      )}

      {/* ======================================================
          ADD INTERVENTION
      ======================================================= */}

      <div className="card p-5">

        <div className="flex items-center justify-between mb-5">

          <div>
            <h3
              className="text-base text-slate-900"
              style={{
                fontFamily:
                  "'DM Sans', sans-serif",
                fontWeight: 700,
              }}
            >
              Add Intervention
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Provide support based on the
              student's actual performance.
            </p>
          </div>

          {selectedStudent && (
            <span className="badge bg-indigo-50 text-indigo-600">
              {selectedStudent.level ||
                "Not Available"}
            </span>
          )}

        </div>

        {/* STUDENT + TYPE */}

        <div className="grid md:grid-cols-2 gap-4">

          {/* STUDENT */}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Student
            </label>

            <select
              value={selectedStudentId}
              onChange={
                handleStudentChange
              }
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">
                Select a student
              </option>

              {students.map(
                (student) => {
                  const studentId =
                    getStudentId(
                      student
                    );

                  return (
                    <option
                      key={studentId}
                      value={studentId}
                    >
                      {student.name}
                    </option>
                  );
                }
              )}

            </select>
          </div>

          {/* INTERVENTION TYPE */}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Intervention Type
            </label>

            <select
              value={
                interventionType
              }
              onChange={(event) =>
                setInterventionType(
                  event.target.value
                )
              }
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {interventionTypes.map(
                (type) => (
                  <option
                    key={type.value}
                    value={type.value}
                  >
                    {type.label}
                  </option>
                )
              )}
            </select>
          </div>

        </div>

        {/* SELECTED STUDENT SUMMARY */}

        {selectedStudent && (
          <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-100">

            <div className="flex items-center justify-between">

              <div>
                <div className="font-semibold text-slate-800">
                  {selectedStudent.name}
                </div>

                <div className="text-xs text-slate-500 mt-1">
                  {selectedStudent.email ||
                    "No email available"}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400">
                  Latest Assessment
                </div>

                <div className="font-bold text-indigo-600">
                  {selectedStudent.latestAnalysis
                    ? `${selectedStudent.score}%`
                    : "Not Available"}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400">
                  Progress
                </div>

                <div className="font-bold text-indigo-600">
                  {selectedStudent.progress ||
                    0}
                  %
                </div>
              </div>

            </div>

          </div>
        )}

        {/* WEAK TOPICS */}

        <div className="mt-5">

          <label className="block text-sm font-medium text-slate-700 mb-2">
            Identified Weak Areas
          </label>

          {selectedStudent &&
          weakTopics.length > 0 ? (
            <div className="flex flex-wrap gap-2">

              {weakTopics
                .slice(0, 6)
                .map(
                  (
                    topic,
                    index
                  ) => (
                    <span
                      key={`${topic}-${index}`}
                      className="badge bg-red-50 text-red-600 text-xs"
                    >
                      {topic}
                    </span>
                  )
                )}

            </div>
          ) : (
            <p className="text-xs text-slate-400">
              Select a student to see
              identified weak areas.
            </p>
          )}

        </div>

        {/* RECOMMENDATION */}

        {selectedStudent && (
          <div className="mt-5 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">

            <div className="text-xs font-semibold text-indigo-700 mb-1">
              🤖 Suggested Support
            </div>

            <p className="text-sm text-slate-700">
              {recommendedAction}
            </p>

          </div>
        )}

        {/* NOTE */}

        <div className="mt-5">

          <label className="block text-sm font-medium text-slate-700 mb-2">
            Intervention Note
          </label>

          <textarea
            value={note}
            onChange={(event) =>
              setNote(
                event.target.value
              )
            }
            rows={5}
            placeholder="Describe the support action, guidance, practice, resource, or follow-up recommended..."
            className="w-full px-3 py-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 outline-none resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

        </div>

        {/* ACTIONS */}

        <div className="flex flex-wrap gap-3 mt-5">

          <button
            onClick={handleSave}
            disabled={
              saving ||
              sending ||
              !selectedStudent
            }
            className="btn-primary text-sm py-2.5 px-5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving
              ? "Saving..."
              : "📋 Save Intervention"}
          </button>

          <button
            onClick={
              handleSendIntervention
            }
            disabled={
              sending ||
              saving ||
              !selectedStudent
            }
            className="btn-secondary text-sm py-2.5 px-5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending
              ? "Sending..."
              : "💬 Send Intervention to Student"}
          </button>

          <button
            onClick={() =>
              onNav(
                "student-monitoring"
              )
            }
            className="text-sm text-slate-500 hover:text-indigo-600 px-3"
          >
            ← Back to Students
          </button>

        </div>

      </div>

      {/* ======================================================
          INTERVENTION HISTORY
      ======================================================= */}

      <div className="card p-5">

        <div className="flex items-center justify-between mb-4">

          <div>
            <h3
              className="text-base text-slate-900"
              style={{
                fontFamily:
                  "'DM Sans', sans-serif",
                fontWeight: 700,
              }}
            >
              Intervention History
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Support actions recorded by this
              teacher session.
            </p>
          </div>

          <span className="badge bg-slate-100 text-slate-600">
            {history.length}{" "}
            {history.length === 1
              ? "Record"
              : "Records"}
          </span>

        </div>

        {history.length === 0 ? (
          <div className="py-10 text-center">

            <div className="text-3xl mb-2">
              📋
            </div>

            <p className="text-sm font-medium text-slate-700">
              No interventions recorded yet.
            </p>

            <p className="text-xs text-slate-400 mt-1">
              Select a student and save the
              first intervention.
            </p>

          </div>
        ) : (
          <div className="space-y-3">

            {history.map(
              (item) => {
                const statusStyle =
                  statusColors[
                    item.status
                  ] ||
                  statusColors.Pending;

                return (
                  <div
                    key={item.id}
                    className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition-colors"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex-1">

                        <div className="flex items-center gap-2 flex-wrap">

                          <span className="font-semibold text-slate-800">
                            {
                              item.studentName
                            }
                          </span>

                          <span className="badge bg-indigo-50 text-indigo-600 text-xs">
                            {
                              item.interventionTypeLabel
                            }
                          </span>

                          <span
                            className="badge text-xs"
                            style={{
                              background:
                                statusStyle.bg,
                              color:
                                statusStyle.color,
                            }}
                          >
                            {
                              item.status
                            }
                          </span>

                          {item.sentToStudent && (
                            <span className="badge bg-emerald-50 text-emerald-600 text-xs">
                              Sent to Student
                            </span>
                          )}

                        </div>

                        <p className="text-sm text-slate-600 mt-2">
                          {item.note}
                        </p>

                        {Array.isArray(
                          item.weakTopics
                        ) &&
                          item
                            .weakTopics
                            .length >
                            0 && (
                            <div className="flex flex-wrap gap-1 mt-2">

                              {item.weakTopics
                                .slice(
                                  0,
                                  4
                                )
                                .map(
                                  (
                                    topic,
                                    index
                                  ) => (
                                    <span
                                      key={`${topic}-${index}`}
                                      className="badge bg-red-50 text-red-600 text-xs"
                                    >
                                      {topic}
                                    </span>
                                  )
                                )}

                            </div>
                          )}

                        <p className="text-xs text-slate-400 mt-3">
                          {new Date(
                            item.createdAt
                          ).toLocaleString()}
                        </p>

                      </div>

                      <button
                        onClick={() =>
                          handleDelete(
                            item.id
                          )
                        }
                        className="text-xs text-red-500 hover:text-red-700 px-2 py-1"
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

      </div>

    </div>
  );
}