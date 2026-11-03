const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("../config/db");
const Topic = require("../models/Topic");
const EngagementQuestion = require("../models/EngagementQuestion");

// =====================================================
// TOPIC 5: LOOPS
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
    question: "Which loop is commonly used when the number of iterations is known?",
    options: ["for", "while", "do-while", "switch"],
    correctAnswer: "for",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which loop checks its condition before executing the loop body?",
    options: ["while", "do-while", "switch", "foreach"],
    correctAnswer: "while",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which loop executes its body at least once even if the condition is false initially?",
    options: ["for", "while", "do-while", "if"],
    correctAnswer: "do-while",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which keyword is used to immediately terminate a loop?",
    options: ["stop", "exit", "break", "continue"],
    correctAnswer: "break",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which keyword skips the current iteration and proceeds to the next iteration?",
    options: ["skip", "break", "continue", "next"],
    correctAnswer: "continue",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which part of a for loop is executed after every iteration?",
    options: ["Initialization", "Condition", "Update", "Declaration"],
    correctAnswer: "Update",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "How many times will this loop execute?\n\nfor (int i = 0; i < 5; i++) {\n    System.out.println(i);\n}",
    options: ["4", "5", "6", "Infinite"],
    correctAnswer: "5",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which keyword is used to create an enhanced for loop?",
    options: ["foreach", "for", "loop", "iterate"],
    correctAnswer: "for",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "What is the initial value of i in this loop?\n\nfor (int i = 1; i <= 5; i++)",
    options: ["0", "1", "5", "6"],
    correctAnswer: "1",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which loop is best suited for repeatedly executing statements while a condition remains true?",
    options: ["while", "switch", "if", "try"],
    correctAnswer: "while",
    marks: 3,
    difficulty: "basic",
  },

  // =====================================================
  // MEDIUM - 10 × 3 = 30
  // =====================================================

  {
    question: "What is the output?\n\nfor (int i = 1; i <= 3; i++) {\n    System.out.print(i + \" \");\n}",
    options: ["1 2 3", "0 1 2", "1 2", "0 1 2 3"],
    correctAnswer: "1 2 3",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output?\n\nint i = 1;\nwhile (i <= 3) {\n    System.out.print(i + \" \");\n    i++;\n}",
    options: ["1 2 3", "0 1 2", "1 2", "Infinite loop"],
    correctAnswer: "1 2 3",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output?\n\nint i = 5;\ndo {\n    System.out.println(i);\n    i++;\n} while (i < 5);",
    options: ["Nothing", "5", "5 6", "Infinite loop"],
    correctAnswer: "5",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output?\n\nfor (int i = 0; i < 5; i++) {\n    if (i == 2)\n        break;\n    System.out.print(i + \" \");\n}",
    options: ["0 1", "0 1 2", "2 3 4", "0 1 2 3 4"],
    correctAnswer: "0 1",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output?\n\nfor (int i = 0; i < 5; i++) {\n    if (i == 2)\n        continue;\n    System.out.print(i + \" \");\n}",
    options: ["0 1 2 3 4", "0 1 3 4", "2", "0 1"],
    correctAnswer: "0 1 3 4",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "How many times does the following loop execute?\n\nfor (int i = 0; i < 10; i += 2) {\n    System.out.println(i);\n}",
    options: ["4", "5", "6", "10"],
    correctAnswer: "5",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output?\n\nfor (int i = 5; i > 0; i--) {\n    System.out.print(i + \" \");\n}",
    options: ["0 1 2 3 4", "5 4 3 2 1", "5 4 3 2", "1 2 3 4 5"],
    correctAnswer: "5 4 3 2 1",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which statement about a while loop is correct?",
    options: [
      "It always executes at least once",
      "Its condition is checked before each iteration",
      "It can never become infinite",
      "It does not require a condition"
    ],
    correctAnswer: "Its condition is checked before each iteration",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output?\n\nfor (int i = 1; i <= 3; i++) {\n    for (int j = 1; j <= 2; j++) {\n        System.out.print(\"* \");\n    }\n}",
    options: [
      "* *",
      "* * * *",
      "* * * * * *",
      "No output"
    ],
    correctAnswer: "* * * * * *",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which part of a for loop can be omitted while still keeping a valid for-loop structure?",
    options: [
      "Only initialization",
      "Only condition",
      "Only update",
      "Any of initialization, condition, and update"
    ],
    correctAnswer: "Any of initialization, condition, and update",
    marks: 3,
    difficulty: "medium",
  },

  // =====================================================
  // ADVANCED - 10 × 4 = 40
  // =====================================================

  {
    question: "What is the output?\n\nfor (int i = 1; i <= 3; i++) {\n    for (int j = 1; j <= 2; j++) {\n        System.out.print(i + \"\" + j + \" \");\n    }\n}",
    options: [
      "11 12 21 22 31 32",
      "11 21 12 22 31 32",
      "12 11 22 21 32 31",
      "11 12 13 21 22 23"
    ],
    correctAnswer: "11 12 21 22 31 32",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nint count = 0;\nfor (int i = 1; i <= 5; i++) {\n    if (i % 2 == 0)\n        continue;\n    count++;\n}\nSystem.out.println(count);",
    options: ["2", "3", "4", "5"],
    correctAnswer: "3",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nint sum = 0;\nfor (int i = 1; i <= 5; i++) {\n    if (i == 4)\n        break;\n    sum += i;\n}\nSystem.out.println(sum);",
    options: ["6", "10", "15", "4"],
    correctAnswer: "6",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nint i = 0;\nwhile (i < 5) {\n    i++;\n    if (i == 3)\n        continue;\n    System.out.print(i + \" \");\n}",
    options: ["1 2 4 5", "0 1 2 4", "1 2 3 4 5", "1 2"],
    correctAnswer: "1 2 4 5",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nint result = 0;\nfor (int i = 1; i <= 3; i++) {\n    for (int j = 1; j <= 3; j++) {\n        result++;\n    }\n}\nSystem.out.println(result);",
    options: ["3", "6", "9", "12"],
    correctAnswer: "9",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nfor (int i = 1; i <= 3; i++) {\n    System.out.print(i + \" \");\n    if (i == 2)\n        break;\n}\nSystem.out.print(\"End\");",
    options: [
      "1 2 End",
      "1 2 3 End",
      "1 End",
      "End"
    ],
    correctAnswer: "1 2 End",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nint i = 1;\nwhile (i <= 3) {\n    System.out.print(i + \" \");\n    i += 2;\n}",
    options: ["1 2 3", "1 3", "2 3", "1 2"],
    correctAnswer: "1 3",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nfor (int i = 1; i <= 3; i++) {\n    for (int j = 1; j <= i; j++) {\n        System.out.print(\"* \");\n    }\n}",
    options: [
      "* * *",
      "* * * * * *",
      "* * * * *",
      "* *"
    ],
    correctAnswer: "* * * * * *",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "How many times will the following statement execute?\n\nfor (int i = 1; i <= 4; i++) {\n    for (int j = 1; j <= 3; j++) {\n        System.out.println(\"Hello\");\n    }\n}",
    options: ["4", "7", "12", "16"],
    correctAnswer: "12",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nfor (int i = 0; i < 5; i++) {\n    if (i % 2 == 0)\n        continue;\n    System.out.print(i + \" \");\n}",
    options: ["0 2 4", "1 3", "0 1 2 3 4", "2 4"],
    correctAnswer: "1 3",
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
    console.log("Topic 5 Assessment Question Seeding");
    console.log("========================================\n");

    const topic = await Topic.findOne({
      title: "Loops",
      subject: "Java",
    });

    if (!topic) {
      console.log("❌ Topic 'Loops' not found.");
      console.log("Please make sure Topic 5 exists in MongoDB.");
      process.exit(1);
    }

    console.log(`✅ Topic found: ${topic.title}`);
    console.log(`Topic ID: ${topic._id}\n`);

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

    if (questions.length !== 30) {
      console.log(
        `❌ Expected 30 questions, but found ${questions.length}.`
      );
      process.exit(1);
    }

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

    const totalMarks = questions.reduce(
      (total, question) => total + question.marks,
      0
    );

    console.log(`Total Marks: ${totalMarks}`);

    if (totalMarks !== 100) {
      console.log("❌ Total marks must be exactly 100.");
      process.exit(1);
    }

    const questionsWithTopic = questions.map((question) => ({
      ...question,
      topicId: topic._id,
      isActive: true,
    }));

    await EngagementQuestion.insertMany(questionsWithTopic);

    console.log("\n========================================");
    console.log("✅ SUCCESS");
    console.log("========================================");
    console.log("Topic: Loops");
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