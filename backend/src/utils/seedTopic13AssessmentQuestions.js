const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("../config/db");
const Topic = require("../models/Topic");
const EngagementQuestion = require("../models/EngagementQuestion");

// =====================================================
// TOPIC 13: ABSTRACTION & INTERFACES
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
    question: "What is abstraction in Java?",
    options: [
      "Hiding implementation details and showing essential features",
      "Creating multiple objects",
      "Storing data in variables",
      "Converting one data type into another"
    ],
    correctAnswer:
      "Hiding implementation details and showing essential features",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which two mechanisms are commonly used to achieve abstraction in Java?",
    options: [
      "Abstract classes and interfaces",
      "Arrays and strings",
      "Loops and conditions",
      "Packages and variables"
    ],
    correctAnswer: "Abstract classes and interfaces",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which keyword is used to declare an abstract class?",
    options: ["abstract", "interface", "extends", "implements"],
    correctAnswer: "abstract",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which keyword is used to declare an interface?",
    options: ["interface", "abstract", "implements", "extends"],
    correctAnswer: "interface",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Can an abstract class be instantiated directly?",
    options: ["Yes", "No", "Only with static methods", "Only inside main()"],
    correctAnswer: "No",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which keyword is used when a class implements an interface?",
    options: ["implements", "extends", "interface", "abstract"],
    correctAnswer: "implements",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which keyword is normally used when one class inherits from another class?",
    options: ["extends", "implements", "inherits", "interface"],
    correctAnswer: "extends",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Can a Java class implement more than one interface?",
    options: ["Yes", "No", "Only two interfaces", "Only three interfaces"],
    correctAnswer: "Yes",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "What is an abstract method?",
    options: [
      "A method declared without a body",
      "A method that must always be static",
      "A private method",
      "A method with multiple constructors"
    ],
    correctAnswer: "A method declared without a body",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which keyword is used to provide an implementation of an interface method in a class?",
    options: ["implements", "extends", "override", "interface"],
    correctAnswer: "implements",
    marks: 3,
    difficulty: "basic",
  },

  // =====================================================
  // MEDIUM - 10 × 3 = 30
  // =====================================================

  {
    question:
      "Which statement about an abstract class is correct?",
    options: [
      "It can contain both abstract and concrete methods",
      "It can contain only abstract methods",
      "It cannot contain constructors",
      "It cannot contain instance variables"
    ],
    correctAnswer:
      "It can contain both abstract and concrete methods",
    marks: 3,
    difficulty: "medium",
  },
  {
    question:
      "Which statement about an interface is correct in modern Java?",
    options: [
      "It can contain abstract, default, and static methods",
      "It can contain only constructors",
      "It can be instantiated directly",
      "It can extend only classes"
    ],
    correctAnswer:
      "It can contain abstract, default, and static methods",
    marks: 3,
    difficulty: "medium",
  },
  {
    question:
      "What happens if a concrete class extends an abstract class but does not implement all inherited abstract methods?",
    options: [
      "The concrete class must also be declared abstract",
      "The program always runs successfully",
      "All methods become static",
      "The abstract methods are automatically deleted"
    ],
    correctAnswer:
      "The concrete class must also be declared abstract",
    marks: 3,
    difficulty: "medium",
  },
  {
    question:
      "What is the output?\n\nabstract class Animal {\n    abstract void sound();\n}\n\nclass Dog extends Animal {\n    void sound() {\n        System.out.println(\"Bark\");\n    }\n}\n\nAnimal a = new Dog();\na.sound();",
    options: ["Animal", "Bark", "Compilation error", "No output"],
    correctAnswer: "Bark",
    marks: 3,
    difficulty: "medium",
  },
  {
    question:
      "Which relationship is used when an interface inherits from another interface?",
    options: [
      "extends",
      "implements",
      "inherits",
      "instanceof"
    ],
    correctAnswer: "extends",
    marks: 3,
    difficulty: "medium",
  },
  {
    question:
      "Which relationship is used when a class uses an interface?",
    options: [
      "implements",
      "extends",
      "inherits",
      "instanceof"
    ],
    correctAnswer: "implements",
    marks: 3,
    difficulty: "medium",
  },
  {
    question:
      "What is the main purpose of an interface?",
    options: [
      "To define a contract that implementing classes must follow",
      "To create objects directly",
      "To replace all classes",
      "To store only local variables"
    ],
    correctAnswer:
      "To define a contract that implementing classes must follow",
    marks: 3,
    difficulty: "medium",
  },
  {
    question:
      "Can an abstract class have a constructor?",
    options: ["Yes", "No", "Only a private constructor", "Only a static constructor"],
    correctAnswer: "Yes",
    marks: 3,
    difficulty: "medium",
  },
  {
    question:
      "Which access modifier is commonly used for methods declared in an interface without an explicit access modifier?",
    options: ["public", "private", "protected", "package-private"],
    correctAnswer: "public",
    marks: 3,
    difficulty: "medium",
  },
  {
    question:
      "Which feature allows an interface to contain a method with an implementation?",
    options: [
      "default method",
      "abstract variable",
      "constructor method",
      "protected interface"
    ],
    correctAnswer: "default method",
    marks: 3,
    difficulty: "medium",
  },

  // =====================================================
  // ADVANCED - 10 × 4 = 40
  // =====================================================

  {
    question:
      "What is the output?\n\ninterface A {\n    default void show() {\n        System.out.println(\"A\");\n    }\n}\n\nclass B implements A {\n}\n\nnew B().show();",
    options: ["A", "B", "Compilation error", "No output"],
    correctAnswer: "A",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "What happens when a class implements two interfaces that contain the same default method signature?",
    options: [
      "The class must resolve the conflict by overriding the method",
      "The first interface always wins",
      "The second interface always wins",
      "Java automatically merges both methods"
    ],
    correctAnswer:
      "The class must resolve the conflict by overriding the method",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "What is the output?\n\ninterface A {\n    default void show() {\n        System.out.println(\"A\");\n    }\n}\n\ninterface B {\n    default void show() {\n        System.out.println(\"B\");\n    }\n}\n\nclass C implements A, B {\n    public void show() {\n        System.out.println(\"C\");\n    }\n}\n\nnew C().show();",
    options: ["A", "B", "C", "Compilation error"],
    correctAnswer: "C",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "Which statement about abstract classes and interfaces is correct?",
    options: [
      "A class can extend one class but implement multiple interfaces",
      "A class can extend multiple classes",
      "An interface can extend a class",
      "An abstract class cannot contain concrete methods"
    ],
    correctAnswer:
      "A class can extend one class but implement multiple interfaces",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "What is the output?\n\ninterface Printable {\n    void print();\n}\n\nclass Report implements Printable {\n    public void print() {\n        System.out.println(\"Report\");\n    }\n}\n\nPrintable p = new Report();\np.print();",
    options: ["Report", "Printable", "Compilation error", "No output"],
    correctAnswer: "Report",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "Which statement about interface variables is correct?",
    options: [
      "Variables declared in an interface are implicitly public, static, and final",
      "Interface variables are always private",
      "Interface variables can be modified by implementing classes",
      "Interface variables must be protected"
    ],
    correctAnswer:
      "Variables declared in an interface are implicitly public, static, and final",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "What is the output?\n\ninterface A {\n    static void show() {\n        System.out.println(\"A\");\n    }\n}\n\nclass B implements A {\n}\n\nA.show();",
    options: ["A", "B", "Compilation error", "No output"],
    correctAnswer: "A",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "Which statement about private methods in interfaces is correct in modern Java?",
    options: [
      "They can be used internally by default or static interface methods",
      "They must always be implemented by subclasses",
      "They can be called directly through implementing objects",
      "They are automatically abstract"
    ],
    correctAnswer:
      "They can be used internally by default or static interface methods",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "What is the output?\n\nabstract class Shape {\n    abstract void draw();\n\n    void message() {\n        System.out.println(\"Shape\");\n    }\n}\n\nclass Circle extends Shape {\n    void draw() {\n        System.out.println(\"Circle\");\n    }\n}\n\nShape s = new Circle();\ns.draw();\ns.message();",
    options: [
      "Circle Shape",
      "Shape Circle",
      "Only Circle",
      "Compilation error"
    ],
    correctAnswer: "Circle Shape",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "Which statement best describes the difference between an abstract class and an interface?",
    options: [
      "An abstract class can maintain state and constructors, while an interface primarily defines a contract and supports multiple implementation inheritance",
      "An interface can be instantiated directly but an abstract class cannot",
      "An abstract class cannot contain implemented methods",
      "There is no difference between them"
    ],
    correctAnswer:
      "An abstract class can maintain state and constructors, while an interface primarily defines a contract and supports multiple implementation inheritance",
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
    console.log("Topic 13 Assessment Question Seeding");
    console.log("========================================\n");

    const topic = await Topic.findOne({
      title: "Abstraction & Interfaces",
      subject: "Java",
    });

    if (!topic) {
      console.log("❌ Topic 'Abstraction & Interfaces' not found.");
      console.log("Please make sure Topic 13 exists in MongoDB.");
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
    console.log("Topic: Abstraction & Interfaces");
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