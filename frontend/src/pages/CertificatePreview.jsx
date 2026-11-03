
import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/final-evaluation";

function getToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    ""
  );
}

function formatDate(value) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getAchievementLevel(score) {
  if (score >= 96) return "Certificate Eligible";
  if (score >= 85) return "Advanced Proficiency";
  if (score >= 70) return "Intermediate Proficiency";
  return "Developing Proficiency";
}

function CertificateCard({ certData }) {
  return (
    <div
      id="certificate-print"
      className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
    >
      <div className="bg-gradient-to-br from-indigo-950 via-indigo-600 to-cyan-500 p-2">
        <div className="rounded-md bg-white px-5 py-8 sm:px-12 sm:py-10">
          <div className="mb-7 border-b-2 border-slate-200 pb-6 text-center">
            <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-500 font-bold text-white">
                AI
              </div>

              <span className="text-sm font-bold tracking-wide text-indigo-950 sm:text-base">
                AI-Powered Personalized Learning Platform
              </span>
            </div>

            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-slate-400">
              Proudly Presents
            </p>

            <h1 className="text-2xl font-extrabold tracking-wide text-indigo-950 sm:text-3xl">
              Certificate of Completion
            </h1>
          </div>

          <div className="mb-7 text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-400">
              This certificate is proudly presented to
            </p>

            <h2 className="mb-5 inline-block break-words border-b-2 border-indigo-600 pb-2 text-2xl font-extrabold text-indigo-600 sm:text-4xl">
              {certData.student}
            </h2>

            <p className="mb-2 text-xs uppercase tracking-widest text-slate-400">
              For successfully completing
            </p>

            <h3 className="mb-2 text-lg font-bold text-indigo-950">
              {certData.course}
            </h3>

            <p className="mb-6 text-sm italic text-slate-500">
              Final score:{" "}
              <strong className="text-indigo-600">
                {certData.score}%
              </strong>{" "}
              — {certData.level}
            </p>

            <div className="mb-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-indigo-200" />
              <span className="text-xl text-indigo-600">✦</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-indigo-200" />
            </div>

            <div className="grid grid-cols-1 gap-4 text-left sm:grid-cols-2">
              <div className="rounded-lg bg-indigo-50 p-4">
                <p className="mb-1 text-xs uppercase tracking-wider text-slate-400">
                  Completion Date
                </p>
                <p className="break-words text-sm font-semibold text-indigo-950">
                  {certData.date}
                </p>
              </div>

              <div className="rounded-lg bg-indigo-50 p-4">
                <p className="mb-1 text-xs uppercase tracking-wider text-slate-400">
                  Certificate ID
                </p>
                <p className="break-all font-mono text-xs font-semibold text-indigo-600">
                  {certData.certId}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 border-t border-slate-200 pt-6 sm:grid-cols-2">
            <div className="text-center">
              <div className="mb-2 border-b border-slate-400 pb-2 text-sm italic text-indigo-600">
                {certData.instructor}
              </div>
              <p className="text-xs uppercase tracking-wider text-slate-400">
                Course Instructor
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {certData.department}
              </p>
            </div>

            <div className="text-center">
              <div className="mb-2 flex items-center justify-center gap-2 border-b border-slate-400 pb-2">
                <span className="flex h-7 w-7 items-center justify-center rounded bg-gradient-to-br from-indigo-600 to-cyan-500 text-xs font-bold text-white">
                  AI
                </span>
                <span className="text-sm font-bold text-indigo-950">
                  LearnAI Platform
                </span>
              </div>
              <p className="text-xs uppercase tracking-wider text-slate-400">
                Issuing Authority
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Digital Certificate
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <span className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">
              <span>✓</span>
              Certificate eligibility verified by the application
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CertificatePreview({ onNav }) {
  const [certData, setCertData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [verifyId, setVerifyId] = useState("");
  const [verifyResult, setVerifyResult] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCertificate() {
      setLoading(true);
      setError("");

      try {
        const token = getToken();

        if (!token) {
          throw new Error("Your login session was not found. Please log in again.");
        }

        const response = await fetch(
          `${API_URL}/my-certificate`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok || data.success === false) {
          throw new Error(
            data.message ||
              `Unable to load certificate (HTTP ${response.status}).`
          );
        }

        const raw = data.certificate || data.data?.certificate || data.data;

        if (!raw || typeof raw !== "object") {
          throw new Error("The backend did not return certificate details.");
        }

        const score = Number(
          raw.score ??
          raw.percentage ??
          raw.obtainedMarks ??
          0
        );

        const normalized = {
          student:
            raw.student ||
            raw.studentName ||
            raw.name ||
            raw.user?.name ||
            raw.studentId?.name ||
            "Student",

          course:
            raw.course ||
            raw.courseName ||
            "Java Programming",

          date: formatDate(
            raw.date ||
            raw.completionDate ||
            raw.completedAt
          ),

          score,

          level:
            raw.level ||
            raw.achievementLevel ||
            getAchievementLevel(score),

          certId:
            raw.certId ||
            raw.certificateId ||
            raw.certificateNumber ||
            "",

          instructor:
            raw.instructor ||
            raw.instructorName ||
            "Course Instructor",

          department:
            raw.department ||
            "Computer Science & Engineering",
        };

        if (!normalized.certId) {
          throw new Error(
            "Certificate ID is missing from the backend response. Check your getMyCertificate controller."
          );
        }

        if (!cancelled) {
          setCertData(normalized);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load certificate.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCertificate();

    return () => {
      cancelled = true;
    };
  }, []);

  function downloadCertificate() {
    window.print();
  }

  async function shareCertificate() {
    if (!certData) return;

    const shareText =
      `Certificate of Completion\n` +
      `Student: ${certData.student}\n` +
      `Course: ${certData.course}\n` +
      `Score: ${certData.score}%\n` +
      `Certificate ID: ${certData.certId}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Certificate of Completion",
          text: shareText,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        alert("Certificate details copied. You can now share them.");
      } else {
        alert(shareText);
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        alert("Unable to share the certificate on this device.");
      }
    }
  }

  async function handleVerify() {
    const enteredId = verifyId.trim();

    if (!enteredId) {
      setVerifyResult({
        valid: false,
        message: "Please enter a certificate ID.",
      });
      return;
    }

    // This checks the currently loaded certificate only.
    // It does not verify arbitrary IDs against the server.
    if (
      certData &&
      enteredId.toUpperCase() === certData.certId.toUpperCase()
    ) {
      setVerifyResult({
        valid: true,
        message: "This matches your loaded certificate.",
      });
    } else {
      setVerifyResult({
        valid: false,
        message:
          "This ID does not match your loaded certificate.",
      });
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-semibold text-indigo-950">
            Loading your certificate...
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Retrieving your saved final evaluation result.
          </p>
        </div>
      </div>
    );
  }

  if (error || !certData) {
    return (
      <div className="p-6">
        <div className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Certificate Preview
          </h2>

          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error || "Certificate details are unavailable."}
          </div>

          <p className="mt-3 text-sm text-slate-500">
            Ensure your final evaluation is completed and the
            backend route GET /api/final-evaluation/my-certificate
            returns the saved certificate details.
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700"
          >
            Retry
          </button>

          <button
            type="button"
            onClick={() => onNav?.("certificates")}
            className="ml-3 mt-4 rounded-lg border border-indigo-200 px-5 py-2.5 font-semibold text-indigo-700 hover:bg-indigo-50"
          >
            My Certificates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <style>
        {`
          @media print {
            body * {
              visibility: hidden !important;
            }

            #certificate-print,
            #certificate-print * {
              visibility: visible !important;
            }

            #certificate-print {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              box-shadow: none !important;
            }

            @page {
              size: landscape;
              margin: 10mm;
            }
          }
        `}
      </style>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="min-w-0 lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-indigo-950">
                Certificate Preview
              </h2>
              <p className="text-sm text-slate-500">
                Your course completion details
              </p>
            </div>

            <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
              ✓ Eligibility details loaded
            </span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
            <CertificateCard certData={certData} />
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={downloadCertificate}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              📥 Print / Save as PDF
            </button>

            <button
              type="button"
              onClick={shareCertificate}
              className="flex-1 rounded-lg border border-indigo-200 bg-white px-4 py-3 font-semibold text-indigo-700 hover:bg-indigo-50"
            >
              🔗 Share Details
            </button>

            <button
              type="button"
              onClick={() => onNav?.("certificates")}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              📜 My Certificates
            </button>
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-slate-900">
              Certificate Details
            </h3>

            {[
              ["Course Name", certData.course],
              ["Student Name", certData.student],
              ["Completion Date", certData.date],
              ["Final Score", `${certData.score}%`],
              ["Achievement Level", certData.level],
              ["Department", certData.department],
            ].map(([label, value]) => (
              <div
                key={label}
                className="border-b border-slate-100 py-3 last:border-0"
              >
                <p className="text-xs text-slate-400">{label}</p>
                <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                  {value}
                </p>
              </div>
            ))}

            <div className="mt-3">
              <p className="text-xs text-slate-400">Certificate ID</p>
              <p className="mt-1 break-all rounded-lg bg-indigo-50 px-3 py-2 font-mono text-xs font-semibold text-indigo-700">
                {certData.certId}
              </p>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-slate-900">
              Verify Certificate ID
            </h3>

            <p className="mb-3 text-sm text-slate-500">
              Compare an entered ID with the certificate currently loaded.
              Server-side verification of other IDs requires a separate
              verification endpoint.
            </p>

            <input
              type="text"
              value={verifyId}
              onChange={(event) => {
                setVerifyId(event.target.value);
                setVerifyResult(null);
              }}
              placeholder="Enter certificate ID"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <button
              type="button"
              onClick={handleVerify}
              className="mt-3 w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white hover:bg-indigo-700"
            >
              Check ID
            </button>

            {verifyResult && (
              <div
                className={`mt-3 rounded-lg border p-3 text-sm ${
                  verifyResult.valid
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {verifyResult.message}
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
