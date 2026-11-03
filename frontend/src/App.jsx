import { useState } from "react";

// ============================================================
// PAGES
// ============================================================

import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import PrerequisiteQuiz from "./pages/PrerequisiteQuiz";

// ---------------- STUDENT PAGES ----------------

import StudentDashboard from "./pages/StudentDashboard";
import MyLearning from "./pages/MyLearning";
import LearningPath from "./pages/LearningPath";
import LearningResource from "./pages/LearningResource";
import SmartQuiz from "./pages/SmartQuiz";
import Performance from "./pages/Performance";
import Recommendations from "./pages/Recommendations";
import StudyPlanner from "./pages/StudyPlanner";
import RevisionCenter from "./pages/RevisionCenter";
import CareerMentor from "./pages/CareerMentor";
import Progress from "./pages/Progress";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

// ---------------- TEACHER PAGES ----------------

import TeacherDashboard from "./pages/TeacherDashboard";
import StudentMonitoring from "./pages/StudentMonitoring";
import StudentDetail from "./pages/StudentDetail";
import AtRisk from "./pages/AtRisk";
import TeacherReports from "./pages/TeacherReports";
import Intervention from "./pages/Intervention";

import TeacherNotifications from "./pages/TeacherNotifications";
import TeacherProfile from "./pages/TeacherProfile";
import TeacherSettings from "./pages/TeacherSettings";

// ---------------- OTHER STUDENT PAGES ----------------

import FinalEvaluation from "./pages/FinalEvaluation";
import CourseComplete from "./pages/CourseComplete";
import CertificatePreview from "./pages/CertificatePreview";
import MyCertificates from "./pages/MyCertificates";

// ============================================================
// LAYOUT
// ============================================================

import StudentSidebar from "./components/StudentSidebar";
import TeacherSidebar from "./components/TeacherSidebar";
import TopBar from "./components/TopBar";

// ============================================================
// STUDENT VIEWS
// ============================================================

const studentViews = [
  "student-dashboard",
  "my-learning",
  "learning-path",
  "learning-resource",
  "smart-quiz",
  "smart-quiz-result",
  "performance",
  "recommendations",
  "study-planner",
  "revision",
  "career",
  "progress",

  // Student-specific pages
  "notifications",
  "profile",
  "settings",

  "final-evaluation",
  "course-complete",
  "certificate-preview",
  "certificates",
];

// ============================================================
// TEACHER VIEWS
// ============================================================

const teacherViews = [
  "teacher-dashboard",
  "student-monitoring",
  "student-detail",
  "at-risk",
  "teacher-reports",
  "intervention",

  // Teacher-specific pages
  "teacher-notifications",
  "teacher-profile",
  "teacher-settings",
];

// ============================================================
// PAGE TITLES
// ============================================================

