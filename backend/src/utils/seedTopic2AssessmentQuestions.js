const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("../config/db");
const Topic = require("../models/Topic");
const EngagementQuestion = require("../models/EngagementQuestion");

// =====================================================
// TOPIC 2: VARIABLES & DATA TYPES
// 30 Questions | 100 Marks
// Basic: 10 × 3 = 30
// Medium: 10 × 3 = 30
// Advanced: 10 × 4 = 40
// =====================================================

const questions = [
  // =====================================================
  // BASIC QUESTIONS - 10 × 3 = 30
  // =====================================================

  {
    question: "Which keyword is used to declare a variable in Java?",
    options: ["var", "let", "variable", "No specific keyword"],
    correctAnswer: "No specific keyword",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which of the following is a valid declaration of an integer variable in Java?",
    options: [
      "int number;",
      "integer number;",
      "number int;",
      "Int number;"
    ],
    correctAnswer: "int number;",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which data type is used to store a single character in Java?",
    options: ["String", "char", "character", "Character[]"],
    correctAnswer: "char",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which data type is used to store true or false values in Java?",
    options: ["boolean", "bool", "bit", "logical"],
    correctAnswer: "boolean",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "What is the size of the int data type in Java?",
    options: ["2 bytes", "4 bytes", "8 bytes", "Depends on system"],
    correctAnswer: "4 bytes",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which data type is used to store decimal values with single precision?",
    options: ["double", "float", "decimal", "real"],
    correctAnswer: "float",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which of the following is a reference data type in Java?",
    options: ["int", "double", "boolean", "String"],
    correctAnswer: "String",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which value represents a boolean true value in Java?",
    options: ["1", "true", "'true'", "\"true\""],
    correctAnswer: "true",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which data type can store the largest range of decimal values among these?",
    options: ["float", "double", "int", "short"],
    correctAnswer: "double",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which keyword is used to make a variable constant in Java?",
    options: ["constant", "const", "final", "static"],
    correctAnswer: "final",
    marks: 3,
    difficulty: "basic",
  },

  // =====================================================
  // MEDIUM QUESTIONS - 10 × 3 = 30
  // =====================================================

  {
    question: "What is the default value of an instance variable of type int in Java?",
    options: ["0", "null", "1", "Undefined"],
    correctAnswer: "0",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the default value of an instance variable of type boolean?",
    options: ["true", "false", "0", "null"],
    correctAnswer: "false",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which conversion is automatically performed when converting an int to a long?",
    options: [
      "Narrowing conversion",
      "Widening conversion",
      "Explicit conversion",
      "String conversion"
    ],
    correctAnswer: "Widening conversion",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which type casting is required when converting a double value to an int?",
    options: [
      "No casting is required",
      "Implicit casting",
      "Explicit casting",
      "Reference casting"
    ],
    correctAnswer: "Explicit casting",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output of the following code?\n\nint x = 10;\ndouble y = x;\nSystem.out.println(y);",
    options: ["10", "10.0", "Compilation error", "10.00"],
    correctAnswer: "10.0",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output of the following code?\n\ndouble x = 10.8;\nint y = (int) x;\nSystem.out.println(y);",
    options: ["10", "10.8", "11", "Compilation error"],
    correctAnswer: "10",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which data type should generally be used for storing monetary values when exact decimal precision is required in Java applications?",
    options: ["float", "double", "BigDecimal", "int"],
    correctAnswer: "BigDecimal",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What happens when a local variable is declared but not initialized before it is used?",
    options: [
      "It gets a default value of 0",
      "It gets a default value of null",
      "Compilation error occurs",
      "It gets a random value"
    ],
    correctAnswer: "Compilation error occurs",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which of the following declarations correctly initializes a float variable?",
    options: [
      "float value = 10.5;",
      "float value = 10.5f;",
      "float value = 10;",
      "Both B and C"
    ],
    correctAnswer: "Both B and C",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the result of the following expression?\n\nbyte a = 10;\nbyte b = 20;\nint c = a + b;",
    options: ["10", "20", "30", "Compilation error"],
    correctAnswer: "30",
    marks: 3,
    difficulty: "medium",
  },

  // =====================================================
  // ADVANCED QUESTIONS - 10 × 4 = 40
  // =====================================================

  {
    question: "What is the output of the following code?\n\nbyte a = 10;\na = (byte) (a + 20);\nSystem.out.println(a);",
    options: ["10", "20", "30", "Compilation error"],
    correctAnswer: "30",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output of the following code?\n\nint x = 100;\nlong y = x;\nfloat z = y;\nSystem.out.println(z);",
    options: ["100", "100.0", "Compilation error", "100.00"],
    correctAnswer: "100.0",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output of the following code?\n\nint x = 5;\ndouble y = 2;\nSystem.out.println(x / y);",
    options: ["2", "2.0", "2.5", "Compilation error"],
    correctAnswer: "2.5",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output of the following code?\n\nint x = 10;\nSystem.out.println(x / 4);",
    options: ["2", "2.5", "3", "Compilation error"],
    correctAnswer: "2",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output of the following code?\n\nchar ch = 'A';\nint value = ch;\nSystem.out.println(value);",
    options: ["A", "65", "66", "Compilation error"],
    correctAnswer: "65",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output of the following code?\n\nint x = 65;\nchar ch = (char) x;\nSystem.out.println(ch);",
    options: ["65", "A", "a", "Compilation error"],
    correctAnswer: "A",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output of the following code?\n\nfinal int x = 10;\nx = 20;\nSystem.out.println(x);",
    options: ["10", "20", "Compilation error", "Runtime error"],
    correctAnswer: "Compilation error",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output of the following code?\n\nInteger a = 100;\nInteger b = 100;\nSystem.out.println(a == b);",
    options: ["true", "false", "Compilation error", "Runtime error"],
    correctAnswer: "true",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output of the following code?\n\nInteger a = 200;\nInteger b = 200;\nSystem.out.println(a == b);",
    options: ["true", "false", "Compilation error", "Runtime error"],
    correctAnswer: "false",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the result of the following code?\n\nint x = 10;\nlong y = 20L;\nint z = x + (int)y;\nSystem.out.println(z);",
    options: ["20", "30", "30L", "Compilation error"],
    correctAnswer: "30",
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
    console.log("Topic 2 Assessment Question Seeding");
    console.log("========================================\n");

    // Find Topic 2
    const topic = await Topic.findOne({
      title: "Variables & Data Types",
      subject: "Java",
    });

    if (!topic) {
      console.log("❌ Topic 'Variables & Data Types' not found.");
      console.log("Please make sure Topic 2 exists in MongoDB.");
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

    // Add topicId to every question
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
    console.log("Topic: Variables & Data Types");
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