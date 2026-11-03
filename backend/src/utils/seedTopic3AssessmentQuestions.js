const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("../config/db");
const Topic = require("../models/Topic");
const EngagementQuestion = require("../models/EngagementQuestion");

// =====================================================
// TOPIC 3: OPERATORS
// 30 Questions | 100 Marks
// Basic: 10 × 3 = 30
// Medium: 10 × 3 = 30
// Advanced: 10 × 4 = 40
// =====================================================

const questions = [
  // =====================================================
  // BASIC - 10 × 3 = 30
  // =====================================================

  {
    question: "Which operator is used for addition in Java?",
    options: ["+", "-", "*", "/"],
    correctAnswer: "+",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which operator is used for subtraction in Java?",
    options: ["+", "-", "*", "%"],
    correctAnswer: "-",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which operator is used for multiplication in Java?",
    options: ["+", "*", "/", "%"],
    correctAnswer: "*",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which operator is used for division in Java?",
    options: ["/", "\\", "%", "//"],
    correctAnswer: "/",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which operator returns the remainder after division?",
    options: ["/", "%", "//", "&"],
    correctAnswer: "%",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which operator is used to compare two values for equality?",
    options: ["=", "==", "!=", "==="],
    correctAnswer: "==",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which operator is used to assign a value to a variable?",
    options: ["==", "=", ":=", "=>"],
    correctAnswer: "=",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which operator represents logical AND in Java?",
    options: ["&", "&&", "||", "!"],
    correctAnswer: "&&",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which operator represents logical OR in Java?",
    options: ["|", "&&", "||", "!"],
    correctAnswer: "||",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which operator is used for logical NOT?",
    options: ["!", "not", "~", "!="],
    correctAnswer: "!",
    marks: 3,
    difficulty: "basic",
  },

  // =====================================================
  // MEDIUM - 10 × 3 = 30
  // =====================================================

  {
    question: "What is the result of 10 % 3 in Java?",
    options: ["1", "2", "3", "0"],
    correctAnswer: "1",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output of the following code?\n\nint x = 10;\nint y = 3;\nSystem.out.println(x / y);",
    options: ["3", "3.33", "4", "1"],
    correctAnswer: "3",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output of the following code?\n\nint x = 5;\nSystem.out.println(x++);",
    options: ["4", "5", "6", "Compilation error"],
    correctAnswer: "5",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output of the following code?\n\nint x = 5;\nSystem.out.println(++x);",
    options: ["4", "5", "6", "Compilation error"],
    correctAnswer: "6",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output of the following code?\n\nint x = 5;\nSystem.out.println(x--);",
    options: ["4", "5", "6", "Compilation error"],
    correctAnswer: "5",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output of the following code?\n\nint x = 5;\nSystem.out.println(--x);",
    options: ["4", "5", "6", "Compilation error"],
    correctAnswer: "4",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which operator is known as the ternary operator in Java?",
    options: ["::", "?:", "??", "->"],
    correctAnswer: "?:",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output of the following expression?\n\nint x = 10;\nSystem.out.println(x > 5 && x < 20);",
    options: ["true", "false", "10", "Compilation error"],
    correctAnswer: "true",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output of the following expression?\n\nint x = 10;\nSystem.out.println(x < 5 || x == 10);",
    options: ["true", "false", "10", "Compilation error"],
    correctAnswer: "true",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output of the following code?\n\nint x = 10;\nx += 5;\nSystem.out.println(x);",
    options: ["5", "10", "15", "50"],
    correctAnswer: "15",
    marks: 3,
    difficulty: "medium",
  },

  // =====================================================
  // ADVANCED - 10 × 4 = 40
  // =====================================================

  {
    question: "What is the output of the following code?\n\nint a = 5;\nint b = 10;\nint c = a++ + ++b;\nSystem.out.println(c);",
    options: ["15", "16", "17", "14"],
    correctAnswer: "16",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output of the following code?\n\nint a = 10;\nint b = 20;\nSystem.out.println(a++ + ++b);",
    options: ["30", "31", "32", "29"],
    correctAnswer: "31",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output of the following code?\n\nint x = 10;\nint y = 5;\nSystem.out.println(x > y ? x : y);",
    options: ["5", "10", "true", "false"],
    correctAnswer: "10",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output of the following code?\n\nint x = 10;\nSystem.out.println(x > 5 && x++ > 10);\nSystem.out.println(x);",
    options: [
      "false and 10",
      "false and 11",
      "true and 11",
      "true and 10"
    ],
    correctAnswer: "false and 10",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output of the following code?\n\nint x = 5;\nint y = 10;\nSystem.out.println(x < 10 || y++ > 10);\nSystem.out.println(y);",
    options: [
      "true and 10",
      "true and 11",
      "false and 10",
      "false and 11"
    ],
    correctAnswer: "true and 10",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the result of the following expression?\n\nint x = 5;\nint y = 2;\nSystem.out.println(x & y);",
    options: ["0", "1", "2", "7"],
    correctAnswer: "0",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the result of the following expression?\n\nint x = 5;\nint y = 3;\nSystem.out.println(x | y);",
    options: ["1", "6", "7", "8"],
    correctAnswer: "7",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the result of the following expression?\n\nint x = 5;\nSystem.out.println(x << 1);",
    options: ["5", "6", "10", "20"],
    correctAnswer: "10",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the result of the following expression?\n\nint x = 16;\nSystem.out.println(x >> 2);",
    options: ["2", "4", "8", "32"],
    correctAnswer: "4",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output of the following code?\n\nint a = 10;\nint b = 20;\nint c = 30;\nSystem.out.println(a < b && b < c);",
    options: ["true", "false", "30", "Compilation error"],
    correctAnswer: "true",
    marks: 4,
    difficulty: "advanced",
  },
];

