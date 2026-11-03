const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("../config/db");
const Topic = require("../models/Topic");
const EngagementQuestion = require("../models/EngagementQuestion");

// =====================================================
// TOPIC 14: EXCEPTION HANDLING
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
    question: "What is an exception in Java?",
    options: [
      "An event that disrupts the normal flow of program execution",
      "A type of variable",
      "A Java package",
      "A type of loop"
    ],
    correctAnswer:
      "An event that disrupts the normal flow of program execution",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which keyword is used to handle an exception?",
    options: ["catch", "throw", "throws", "finally"],
    correctAnswer: "catch",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which keyword is used to define code that may throw an exception?",
    options: ["try", "catch", "throw", "throws"],
    correctAnswer: "try",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which keyword is used to explicitly throw an exception?",
    options: ["throw", "throws", "catch", "finally"],
    correctAnswer: "throw",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which keyword declares that a method may throw exceptions?",
    options: ["throws", "throw", "try", "catch"],
    correctAnswer: "throws",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which block is generally used for cleanup code?",
    options: ["finally", "try", "catch", "throw"],
    correctAnswer: "finally",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which exception occurs when an integer is divided by zero?",
    options: [
      "ArithmeticException",
      "NullPointerException",
      "IOException",
      "ArrayIndexOutOfBoundsException"
    ],
    correctAnswer: "ArithmeticException",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which exception occurs when accessing an array using an invalid index?",
    options: [
      "ArrayIndexOutOfBoundsException",
      "ArithmeticException",
      "IOException",
      "ClassNotFoundException"
    ],
    correctAnswer: "ArrayIndexOutOfBoundsException",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which exception commonly occurs when calling a method on a null reference?",
    options: [
      "NullPointerException",
      "ArithmeticException",
      "IOException",
      "NumberFormatException"
    ],
    correctAnswer: "NullPointerException",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which is the superclass of both Error and Exception?",
    options: ["Throwable", "Object", "RuntimeException", "Exception"],
    correctAnswer: "Throwable",
    marks: 3,
    difficulty: "basic",
  },

  // =====================================================
  // MEDIUM - 10 × 3 = 30
  // =====================================================

  {
    question:
      "What happens if an exception is thrown inside a try block and a matching catch block exists?",
    options: [
      "The matching catch block handles the exception",
      "The program always terminates immediately",
      "The finally block is skipped",
      "The exception is ignored"
    ],
    correctAnswer:
      "The matching catch block handles the exception",
    marks: 3,
    difficulty: "medium",
  },
  {
    question:
      "Can a try block be used without a catch block?",
    options: [
      "Yes, if it is followed by a finally block",
      "No, never",
      "Only with static methods",
      "Only inside constructors"
    ],
    correctAnswer:
      "Yes, if it is followed by a finally block",
    marks: 3,
    difficulty: "medium",
  },
  {
    question:
      "Can there be multiple catch blocks after a single try block?",
    options: ["Yes", "No", "Only two", "Only three"],
    correctAnswer: "Yes",
    marks: 3,
    difficulty: "medium",
  },
  {
    question:
      "Which catch block should generally come first when handling related exceptions?",
    options: [
      "The more specific exception",
      "The more general exception",
      "Throwable only",
      "Object"
    ],
    correctAnswer: "The more specific exception",
    marks: 3,
    difficulty: "medium",
  },
  {
    question:
      "What happens if the catch block for Exception appears before a catch block for ArithmeticException?",
    options: [
      "The ArithmeticException catch block becomes unreachable",
      "Both blocks execute",
      "ArithmeticException is automatically converted",
      "The program runs normally"
    ],
    correctAnswer:
      "The ArithmeticException catch block becomes unreachable",
    marks: 3,
    difficulty: "medium",
  },
  {
    question:
      "Which type of exceptions generally must be either caught or declared using throws?",
    options: [
      "Checked exceptions",
      "Unchecked exceptions",
      "Errors only",
      "All runtime exceptions only"
    ],
    correctAnswer: "Checked exceptions",
    marks: 3,
    difficulty: "medium",
  },
  {
    question:
      "Which class is the superclass of unchecked runtime exceptions?",
    options: [
      "RuntimeException",
      "IOException",
      "Throwable",
      "Error"
    ],
    correctAnswer: "RuntimeException",
    marks: 3,
    difficulty: "medium",
  },
  {
    question:
      "What is the main purpose of the finally block?",
    options: [
      "To execute cleanup code whether or not an exception occurs",
      "To declare an exception",
      "To create a new object",
      "To stop the program"
    ],
    correctAnswer:
      "To execute cleanup code whether or not an exception occurs",
    marks: 3,
    difficulty: "medium",
  },
  {
    question:
      "Which method can be used to obtain the message associated with an exception?",
    options: ["getMessage()", "getError()", "message()", "exceptionMessage()"],
    correctAnswer: "getMessage()",
    marks: 3,
    difficulty: "medium",
  },
  {
    question:
      "Which method prints the exception type and stack trace?",
    options: [
      "printStackTrace()",
      "printException()",
      "showStack()",
      "displayError()"
    ],
    correctAnswer: "printStackTrace()",
    marks: 3,
    difficulty: "medium",
  },

  // =====================================================
  // ADVANCED - 10 × 4 = 40
  // =====================================================

  {
    question:
      "What is the output?\n\ntry {\n    int x = 10 / 0;\n    System.out.println(\"A\");\n} catch (ArithmeticException e) {\n    System.out.println(\"B\");\n} finally {\n    System.out.println(\"C\");\n}",
    options: [
      "A B C",
      "B C",
      "A C",
      "Only B"
    ],
    correctAnswer: "B C",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "What is the output?\n\ntry {\n    String s = null;\n    System.out.println(s.length());\n} catch (NullPointerException e) {\n    System.out.println(\"Handled\");\n}",
    options: [
      "Handled",
      "null",
      "0",
      "Compilation error"
    ],
    correctAnswer: "Handled",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "What is the output?\n\ntry {\n    int[] a = {1, 2};\n    System.out.println(a[5]);\n} catch (ArrayIndexOutOfBoundsException e) {\n    System.out.println(\"Array Error\");\n} finally {\n    System.out.println(\"Done\");\n}",
    options: [
      "Array Error Done",
      "Done only",
      "Array Error only",
      "Compilation error"
    ],
    correctAnswer: "Array Error Done",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "What happens when an exception is not handled in the current method?",
    options: [
      "It propagates to the calling method",
      "It is automatically ignored",
      "It becomes a warning only",
      "It is converted into a String"
    ],
    correctAnswer:
      "It propagates to the calling method",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "Which statement correctly describes try-with-resources?",
    options: [
      "It automatically closes resources that implement AutoCloseable",
      "It prevents all exceptions",
      "It can only be used with arrays",
      "It replaces every catch block"
    ],
    correctAnswer:
      "It automatically closes resources that implement AutoCloseable",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "What is the output?\n\nstatic void test() {\n    try {\n        System.out.println(\"Try\");\n        return;\n    } finally {\n        System.out.println(\"Finally\");\n    }\n}",
    options: [
      "Try Finally",
      "Try only",
      "Finally only",
      "Compilation error"
    ],
    correctAnswer: "Try Finally",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "What happens if both try and finally contain return statements?",
    options: [
      "The return from finally takes precedence",
      "The return from try always takes precedence",
      "Both values are returned",
      "Compilation always fails"
    ],
    correctAnswer:
      "The return from finally takes precedence",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "Which statement about custom exceptions is correct?",
    options: [
      "A custom exception can be created by extending Exception or another appropriate exception class",
      "Custom exceptions cannot have constructors",
      "Custom exceptions must always extend Error",
      "Custom exceptions cannot contain messages"
    ],
    correctAnswer:
      "A custom exception can be created by extending Exception or another appropriate exception class",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "What is the purpose of exception chaining?",
    options: [
      "To preserve the original cause of an exception",
      "To execute multiple finally blocks",
      "To prevent all exceptions",
      "To convert checked exceptions into loops"
    ],
    correctAnswer:
      "To preserve the original cause of an exception",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "Which statement correctly distinguishes throw and throws?",
    options: [
      "throw explicitly throws an exception, while throws declares exceptions that a method may propagate",
      "throws explicitly throws an exception, while throw declares it",
      "Both keywords perform exactly the same operation",
      "Neither keyword is related to exception handling"
    ],
    correctAnswer:
      "throw explicitly throws an exception, while throws declares exceptions that a method may propagate",
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
    console.log("Topic 14 Assessment Question Seeding");
    console.log("========================================\n");

    const topic = await Topic.findOne({
      title: "Exception Handling",
      subject: "Java",
    });

    if (!topic) {
      console.log("❌ Topic 'Exception Handling' not found.");
      console.log("Please make sure Topic 14 exists in MongoDB.");
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
    console.log("Topic: Exception Handling");
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