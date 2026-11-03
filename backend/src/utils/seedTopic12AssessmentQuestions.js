const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("../config/db");
const Topic = require("../models/Topic");
const EngagementQuestion = require("../models/EngagementQuestion");

// =====================================================
// TOPIC 12: POLYMORPHISM
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
    question: "What does polymorphism mean in object-oriented programming?",
    options: [
      "One interface or method name can have different forms of behavior",
      "Creating multiple variables",
      "Hiding all class members",
      "Creating only one object"
    ],
    correctAnswer:
      "One interface or method name can have different forms of behavior",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which are the two main types of polymorphism in Java?",
    options: [
      "Compile-time and runtime",
      "Static and private",
      "Class and object",
      "Local and global"
    ],
    correctAnswer: "Compile-time and runtime",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which concept is used to achieve compile-time polymorphism?",
    options: [
      "Method overloading",
      "Method overriding",
      "Inheritance only",
      "Exception handling"
    ],
    correctAnswer: "Method overloading",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which concept is used to achieve runtime polymorphism?",
    options: [
      "Method overriding",
      "Method overloading",
      "Constructor overloading",
      "Variable declaration"
    ],
    correctAnswer: "Method overriding",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "What is method overloading?",
    options: [
      "Multiple methods with the same name but different parameter lists",
      "Replacing a parent method in a subclass",
      "Creating multiple classes",
      "Using multiple return statements"
    ],
    correctAnswer:
      "Multiple methods with the same name but different parameter lists",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "What is method overriding?",
    options: [
      "A subclass provides its own implementation of an inherited method",
      "Creating methods with different names",
      "Creating multiple constructors",
      "Changing only a method's return variable"
    ],
    correctAnswer:
      "A subclass provides its own implementation of an inherited method",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which annotation is commonly used to indicate that a method overrides a superclass method?",
    options: ["@Override", "@Overload", "@Inherited", "@Polymorphic"],
    correctAnswer: "@Override",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which type of method binding is associated with runtime polymorphism?",
    options: [
      "Dynamic binding",
      "Static binding",
      "Early binding only",
      "Compile binding"
    ],
    correctAnswer: "Dynamic binding",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Can static methods be overridden in the normal runtime-polymorphism sense?",
    options: ["Yes", "No", "Only private static methods", "Only final static methods"],
    correctAnswer: "No",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which relationship is commonly required for runtime polymorphism?",
    options: [
      "Inheritance",
      "Only encapsulation",
      "Only abstraction",
      "Only packages"
    ],
    correctAnswer: "Inheritance",
    marks: 3,
    difficulty: "basic",
  },

  // =====================================================
  // MEDIUM - 10 × 3 = 30
  // =====================================================

  {
    question:
      "What is the output?\n\nclass A {\n    void show() {\n        System.out.println(\"A\");\n    }\n}\n\nclass B extends A {\n    @Override\n    void show() {\n        System.out.println(\"B\");\n    }\n}\n\nB obj = new B();\nobj.show();",
    options: ["A", "B", "A B", "Compilation error"],
    correctAnswer: "B",
    marks: 3,
    difficulty: "medium",
  },
  {
    question:
      "What is the output?\n\nclass Test {\n    void add(int a, int b) {\n        System.out.println(a + b);\n    }\n\n    void add(double a, double b) {\n        System.out.println(a + b);\n    }\n}\n\nTest t = new Test();\nt.add(2, 3);",
    options: ["5", "5.0", "2.3", "Compilation error"],
    correctAnswer: "5",
    marks: 3,
    difficulty: "medium",
  },
  {
    question:
      "Which factor determines which overloaded method is selected?",
    options: [
      "The argument types and number of arguments",
      "Only the return type",
      "Only the method name",
      "The object memory address"
    ],
    correctAnswer: "The argument types and number of arguments",
    marks: 3,
    difficulty: "medium",
  },
  {
    question:
      "Can methods be overloaded by changing only their return type?",
    options: ["Yes", "No", "Only static methods", "Only private methods"],
    correctAnswer: "No",
    marks: 3,
    difficulty: "medium",
  },
  {
    question:
      "What is the output?\n\nclass Parent {\n    void display() {\n        System.out.println(\"Parent\");\n    }\n}\n\nclass Child extends Parent {\n    void display() {\n        System.out.println(\"Child\");\n    }\n}\n\nParent p = new Child();\np.display();",
    options: ["Parent", "Child", "Parent Child", "Compilation error"],
    correctAnswer: "Child",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which concept allows a superclass reference to refer to a subclass object?",
    options: [
      "Upcasting",
      "Downcasting",
      "Encapsulation",
      "Constructor chaining"
    ],
    correctAnswer: "Upcasting",
    marks: 3,
    difficulty: "medium",
  },
  {
    question:
      "What happens when an overridden method is called using a superclass reference pointing to a subclass object?",
    options: [
      "The subclass version is selected at runtime",
      "The superclass version is always selected",
      "Compilation always fails",
      "Both versions execute automatically"
    ],
    correctAnswer: "The subclass version is selected at runtime",
    marks: 3,
    difficulty: "medium",
  },
  {
    question:
      "Which keyword can prevent a method from being overridden?",
    options: ["final", "static", "private", "constant"],
    correctAnswer: "final",
    marks: 3,
    difficulty: "medium",
  },
  {
    question:
      "Which access level must an overriding method not reduce compared with the inherited method?",
    options: [
      "Access visibility",
      "Return type size",
      "Variable count",
      "Class size"
    ],
    correctAnswer: "Access visibility",
    marks: 3,
    difficulty: "medium",
  },
  {
    question:
      "Which statement is true about method overloading?",
    options: [
      "It can occur within the same class",
      "It requires inheritance",
      "It is resolved only at runtime",
      "It requires the same parameter list"
    ],
    correctAnswer: "It can occur within the same class",
    marks: 3,
    difficulty: "medium",
  },

  // =====================================================
  // ADVANCED - 10 × 4 = 40
  // =====================================================

  {
    question:
      "What is the output?\n\nclass A {\n    void show() {\n        System.out.println(\"A\");\n    }\n}\n\nclass B extends A {\n    @Override\n    void show() {\n        System.out.println(\"B\");\n    }\n}\n\nclass C extends B {\n    @Override\n    void show() {\n        System.out.println(\"C\");\n    }\n}\n\nA obj = new C();\nobj.show();",
    options: ["A", "B", "C", "Compilation error"],
    correctAnswer: "C",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "What is the output?\n\nclass Test {\n    void display(int x) {\n        System.out.println(\"int\");\n    }\n\n    void display(double x) {\n        System.out.println(\"double\");\n    }\n}\n\nTest t = new Test();\nt.display(10);",
    options: ["int", "double", "Both", "Compilation error"],
    correctAnswer: "int",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "What is the output?\n\nclass Parent {\n    static void show() {\n        System.out.println(\"Parent\");\n    }\n}\n\nclass Child extends Parent {\n    static void show() {\n        System.out.println(\"Child\");\n    }\n}\n\nParent obj = new Child();\nobj.show();",
    options: ["Parent", "Child", "Both", "Compilation error"],
    correctAnswer: "Parent",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "What is the output?\n\nclass Parent {\n    void show() {\n        System.out.println(\"Parent\");\n    }\n}\n\nclass Child extends Parent {\n    void show() {\n        System.out.println(\"Child\");\n    }\n\n    void test() {\n        super.show();\n        this.show();\n    }\n}\n\nnew Child().test();",
    options: [
      "Parent Child",
      "Child Parent",
      "Parent Parent",
      "Child Child"
    ],
    correctAnswer: "Parent Child",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "Which statement best explains dynamic method dispatch?",
    options: [
      "The overridden method to execute is determined at runtime based on the actual object",
      "The method is always selected from the reference type at compile time",
      "It applies only to constructors",
      "It applies only to static methods"
    ],
    correctAnswer:
      "The overridden method to execute is determined at runtime based on the actual object",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "What is the output?\n\nclass Test {\n    void show(Object x) {\n        System.out.println(\"Object\");\n    }\n\n    void show(String x) {\n        System.out.println(\"String\");\n    }\n}\n\nTest t = new Test();\nt.show(\"Java\");",
    options: ["Object", "String", "Both", "Compilation error"],
    correctAnswer: "String",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "What happens if a superclass reference points to a subclass object but the subclass contains a method that does not exist in the superclass?",
    options: [
      "The superclass reference cannot directly call that subclass-only method",
      "The method is automatically called",
      "Compilation always creates a new superclass method",
      "The method becomes static"
    ],
    correctAnswer:
      "The superclass reference cannot directly call that subclass-only method",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "Which statement about covariant return types is correct?",
    options: [
      "An overriding method can return a subtype of the original return type",
      "An overriding method must always return int",
      "Return types can always be unrelated",
      "Only overloaded methods support return types"
    ],
    correctAnswer:
      "An overriding method can return a subtype of the original return type",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "What is the output?\n\nclass A {\n    Number get() {\n        return 10;\n    }\n}\n\nclass B extends A {\n    Integer get() {\n        return 20;\n    }\n}\n\nA obj = new B();\nSystem.out.println(obj.get());",
    options: ["10", "20", "Compilation error", "null"],
    correctAnswer: "20",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "Which statement correctly distinguishes overloading from overriding?",
    options: [
      "Overloading is generally resolved at compile time, while overriding participates in runtime polymorphism",
      "Both are resolved only at runtime",
      "Overriding requires different parameter lists",
      "Overloading requires inheritance"
    ],
    correctAnswer:
      "Overloading is generally resolved at compile time, while overriding participates in runtime polymorphism",
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
    console.log("Topic 12 Assessment Question Seeding");
    console.log("========================================\n");

    const topic = await Topic.findOne({
      title: "Polymorphism",
      subject: "Java",
    });

    if (!topic) {
      console.log("❌ Topic 'Polymorphism' not found.");
      console.log("Please make sure Topic 12 exists in MongoDB.");
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
    console.log("Topic: Polymorphism");
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