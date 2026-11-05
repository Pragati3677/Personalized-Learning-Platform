
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

const API_URL = "http://localhost:5000/api/final-evaluation";

// Get authentication token
function getToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken") ||
    ""
  );
}

// Format date
function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// Extract student name
function getStudentName(data) {
  return (
    data?.studentName ||
    data?.student?.name ||
    data?.student?.fullName ||
    data?.user?.name ||
    data?.user?.fullName ||
    data?.name ||
    "Student"
  );
}

// Normalize certificate API response
function getCertificateDetails(data) {
  const root =
    data?.certificate ||
    data?.data?.certificate ||
    data?.data ||
    data;

  const result = root?.result || root;

  return {
    studentName: getStudentName(result),

    courseName:
      result?.courseName ||
      result?.course ||
      "Java Programming",

    certificateId:
      result?.certificateId ||
      result?.certId ||
      result?.certificateNumber ||
      result?.id ||
      "",

    score:
      result?.percentage ??
      result?.finalScore ??
      result?.score ??
      result?.obtainedMarks ??
      null,

    completedAt:
      result?.completedAt ||
      result?.completionDate ||
      result?.date ||
      result?.issuedAt ||
      result?.createdAt ||
      null,

    eligible:
      result?.certificateEligible ??
      result?.eligible ??
      false,

    issued:
      result?.issued ??
      (String(result?.status || "").toLowerCase() === "issued"),

    verified: result?.verified ?? false,
  };
}

// Edu-path logo
function EduPathLogo() {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-700 via-indigo-600 to-blue-500 shadow-lg shadow-indigo-200">
        <svg
          viewBox="0 0 48 48"
          className="h-8 w-8"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M7 17 24 8l17 9-17 9L7 17Z"
            fill="#FDE68A"
            stroke="#FFF7D6"
            strokeWidth="1.4"
          />

          <path
            d="M14 22v8c5 5 15 5 20 0v-8l-10 5-10-5Z"
            fill="white"
          />

          <path
            d="M40 18v11"
            stroke="#FDE68A"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <circle
            cx="40"
            cy="32"
            r="2"
            fill="#FDE68A"
          />

          <path
            d="M12 37c7-4 17-4 24 0"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div>
        <div className="text-xl font-extrabold tracking-tight text-violet-700">
          Edu-path
        </div>

        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          Adaptive Learning Platform
        </div>
      </div>
    </div>
  );
}

// Gold achievement medal
function CertificateSeal() {
  return (
    <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center self-center">
      <div className="absolute inset-1 rounded-full border-4 border-amber-400 bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600 shadow-lg" />
      <div className="absolute inset-2 rounded-full border border-amber-100" />

      <svg
        viewBox="0 0 48 48"
        className="relative z-10 h-8 w-8"
        aria-hidden="true"
      >
        <path
          d="m24 4 5.2 11 12 1.7-8.6 8.4 2 12L24 31.5l-10.6 5.6 2-12-8.6-8.4 12-1.7L24 4Z"
          fill="#FFF7D6"
          stroke="#A16207"
          strokeWidth="1.3"
        />
      </svg>

      <span className="absolute -bottom-2 left-[17px] h-5 w-2.5 -rotate-12 rounded-b-sm bg-gradient-to-b from-violet-700 to-indigo-950" />
      <span className="absolute -bottom-2 right-[17px] h-5 w-2.5 rotate-12 rounded-b-sm bg-gradient-to-b from-violet-700 to-indigo-950" />
    </div>
  );
}

