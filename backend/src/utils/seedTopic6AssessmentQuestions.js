const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("../config/db");
const Topic = require("../models/Topic");
const EngagementQuestion = require("../models/EngagementQuestion");

// =====================================================
// TOPIC 6: ARRAYS
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
    question: "Which of the following is a correct declaration of an integer array in Java?",
    options: [
      "int[] arr;",
      "array int arr;",
      "int arr();",
      "integer[] arr;"
    ],
    correctAnswer: "int[] arr;",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "What is the index of the first element in a Java array?",
    options: ["0", "1", "-1", "Depends on the array"],
    correctAnswer: "0",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which property is used to find the number of elements in a Java array?",
    options: ["size", "length", "count", "length()"],
    correctAnswer: "length",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which statement correctly creates an integer array containing 5 elements?",
    options: [
      "int[] arr = new int[5];",
      "int arr = new int(5);",
      "int[] arr = int[5];",
      "array arr = new int[5];"
    ],
    correctAnswer: "int[] arr = new int[5];",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "What is the default value of elements in an int array?",
    options: ["0", "1", "null", "Undefined"],
    correctAnswer: "0",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which exception occurs when an invalid array index is accessed?",
    options: [
      "NullPointerException",
      "ArrayIndexOutOfBoundsException",
      "IndexException",
      "InvalidArrayException"
    ],
    correctAnswer: "ArrayIndexOutOfBoundsException",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which of the following correctly initializes an array?",
    options: [
      "int[] arr = {1, 2, 3};",
      "int arr = {1, 2, 3};",
      "array arr = [1, 2, 3];",
      "int[] arr = (1, 2, 3);"
    ],
    correctAnswer: "int[] arr = {1, 2, 3};",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "How many elements are present in int[] arr = new int[10]?",
    options: ["9", "10", "11", "Depends on values"],
    correctAnswer: "10",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which index accesses the third element of an array?",
    options: ["1", "2", "3", "4"],
    correctAnswer: "2",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Can a Java array store primitive data types?",
    options: [
      "Yes",
      "No",
      "Only int",
      "Only char"
    ],
    correctAnswer: "Yes",
    marks: 3,
    difficulty: "basic",
  },

  // =====================================================
  // MEDIUM - 10 × 3 = 30
  // =====================================================

  {
    question: "What is the output?\n\nint[] arr = {10, 20, 30};\nSystem.out.println(arr[1]);",
    options: ["10", "20", "30", "1"],
    correctAnswer: "20",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output?\n\nint[] arr = {5, 10, 15, 20};\nSystem.out.println(arr.length);",
    options: ["3", "4", "5", "20"],
    correctAnswer: "4",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output?\n\nint[] arr = new int[3];\nSystem.out.println(arr[0]);",
    options: ["0", "1", "null", "Compilation error"],
    correctAnswer: "0",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output?\n\nint[] arr = {1, 2, 3, 4};\narr[2] = 10;\nSystem.out.println(arr[2]);",
    options: ["2", "3", "4", "10"],
    correctAnswer: "10",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which loop is commonly used to traverse every element of an array?",
    options: ["for loop", "switch", "try-catch", "if statement"],
    correctAnswer: "for loop",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output?\n\nint[] arr = {2, 4, 6};\nfor (int i = 0; i < arr.length; i++) {\n    System.out.print(arr[i] + \" \");\n}",
    options: [
      "0 1 2",
      "2 4 6",
      "2 4",
      "4 6"
    ],
    correctAnswer: "2 4 6",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What happens when arr[arr.length] is accessed?",
    options: [
      "First element is returned",
      "Last element is returned",
      "ArrayIndexOutOfBoundsException occurs",
      "null is returned"
    ],
    correctAnswer: "ArrayIndexOutOfBoundsException occurs",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output?\n\nint[] arr = {1, 2, 3};\nint sum = 0;\nfor (int value : arr) {\n    sum += value;\n}\nSystem.out.println(sum);",
    options: ["3", "5", "6", "7"],
    correctAnswer: "6",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which statement creates a two-dimensional integer array with 3 rows and 4 columns?",
    options: [
      "int[][] arr = new int[3][4];",
      "int[] arr = new int[3][4];",
      "int[][] arr = new int[4][3];",
      "int arr[][] = new int[3];"
    ],
    correctAnswer: "int[][] arr = new int[3][4];",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output?\n\nint[][] arr = {{1, 2}, {3, 4}};\nSystem.out.println(arr[1][0]);",
    options: ["1", "2", "3", "4"],
    correctAnswer: "3",
    marks: 3,
    difficulty: "medium",
  },

  // =====================================================
  // ADVANCED - 10 × 4 = 40
  // =====================================================

  {
    question: "What is the output?\n\nint[] arr = {1, 2, 3, 4, 5};\nfor (int i = arr.length - 1; i >= 0; i--) {\n    System.out.print(arr[i] + \" \");\n}",
    options: [
      "1 2 3 4 5",
      "5 4 3 2 1",
      "4 3 2 1",
      "5 4 3 2"
    ],
    correctAnswer: "5 4 3 2 1",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nint[] arr = {10, 20, 30, 40};\nint sum = 0;\nfor (int i = 0; i < arr.length; i += 2) {\n    sum += arr[i];\n}\nSystem.out.println(sum);",
    options: ["30", "40", "60", "100"],
    correctAnswer: "40",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nint[] arr = {5, 3, 8, 1};\nint max = arr[0];\nfor (int i = 1; i < arr.length; i++) {\n    if (arr[i] > max)\n        max = arr[i];\n}\nSystem.out.println(max);",
    options: ["1", "3", "5", "8"],
    correctAnswer: "8",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nint[] arr = {1, 2, 3, 4, 5};\nint count = 0;\nfor (int x : arr) {\n    if (x % 2 == 0)\n        count++;\n}\nSystem.out.println(count);",
    options: ["1", "2", "3", "5"],
    correctAnswer: "2",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nint[][] arr = {{1, 2}, {3, 4}, {5, 6}};\nSystem.out.println(arr.length);",
    options: ["2", "3", "5", "6"],
    correctAnswer: "3",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nint[][] arr = {{1, 2}, {3, 4}, {5, 6}};\nSystem.out.println(arr[0].length);",
    options: ["2", "3", "5", "6"],
    correctAnswer: "2",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nint[][] arr = {{1, 2}, {3, 4}};\nint sum = 0;\nfor (int i = 0; i < arr.length; i++) {\n    for (int j = 0; j < arr[i].length; j++) {\n        sum += arr[i][j];\n    }\n}\nSystem.out.println(sum);",
    options: ["4", "6", "10", "12"],
    correctAnswer: "10",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nint[] arr = {1, 2, 3, 4};\nfor (int i = 0; i < arr.length; i++) {\n    arr[i] = arr[i] * 2;\n}\nSystem.out.println(arr[2]);",
    options: ["3", "4", "6", "8"],
    correctAnswer: "6",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nint[] arr = {2, 4, 6, 8};\nint result = 1;\nfor (int i = 0; i < arr.length; i++) {\n    if (arr[i] > 4)\n        result *= arr[i];\n}\nSystem.out.println(result);",
    options: ["6", "8", "48", "384"],
    correctAnswer: "48",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nint[] arr = {1, 2, 3, 4, 5};\nfor (int i = 0; i < arr.length / 2; i++) {\n    int temp = arr[i];\n    arr[i] = arr[arr.length - 1 - i];\n    arr[arr.length - 1 - i] = temp;\n}\nSystem.out.println(arr[0] + \" \" + arr[4]);",
    options: [
      "1 5",
      "5 1",
      "2 4",
      "4 2"
    ],
    correctAnswer: "5 1",
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
    console.log("Topic 6 Assessment Question Seeding");
    console.log("========================================\n");

    const topic = await Topic.findOne({
      title: "Arrays",
      subject: "Java",
    });

    if (!topic) {
      console.log("❌ Topic 'Arrays' not found.");
      console.log("Please make sure Topic 6 exists in MongoDB.");
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
    console.log("Topic: Arrays");
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