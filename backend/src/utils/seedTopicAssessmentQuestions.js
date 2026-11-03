const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("../config/db");
const Topic = require("../models/Topic");
const EngagementQuestion = require("../models/EngagementQuestion");

// =====================================================
// JAVA BASICS & SYNTAX - 30 QUESTIONS
// 10 Basic + 10 Medium + 10 Advanced
// =====================================================

const questions = [
  // ===================================================
  // BASIC QUESTIONS - 10 × 3 MARKS
  // ===================================================

  {
    question: "Which keyword is used to define a class in Java?",
    options: ["class", "Class", "define", "struct"],
    correctAnswer: "class",
    marks: 3,
    difficulty: "basic",
  },

  {
    question: "Which method is the entry point of a Java program?",
    options: ["start()", "main()", "run()", "execute()"],
    correctAnswer: "main()",
    marks: 3,
    difficulty: "basic",
  },

  {
    question: "Which symbol is used to end a statement in Java?",
    options: [".", ":", ";", ","],
    correctAnswer: ";",
    marks: 3,
    difficulty: "basic",
  },

  {
    question: "Which keyword is used to create an object in Java?",
    options: ["create", "object", "new", "instance"],
    correctAnswer: "new",
    marks: 3,
    difficulty: "basic",
  },

  {
    question: "Which of the following is a valid Java identifier?",
    options: ["2number", "class", "studentName", "student-name"],
    correctAnswer: "studentName",
    marks: 3,
    difficulty: "basic",
  },

  {
    question: "Which keyword is used to declare a constant in Java?",
    options: ["constant", "const", "final", "static"],
    correctAnswer: "final",
    marks: 3,
    difficulty: "basic",
  },

  {
    question: "Which command is used to compile a Java source file?",
    options: ["java", "javac", "compile", "javadoc"],
    correctAnswer: "javac",
    marks: 3,
    difficulty: "basic",
  },

  {
    question: "Which command is used to run a compiled Java program?",
    options: ["javac", "java", "run", "execute"],
    correctAnswer: "java",
    marks: 3,
    difficulty: "basic",
  },

  {
    question: "Which symbol is used for a single-line comment in Java?",
    options: ["//", "/*", "#", "<!--"],
    correctAnswer: "//",
    marks: 3,
    difficulty: "basic",
  },

  {
    question: "Which keyword is used to import a package in Java?",
    options: ["include", "using", "import", "package"],
    correctAnswer: "import",
    marks: 3,
    difficulty: "basic",
  },

  // ===================================================
  // MEDIUM QUESTIONS - 10 × 3 MARKS
  // ===================================================

  {
    question: "What is the correct signature of the main method in Java?",
    options: [
      "public void main(String args)",
      "public static void main(String[] args)",
      "static public main(String[] args)",
      "public main(String[] args)"
    ],
    correctAnswer: "public static void main(String[] args)",
    marks: 3,
    difficulty: "medium",
  },

  {
    question: "Which of the following is NOT a valid Java keyword?",
    options: ["static", "private", "protected", "main"],
    correctAnswer: "main",
    marks: 3,
    difficulty: "medium",
  },

  {
    question: "What is the purpose of the package statement in Java?",
    options: [
      "To import a class",
      "To define the package of a class",
      "To create an object",
      "To define a variable"
    ],
    correctAnswer: "To define the package of a class",
    marks: 3,
    difficulty: "medium",
  },

  {
    question: "Which access modifier allows a member to be accessed from anywhere?",
    options: ["private", "protected", "default", "public"],
    correctAnswer: "public",
    marks: 3,
    difficulty: "medium",
  },

  {
    question: "Which keyword prevents a class from being inherited?",
    options: ["static", "final", "private", "sealed"],
    correctAnswer: "final",
    marks: 3,
    difficulty: "medium",
  },

  {
    question: "What happens when a Java source file is compiled?",
    options: [
      "Machine code is directly generated",
      "Bytecode is generated",
      "JavaScript code is generated",
      "HTML code is generated"
    ],
    correctAnswer: "Bytecode is generated",
    marks: 3,
    difficulty: "medium",
  },

  {
    question: "Which component executes Java bytecode?",
    options: [
      "JDK",
      "JVM",
      "JRE compiler",
      "javac"
    ],
    correctAnswer: "JVM",
    marks: 3,
    difficulty: "medium",
  },

  {
    question: "Which of the following is the correct way to declare a Java package?",
    options: [
      "package java;",
      "package mypackage;",
      "import mypackage;",
      "namespace mypackage;"
    ],
    correctAnswer: "package mypackage;",
    marks: 3,
    difficulty: "medium",
  },

  {
    question: "Which statement correctly creates an object of class Student?",
    options: [
      "Student s;",
      "new Student s;",
      "Student s = new Student();",
      "object Student s = new Student();"
    ],
    correctAnswer: "Student s = new Student();",
    marks: 3,
    difficulty: "medium",
  },

  {
    question: "Which of the following is true about Java?",
    options: [
      "Java is only a procedural language",
      "Java supports object-oriented programming",
      "Java does not support inheritance",
      "Java programs cannot run on different operating systems"
    ],
    correctAnswer: "Java supports object-oriented programming",
    marks: 3,
    difficulty: "medium",
  },

  // ===================================================
  // ADVANCED QUESTIONS - 10 × 4 MARKS
  // ===================================================

  {
    question: "Why is Java considered platform independent?",
    options: [
      "Java source code never needs compilation",
      "Java bytecode can run on a JVM available for different platforms",
      "Java uses only interpreted code",
      "Java programs depend on the operating system"
    ],
    correctAnswer:
      "Java bytecode can run on a JVM available for different platforms",
    marks: 4,
    difficulty: "advanced",
  },

  {
    question: "What is the correct execution flow of a Java program?",
    options: [
      "Source code → JVM → javac → Bytecode",
      "Source code → javac → Bytecode → JVM",
      "Bytecode → javac → Source code → JVM",
      "Source code → JRE → javac → JVM"
    ],
    correctAnswer: "Source code → javac → Bytecode → JVM",
    marks: 4,
    difficulty: "advanced",
  },

  {
    question: "Which statement correctly describes the relationship between JDK, JRE, and JVM?",
    options: [
      "JVM contains JDK and JRE",
      "JRE contains JVM, while JDK contains JRE and development tools",
      "JDK contains only JVM",
      "JRE contains JDK"
    ],
    correctAnswer:
      "JRE contains JVM, while JDK contains JRE and development tools",
    marks: 4,
    difficulty: "advanced",
  },

  {
    question: "What happens if the main method is declared without the static keyword?",
    options: [
      "The program runs normally",
      "JVM creates an object automatically",
      "JVM cannot invoke the main method as the program entry point",
      "The compiler converts it into a static method"
    ],
    correctAnswer:
      "JVM cannot invoke the main method as the program entry point",
    marks: 4,
    difficulty: "advanced",
  },

  {
    question: "Which statement about Java identifiers is correct?",
    options: [
      "An identifier can start with a digit",
      "An identifier can contain spaces",
      "An identifier cannot be the same as a reserved keyword",
      "All identifiers must be uppercase"
    ],
    correctAnswer:
      "An identifier cannot be the same as a reserved keyword",
    marks: 4,
    difficulty: "advanced",
  },

  {
    question: "Consider the statement: final int x = 10;. What happens if x is assigned another value later?",
    options: [
      "The value changes normally",
      "The compiler reports an error",
      "The JVM changes the value",
      "The variable becomes static"
    ],
    correctAnswer: "The compiler reports an error",
    marks: 4,
    difficulty: "advanced",
  },

  {
    question: "Why can a Java class contain multiple methods with the same name?",
    options: [
      "Java automatically ignores duplicate methods",
      "Java supports method overloading when method signatures differ",
      "Methods are always treated as variables",
      "The JVM renames the methods automatically"
    ],
    correctAnswer:
      "Java supports method overloading when method signatures differ",
    marks: 4,
    difficulty: "advanced",
  },

  {
    question: "What is the purpose of the public static void main(String[] args) method?",
    options: [
      "It defines the constructor of every class",
      "It provides the standard entry point for JVM execution",
      "It creates the JVM",
      "It compiles the Java program"
    ],
    correctAnswer:
      "It provides the standard entry point for JVM execution",
    marks: 4,
    difficulty: "advanced",
  },

  {
    question: "Which statement about Java source files is correct?",
    options: [
      "A source file must always contain exactly one class",
      "A source file can contain multiple classes, but only one public top-level class can match the file name",
      "Every class must be public",
      "The file name can never match a class name"
    ],
    correctAnswer:
      "A source file can contain multiple classes, but only one public top-level class can match the file name",
    marks: 4,
    difficulty: "advanced",
  },

  {
    question: "Which statement best explains why Java uses bytecode?",
    options: [
      "Bytecode removes the need for a compiler",
      "Bytecode allows Java programs to be executed by a JVM on different platforms",
      "Bytecode is directly understood by every CPU",
      "Bytecode is Java source code with a different extension"
    ],
    correctAnswer:
      "Bytecode allows Java programs to be executed by a JVM on different platforms",
    marks: 4,
    difficulty: "advanced",
  },
];

