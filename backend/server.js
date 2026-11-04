
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const teacherDashboardRoutes = require("./src/routes/teacherDashboardRoutes");
const prerequisiteRoutes = require("./src/routes/prerequisiteRoutes");
const studentProgressRoutes = require("./src/routes/studentProgressRoutes");
const topicRoutes = require("./src/routes/topicRoutes");
const learningResourceRoutes = require("./src/routes/learningResourceRoutes");
const engagementQuestionRoutes = require("./src/routes/engagementQuestionRoutes");
const engagementAttemptRoutes = require("./src/routes/engagementAttemptRoutes");
const evaluationAnalysisRoutes = require("./src/routes/evaluationAnalysisRoutes");
const learningRecommendationRoutes = require("./src/routes/learningRecommendationRoutes");
const personalizedContentRoutes = require("./src/routes/personalizedContentRoutes");
const practiceQuestionRoutes = require("./src/routes/practiceQuestionRoutes");
const practiceAttemptRoutes = require("./src/routes/practiceAttemptRoutes");
const finalEvaluationQuestionRoutes = require("./src/routes/finalEvaluationQuestionRoutes");
const finalEvaluationAttemptRoutes = require("./src/routes/finalEvaluationAttemptRoutes");
const performanceComparisonRoutes = require("./src/routes/performanceComparisonRoutes");
const teacherReportRoutes = require("./src/routes/teacherReportRoutes");
const teacherStudentProgressRoutes = require("./src/routes/teacherStudentProgressRoutes");
const earlyAlertRoutes = require("./src/routes/earlyAlertRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");
const javaCompilerRoutes = require("./src/routes/javaCompilerRoutes");

const app = express();

// Middleware
// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Authentication and dashboards
app.use("/api/auth", authRoutes);
app.use("/api/teacher", teacherDashboardRoutes);

// Student learning
app.use("/api/prerequisites", prerequisiteRoutes);
app.use("/api/progress", studentProgressRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/resources", learningResourceRoutes);

// Quizzes and learning analysis
app.use("/api/engagement-questions", engagementQuestionRoutes);
app.use("/api/engagement-evaluation", engagementAttemptRoutes);
app.use("/api/evaluation-analysis", evaluationAnalysisRoutes);
app.use("/api/learning-recommendations", learningRecommendationRoutes);
app.use("/api/personalized-content", personalizedContentRoutes);

// Practice assessments
app.use("/api/practice-questions", practiceQuestionRoutes);
app.use("/api/practice-attempts", practiceAttemptRoutes);

// Final evaluation
app.use("/api/final-evaluation-questions", finalEvaluationQuestionRoutes);
app.use("/api/final-evaluation-attempts", finalEvaluationAttemptRoutes);
app.use("/api/final-evaluation", finalEvaluationAttemptRoutes);

// Teacher reports and monitoring
app.use("/api/performance-comparisons", performanceComparisonRoutes);
app.use("/api/teacher-reports", teacherReportRoutes);
app.use("/api/teacher-progress", teacherStudentProgressRoutes);
app.use("/api/early-alerts", earlyAlertRoutes);
app.use("/api/notifications", notificationRoutes);

// Java compiler
app.use("/api/java-compiler", javaCompilerRoutes);

// Backend health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Edu Path AI Backend is running",
  });
});

// Start server
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
