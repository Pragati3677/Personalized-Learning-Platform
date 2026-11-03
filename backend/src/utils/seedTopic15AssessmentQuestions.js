const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("../config/db");
const Topic = require("../models/Topic");
const EngagementQuestion = require("../models/EngagementQuestion");

// =====================================================
// TOPIC 15: COLLECTIONS FRAMEWORK
// Existing question: 1 Basic × 3 = 3 marks
// New questions: 29
//
// New:
// Basic:    9 × 3 = 27
// Medium:  10 × 3 = 30
// Advanced:10 × 4 = 40
//
// Total:
// Existing 3 + New 97 = 100 marks
// Final questions = 30
// =====================================================

const questions = [
  // =====================================================
  // BASIC - 9 NEW QUESTIONS × 3 = 27
  // =====================================================

  {
    question: "Which interface represents an ordered collection that can contain duplicate elements?",
    options: ["List", "Set", "Map", "Queue"],
    correctAnswer: "List",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which interface does not allow duplicate elements?",
    options: ["Set", "List", "Queue", "Collection"],
    correctAnswer: "Set",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which interface stores elements as key-value pairs?",
    options: ["Map", "List", "Set", "Queue"],
    correctAnswer: "Map",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which class provides a resizable array implementation of List?",
    options: ["ArrayList", "HashSet", "HashMap", "TreeSet"],
    correctAnswer: "ArrayList",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which class implements the Map interface using hashing?",
    options: ["HashMap", "ArrayList", "HashSet", "LinkedList"],
    correctAnswer: "HashMap",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which collection maintains insertion order and does not allow duplicate elements?",
    options: ["LinkedHashSet", "HashSet", "TreeSet", "HashMap"],
    correctAnswer: "LinkedHashSet",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which collection stores elements in sorted order and does not allow duplicates?",
    options: ["TreeSet", "HashSet", "ArrayList", "LinkedList"],
    correctAnswer: "TreeSet",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which interface is commonly used for a first-in-first-out collection?",
    options: ["Queue", "Set", "Map", "List"],
    correctAnswer: "Queue",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which class is commonly used to implement a doubly linked list?",
    options: ["LinkedList", "ArrayList", "HashSet", "TreeMap"],
    correctAnswer: "LinkedList",
    marks: 3,
    difficulty: "basic",
  },

  // =====================================================
  // MEDIUM - 10 QUESTIONS × 3 = 30
  // =====================================================

  {
    question: "Which collection is generally efficient for random access using an index?",
    options: ["ArrayList", "LinkedList", "HashSet", "TreeSet"],
    correctAnswer: "ArrayList",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which collection is generally suitable for frequent insertion and deletion operations?",
    options: ["LinkedList", "ArrayList", "HashSet", "TreeSet"],
    correctAnswer: "LinkedList",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which Map implementation maintains insertion order?",
    options: ["LinkedHashMap", "HashMap", "TreeMap", "Hashtable"],
    correctAnswer: "LinkedHashMap",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which Map implementation maintains keys in sorted order?",
    options: ["TreeMap", "HashMap", "LinkedHashMap", "Hashtable"],
    correctAnswer: "TreeMap",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which interface provides methods such as add(), remove(), and contains()?",
    options: ["Collection", "Map", "Iterator", "Comparator"],
    correctAnswer: "Collection",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which interface is commonly used to traverse collection elements?",
    options: ["Iterator", "Comparable", "Map", "Comparator"],
    correctAnswer: "Iterator",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which method checks whether a collection contains a particular element?",
    options: ["contains()", "exists()", "has()", "search()"],
    correctAnswer: "contains()",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which method returns the number of elements in a collection?",
    options: ["size()", "length()", "count()", "capacity()"],
    correctAnswer: "size()",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which collection uses priority-based ordering?",
    options: ["PriorityQueue", "ArrayList", "HashSet", "LinkedHashSet"],
    correctAnswer: "PriorityQueue",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which interface allows traversal of a List in both forward and backward directions?",
    options: ["ListIterator", "Iterator", "Collection", "Iterable"],
    correctAnswer: "ListIterator",
    marks: 3,
    difficulty: "medium",
  },

  // =====================================================
  // ADVANCED - 10 QUESTIONS × 4 = 40
  // =====================================================

  {
    question:
      "What is the output?\n\nSet<Integer> set = new HashSet<>();\nset.add(10);\nset.add(20);\nset.add(10);\nSystem.out.println(set.size());",
    options: ["1", "2", "3", "Compilation error"],
    correctAnswer: "2",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "What is the output?\n\nMap<String, Integer> map = new HashMap<>();\nmap.put(\"Java\", 10);\nmap.put(\"Java\", 20);\nSystem.out.println(map.get(\"Java\"));",
    options: ["10", "20", "30", "null"],
    correctAnswer: "20",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What happens when a HashMap receives a new value for an existing key?",
    options: [
      "The existing value is replaced",
      "A duplicate key is created",
      "The new value is ignored",
      "The map becomes a Set"
    ],
    correctAnswer: "The existing value is replaced",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "Which statement about HashMap is correct?",
    options: [
      "It allows one null key and multiple null values",
      "It does not allow null values",
      "It allows duplicate keys",
      "It automatically sorts keys"
    ],
    correctAnswer: "It allows one null key and multiple null values",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "Which statement correctly compares HashSet and TreeSet?",
    options: [
      "HashSet is hash-based, while TreeSet maintains sorted order",
      "HashSet always maintains sorted order",
      "TreeSet allows duplicate elements",
      "Both always preserve insertion order"
    ],
    correctAnswer:
      "HashSet is hash-based, while TreeSet maintains sorted order",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the purpose of the Comparable interface?",
    options: [
      "To define the natural ordering of objects",
      "To store key-value pairs",
      "To remove duplicate objects",
      "To create threads"
    ],
    correctAnswer: "To define the natural ordering of objects",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the purpose of the Comparator interface?",
    options: [
      "To define custom ordering of objects",
      "To store key-value pairs",
      "To create immutable collections",
      "To handle exceptions"
    ],
    correctAnswer: "To define custom ordering of objects",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "What happens when Iterator.remove() is called after next() during iteration?",
    options: [
      "The last element returned by next() is removed",
      "The entire collection is cleared",
      "The iterator is sorted",
      "A new iterator is created"
    ],
    correctAnswer:
      "The last element returned by next() is removed",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "What may happen if a collection is structurally modified directly while using a fail-fast iterator?",
    options: [
      "ConcurrentModificationException may be thrown",
      "The collection is automatically synchronized",
      "The iterator restarts automatically",
      "The modification is always ignored"
    ],
    correctAnswer:
      "ConcurrentModificationException may be thrown",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What is the main difference between Collection and Map?",
    options: [
      "Collection stores individual elements, while Map stores key-value associations",
      "Collection stores only key-value pairs",
      "Map stores only individual elements",
      "Map extends Collection"
    ],
    correctAnswer:
      "Collection stores individual elements, while Map stores key-value associations",
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
    console.log("Topic 15 Assessment Question Seeding");
    console.log("========================================\n");

    const topic = await Topic.findOne({
      title: "Collections Framework",
      subject: "Java",
    });

    if (!topic) {
      console.log("❌ Topic 'Collections Framework' not found.");
      process.exit(1);
    }

    console.log(`✅ Topic found: ${topic.title}`);
    console.log(`Topic ID: ${topic._id}\n`);

    // -------------------------------------------------
    // Check existing questions
    // -------------------------------------------------

    const existingQuestions = await EngagementQuestion.find({
      topicId: topic._id,
    });

    console.log(
      `Existing questions for this topic: ${existingQuestions.length}`
    );

    if (existingQuestions.length !== 1) {
      console.log(
        "❌ Expected exactly 1 existing question for Topic 15."
      );
      console.log("No questions were inserted.");
      process.exit(1);
    }

    const existingQuestion = existingQuestions[0];

    console.log(
      `Existing question: ${existingQuestion.question}`
    );
    console.log(
      `Existing marks: ${existingQuestion.marks}`
    );
    console.log(
      `Existing difficulty: ${existingQuestion.difficulty}\n`
    );

    // -------------------------------------------------
    // Validate existing question
    // -------------------------------------------------

    if (
      existingQuestion.marks !== 3 ||
      existingQuestion.difficulty !== "basic"
    ) {
      console.log(
        "❌ Existing question must have marks = 3 and difficulty = basic."
      );
      console.log(
        "Please update the existing question first."
      );
      process.exit(1);
    }

    // -------------------------------------------------
    // Validate new questions
    // -------------------------------------------------

    if (questions.length !== 29) {
      console.log(
        `❌ Expected 29 new questions, found ${questions.length}.`
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

    console.log("New Question Distribution:");
    console.log(`Basic: ${basicCount}`);
    console.log(`Medium: ${mediumCount}`);
    console.log(`Advanced: ${advancedCount}\n`);

    if (
      basicCount !== 9 ||
      mediumCount !== 10 ||
      advancedCount !== 10
    ) {
      console.log(
        "❌ New question distribution is incorrect."
      );
      process.exit(1);
    }

    const newMarks = questions.reduce(
      (total, question) => total + question.marks,
      0
    );

    console.log(`New questions marks: ${newMarks}`);

    if (newMarks !== 97) {
      console.log(
        "❌ New questions must total exactly 97 marks."
      );
      process.exit(1);
    }

    const existingMarks = existingQuestion.marks;
    const finalMarks = existingMarks + newMarks;

    console.log(`Existing question marks: ${existingMarks}`);
    console.log(`Final total marks: ${finalMarks}`);

    if (finalMarks !== 100) {
      console.log(
        "❌ Final assessment must total exactly 100 marks."
      );
      process.exit(1);
    }

    // -------------------------------------------------
    // Insert 29 new questions
    // -------------------------------------------------

    const questionsWithTopic = questions.map((question) => ({
      ...question,
      topicId: topic._id,
      isActive: true,
    }));

    await EngagementQuestion.insertMany(questionsWithTopic);

    // -------------------------------------------------
    // Final verification
    // -------------------------------------------------

    const finalQuestions = await EngagementQuestion.find({
      topicId: topic._id,
    });

    const finalTotalMarks = finalQuestions.reduce(
      (total, question) => total + question.marks,
      0
    );

    const finalBasic = finalQuestions.filter(
      (q) => q.difficulty === "basic"
    ).length;

    const finalMedium = finalQuestions.filter(
      (q) => q.difficulty === "medium"
    ).length;

    const finalAdvanced = finalQuestions.filter(
      (q) => q.difficulty === "advanced"
    ).length;

    console.log("\n========================================");
    console.log("✅ SUCCESS");
    console.log("========================================");
    console.log(`Topic: ${topic.title}`);
    console.log(`Final Questions: ${finalQuestions.length}`);
    console.log(`Basic: ${finalBasic}`);
    console.log(`Medium: ${finalMedium}`);
    console.log(`Advanced: ${finalAdvanced}`);
    console.log(`Total Marks: ${finalTotalMarks}`);
    console.log("========================================\n");

    if (
      finalQuestions.length !== 30 ||
      finalBasic !== 10 ||
      finalMedium !== 10 ||
      finalAdvanced !== 10 ||
      finalTotalMarks !== 100
    ) {
      console.log(
        "⚠️ WARNING: Final verification did not match the expected assessment structure."
      );
      process.exit(1);
    }

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error while seeding questions:");
    console.error(error.message);
    process.exit(1);
  }
};

seedQuestions();