export default function MyCertificates({ onNav }) {
  const [certificate, setCertificate] = useState(null);

  const [loading, setLoading] = useState(true);

  const [downloading, setDownloading] = useState(false);

  const [error, setError] = useState("");

  const [certificateIdInput, setCertificateIdInput] = useState("");

  const [verifyMessage, setVerifyMessage] = useState("");

  // Reference to the actual certificate displayed on the website
  const certificateRef = useRef(null);

  // Fetch certificate from backend
  const loadCertificate = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = getToken();

      if (!token) {
        throw new Error(
          "Please log in again to view your certificate."
        );
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

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message ||
            `Unable to load certificate. HTTP ${response.status}`
        );
      }

      const details = getCertificateDetails(result);

      if (!details.certificateId) {
        throw new Error(
          "Certificate ID was not returned by the backend."
        );
      }

      setCertificate(details);
    } catch (err) {
      console.error("Certificate loading error:", err);

      setError(
        err.message || "Unable to load certificate."
      );

      setCertificate(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCertificate();
  }, [loadCertificate]);

  // Download the complete certificate preview as a single-page A4 landscape PDF.
  const downloadCertificate = async () => {
    const certificateElement = certificateRef.current;

    if (!certificate || !certificateElement) {
      setError("Certificate preview is not available.");
      return;
    }

    setDownloading(true);
    setError("");

    try {
      const images = Array.from(certificateElement.querySelectorAll("img"));
      await Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );

      // Fixed 1122 × 794 px certificate dimensions match A4 landscape.
      const canvas = await html2canvas(certificateElement, {
        scale: 2,
        width: 1122,
        height: 794,
        windowWidth: 1200,
        windowHeight: 900,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#fffefa",
        logging: false,
        imageTimeout: 15000,
        scrollX: 0,
        scrollY: 0,
      });

      const imageData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      pdf.addImage(imageData, "PNG", 0, 0, 297, 210, undefined, "FAST");

      const safeId = String(certificate.certificateId || "certificate")
        .replace(/[^a-zA-Z0-9_-]/g, "-");

      pdf.save(`Edu-path-Certificate-${safeId}.pdf`);
    } catch (err) {
      console.error("Certificate PDF error:", err);
      setError(
        `Unable to download certificate: ${err?.message || "Please try again."}`
      );
    } finally {
      setDownloading(false);
    }
  };

  // Certificate ID verification
  const verifyCertificate = () => {
    if (!certificateIdInput.trim()) {
      setVerifyMessage(
        "Please enter a certificate ID."
      );
      return;
    }

    if (
      certificate &&
      certificateIdInput.trim().toLowerCase() ===
        certificate.certificateId.toLowerCase()
    ) {
      setVerifyMessage(
        "This ID matches the certificate currently loaded."
      );
    } else {
      setVerifyMessage(
        "This ID does not match the loaded certificate."
      );
    }
  };

  // Loading screen
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-8 text-slate-700">
        Loading your certificate...
      </main>
    );
  }

  // Error screen
  if (!certificate) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 md:p-10">
        <section className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            My Certificates
          </h1>

          <p className="mt-4 rounded-lg bg-red-50 p-4 text-red-700">
            {error || "No certificate details are available."}
          </p>

          <button
            onClick={loadCertificate}
            className="mt-5 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
          >
            Retry
          </button>
        </section>
      </main>
    );
  }

  const score =
    certificate.score === null ||
    certificate.score === undefined
      ? null
      : Number(certificate.score);

  const certificateIsIssued =
    certificate.issued || certificate.verified;

  return (
    <main className="min-h-screen bg-[#f5f6fc] px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-[1450px]">

        {/* Page Header */}
        <header className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-violet-700">
              Edu-path • Student Achievement
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              My Certificates
            </h1>

            <p className="mt-1 text-slate-600">
              Celebrate your learning journey and achievements.
            </p>
          </div>

          <button
            onClick={() => onNav?.("student-dashboard")}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-300 hover:text-violet-700"
          >
            Back to Dashboard
          </button>
        </header>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_370px]">

          {/* LEFT SIDE */}
          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-900">
                Your Achievement
              </h2>

              <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-800">
                OFFICIAL COURSE RECORD
              </span>
            </div>

            {/* ACTUAL CERTIFICATE PREVIEW */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-indigo-100/60 md:p-5">

              <div
                ref={certificateRef}
                className="relative mx-auto overflow-hidden border-[7px] border-[#3b176f] bg-[#fffefa] p-5 text-center text-slate-900 md:p-7"
                style={{
                  width: "1122px",
                  height: "794px",
                  minWidth: "1122px",
                  boxSizing: "border-box",
                  backgroundColor: "#fffefa",
                  backgroundImage:
                    "radial-gradient(circle at 50% 48%, #ffffff 0%, #fffefa 65%, #f8f3ff 100%)",
                }}
              >
                {/* Inner border */}
                <div className="pointer-events-none absolute inset-[5px] border border-[#d7b45b]" />

                {/* Top-left decoration */}
                <div className="pointer-events-none absolute left-0 top-0 h-28 w-44 -translate-x-8 -translate-y-8 rotate-[-18deg] rounded-br-[70px] bg-gradient-to-br from-violet-950 via-violet-800 to-indigo-700" />

                <div className="pointer-events-none absolute left-0 top-[78px] h-1.5 w-48 -translate-x-8 rotate-[-27deg] bg-gradient-to-r from-amber-200 via-yellow-500 to-amber-200" />

                {/* Bottom-right decoration */}
                <div className="pointer-events-none absolute bottom-0 right-0 h-28 w-44 translate-x-8 translate-y-8 rotate-[-18deg] rounded-tl-[70px] bg-gradient-to-br from-indigo-700 via-violet-800 to-violet-950" />

                <div className="pointer-events-none absolute bottom-[78px] right-0 h-1.5 w-48 translate-x-8 rotate-[-27deg] bg-gradient-to-r from-amber-200 via-yellow-500 to-amber-200" />

                {/* Certificate Content */}
                <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 pt-2">

                  {/* Logo */}
                  <div className="mb-2">
                    <EduPathLogo />
                  </div>

                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.32em] text-amber-700 md:text-xs">
                    ✦ Certificate of Achievement ✦
                  </p>

                  <h2 className="mt-2 font-serif text-2xl font-black uppercase tracking-wide text-[#24134f] md:text-4xl">
                    Certificate of Completion
                  </h2>

                  {/* Gold Divider */}
                  <div className="my-3 flex w-full max-w-2xl items-center gap-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-400 to-amber-500" />

                    <span className="text-xl text-amber-500">
                      ✦
                    </span>

                    <div className="h-px flex-1 bg-gradient-to-l from-transparent via-amber-400 to-amber-500" />
                  </div>

                  <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-slate-500 md:text-xs">
                    This certificate is proudly presented to
                  </p>

                  {/* Student Name */}
                  <h3 className="mt-2 max-w-full break-words font-serif text-2xl font-bold text-violet-700 md:text-4xl">
                    {certificate.studentName}
                  </h3>

                  <div className="mt-2 h-[2px] w-2/3 max-w-lg bg-gradient-to-r from-transparent via-violet-500 to-transparent" />

                  <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600 md:text-xs">
                    For successfully completing the course
                  </p>

                  {/* Course Title */}
                  <div className="mt-2 rounded-full bg-gradient-to-r from-[#32106f] via-violet-800 to-[#32106f] px-6 py-2 text-sm font-bold text-white shadow-lg shadow-violet-200 md:text-xl">
                    &lt;/&gt;&nbsp; {certificate.courseName}
                  </div>

                  {/* Final Score */}
                  <p className="mt-2 text-sm italic text-violet-950 md:text-base">
                    Final Score:{" "}
                    <span className="font-extrabold not-italic">
                      {score !== null && Number.isFinite(score)
                        ? `${score}%`
                        : "—"}
                    </span>
                  </p>

                  {/* Lower Divider */}
                  <div className="my-3 flex w-full items-center gap-3">
                    <div className="h-px flex-1 bg-violet-200" />

                    <span className="text-amber-500">
                      ✧
                    </span>

                    <div className="h-px flex-1 bg-violet-200" />
                  </div>

                  {/* Date, Medal and Certificate ID */}
                  <div className="grid w-full grid-cols-[minmax(0,1fr)_56px_minmax(0,1fr)] items-center gap-3 text-left">

                    <div className="rounded-xl border border-violet-100 bg-violet-50/90 p-2.5 md:p-3">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 md:text-[10px]">
                        Completion Date
                      </p>

                      <p className="mt-1 break-words text-xs font-bold text-slate-900 md:text-sm">
                        {formatDate(certificate.completedAt)}
                      </p>
                    </div>

                    <CertificateSeal />

                    <div className="rounded-xl border border-violet-100 bg-violet-50/90 p-2.5 md:p-3">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 md:text-[10px]">
                        Certificate ID
                      </p>

                      <p className="mt-1 break-all font-mono text-[9px] font-bold text-violet-800 md:text-xs">
                        {certificate.certificateId}
                      </p>
                    </div>

                  </div>

                  <p className="mt-6 text-[9px] font-medium tracking-wide text-slate-500 md:text-[10px]">
                    COMPUTER SCIENCE &amp; ENGINEERING • EDU-PATH
                  </p>
                </div>
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={downloadCertificate}
              disabled={downloading}
              className="mt-5 flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-violet-700 to-indigo-600 px-6 py-4 font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:from-violet-800 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v3h16v-3" />
              </svg>

              {downloading
                ? "Preparing your certificate..."
                : "Download Certificate (PDF)"}
            </button>

            <p className="mt-2 text-center text-xs text-slate-500">
              Your certificate is exported as a single-page A4 landscape PDF.
            </p>
          </section>

          {/* RIGHT SIDE */}
          <aside className="space-y-5">

            {/* Certificate Details */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  Certificate Details
                </h2>

                <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-700">
                  Edu-path
                </span>
              </div>

              <Detail
                label="Course Name"
                value={certificate.courseName}
              />

              <Detail
                label="Student Name"
                value={certificate.studentName}
              />

              <Detail
                label="Completion Date"
                value={formatDate(certificate.completedAt)}
              />

              <Detail
                label="Final Score"
                value={
                  score !== null && Number.isFinite(score)
                    ? `${score}%`
                    : "Not provided by backend"
                }
              />

              <Detail
                label="Certificate ID"
                value={certificate.certificateId}
              />

              <div
                className={`mt-5 rounded-xl p-4 ${
                  certificateIsIssued
                    ? "border border-emerald-100 bg-emerald-50"
                    : "border border-amber-100 bg-amber-50"
                }`}
              >
                <p
                  className={`font-bold ${
                    certificateIsIssued
                      ? "text-emerald-800"
                      : "text-amber-800"
                  }`}
                >
                  {certificateIsIssued
                    ? "✓ Certificate Issued"
                    : certificate.eligible
                    ? "Certificate Eligible"
                    : "Eligibility Not Confirmed"}
                </p>

                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  {certificateIsIssued
                    ? "The certificate record has been issued by Edu-path."
                    : "The API has not confirmed that a certificate has been issued."}
                </p>
              </div>
            </section>

            {/* Verification */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Verify Certificate ID
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Enter the ID to compare it with the certificate currently loaded.
                This is a local comparison, not independent server verification.
              </p>

              <input
                value={certificateIdInput}
                onChange={(event) => {
                  setCertificateIdInput(event.target.value);
                  setVerifyMessage("");
                }}
                placeholder="Enter Certificate ID"
                className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />

              <button
                onClick={verifyCertificate}
                className="mt-3 w-full rounded-xl border border-violet-200 px-4 py-3 font-semibold text-violet-700 transition hover:bg-violet-50"
              >
                Verify ID
              </button>

              {verifyMessage && (
                <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                  {verifyMessage}
                </p>
              )}
            </section>

            {/* Learning Journey Card */}
            <div className="rounded-2xl bg-gradient-to-br from-[#32106f] to-indigo-700 p-5 text-white shadow-lg shadow-indigo-200">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-200">
                Keep Learning
              </p>

              <h3 className="mt-2 text-xl font-bold">
                One achievement. Many possibilities.
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-indigo-100">
                Continue building your skills and take the next step in your learning journey.
              </p>

              <button
                onClick={() => onNav?.("student-dashboard")}
                className="mt-4 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-violet-800 transition hover:bg-violet-50"
              >
                Back to Dashboard
              </button>
            </div>

          </aside>
        </div>
      </div>
    </main>
  );
}

// Reusable detail row
function Detail({ label, value }) {
  return (
    <div className="mt-4 border-b border-slate-100 pb-3">
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words font-semibold text-slate-900">
        {value || "—"}
      </p>
    </div>
  );
}