const pageTitles = {
  // ----------------------------------------------------------
  // STUDENT
  // ----------------------------------------------------------

  "final-evaluation": {
    title: "Final Evaluation",
    subtitle:
      "Complete this to unlock your certificate",
  },

  "course-complete": {
    title: "Course Completed! 🎉",
    subtitle:
      "Congratulations on finishing your course",
  },

  "certificate-preview": {
    title: "Certificate of Completion",
    subtitle:
      "View, download, and share your certificate",
  },

  certificates: {
    title: "My Certificates",
    subtitle:
      "Your earned certificates and verification",
  },

  "student-dashboard": {
    title: "Dashboard",
    subtitle:
      "Your personalized AI learning hub",
  },

  "my-learning": {
    title: "My Learning",
    subtitle:
      "Track your subjects and topics",
  },

  "learning-path": {
    title: "Personalized Learning Path",
    subtitle:
      "AI-mapped roadmap based on your performance",
  },

  "learning-resource": {
    title: "Learning Resource",
    subtitle:
      "Learn topic resources and assessments",
  },

  "smart-quiz": {
    title: "AI Smart Quiz",
    subtitle:
      "Adaptive questions based on your level",
  },

  performance: {
    title: "Performance Analysis",
    subtitle:
      "AI-powered insights into your learning",
  },

  recommendations: {
    title: "AI Recommendations",
    subtitle:
      "Personalized resources just for you",
  },

  "study-planner": {
    title: "AI Study Planner",
    subtitle:
      "Auto-generated schedule based on your goals",
  },

  revision: {
    title: "Revision Center",
    subtitle:
      "Spaced repetition for long-term retention",
  },

  career: {
    title: "Career & Placement Mentor",
    subtitle:
      "AI-guided path to your dream role",
  },

  progress: {
    title: "Progress Analytics",
    subtitle:
      "Your complete learning journey",
  },

  notifications: {
    title: "Notifications",
    subtitle:
      "Stay on top of your learning",
  },

  profile: {
    title: "My Profile",
    subtitle:
      "Your account information",
  },

  settings: {
    title: "Settings",
    subtitle:
      "Preferences and account settings",
  },

  // ----------------------------------------------------------
  // TEACHER
  // ----------------------------------------------------------

  "teacher-dashboard": {
    title: "Teacher Dashboard",
    subtitle:
      "Class overview and AI insights",
  },

  "student-monitoring": {
    title: "Student Monitoring",
    subtitle:
      "Track all students in real time",
  },

  "student-detail": {
    title: "Student Performance",
    subtitle:
      "Detailed student analysis",
  },

  "at-risk": {
    title: "Early Alert System",
    subtitle:
      "AI-detected at-risk students",
  },

  "teacher-reports": {
    title: "Reports",
    subtitle:
      "Generate performance reports",
  },

  intervention: {
    title: "Interventions",
    subtitle:
      "Support actions and notes",
  },

  "teacher-notifications": {
    title: "Teacher Notifications",
    subtitle:
      "Send messages and learning guidance to students",
  },

  "teacher-profile": {
    title: "Teacher Profile",
    subtitle:
      "Your teacher account information",
  },

  "teacher-settings": {
    title: "Teacher Settings",
    subtitle:
      "Teacher portal preferences",
  },
};

// ============================================================
// APP
// ============================================================