// =====================================================
// SEED FUNCTION
// =====================================================

const seedTopicAssessmentQuestions = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    console.log("Connected to MongoDB.");

    // Find Topic 1
    const topic = await Topic.findOne({
      title: "Java Basics & Syntax",
      subject: "Java",
      isActive: true,
    });

    if (!topic) {
      console.error(
        "Java Basics & Syntax topic was not found."
      );

      process.exit(1);
    }

    console.log(
      `Found topic: ${topic.title}`
    );

    // Check existing questions for this topic
    const existingCount = await EngagementQuestion.countDocuments({
      topicId: topic._id,
    });

    if (existingCount > 0) {
      console.log(
        `This topic already has ${existingCount} questions.`
      );

      console.log(
        "No new questions were inserted to prevent duplicates."
      );

      process.exit(0);
    }

    // Add topicId to every question
    const questionsWithTopic = questions.map((question) => ({
      ...question,
      topicId: topic._id,
      isActive: true,
    }));

    // Verify exactly 30 questions
    if (questionsWithTopic.length !== 30) {
      console.error(
        `Expected 30 questions but found ${questionsWithTopic.length}.`
      );

      process.exit(1);
    }

    // Verify difficulty distribution
    const basicCount = questionsWithTopic.filter(
      (q) => q.difficulty === "basic"
    ).length;

    const mediumCount = questionsWithTopic.filter(
      (q) => q.difficulty === "medium"
    ).length;

    const advancedCount = questionsWithTopic.filter(
      (q) => q.difficulty === "advanced"
    ).length;

    console.log("\nQuestion distribution:");
    console.log(`Basic: ${basicCount}`);
    console.log(`Medium: ${mediumCount}`);
    console.log(`Advanced: ${advancedCount}`);

    if (
      basicCount !== 10 ||
      mediumCount !== 10 ||
      advancedCount !== 10
    ) {
      console.error(
        "Invalid question distribution."
      );

      process.exit(1);
    }

    // Verify total marks
    const totalMarks = questionsWithTopic.reduce(
      (total, question) => total + question.marks,
      0
    );

    console.log(`Total marks: ${totalMarks}`);

    if (totalMarks !== 100) {
      console.error(
        `Expected total marks to be 100, but got ${totalMarks}.`
      );

      process.exit(1);
    }

    // Insert questions
    const insertedQuestions =
      await EngagementQuestion.insertMany(
        questionsWithTopic
      );

    console.log(
      `\nSuccessfully inserted ${insertedQuestions.length} questions.`
    );

    console.log(
      `Topic: ${topic.title}`
    );

    console.log(
      `Topic ID: ${topic._id}`
    );

    console.log(
      "Assessment total: 100 marks"
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "\nError while seeding topic assessment questions:"
    );

    console.error(error.message);

    process.exit(1);
  }
};

seedTopicAssessmentQuestions();