// =====================================================
// SEED FUNCTION
// =====================================================

const seedQuestions = async () => {
  try {
    await connectDB();

    console.log("\n========================================");
    console.log("Topic 3 Assessment Question Seeding");
    console.log("========================================\n");

    // Find Topic 3
    const topic = await Topic.findOne({
      title: "Operators",
      subject: "Java",
    });

    if (!topic) {
      console.log("❌ Topic 'Operators' not found.");
      console.log("Please make sure Topic 3 exists in MongoDB.");
      process.exit(1);
    }

    console.log(`✅ Topic found: ${topic.title}`);
    console.log(`Topic ID: ${topic._id}\n`);

    // Check existing questions
    const existingCount = await EngagementQuestion.countDocuments({
      topicId: topic._id,
    });

    if (existingCount > 0) {
      console.log(
        `⚠️ This topic already has ${existingCount} question(s).`
      );
      console.log("No new questions were inserted.");
      process.exit(0);
    }

    // Validate question count
    if (questions.length !== 30) {
      console.log(
        `❌ Expected 30 questions, but found ${questions.length}.`
      );
      process.exit(1);
    }

    // Add topicId and isActive
    const questionsWithTopic = questions.map((question) => ({
      ...question,
      topicId: topic._id,
      isActive: true,
    }));

    // Validate difficulty distribution
    const basicCount = questions.filter(
      (q) => q.difficulty === "basic"
    ).length;

    const mediumCount = questions.filter(
      (q) => q.difficulty === "medium"
    ).length;

    const advancedCount = questions.filter(
      (q) => q.difficulty === "advanced"
    ).length;

    console.log("Question Distribution:");
    console.log(`Basic: ${basicCount}`);
    console.log(`Medium: ${mediumCount}`);
    console.log(`Advanced: ${advancedCount}\n`);

    if (
      basicCount !== 10 ||
      mediumCount !== 10 ||
      advancedCount !== 10
    ) {
      console.log("❌ Difficulty distribution is incorrect.");
      process.exit(1);
    }

    // Calculate total marks
    const totalMarks = questions.reduce(
      (total, question) => total + question.marks,
      0
    );

    console.log(`Total Marks: ${totalMarks}`);

    if (totalMarks !== 100) {
      console.log("❌ Total marks must be exactly 100.");
      process.exit(1);
    }

    // Insert questions
    await EngagementQuestion.insertMany(questionsWithTopic);

    console.log("\n========================================");
    console.log("✅ SUCCESS");
    console.log("========================================");
    console.log("Topic: Operators");
    console.log("Questions inserted: 30");
    console.log("Basic: 10 × 3 = 30 marks");
    console.log("Medium: 10 × 3 = 30 marks");
    console.log("Advanced: 10 × 4 = 40 marks");
    console.log("Total: 100 marks");
    console.log("========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error while seeding questions:");
    console.error(error.message);
    process.exit(1);
  }
};

seedQuestions();