export default function App() {
  const [view, setView] =
    useState("landing");

  const [role, setRole] =
    useState(() => {
      try {
        const user = JSON.parse(
          localStorage.getItem("user") || "{}"
        );

        return user.role || null;
      } catch {
        return null;
      }
    });

  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  // ==========================================================
  // SELECTED TOPIC
  // ==========================================================

  const [selectedTopic, setSelectedTopic] =
    useState(null);

  // ==========================================================
  // SELECTED TEACHER STUDENT
  // ==========================================================

  const [
    selectedStudentName,
    setSelectedStudentName,
  ] = useState(() =>
    localStorage.getItem(
      "teacherSelectedStudentName"
    ) || ""
  );

  // ==========================================================
  // NAVIGATION
  // ==========================================================

  const nav = (
    nextView,
    topic = null
  ) => {
    // ========================================================
    // PROTECTED STUDENT VIEWS
    // ========================================================

    const protectedStudentViews = [
      "student-dashboard",
      "my-learning",
      "learning-path",
      "learning-resource",
      "smart-quiz",
      "smart-quiz-result",
      "performance",
      "recommendations",
      "study-planner",
      "revision",
      "career",
      "progress",
      "notifications",
      "profile",
      "settings",
      "final-evaluation",
      "course-complete",
      "certificate-preview",
      "certificates",
    ];

    // ========================================================
    // STUDENT PREREQUISITE PROTECTION
    // ========================================================

    if (
      protectedStudentViews.includes(
        nextView
      )
    ) {
      const user = JSON.parse(
        localStorage.getItem("user") ||
          "{}"
      );

      // No logged-in user
      if (!user.email) {
        setView("login");
        return;
      }

      // Only apply prerequisite protection
      // to students.
      if (user.role === "student") {
        const completedKey =
          `prerequisiteCompleted_${user.email}`;

        const prerequisiteCompleted =
          localStorage.getItem(
            completedKey
          ) === "true";

        if (!prerequisiteCompleted) {
          setView("onboarding");
          return;
        }
      }
    }

    // ========================================================
    // SAVE SELECTED TOPIC
    // ========================================================

    if (topic) {
      setSelectedTopic(topic);
    }

    // ========================================================
    // SAVE SELECTED STUDENT NAME
    // ========================================================

    if (
      nextView === "student-detail"
    ) {
      const storedStudentName =
        localStorage.getItem(
          "teacherSelectedStudentName"
        ) || "";

      setSelectedStudentName(
        storedStudentName
      );
    }

    // ========================================================
    // NORMAL NAVIGATION
    // ========================================================

    setView(nextView);
  };

  // ==========================================================
  // LOGIN
  // ==========================================================

  const handleLogin = (
    userRole
  ) => {
    setRole(userRole);

    if (userRole === "teacher") {
      setView("teacher-dashboard");
    } else {
      setView("student-dashboard");
    }
  };

  // ==========================================================
  // VIEW TYPES
  // ==========================================================

  const isStudent =
    role === "student" &&
    studentViews.includes(view);

  const isTeacher =
    role === "teacher" &&
    teacherViews.includes(view);

  // ==========================================================
  // PAGE META
  // ==========================================================

  let meta =
    pageTitles[view];

  // ==========================================================
  // DYNAMIC STUDENT PERFORMANCE TITLE
  // ==========================================================

  if (
    view === "student-detail"
  ) {
    meta = {
      title: "Student Performance",

      subtitle:
        selectedStudentName
          ? `${selectedStudentName} — Detailed Analysis`
          : "Detailed Student Analysis",
    };
  }

  // ==========================================================
  // FULLSCREEN PAGES
  // ==========================================================

  const fullscreen = [
    "landing",
    "login",
    "register",
    "onboarding",
    "prereq-quiz",
    "quiz-result",
  ].includes(view);

  // ==========================================================
  // FULLSCREEN RENDERING
  // ==========================================================

  if (fullscreen) {
    if (view === "landing") {
      return (
        <Landing
          onNav={nav}
        />
      );
    }

    if (view === "login") {
      return (
        <Auth
          mode="login"
          onNav={nav}
          onLogin={handleLogin}
        />
      );
    }

    if (view === "register") {
      return (
        <Auth
          mode="register"
          onNav={nav}
          onLogin={handleLogin}
        />
      );
    }

    if (view === "onboarding") {
      return (
        <Onboarding
          onNav={nav}
        />
      );
    }

    if (view === "prereq-quiz") {
      return (
        <PrerequisiteQuiz
          onNav={nav}
        />
      );
    }
  }

  // ==========================================================
  // RENDER PAGE
  // ==========================================================

  const renderPage = () => {
    switch (view) {

      // ======================================================
      // STUDENT
      // ======================================================

      case "student-dashboard":
        return (
          <StudentDashboard
            onNav={nav}
          />
        );

      case "my-learning":
        return (
          <MyLearning
            onNav={nav}
          />
        );

      case "learning-path":
        return (
          <LearningPath
            onNav={nav}
          />
        );

      case "learning-resource":
        return (
          <LearningResource
            onNav={nav}
            topic={selectedTopic}
          />
        );

      case "smart-quiz":
        return (
          <SmartQuiz
            onNav={nav}
            topic={selectedTopic}
          />
        );

      case "performance":
        return (
          <Performance />
        );

      case "recommendations":
        return (
          <Recommendations
            onNav={nav}
          />
        );

      case "study-planner":
        return (
          <StudyPlanner />
        );

      case "revision":
        return (
          <RevisionCenter />
        );

      case "career":
        return (
          <CareerMentor />
        );

      case "progress":
        return (
          <Progress />
        );

      // ---------------- STUDENT NOTIFICATIONS ----------------

      case "notifications":
        return (
          <Notifications />
        );

      // ---------------- STUDENT PROFILE ----------------

      case "profile":
        return (
          <Profile />
        );

      // ---------------- STUDENT SETTINGS ----------------

      case "settings":
        return (
          <Settings
            onNav={nav}
          />
        );

      case "final-evaluation":
        return (
          <FinalEvaluation
            onNav={nav}
          />
        );

      case "course-complete":
        return (
          <CourseComplete
            onNav={nav}
          />
        );

      case "certificate-preview":
        return (
          <CertificatePreview
            onNav={nav}
          />
        );

      case "certificates":
        return (
          <MyCertificates
            onNav={nav}
          />
        );

      // ======================================================
      // TEACHER
      // ======================================================

      case "teacher-dashboard":
        return (
          <TeacherDashboard
            onNav={nav}
          />
        );

      case "student-monitoring":
        return (
          <StudentMonitoring
            onNav={nav}
          />
        );

      case "student-detail":
        return (
          <StudentDetail
            onNav={nav}
          />
        );

      case "at-risk":
        return (
          <AtRisk
            onNav={nav}
          />
        );

      case "teacher-reports":
        return (
          <TeacherReports />
        );

      case "intervention":
        return (
          <Intervention
            onNav={nav}
          />
        );

      // ---------------- TEACHER NOTIFICATIONS ----------------

      case "teacher-notifications":
        return (
          <TeacherNotifications
            onNav={nav}
          />
        );

      // ---------------- TEACHER PROFILE ----------------

      case "teacher-profile":
        return (
          <TeacherProfile />
        );

      // ---------------- TEACHER SETTINGS ----------------

      case "teacher-settings":
        return (
          <TeacherSettings />
        );

      // ======================================================
      // DEFAULT
      // ======================================================

      default:
        return (
          <Landing
            onNav={nav}
          />
        );
    }
  };

  // ==========================================================
  // MAIN LAYOUT
  // ==========================================================

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* ======================================================
          STUDENT SIDEBAR
      ======================================================= */}

      {isStudent && (
        <StudentSidebar
          current={view}
          onNav={nav}
          collapsed={
            sidebarCollapsed
          }
        />
      )}

      {/* ======================================================
          TEACHER SIDEBAR
      ======================================================= */}

      {isTeacher && (
        <TeacherSidebar
          current={view}
          onNav={nav}
        />
      )}

      {/* ======================================================
          MAIN CONTENT
      ======================================================= */}

      <div className="flex-1 flex flex-col min-w-0">

        {/* ====================================================
            TOP BAR
        ===================================================== */}

        {meta && (
          <TopBar
            title={meta.title}
            subtitle={meta.subtitle}

            onMenuClick={
              isStudent
                ? () =>
                    setSidebarCollapsed(
                      !sidebarCollapsed
                    )
                : undefined
            }

            rightContent={
              <div className="flex items-center gap-2">

                {/* ============================================
                    STUDENT NAVIGATION
                ============================================ */}

                {isStudent && (
                  <div className="hidden md:flex items-center gap-2">

                    <button
                      onClick={() =>
                        nav("landing")
                      }
                      className="text-xs text-slate-500 hover:text-indigo-600 px-2 py-1 rounded hover:bg-slate-100"
                    >
                      🏠 Landing
                    </button>

                    <button
                      onClick={() =>
                        nav(
                          "teacher-dashboard"
                        )
                      }
                      className="text-xs text-slate-500 hover:text-indigo-600 px-2 py-1 rounded hover:bg-slate-100"
                    >
                      👩‍🏫 Teacher View
                    </button>

                  </div>
                )}

                {/* ============================================
                    TEACHER NAVIGATION
                ============================================ */}

                {isTeacher && (
                  <div className="hidden md:flex items-center gap-2">

                    <button
                      onClick={() =>
                        nav(
                          "student-dashboard"
                        )
                      }
                      className="text-xs text-slate-500 hover:text-indigo-600 px-2 py-1 rounded hover:bg-slate-100"
                    >
                      👨‍🎓 Student View
                    </button>

                    <button
                      onClick={() =>
                        nav("landing")
                      }
                      className="text-xs text-slate-500 hover:text-indigo-600 px-2 py-1 rounded hover:bg-slate-100"
                    >
                      🏠 Landing
                    </button>

                  </div>
                )}

              </div>
            }
          />
        )}

        {/* ====================================================
            PAGE CONTENT
        ===================================================== */}

        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>

      </div>

    </div>
  );
}