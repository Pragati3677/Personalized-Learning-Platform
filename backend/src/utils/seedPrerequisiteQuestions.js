const mongoose = require("mongoose");
require("dotenv").config();

const PrerequisiteQuestion = require("../models/PrerequisiteQuestion");

const prerequisiteId = "6aaa57f0b03509e218cbeb78";

const questions = [
  // =========================
  // JAVA BASICS - 20 QUESTIONS
  // =========================

  {
    prerequisiteId,
    category: "java",
    question: "Which keyword is used to create a class in Java?",
    options: ["class", "Class", "create", "new"],
    correctAnswer: "class",
    marks: 3,
    difficulty: "easy",
  },
  {
    prerequisiteId,
    category: "java",
    question: "Which method is the starting point of a Java program?",
    options: ["start()", "main()", "run()", "execute()"],
    correctAnswer: "main()",
    marks: 3,
    difficulty: "easy",
  },
  {
    prerequisiteId,
    category: "java",
    question: "Which data type is used to store an integer in Java?",
    options: ["float", "int", "char", "boolean"],
    correctAnswer: "int",
    marks: 3,
    difficulty: "easy",
  },
  {
    prerequisiteId,
    category: "java",
    question: "Which symbol is used to end a statement in Java?",
    options: [".", ":", ";", ","],
    correctAnswer: ";",
    marks: 3,
    difficulty: "easy",
  },
  {
    prerequisiteId,
    category: "java",
    question: "Which keyword is used to inherit a class in Java?",
    options: ["implements", "extends", "inherits", "super"],
    correctAnswer: "extends",
    marks: 3,
    difficulty: "easy",
  },
  {
    prerequisiteId,
    category: "java",
    question: "Which data type stores true or false?",
    options: ["int", "char", "boolean", "String"],
    correctAnswer: "boolean",
    marks: 3,
    difficulty: "easy",
  },
  {
    prerequisiteId,
    category: "java",
    question: "Which operator checks whether two values are equal?",
    options: ["=", "==", "+=", "&&"],
    correctAnswer: "==",
    marks: 3,
    difficulty: "easy",
  },
  {
    prerequisiteId,
    category: "java",
    question: "Which loop executes at least once?",
    options: ["for", "while", "do-while", "foreach"],
    correctAnswer: "do-while",
    marks: 3,
    difficulty: "easy",
  },
  {
    prerequisiteId,
    category: "java",
    question: "Which keyword is used to create an object?",
    options: ["object", "create", "new", "this"],
    correctAnswer: "new",
    marks: 3,
    difficulty: "easy",
  },
  {
    prerequisiteId,
    category: "java",
    question: "Which keyword is used to declare a constant?",
    options: ["constant", "const", "final", "static"],
    correctAnswer: "final",
    marks: 3,
    difficulty: "easy",
  },
  {
    prerequisiteId,
    category: "java",
    question: "Which of these is not a primitive data type in Java?",
    options: ["int", "char", "String", "boolean"],
    correctAnswer: "String",
    marks: 3,
    difficulty: "easy",
  },
  {
    prerequisiteId,
    category: "java",
    question: "What is the index of the first element of a Java array?",
    options: ["0", "1", "-1", "2"],
    correctAnswer: "0",
    marks: 3,
    difficulty: "easy",
  },
  {
    prerequisiteId,
    category: "java",
    question: "Which keyword refers to the current object?",
    options: ["self", "current", "this", "object"],
    correctAnswer: "this",
    marks: 3,
    difficulty: "easy",
  },
  {
    prerequisiteId,
    category: "java",
    question: "Which concept allows the same method name with different parameters?",
    options: [
      "Inheritance",
      "Method Overloading",
      "Encapsulation",
      "Abstraction",
    ],
    correctAnswer: "Method Overloading",
    marks: 3,
    difficulty: "medium",
  },
  {
    prerequisiteId,
    category: "java",
    question: "Which concept hides implementation details?",
    options: [
      "Inheritance",
      "Polymorphism",
      "Abstraction",
      "Compilation",
    ],
    correctAnswer: "Abstraction",
    marks: 3,
    difficulty: "medium",
  },
  {
    prerequisiteId,
    category: "java",
    question: "Which access modifier provides the widest access?",
    options: ["private", "protected", "public", "default"],
    correctAnswer: "public",
    marks: 3,
    difficulty: "easy",
  },
  {
    prerequisiteId,
    category: "java",
    question: "Which keyword is used to handle exceptions?",
    options: ["try", "check", "error", "exception"],
    correctAnswer: "try",
    marks: 3,
    difficulty: "easy",
  },
  {
    prerequisiteId,
    category: "java",
    question: "Which class is commonly used for keyboard input?",
    options: ["Input", "Scanner", "Keyboard", "Reader"],
    correctAnswer: "Scanner",
    marks: 3,
    difficulty: "easy",
  },
  {
    prerequisiteId,
    category: "java",
    question: "Which concept allows a class to acquire properties of another class?",
    options: [
      "Encapsulation",
      "Inheritance",
      "Abstraction",
      "Overloading",
    ],
    correctAnswer: "Inheritance",
    marks: 3,
    difficulty: "easy",
  },
  {
    prerequisiteId,
    category: "java",
    question: "Which collection does not allow duplicate elements?",
    options: ["List", "Set", "ArrayList", "Vector"],
    correctAnswer: "Set",
    marks: 3,
    difficulty: "medium",
  },

  // =========================
  // BASIC DSA - 10 QUESTIONS
  // =========================

  {
    prerequisiteId,
    category: "dsa",
    question: "Which data structure follows LIFO?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    correctAnswer: "Stack",
    marks: 4,
    difficulty: "easy",
  },
  {
    prerequisiteId,
    category: "dsa",
    question: "Which data structure follows FIFO?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    correctAnswer: "Queue",
    marks: 4,
    difficulty: "easy",
  },
  {
    prerequisiteId,
    category: "dsa",
    question: "What is the time complexity of accessing an array element by index?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    correctAnswer: "O(1)",
    marks: 4,
    difficulty: "easy",
  },
  {
    prerequisiteId,
    category: "dsa",
    question: "Which search algorithm is efficient on a sorted array?",
    options: [
      "Linear Search",
      "Binary Search",
      "Bubble Sort",
      "DFS",
    ],
    correctAnswer: "Binary Search",
    marks: 4,
    difficulty: "easy",
  },
  {
    prerequisiteId,
    category: "dsa",
    question: "What is the worst-case time complexity of linear search?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctAnswer: "O(n)",
    marks: 4,
    difficulty: "easy",
  },
  {
    prerequisiteId,
    category: "dsa",
    question: "Which data structure consists of nodes connected by links?",
    options: ["Array", "Linked List", "Stack", "Heap"],
    correctAnswer: "Linked List",
    marks: 4,
    difficulty: "easy",
  },
  {
    prerequisiteId,
    category: "dsa",
    question: "Which sorting algorithm repeatedly swaps adjacent elements?",
    options: [
      "Merge Sort",
      "Quick Sort",
      "Bubble Sort",
      "Selection Sort",
    ],
    correctAnswer: "Bubble Sort",
    marks: 4,
    difficulty: "easy",
  },
  {
    prerequisiteId,
    category: "dsa",
    question: "Which data structure is commonly used for BFS?",
    options: ["Stack", "Queue", "Heap", "Array"],
    correctAnswer: "Queue",
    marks: 4,
    difficulty: "medium",
  },
  {
    prerequisiteId,
    category: "dsa",
    question: "Which data structure is commonly used for DFS?",
    options: ["Queue", "Stack", "Hash Table", "Array"],
    correctAnswer: "Stack",
    marks: 4,
    difficulty: "medium",
  },
  {
    prerequisiteId,
    category: "dsa",
    question: "What is the main purpose of a hash table?",
    options: [
      "Sorting data",
      "Fast key-based data access",
      "Storing only numbers",
      "Creating graphs",
    ],
    correctAnswer: "Fast key-based data access",
    marks: 4,
    difficulty: "medium",
  },
];

const seedQuestions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const existingQuestions =
      await PrerequisiteQuestion.countDocuments({
        prerequisiteId,
      });

    if (existingQuestions > 0) {
      console.log(
        `Questions already exist: ${existingQuestions}`
      );

      await mongoose.disconnect();
      return;
    }

    await PrerequisiteQuestion.insertMany(questions);

    console.log("30 prerequisite questions inserted successfully");
    console.log("Java Questions: 20");
    console.log("DSA Questions: 10");
    console.log("Total Marks: 100");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding questions:", error.message);
    process.exit(1);
  }
};

seedQuestions();