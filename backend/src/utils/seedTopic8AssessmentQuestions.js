const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("../config/db");
const Topic = require("../models/Topic");
const EngagementQuestion = require("../models/EngagementQuestion");

// =====================================================
// TOPIC 8: METHODS
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
    question: "What is a method in Java?",
    options: [
      "A block of code that performs a specific task",
      "A variable",
      "A data type",
      "A package"
    ],
    correctAnswer: "A block of code that performs a specific task",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which keyword is used when a method does not return a value?",
    options: ["null", "empty", "void", "return"],
    correctAnswer: "void",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which keyword is used to return a value from a method?",
    options: ["give", "return", "output", "result"],
    correctAnswer: "return",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "What is a parameter?",
    options: [
      "A variable defined in a method declaration",
      "A method name",
      "A class name",
      "A package name"
    ],
    correctAnswer: "A variable defined in a method declaration",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "What is an argument?",
    options: [
      "A value passed to a method when it is called",
      "The method return type",
      "The method name",
      "A class"
    ],
    correctAnswer: "A value passed to a method when it is called",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which part of a method specifies the type of value it returns?",
    options: ["Parameter", "Return type", "Method body", "Argument"],
    correctAnswer: "Return type",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which keyword is used to define a static method?",
    options: ["static", "method", "class", "fixed"],
    correctAnswer: "static",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which method is the entry point of a standard Java application?",
    options: [
      "start()",
      "run()",
      "main()",
      "execute()"
    ],
    correctAnswer: "main()",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which access modifier allows a method to be accessed from any class?",
    options: ["private", "protected", "public", "default"],
    correctAnswer: "public",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Can a Java method accept multiple parameters?",
    options: ["Yes", "No", "Only two", "Only three"],
    correctAnswer: "Yes",
    marks: 3,
    difficulty: "basic",
  },

  // =====================================================
  // MEDIUM - 10 × 3 = 30
  // =====================================================

  {
    question: "What is the output?\n\nstatic int add(int a, int b) {\n    return a + b;\n}\n\nSystem.out.println(add(5, 3));",
    options: ["5", "3", "8", "15"],
    correctAnswer: "8",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output?\n\nstatic void greet() {\n    System.out.println(\"Hello\");\n}\n\ngreet();",
    options: ["Hello", "greet", "Nothing", "Compilation error"],
    correctAnswer: "Hello",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the return type of the following method?\n\nstatic double calculate() {\n    return 10.5;\n}",
    options: ["static", "double", "calculate", "return"],
    correctAnswer: "double",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output?\n\nstatic int square(int x) {\n    return x * x;\n}\n\nSystem.out.println(square(4));",
    options: ["4", "8", "12", "16"],
    correctAnswer: "16",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which statement correctly calls this method?\n\nstatic void display(int x) { }",
    options: [
      "display();",
      "display(10);",
      "call display(10);",
      "display[int];"
    ],
    correctAnswer: "display(10);",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What happens if a non-void method does not return a value on all possible execution paths?",
    options: [
      "It always returns null",
      "Compilation error may occur",
      "It returns 0 automatically",
      "It returns false"
    ],
    correctAnswer: "Compilation error may occur",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is method overloading?",
    options: [
      "Having multiple methods with the same name but different parameter lists",
      "Calling a method many times",
      "Creating methods in multiple classes",
      "Making a method private"
    ],
    correctAnswer: "Having multiple methods with the same name but different parameter lists",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Can methods be overloaded by changing only the return type?",
    options: ["Yes", "No", "Only for static methods", "Only for private methods"],
    correctAnswer: "No",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output?\n\nstatic int multiply(int a, int b) {\n    return a * b;\n}\n\nint result = multiply(2, 5);\nSystem.out.println(result);",
    options: ["7", "10", "25", "2"],
    correctAnswer: "10",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which keyword prevents a method from being overridden in a subclass?",
    options: ["static", "private", "final", "constant"],
    correctAnswer: "final",
    marks: 3,
    difficulty: "medium",
  },

  // =====================================================
  // ADVANCED - 10 × 4 = 40
  // =====================================================

  {
    question: "What is the output?\n\nstatic int test(int x) {\n    if (x > 0)\n        return 10;\n    return 20;\n}\n\nSystem.out.println(test(-1));",
    options: ["10", "20", "-1", "Compilation error"],
    correctAnswer: "20",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nstatic int calculate(int x) {\n    return x > 5 ? x * 2 : x + 2;\n}\n\nSystem.out.println(calculate(6));",
    options: ["8", "10", "12", "14"],
    correctAnswer: "12",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nstatic void change(int x) {\n    x = 20;\n}\n\nint x = 10;\nchange(x);\nSystem.out.println(x);",
    options: ["10", "20", "0", "Compilation error"],
    correctAnswer: "10",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nstatic int factorial(int n) {\n    if (n == 1)\n        return 1;\n    return n * factorial(n - 1);\n}\n\nSystem.out.println(factorial(4));",
    options: ["4", "12", "24", "16"],
    correctAnswer: "24",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What concept is demonstrated when a method calls itself?",
    options: ["Inheritance", "Recursion", "Encapsulation", "Overloading"],
    correctAnswer: "Recursion",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nstatic int sum(int... numbers) {\n    int total = 0;\n    for (int n : numbers)\n        total += n;\n    return total;\n}\n\nSystem.out.println(sum(1, 2, 3));",
    options: ["3", "5", "6", "123"],
    correctAnswer: "6",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nstatic int add(int a, int b) {\n    return a + b;\n}\n\nstatic double add(double a, double b) {\n    return a + b;\n}\n\nSystem.out.println(add(2, 3));",
    options: ["5", "5.0", "2.3", "Compilation error"],
    correctAnswer: "5",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "Which method declaration correctly uses variable-length arguments?",
    options: [
      "static void test(int... values)",
      "static void test(...int values)",
      "static void test(int values...)",
      "static void test(var int values)"
    ],
    correctAnswer: "static void test(int... values)",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nstatic int method() {\n    try {\n        return 10;\n    } finally {\n        System.out.println(\"Finally\");\n    }\n}\n\nSystem.out.println(method());",
    options: [
      "10",
      "Finally then 10",
      "10 then Finally",
      "Compilation error"
    ],
    correctAnswer: "Finally then 10",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nstatic int test() {\n    int x = 5;\n    return x++;\n}\n\nSystem.out.println(test());",
    options: ["4", "5", "6", "Compilation error"],
    correctAnswer: "5",
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
    console.log("Topic 8 Assessment Question Seeding");
    console.log("========================================\n");

    const topic = await Topic.findOne({
      title: "Methods",
      subject: "Java",
    });

    if (!topic) {
      console.log("❌ Topic 'Methods' not found.");
      console.log("Please make sure Topic 8 exists in MongoDB.");
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
    console.log("Topic: Methods");
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