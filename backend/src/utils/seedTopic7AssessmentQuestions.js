const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("../config/db");
const Topic = require("../models/Topic");
const EngagementQuestion = require("../models/EngagementQuestion");

// =====================================================
// TOPIC 7: STRINGS
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
    question: "Which class is used to represent strings in Java?",
    options: ["String", "StringBuilder", "Character", "Text"],
    correctAnswer: "String",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which method returns the number of characters in a String?",
    options: ["size()", "length()", "count()", "characters()"],
    correctAnswer: "length()",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which method converts a String to uppercase?",
    options: ["upper()", "toUpperCase()", "uppercase()", "convertUpper()"],
    correctAnswer: "toUpperCase()",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which method converts a String to lowercase?",
    options: ["lower()", "toLowerCase()", "lowercase()", "convertLower()"],
    correctAnswer: "toLowerCase()",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which method compares two strings based on their content?",
    options: ["==", "equals()", "compare()", "same()"],
    correctAnswer: "equals()",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Are Java String objects mutable?",
    options: ["Yes", "No", "Only sometimes", "Only for final Strings"],
    correctAnswer: "No",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which method returns a character at a specified index?",
    options: ["get()", "charAt()", "characterAt()", "indexChar()"],
    correctAnswer: "charAt()",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which method checks whether a String contains a specified sequence?",
    options: ["contains()", "has()", "includes()", "find()"],
    correctAnswer: "contains()",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which operator is commonly used to concatenate Strings?",
    options: ["+", "&", ".", "::"],
    correctAnswer: "+",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which method removes leading and trailing whitespace from a String?",
    options: ["remove()", "trim()", "stripSpaces()", "clean()"],
    correctAnswer: "trim()",
    marks: 3,
    difficulty: "basic",
  },

  // =====================================================
  // MEDIUM - 10 × 3 = 30
  // =====================================================

  {
    question: "What is the output?\n\nString s = \"Java\";\nSystem.out.println(s.length());",
    options: ["3", "4", "5", "0"],
    correctAnswer: "4",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output?\n\nString s = \"Java\";\nSystem.out.println(s.charAt(2));",
    options: ["J", "a", "v", "a"],
    correctAnswer: "v",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output?\n\nString s = \"Hello\";\nSystem.out.println(s.substring(1, 4));",
    options: ["Hel", "ell", "ello", "ellO"],
    correctAnswer: "ell",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output?\n\nString s = \"Java\";\nSystem.out.println(s.toUpperCase());",
    options: ["java", "JAVA", "Java", "Compilation error"],
    correctAnswer: "JAVA",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output?\n\nString s = \"JAVA\";\nSystem.out.println(s.toLowerCase());",
    options: ["JAVA", "java", "Java", "Compilation error"],
    correctAnswer: "java",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output?\n\nString a = \"Hello\";\nString b = \"Hello\";\nSystem.out.println(a.equals(b));",
    options: ["true", "false", "Hello", "Compilation error"],
    correctAnswer: "true",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output?\n\nString s = \"Hello World\";\nSystem.out.println(s.contains(\"World\"));",
    options: ["true", "false", "World", "Compilation error"],
    correctAnswer: "true",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output?\n\nString s = \"Java\";\nSystem.out.println(s.indexOf('v'));",
    options: ["1", "2", "3", "-1"],
    correctAnswer: "2",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output?\n\nString s = \"banana\";\nSystem.out.println(s.replace('a', 'o'));",
    options: ["bonono", "banana", "bonana", "banono"],
    correctAnswer: "bonono",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output?\n\nString s = \"  Java  \";\nSystem.out.println(s.trim().length());",
    options: ["4", "6", "8", "10"],
    correctAnswer: "4",
    marks: 3,
    difficulty: "medium",
  },

  // =====================================================
  // ADVANCED - 10 × 4 = 40
  // =====================================================

  {
    question: "What is the output?\n\nString a = \"Java\";\nString b = new String(\"Java\");\nSystem.out.println(a == b);",
    options: ["true", "false", "Java", "Compilation error"],
    correctAnswer: "false",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nString a = \"Java\";\nString b = new String(\"Java\");\nSystem.out.println(a.equals(b));",
    options: ["true", "false", "Java", "Compilation error"],
    correctAnswer: "true",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nString s = \"Java Programming\";\nSystem.out.println(s.substring(5, 16));",
    options: [
      "Programming",
      "Programming ",
      "rogramming",
      "Java"
    ],
    correctAnswer: "Programming",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nString s = \"abcabc\";\nSystem.out.println(s.indexOf(\"bc\"));",
    options: ["0", "1", "2", "3"],
    correctAnswer: "1",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nString s = \"Java\";\ns = s.concat(\" Programming\");\nSystem.out.println(s);",
    options: [
      "Java",
      "Programming",
      "Java Programming",
      "Compilation error"
    ],
    correctAnswer: "Java Programming",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nString s = \"hello\";\nSystem.out.println(s.substring(1).toUpperCase());",
    options: ["HELLO", "ELLO", "ello", "ELLOH"],
    correctAnswer: "ELLO",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nString s = \"Java\";\nSystem.out.println(s.startsWith(\"Ja\") && s.endsWith(\"va\"));",
    options: ["true", "false", "Java", "Compilation error"],
    correctAnswer: "true",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nString s = \"one,two,three\";\nString[] parts = s.split(\",\");\nSystem.out.println(parts.length);",
    options: ["2", "3", "4", "12"],
    correctAnswer: "3",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nString s = \"Java\";\nSystem.out.println(s.compareTo(\"Java\"));",
    options: ["0", "1", "-1", "4"],
    correctAnswer: "0",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nString s = \"abc\";\ns = s.replace(\"a\", \"x\");\nSystem.out.println(s);",
    options: ["abc", "xbc", "axc", "abx"],
    correctAnswer: "xbc",
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
    console.log("Topic 7 Assessment Question Seeding");
    console.log("========================================\n");

    const topic = await Topic.findOne({
      title: "Strings",
      subject: "Java",
    });

    if (!topic) {
      console.log("❌ Topic 'Strings' not found.");
      console.log("Please make sure Topic 7 exists in MongoDB.");
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
    console.log("Topic: Strings");
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