
import { useCallback, useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const API_URL = "http://localhost:5000/api/final-evaluation";

function getToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken") ||
    ""
  );
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

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

function getCertificateDetails(data) {
  // Support common API response structures.
  const root = data?.certificate || data?.data?.certificate || data?.data || data;
  const result = root?.result || root;

  return {
    studentName: getStudentName(result),
    courseName:
      result?.courseName ||
      result?.course ||
      "Java Programming",
    certificateId:
      result?.certificateId ||
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
      result?.issuedAt ||
      result?.createdAt ||
      null,
    eligible:
      result?.certificateEligible ??
      result?.eligible ??
      false,
    topicsCompleted:
      result?.topicsCompleted ??
      result?.completedTopics ??
      18,
    totalTopics:
      result?.totalTopics ?? 18,
  };
}

export default function MyCertificates({ onNav }) {
  const certificateRef = useRef(null);

  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const [certificateIdInput, setCertificateIdInput] = useState("");
  const [verifyMessage, setVerifyMessage] = useState("");

  const loadCertificate = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = getToken();

      if (!token) {
        throw new Error("Please log in again to view your certificate.");
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
            `Unable to load certificate (HTTP ${response.status}).`
        );
      }

      const details = getCertificateDetails(result);

      if (!details.certificateId) {
        throw new Error(
          "The backend did not return a certificate ID. Check the my-certificate API response."
        );
      }

      setCertificate(details);
    } catch (err) {
      setError(err.message || "Unable to load certificate.");
      setCertificate(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCertificate();
  }, [loadCertificate]);

  const downloadCertificate = async () => {
    if (!certificate) {
      setError("The certificate details are not available.");
      return;
    }

    setDownloading(true);
    setError("");

    try {
      // Build the PDF directly with jsPDF. This avoids html2canvas failures
      // caused by browser/Tailwind CSS color formats and exports only the certificate.
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const centerX = pageWidth / 2;

      // White background and double border.
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");
      pdf.setDrawColor(49, 46, 129);
      pdf.setLineWidth(2.2);
      pdf.rect(7, 7, pageWidth - 14, pageHeight - 14);
      pdf.setDrawColor(165, 180, 252);
      pdf.setLineWidth(0.45);
      pdf.rect(11, 11, pageWidth - 22, pageHeight - 22);

      // Brand heading.
      pdf.setTextColor(79, 70, 229);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(15);
      pdf.text("AI", centerX, 29, { align: "center" });

      pdf.setTextColor(71, 85, 105);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.text("AI-POWERED PERSONALIZED LEARNING PLATFORM", centerX, 36, {
        align: "center",
      });

      pdf.setFontSize(10);
      pdf.setCharSpace(2);
      pdf.text("PROUDLY PRESENTS", centerX, 49, { align: "center" });
      pdf.setCharSpace(0);

      pdf.setTextColor(30, 27, 75);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(27);
      pdf.text("Certificate of Completion", centerX, 63, { align: "center" });

      pdf.setDrawColor(203, 213, 225);
      pdf.setLineWidth(0.4);
      pdf.line(38, 70, pageWidth - 38, 70);

      pdf.setTextColor(71, 85, 105);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setCharSpace(1.2);
      pdf.text("THIS CERTIFICATE IS PROUDLY PRESENTED TO", centerX, 82, {
        align: "center",
      });
      pdf.setCharSpace(0);

      pdf.setTextColor(79, 70, 229);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(25);
      const studentName = String(certificate.studentName || "Student");
      pdf.text(studentName, centerX, 96, {
        align: "center",
        maxWidth: pageWidth - 50,
      });

      pdf.setDrawColor(99, 102, 241);
      pdf.setLineWidth(0.7);
      pdf.line(65, 101, pageWidth - 65, 101);

      pdf.setTextColor(71, 85, 105);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.text("FOR SUCCESSFULLY COMPLETING", centerX, 111, {
        align: "center",
      });

      pdf.setTextColor(15, 23, 42);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(19);
      pdf.text(String(certificate.courseName || "Java Programming"), centerX, 121, {
        align: "center",
        maxWidth: pageWidth - 50,
      });

      pdf.setTextColor(71, 85, 105);
      pdf.setFont("helvetica", "italic");
      pdf.setFontSize(11);
      const scoreText =
        score !== null && Number.isFinite(score)
          ? `Final score: ${score}%`
          : "Course completion certificate";
      pdf.text(scoreText, centerX, 130, { align: "center" });

      // Completion date and certificate ID.
      pdf.setFillColor(238, 242, 255);
      pdf.roundedRect(25, 143, 112, 25, 2, 2, "F");
      pdf.roundedRect(pageWidth - 137, 143, 112, 25, 2, 2, "F");

      pdf.setTextColor(100, 116, 139);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.text("COMPLETION DATE", 31, 151);
      pdf.text("CERTIFICATE ID", pageWidth - 131, 151);

      pdf.setTextColor(15, 23, 42);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.text(formatDate(certificate.completedAt), 31, 160, {
        maxWidth: 100,
      });
      pdf.setFont("courier", "bold");
      pdf.setFontSize(8.5);
      pdf.text(String(certificate.certificateId), pageWidth - 131, 160, {
        maxWidth: 100,
      });

      pdf.setTextColor(100, 116, 139);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.text("Computer Science & Engineering", centerX, 179, {
        align: "center",
      });

      const safeId = String(certificate.certificateId || "certificate").replace(
        /[^a-zA-Z0-9_-]/g,
        "-"
      );
      pdf.save(`Java-Certificate-${safeId}.pdf`);
    } catch (err) {
      console.error("Certificate download error:", err);
      setError(
        `Download failed: ${err?.message || "Unable to create the PDF."}`
      );
    } finally {
      setDownloading(false);
    }
  };

  const verifyCertificate = () => {
    if (!certificateIdInput.trim()) {
      setVerifyMessage("Please enter a certificate ID.");
      return;
    }

    if (
      certificate &&
      certificateIdInput.trim().toLowerCase() ===
        certificate.certificateId.toLowerCase()
    ) {
      setVerifyMessage("This matches the certificate currently loaded.");
    } else {
      setVerifyMessage(
        "This ID does not match the certificate currently loaded. Verification of other certificates requires a backend verification endpoint."
      );
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-8 text-slate-700">
        Loading your certificate...
      </main>
    );
  }

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

          <p className="mt-4 text-sm text-slate-500">
            Confirm that your backend provides
            {" "}
            <code>GET /api/final-evaluation/my-certificate</code>
            {" "}
            and returns the saved certificate details.
          </p>
        </section>
      </main>
    );
  }

  const score =
    certificate.score === null || certificate.score === undefined
      ? null
      : Number(certificate.score);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            My Certificates
          </h1>
          <p className="mt-2 text-slate-600">
            View and download your Java course certificate.
          </p>
        </header>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
          {/* Certificate preview */}
          <section>
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              Certificate Preview
            </h2>

            {/* This element alone is exported to PDF. */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-3 shadow-sm md:p-5">
              <div
                ref={certificateRef}
                className="relative mx-auto w-full min-w-[620px] overflow-hidden border-[8px] border-indigo-800 bg-white p-6 text-center text-slate-900 md:p-10"
                style={{
                  aspectRatio: "1.414 / 1",
                  boxSizing: "border-box",
                  backgroundImage:
                    "linear-gradient(135deg, #ffffff 75%, #f0f3ff 100%)",
                }}
              >
                <div className="pointer-events-none absolute inset-[5px] border border-indigo-300" />

                <div className="relative flex h-full flex-col items-center justify-center">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white">
                      AI
                    </div>
                    <span className="text-base font-bold tracking-wide md:text-xl">
                      AI-Powered Personalized Learning Platform
                    </span>
                  </div>

                  <p className="mt-2 text-xs tracking-[0.35em] text-slate-500 md:text-sm">
                    PROUDLY PRESENTS
                  </p>

                  <h2 className="mt-3 text-2xl font-extrabold text-indigo-950 md:text-4xl">
                    Certificate of Completion
                  </h2>

                  <div className="my-5 w-full max-w-3xl border-t border-slate-300" />

                  <p className="text-xs tracking-[0.25em] text-slate-500 md:text-sm">
                    THIS CERTIFICATE IS PROUDLY PRESENTED TO
                  </p>

                  <h3 className="mt-3 max-w-full break-words text-2xl font-bold text-indigo-600 md:text-4xl">
                    {certificate.studentName}
                  </h3>

                  <div className="mt-3 w-2/3 border-t-2 border-indigo-500" />

                  <p className="mt-4 text-xs tracking-wider text-slate-500 md:text-sm">
                    FOR SUCCESSFULLY COMPLETING
                  </p>

                  <h4 className="mt-2 max-w-full break-words text-lg font-bold md:text-2xl">
                    {certificate.courseName}
                  </h4>

                  <p className="mt-2 text-sm italic text-slate-600 md:text-base">
                    {score !== null && Number.isFinite(score)
                      ? `Final score: ${score}%`
                      : "Course completion certificate"}
                  </p>

                  <div className="my-5 flex w-full items-center gap-4">
                    <div className="flex-1 border-t border-indigo-200" />
                    <span className="text-xl text-indigo-600">✦</span>
                    <div className="flex-1 border-t border-indigo-200" />
                  </div>

                  <div className="grid w-full grid-cols-2 gap-4 text-left">
                    <div className="rounded-lg bg-indigo-50 p-3 md:p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Completion Date
                      </p>
                      <p className="mt-1 break-words text-sm font-semibold md:text-base">
                        {formatDate(certificate.completedAt)}
                      </p>
                    </div>

                    <div className="rounded-lg bg-indigo-50 p-3 md:p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Certificate ID
                      </p>
                      <p className="mt-1 break-all font-mono text-xs font-semibold text-indigo-700 md:text-sm">
                        {certificate.certificateId}
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 text-xs text-slate-500 md:text-sm">
                    Computer Science &amp; Engineering
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={downloadCertificate}
              disabled={downloading}
              className="mt-5 w-full rounded-xl bg-indigo-600 px-6 py-4 font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {downloading
                ? "Preparing PDF..."
                : "Download Certificate (PDF)"}
            </button>

            <p className="mt-2 text-sm text-slate-500">
              Downloads the certificate preview only as a single-page A4
              landscape PDF.
            </p>
          </section>

          {/* Certificate details */}
          <aside className="space-y-5">
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">
                Certificate Details
              </h2>

              <Detail label="Course Name" value={certificate.courseName} />
              <Detail label="Student Name" value={certificate.studentName} />
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

              <div className="mt-4 rounded-lg bg-emerald-50 p-3">
                <p className="font-semibold text-emerald-700">
                  {certificate.eligible
                    ? "Certificate eligible"
                    : "Eligibility not confirmed by the API"}
                </p>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Verify Certificate ID
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                Compare an ID with the certificate currently loaded.
                This is a local comparison, not independent server
                verification.
              </p>

              <input
                value={certificateIdInput}
                onChange={(event) => {
                  setCertificateIdInput(event.target.value);
                  setVerifyMessage("");
                }}
                placeholder="Enter Certificate ID"
                className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              <button
                onClick={verifyCertificate}
                className="mt-3 w-full rounded-lg border border-indigo-200 px-4 py-3 font-semibold text-indigo-700 hover:bg-indigo-50"
              >
                Verify ID
              </button>

              {verifyMessage && (
                <p className="mt-3 text-sm text-slate-700">
                  {verifyMessage}
                </p>
              )}
            </section>

            <button
              onClick={() => onNav?.("student-dashboard")}
              className="w-full rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-100"
            >
              Back to Dashboard
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Detail({ label, value }) {
  return (
    <div className="mt-4 border-b border-slate-100 pb-3">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 break-words font-semibold text-slate-900">
        {value || "—"}
      </p>
    </div>
  );
}
