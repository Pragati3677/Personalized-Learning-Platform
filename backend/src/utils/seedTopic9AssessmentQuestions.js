const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("../config/db");
const Topic = require("../models/Topic");
const EngagementQuestion = require("../models/EngagementQuestion");

// =====================================================
// TOPIC 9: OOP CONCEPTS
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
    question: "What does OOP stand for?",
    options: [
      "Object-Oriented Programming",
      "Object-Operating Program",
      "Oriented Object Programming",
      "Object Order Programming"
    ],
    correctAnswer: "Object-Oriented Programming",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which of the following is a fundamental concept of OOP?",
    options: ["Encapsulation", "Compilation", "Iteration", "Parsing"],
    correctAnswer: "Encapsulation",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which OOP concept bundles data and methods together?",
    options: ["Encapsulation", "Inheritance", "Polymorphism", "Abstraction"],
    correctAnswer: "Encapsulation",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which OOP concept allows a class to acquire properties and behavior from another class?",
    options: ["Inheritance", "Encapsulation", "Abstraction", "Compilation"],
    correctAnswer: "Inheritance",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which OOP concept allows the same interface or method name to have different behavior?",
    options: ["Polymorphism", "Inheritance", "Encapsulation", "Aggregation"],
    correctAnswer: "Polymorphism",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which OOP concept focuses on hiding unnecessary implementation details?",
    options: ["Abstraction", "Inheritance", "Encapsulation", "Overloading"],
    correctAnswer: "Abstraction",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "What is an object?",
    options: [
      "An instance of a class",
      "A package",
      "A method only",
      "A primitive data type"
    ],
    correctAnswer: "An instance of a class",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "What is a class?",
    options: [
      "A blueprint for creating objects",
      "A single object",
      "A primitive variable",
      "A loop"
    ],
    correctAnswer: "A blueprint for creating objects",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which keyword is used to create an object in Java?",
    options: ["create", "new", "object", "instance"],
    correctAnswer: "new",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which keyword refers to the current object in Java?",
    options: ["self", "this", "current", "object"],
    correctAnswer: "this",
    marks: 3,
    difficulty: "basic",
  },

  // =====================================================
  // MEDIUM - 10 × 3 = 30
  // =====================================================

  {
    question: "Which access modifier provides the highest level of restriction?",
    options: ["public", "protected", "private", "default"],
    correctAnswer: "private",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which mechanism is commonly used to achieve encapsulation?",
    options: [
      "Private fields with public getters and setters",
      "Public fields only",
      "Using loops",
      "Using packages"
    ],
    correctAnswer: "Private fields with public getters and setters",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is method overloading?",
    options: [
      "Same method name with different parameter lists",
      "Same method name with same parameters",
      "Replacing a parent method",
      "Hiding a method"
    ],
    correctAnswer: "Same method name with different parameter lists",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is method overriding?",
    options: [
      "Defining a subclass method with the same signature as a superclass method",
      "Creating two methods with different parameters",
      "Creating a constructor",
      "Changing only a return variable"
    ],
    correctAnswer: "Defining a subclass method with the same signature as a superclass method",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which keyword is used to inherit a class in Java?",
    options: ["inherits", "extends", "implements", "super"],
    correctAnswer: "extends",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which keyword is used when a class implements an interface?",
    options: ["extends", "implements", "interface", "inherits"],
    correctAnswer: "implements",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which keyword is used to refer to the superclass?",
    options: ["parent", "base", "super", "this"],
    correctAnswer: "super",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Can a Java class directly extend more than one class?",
    options: ["Yes", "No", "Only abstract classes", "Only final classes"],
    correctAnswer: "No",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which feature allows Java to support multiple inheritance of type?",
    options: [
      "Interfaces",
      "Multiple classes",
      "Constructors",
      "Packages"
    ],
    correctAnswer: "Interfaces",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which keyword prevents a class from being inherited?",
    options: ["static", "private", "final", "sealed"],
    correctAnswer: "final",
    marks: 3,
    difficulty: "medium",
  },

  // =====================================================
  // ADVANCED - 10 × 4 = 40
  // =====================================================

  {
    question: "What is the output?\n\nclass A {\n    void show() {\n        System.out.println(\"A\");\n    }\n}\n\nclass B extends A {\n    void show() {\n        System.out.println(\"B\");\n    }\n}\n\nA obj = new B();\nobj.show();",
    options: ["A", "B", "Compilation error", "Nothing"],
    correctAnswer: "B",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "Which type of polymorphism is achieved through method overloading?",
    options: [
      "Compile-time polymorphism",
      "Runtime polymorphism",
      "Dynamic polymorphism",
      "Inheritance polymorphism"
    ],
    correctAnswer: "Compile-time polymorphism",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "Which type of polymorphism is primarily achieved through method overriding?",
    options: [
      "Compile-time polymorphism",
      "Runtime polymorphism",
      "Static polymorphism",
      "Constructor polymorphism"
    ],
    correctAnswer: "Runtime polymorphism",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the output?\n\nclass Parent {\n    int x = 10;\n}\n\nclass Child extends Parent {\n    int x = 20;\n    void display() {\n        System.out.println(super.x);\n    }\n}",
    options: ["10", "20", "30", "Compilation error"],
    correctAnswer: "10",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "Which statement about constructors is correct?",
    options: [
      "Constructors have the same name as the class",
      "Constructors must return int",
      "Constructors are inherited",
      "Constructors must be static"
    ],
    correctAnswer: "Constructors have the same name as the class",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What happens when a subclass object is assigned to a superclass reference?",
    options: [
      "Upcasting occurs",
      "Downcasting always occurs",
      "Compilation always fails",
      "The object is destroyed"
    ],
    correctAnswer: "Upcasting occurs",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is required to safely access subclass-specific members from a superclass reference?",
    options: [
      "Downcasting",
      "Upcasting",
      "Overloading",
      "Encapsulation"
    ],
    correctAnswer: "Downcasting",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "Which statement about private methods is correct?",
    options: [
      "They can be directly overridden by subclasses",
      "They are not directly accessible outside their defining class",
      "They must be static",
      "They are always inherited"
    ],
    correctAnswer: "They are not directly accessible outside their defining class",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "Which principle states that a subclass should be usable wherever its superclass is expected?",
    options: [
      "Liskov Substitution Principle",
      "Single Responsibility Principle",
      "Open/Closed Principle",
      "Dependency Inversion Principle"
    ],
    correctAnswer: "Liskov Substitution Principle",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "Which OOP principle combines data hiding with controlled access to data?",
    options: [
      "Encapsulation",
      "Inheritance",
      "Polymorphism",
      "Abstraction"
    ],
    correctAnswer: "Encapsulation",
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
    console.log("Topic 9 Assessment Question Seeding");
    console.log("========================================\n");

    const topic = await Topic.findOne({
      title: "OOP Concepts",
      subject: "Java",
    });

    if (!topic) {
      console.log("❌ Topic 'OOP Concepts' not found.");
      console.log("Please make sure Topic 9 exists in MongoDB.");
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
    console.log("Topic: OOP Concepts");
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