const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("../config/db");
const Topic = require("../models/Topic");
const EngagementQuestion = require("../models/EngagementQuestion");

// =====================================================
// TOPIC 11: INHERITANCE
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
    question: "What is inheritance in Java?",
    options: [
      "A mechanism where one class acquires properties and methods of another class",
      "A mechanism for creating variables",
      "A mechanism for handling exceptions",
      "A mechanism for creating packages"
    ],
    correctAnswer:
      "A mechanism where one class acquires properties and methods of another class",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which keyword is used to inherit a class in Java?",
    options: ["inherits", "extends", "implements", "super"],
    correctAnswer: "extends",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "What is the class being inherited from called?",
    options: ["Subclass", "Superclass", "Child class", "Derived object"],
    correctAnswer: "Superclass",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "What is the class that inherits from another class called?",
    options: ["Parent class", "Superclass", "Subclass", "Base class"],
    correctAnswer: "Subclass",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which keyword refers to the immediate superclass?",
    options: ["this", "parent", "super", "base"],
    correctAnswer: "super",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which type of inheritance is directly supported between classes in Java?",
    options: [
      "Single inheritance",
      "Multiple inheritance through classes",
      "Hybrid inheritance",
      "Circular inheritance"
    ],
    correctAnswer: "Single inheritance",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Can a Java class extend more than one class directly?",
    options: ["Yes", "No", "Only abstract classes", "Only interfaces"],
    correctAnswer: "No",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which keyword is used to prevent a class from being inherited?",
    options: ["static", "private", "final", "protected"],
    correctAnswer: "final",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which access modifier allows a member to be accessible in subclasses?",
    options: ["private", "protected", "local", "constant"],
    correctAnswer: "protected",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "What is the main benefit of inheritance?",
    options: [
      "Code reuse",
      "Memory deletion",
      "Automatic compilation",
      "Exception removal"
    ],
    correctAnswer: "Code reuse",
    marks: 3,
    difficulty: "basic",
  },

  // =====================================================
  // MEDIUM - 10 × 3 = 30
  // =====================================================

  {
    question:
      "What is the output?\n\nclass A {\n    int x = 10;\n}\n\nclass B extends A {\n}\n\nB obj = new B();\nSystem.out.println(obj.x);",
    options: ["0", "10", "null", "Compilation error"],
    correctAnswer: "10",
    marks: 3,
    difficulty: "medium",
  },
  {
    question:
      "What is the output?\n\nclass A {\n    void show() {\n        System.out.println(\"A\");\n    }\n}\n\nclass B extends A {\n}\n\nB obj = new B();\nobj.show();",
    options: ["A", "B", "Nothing", "Compilation error"],
    correctAnswer: "A",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which keyword is used to call a superclass constructor?",
    options: ["this", "super", "parent", "base"],
    correctAnswer: "super",
    marks: 3,
    difficulty: "medium",
  },
  {
    question:
      "What happens when a subclass object is created?",
    options: [
      "Only the subclass constructor executes",
      "The superclass constructor is also involved in object initialization",
      "No constructor executes",
      "Only the superclass method executes"
    ],
    correctAnswer:
      "The superclass constructor is also involved in object initialization",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which inheritance structure represents multilevel inheritance?",
    options: [
      "A → B",
      "A → B and A → C",
      "A → B → C",
      "A and B → C"
    ],
    correctAnswer: "A → B → C",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which inheritance structure represents hierarchical inheritance?",
    options: [
      "A → B → C",
      "A → B and A → C",
      "A → B",
      "A and B → C"
    ],
    correctAnswer: "A → B and A → C",
    marks: 3,
    difficulty: "medium",
  },
  {
    question:
      "Can a subclass access a private member of its superclass directly?",
    options: ["Yes", "No", "Only through super", "Only if static"],
    correctAnswer: "No",
    marks: 3,
    difficulty: "medium",
  },
  {
    question:
      "Which keyword can be used to access a superclass method that has been overridden?",
    options: ["this", "super", "parent", "base"],
    correctAnswer: "super",
    marks: 3,
    difficulty: "medium",
  },
  {
    question:
      "Can a subclass override a final method?",
    options: ["Yes", "No", "Only if public", "Only if protected"],
    correctAnswer: "No",
    marks: 3,
    difficulty: "medium",
  },
  {
    question:
      "Which relationship is represented by inheritance?",
    options: [
      "HAS-A",
      "IS-A",
      "USES-A",
      "PART-OF"
    ],
    correctAnswer: "IS-A",
    marks: 3,
    difficulty: "medium",
  },

  // =====================================================
  // ADVANCED - 10 × 4 = 40
  // =====================================================

  {
    question:
      "What is the output?\n\nclass A {\n    A() {\n        System.out.println(\"A\");\n    }\n}\n\nclass B extends A {\n    B() {\n        System.out.println(\"B\");\n    }\n}\n\nnew B();",
    options: [
      "A B",
      "B A",
      "A",
      "B"
    ],
    correctAnswer: "A B",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "What is the output?\n\nclass A {\n    int x = 10;\n}\n\nclass B extends A {\n    int x = 20;\n\n    void show() {\n        System.out.println(super.x);\n        System.out.println(this.x);\n    }\n}\n\nnew B().show();",
    options: [
      "10 then 20",
      "20 then 10",
      "10 then 10",
      "20 then 20"
    ],
    correctAnswer: "10 then 20",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "What is the output?\n\nclass A {\n    void show() {\n        System.out.println(\"Parent\");\n    }\n}\n\nclass B extends A {\n    void show() {\n        super.show();\n        System.out.println(\"Child\");\n    }\n}\n\nnew B().show();",
    options: [
      "Parent Child",
      "Child Parent",
      "Parent",
      "Child"
    ],
    correctAnswer: "Parent Child",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "What is the output?\n\nclass A {\n    A(int x) {\n        System.out.println(x);\n    }\n}\n\nclass B extends A {\n    B() {\n        super(10);\n    }\n}\n\nnew B();",
    options: ["0", "10", "Compilation error", "Nothing"],
    correctAnswer: "10",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "What happens if a superclass has only a parameterized constructor and the subclass constructor does not explicitly call super(...)?",
    options: [
      "The superclass parameterized constructor is automatically called",
      "Compilation error occurs",
      "The subclass constructor is ignored",
      "The superclass constructor receives 0 automatically"
    ],
    correctAnswer: "Compilation error occurs",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "What is the output?\n\nclass A {\n    static void show() {\n        System.out.println(\"A\");\n    }\n}\n\nclass B extends A {\n    static void show() {\n        System.out.println(\"B\");\n    }\n}\n\nA obj = new B();\nobj.show();",
    options: ["A", "B", "Compilation error", "Runtime error"],
    correctAnswer: "A",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "Which statement correctly describes method hiding?",
    options: [
      "It occurs when static methods with the same signature appear in superclass and subclass",
      "It occurs only with private methods",
      "It is the same as constructor overloading",
      "It occurs only with final methods"
    ],
    correctAnswer:
      "It occurs when static methods with the same signature appear in superclass and subclass",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "What is the output?\n\nclass A {\n    protected int x = 10;\n}\n\nclass B extends A {\n    void show() {\n        System.out.println(x);\n    }\n}\n\nnew B().show();",
    options: ["0", "10", "null", "Compilation error"],
    correctAnswer: "10",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "Which statement about constructors and inheritance is correct?",
    options: [
      "Constructors are inherited by subclasses",
      "Constructors are not inherited, but superclass constructors can be invoked using super()",
      "Only private constructors are inherited",
      "Constructors can be overridden"
    ],
    correctAnswer:
      "Constructors are not inherited, but superclass constructors can be invoked using super()",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "What is the output?\n\nclass A {\n    void display() {\n        System.out.println(\"A\");\n    }\n}\n\nclass B extends A {\n    @Override\n    void display() {\n        System.out.println(\"B\");\n    }\n}\n\nA obj = new B();\nobj.display();",
    options: ["A", "B", "A B", "Compilation error"],
    correctAnswer: "B",
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
    console.log("Topic 11 Assessment Question Seeding");
    console.log("========================================\n");

    const topic = await Topic.findOne({
      title: "Inheritance",
      subject: "Java",
    });

    if (!topic) {
      console.log("❌ Topic 'Inheritance' not found.");
      console.log("Please make sure Topic 11 exists in MongoDB.");
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
    console.log("Topic: Inheritance");
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