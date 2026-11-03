const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("../config/db");
const Topic = require("../models/Topic");
const EngagementQuestion = require("../models/EngagementQuestion");

// =====================================================
// TOPIC 4: CONDITIONAL STATEMENTS
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
    question: "Which statement is used to execute a block of code when a condition is true?",
    options: ["if", "for", "switch", "while"],
    correctAnswer: "if",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which statement is used to execute one block when a condition is true and another block when it is false?",
    options: ["if-else", "for", "switch", "while"],
    correctAnswer: "if-else",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which keyword is used to test another condition after an if statement?",
    options: ["else if", "elseif", "elif", "otherwise"],
    correctAnswer: "else if",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which statement is useful when one expression needs to be compared against multiple constant values?",
    options: ["switch", "while", "for", "try"],
    correctAnswer: "switch",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which keyword is commonly used to stop execution of a switch case?",
    options: ["stop", "exit", "break", "continue"],
    correctAnswer: "break",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which keyword is used when no switch case matches the expression?",
    options: ["otherwise", "default", "else", "none"],
    correctAnswer: "default",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "What type of expression must an if statement evaluate?",
    options: ["boolean", "String", "int only", "double only"],
    correctAnswer: "boolean",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which operator can be used to create a simple conditional expression?",
    options: ["?:", "::", "->", "=>"],
    correctAnswer: "?:",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which keyword provides an alternative block when an if condition is false?",
    options: ["else", "otherwise", "default", "alternative"],
    correctAnswer: "else",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "How many else blocks can be directly associated with a single if statement?",
    options: ["One", "Two", "Any number", "Zero or more"],
    correctAnswer: "One",
    marks: 3,
    difficulty: "basic",
  },

  // =====================================================
  // MEDIUM - 10 × 3 = 30
  // =====================================================

  {
    question: "What is the output?\n\nint x = 10;\nif (x > 5) {\n    System.out.println(\"Yes\");\n} else {\n    System.out.println(\"No\");\n}",
    options: ["Yes", "No", "Nothing", "Compilation error"],
    correctAnswer: "Yes",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output?\n\nint x = 3;\nif (x > 5) {\n    System.out.println(\"A\");\n} else {\n    System.out.println(\"B\");\n}",
    options: ["A", "B", "A B", "Compilation error"],
    correctAnswer: "B",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output?\n\nint marks = 75;\nif (marks >= 80) {\n    System.out.println(\"A\");\n} else if (marks >= 60) {\n    System.out.println(\"B\");\n} else {\n    System.out.println(\"C\");\n}",
    options: ["A", "B", "C", "Compilation error"],
    correctAnswer: "B",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output?\n\nint day = 2;\nswitch (day) {\n    case 1:\n        System.out.println(\"Monday\");\n        break;\n    case 2:\n        System.out.println(\"Tuesday\");\n        break;\n    default:\n        System.out.println(\"Other\");\n}",
    options: ["Monday", "Tuesday", "Other", "Nothing"],
    correctAnswer: "Tuesday",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What happens if a break statement is omitted from a matching switch case?",
    options: [
      "The program always stops",
      "Execution can continue into subsequent cases",
      "The switch is ignored",
      "Compilation always fails"
    ],
    correctAnswer: "Execution can continue into subsequent cases",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output?\n\nint x = 10;\nString result = x > 5 ? \"Greater\" : \"Smaller\";\nSystem.out.println(result);",
    options: ["Greater", "Smaller", "true", "Compilation error"],
    correctAnswer: "Greater",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which of the following is a valid condition in Java?",
    options: [
      "if (x > 10)",
      "if x > 10",
      "if [x > 10]",
      "if {x > 10}"
    ],
    correctAnswer: "if (x > 10)",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output?\n\nboolean flag = false;\nif (flag) {\n    System.out.println(\"True\");\n} else {\n    System.out.println(\"False\");\n}",
    options: ["True", "False", "Nothing", "Compilation error"],
    correctAnswer: "False",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which statement is most appropriate for checking a value against several fixed integer choices?",
    options: ["switch", "while", "do-while", "try"],
    correctAnswer: "switch",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output?\n\nint x = 15;\nif (x > 10)\n    if (x > 20)\n        System.out.println(\"A\");\n    else\n        System.out.println(\"B\");",
    options: ["A", "B", "Nothing", "Compilation error"],
    correctAnswer: "B",
    marks: 3,
    difficulty: "medium",
  },

  // =====================================================
  // ADVANCED - 10 × 4 = 40
  // =====================================================

  {
    question: "What is the output?\n\nint x = 10;\nif (x > 5)\n    if (x < 15)\n        System.out.println(\"Valid\");\n    else\n        System.out.println(\"Invalid\");",
    options: ["Valid", "Invalid", "Nothing", "Compilation error"],
    correctAnswer: "Valid",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nint x = 5;\nif (x > 0 && x < 10)\n    System.out.println(\"Inside\");\nelse\n    System.out.println(\"Outside\");",
    options: ["Inside", "Outside", "Nothing", "Compilation error"],
    correctAnswer: "Inside",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nint x = 10;\nif (x > 5 || x++ > 20)\n    System.out.println(x);\nelse\n    System.out.println(x);",
    options: ["10", "11", "20", "Compilation error"],
    correctAnswer: "10",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nint x = 10;\nif (x < 5 && x++ > 2)\n    System.out.println(\"Yes\");\nSystem.out.println(x);",
    options: ["Yes and 11", "No output and 10", "Yes and 10", "Compilation error"],
    correctAnswer: "No output and 10",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nint value = 2;\nswitch (value) {\n    case 1:\n        System.out.println(\"One\");\n    case 2:\n        System.out.println(\"Two\");\n    case 3:\n        System.out.println(\"Three\");\n        break;\n    default:\n        System.out.println(\"Other\");\n}",
    options: [
      "Two",
      "Two Three",
      "One Two Three",
      "Other"
    ],
    correctAnswer: "Two Three",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nint x = 20;\nString result = x > 10 ? x > 15 ? \"A\" : \"B\" : \"C\";\nSystem.out.println(result);",
    options: ["A", "B", "C", "Compilation error"],
    correctAnswer: "A",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nint x = 0;\nif (x == 0)\n    System.out.println(\"Zero\");\nelse if (x > 0)\n    System.out.println(\"Positive\");\nelse\n    System.out.println(\"Negative\");",
    options: ["Zero", "Positive", "Negative", "Nothing"],
    correctAnswer: "Zero",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "Which feature allows multiple case labels to execute the same block in a switch statement?",
    options: [
      "Using multiple case labels before the same statements",
      "Using multiple default statements",
      "Using multiple switch statements",
      "Using multiple break statements"
    ],
    correctAnswer: "Using multiple case labels before the same statements",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nint x = 5;\nif (x > 0) {\n    if (x > 10)\n        System.out.println(\"A\");\n    else\n        System.out.println(\"B\");\n} else {\n    System.out.println(\"C\");\n}",
    options: ["A", "B", "C", "Nothing"],
    correctAnswer: "B",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nint x = 10;\nint y = 20;\nif (x > y)\n    System.out.println(\"X\");\nelse if (x == y)\n    System.out.println(\"Equal\");\nelse\n    System.out.println(\"Y\");",
    options: ["X", "Y", "Equal", "Nothing"],
    correctAnswer: "Y",
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
    console.log("Topic 4 Assessment Question Seeding");
    console.log("========================================\n");

    // Find Topic 4
    const topic = await Topic.findOne({
      title: "Conditional Statements",
      subject: "Java",
    });

    if (!topic) {
      console.log("❌ Topic 'Conditional Statements' not found.");
      console.log("Please make sure Topic 4 exists in MongoDB.");
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

    // Validate total questions
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
    console.log("Topic: Conditional Statements");
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