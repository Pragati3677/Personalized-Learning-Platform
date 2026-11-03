const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("../config/db");
const Topic = require("../models/Topic");
const EngagementQuestion = require("../models/EngagementQuestion");

// =====================================================
// TOPIC 10: CLASSES & OBJECTS
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
    question: "What is a class in Java?",
    options: [
      "A blueprint for creating objects",
      "An instance of an object",
      "A method",
      "A package"
    ],
    correctAnswer: "A blueprint for creating objects",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "What is an object in Java?",
    options: [
      "An instance of a class",
      "A blueprint",
      "A package",
      "A primitive data type"
    ],
    correctAnswer: "An instance of a class",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which keyword is used to create an object?",
    options: ["class", "new", "object", "create"],
    correctAnswer: "new",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which keyword is used to define a class?",
    options: ["object", "class", "define", "struct"],
    correctAnswer: "class",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which keyword refers to the current object?",
    options: ["self", "this", "current", "object"],
    correctAnswer: "this",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "What is a constructor?",
    options: [
      "A special member used to initialize objects",
      "A variable",
      "A return type",
      "A package"
    ],
    correctAnswer: "A special member used to initialize objects",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "What is the name of a constructor?",
    options: [
      "It must be the same as the class name",
      "It must always be main",
      "It can be any name",
      "It must be init"
    ],
    correctAnswer: "It must be the same as the class name",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Does a constructor have a return type?",
    options: ["Yes", "No", "Only int", "Only void"],
    correctAnswer: "No",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which operator is used to access members of an object?",
    options: [".", "->", "::", "#"],
    correctAnswer: ".",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Can a class contain variables and methods?",
    options: ["Yes", "No", "Only variables", "Only methods"],
    correctAnswer: "Yes",
    marks: 3,
    difficulty: "basic",
  },

  // =====================================================
  // MEDIUM - 10 × 3 = 30
  // =====================================================

  {
    question: "What is the output?\n\nclass Student {\n    String name = \"Pragati\";\n}\n\nStudent s = new Student();\nSystem.out.println(s.name);",
    options: ["Student", "Pragati", "null", "Compilation error"],
    correctAnswer: "Pragati",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output?\n\nclass Test {\n    int x = 10;\n}\n\nTest obj = new Test();\nSystem.out.println(obj.x);",
    options: ["0", "10", "null", "Compilation error"],
    correctAnswer: "10",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which statement correctly creates an object of class Student?",
    options: [
      "Student s = new Student();",
      "Student s = Student();",
      "new Student s;",
      "object Student = new s();"
    ],
    correctAnswer: "Student s = new Student();",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output?\n\nclass Demo {\n    Demo() {\n        System.out.println(\"Constructor\");\n    }\n}\n\nDemo d = new Demo();",
    options: [
      "Nothing",
      "Constructor",
      "Demo",
      "Compilation error"
    ],
    correctAnswer: "Constructor",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Can a class have multiple constructors with different parameter lists?",
    options: ["Yes", "No", "Only two", "Only one"],
    correctAnswer: "Yes",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is constructor overloading?",
    options: [
      "Having multiple constructors with different parameter lists",
      "Having multiple classes",
      "Overriding a constructor",
      "Calling a constructor twice"
    ],
    correctAnswer: "Having multiple constructors with different parameter lists",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What happens if no constructor is explicitly defined in a class?",
    options: [
      "The compiler provides a default constructor",
      "The class cannot be instantiated",
      "Compilation always fails",
      "An error occurs at runtime"
    ],
    correctAnswer: "The compiler provides a default constructor",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the output?\n\nclass Demo {\n    int x;\n    Demo(int x) {\n        this.x = x;\n    }\n}\n\nDemo d = new Demo(50);\nSystem.out.println(d.x);",
    options: ["0", "50", "null", "Compilation error"],
    correctAnswer: "50",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Why is the this keyword commonly used inside a constructor?",
    options: [
      "To distinguish instance variables from parameters with the same name",
      "To create a new class",
      "To call the main method",
      "To destroy an object"
    ],
    correctAnswer: "To distinguish instance variables from parameters with the same name",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which member belongs to the class rather than to individual objects?",
    options: ["Instance variable", "Instance method", "Static member", "Constructor parameter"],
    correctAnswer: "Static member",
    marks: 3,
    difficulty: "medium",
  },

  // =====================================================
  // ADVANCED - 10 × 4 = 40
  // =====================================================

  {
    question: "What is the output?\n\nclass Test {\n    int x = 10;\n\n    Test() {\n        x = 20;\n    }\n}\n\nTest obj = new Test();\nSystem.out.println(obj.x);",
    options: ["10", "20", "0", "Compilation error"],
    correctAnswer: "20",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nclass Test {\n    int x;\n\n    Test() {\n        this(50);\n    }\n\n    Test(int x) {\n        this.x = x;\n    }\n}\n\nTest obj = new Test();\nSystem.out.println(obj.x);",
    options: ["0", "50", "100", "Compilation error"],
    correctAnswer: "50",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "Which statement about this() inside a constructor is correct?",
    options: [
      "It calls another constructor of the same class",
      "It calls a superclass method",
      "It creates another object",
      "It destroys the current object"
    ],
    correctAnswer: "It calls another constructor of the same class",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nclass Counter {\n    static int count = 0;\n\n    Counter() {\n        count++;\n    }\n}\n\nnew Counter();\nnew Counter();\nSystem.out.println(Counter.count);",
    options: ["0", "1", "2", "Compilation error"],
    correctAnswer: "2",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nclass A {\n    int x = 10;\n}\n\nA a = new A();\nA b = a;\nb.x = 20;\nSystem.out.println(a.x);",
    options: ["10", "20", "0", "Compilation error"],
    correctAnswer: "20",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What does assigning one object reference to another generally copy?",
    options: [
      "The object itself",
      "The reference to the object",
      "Only primitive fields",
      "The class definition"
    ],
    correctAnswer: "The reference to the object",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nclass Test {\n    int x;\n\n    Test() {\n        x = 10;\n    }\n\n    Test(int value) {\n        x = value;\n    }\n}\n\nTest a = new Test();\nTest b = new Test(30);\nSystem.out.println(a.x + b.x);",
    options: ["10", "30", "40", "0"],
    correctAnswer: "40",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What happens when an object has no references pointing to it?",
    options: [
      "It becomes eligible for garbage collection",
      "It is immediately compiled again",
      "It becomes a static object",
      "It is automatically inherited"
    ],
    correctAnswer: "It becomes eligible for garbage collection",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nclass Demo {\n    int x = 10;\n\n    void show() {\n        int x = 20;\n        System.out.println(this.x);\n    }\n}\n\nDemo d = new Demo();\nd.show();",
    options: ["10", "20", "30", "Compilation error"],
    correctAnswer: "10",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "Which statement is correct about a static method?",
    options: [
      "It belongs to the class and can be called using the class name",
      "It must be called through an object only",
      "It can directly access every instance variable without an object",
      "It must have a return type of void"
    ],
    correctAnswer: "It belongs to the class and can be called using the class name",
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
    console.log("Topic 10 Assessment Question Seeding");
    console.log("========================================\n");

    const topic = await Topic.findOne({
      title: "Classes & Objects",
      subject: "Java",
    });

    if (!topic) {
      console.log("❌ Topic 'Classes & Objects' not found.");
      console.log("Please make sure Topic 10 exists in MongoDB.");
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
    console.log("Topic: Classes & Objects");
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