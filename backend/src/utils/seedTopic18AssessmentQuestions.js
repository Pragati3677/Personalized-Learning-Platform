const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("../config/db");
const Topic = require("../models/Topic");
const EngagementQuestion = require("../models/EngagementQuestion");

// =====================================================
// TOPIC 18: ADVANCED JAVA
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
    question: "Which concept allows multiple threads to execute concurrently?",
    options: [
      "Multithreading",
      "Inheritance",
      "Encapsulation",
      "Serialization"
    ],
    correctAnswer: "Multithreading",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which interface can be implemented to define a task for a thread?",
    options: [
      "Runnable",
      "Threadable",
      "Executable",
      "Process"
    ],
    correctAnswer: "Runnable",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which method starts a new thread of execution?",
    options: ["start()", "run()", "execute()", "begin()"],
    correctAnswer: "start()",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which method contains the code executed by a Thread?",
    options: ["run()", "start()", "execute()", "mainThread()"],
    correctAnswer: "run()",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which keyword is used to protect a critical section from simultaneous access by multiple threads?",
    options: ["synchronized", "volatile", "thread", "parallel"],
    correctAnswer: "synchronized",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which package contains the ExecutorService interface?",
    options: [
      "java.util.concurrent",
      "java.io",
      "java.thread",
      "java.executor"
    ],
    correctAnswer: "java.util.concurrent",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which feature allows Java objects to be converted into a byte stream?",
    options: [
      "Serialization",
      "Inheritance",
      "Compilation",
      "Encapsulation"
    ],
    correctAnswer: "Serialization",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which interface is commonly implemented by a class whose objects can be serialized?",
    options: [
      "Serializable",
      "Serial",
      "Storable",
      "Persistent"
    ],
    correctAnswer: "Serializable",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which keyword prevents a field from being serialized?",
    options: ["transient", "volatile", "static", "final"],
    correctAnswer: "transient",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which keyword is used to indicate that a variable's value may be changed by different threads?",
    options: ["volatile", "shared", "threaded", "atomic"],
    correctAnswer: "volatile",
    marks: 3,
    difficulty: "basic",
  },

  // =====================================================
  // MEDIUM - 10 × 3 = 30
  // =====================================================

  {
    question: "What is the main difference between start() and run() for a Thread?",
    options: [
      "start() creates a new thread, while run() contains the task executed by that thread",
      "run() creates a new thread, while start() stops it",
      "Both always create separate threads",
      "start() only works with Runnable"
    ],
    correctAnswer:
      "start() creates a new thread, while run() contains the task executed by that thread",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which method pauses the current thread for a specified amount of time?",
    options: ["sleep()", "wait()", "pause()", "delay()"],
    correctAnswer: "sleep()",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which method can be used to wait for another thread to complete?",
    options: ["join()", "waitFor()", "complete()", "finish()"],
    correctAnswer: "join()",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is synchronization mainly used for?",
    options: [
      "Controlling concurrent access to shared resources",
      "Creating objects",
      "Compiling classes",
      "Reading files"
    ],
    correctAnswer:
      "Controlling concurrent access to shared resources",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which interface represents a task that returns a result and can throw an exception?",
    options: [
      "Callable",
      "Runnable",
      "Executable",
      "Task"
    ],
    correctAnswer: "Callable",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which object represents the result of a computation performed by an ExecutorService?",
    options: [
      "Future",
      "Result",
      "Promise",
      "TaskResult"
    ],
    correctAnswer: "Future",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which class is commonly used to create a fixed-size thread pool?",
    options: [
      "Executors",
      "ThreadPool",
      "ThreadFactoryOnly",
      "ConcurrentThreads"
    ],
    correctAnswer: "Executors",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which exception can occur when a thread is interrupted while sleeping or waiting?",
    options: [
      "InterruptedException",
      "ThreadException",
      "SleepException",
      "ConcurrentException"
    ],
    correctAnswer: "InterruptedException",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which method is used to wait for another thread while releasing the object's monitor?",
    options: [
      "wait()",
      "sleep()",
      "join()",
      "pause()"
    ],
    correctAnswer: "wait()",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which method is used to wake a single thread waiting on an object's monitor?",
    options: [
      "notify()",
      "wake()",
      "resume()",
      "signalThread()"
    ],
    correctAnswer: "notify()",
    marks: 3,
    difficulty: "medium",
  },

  // =====================================================
  // ADVANCED - 10 × 4 = 40
  // =====================================================

  {
    question:
      "What happens when start() is called on a Thread object?",
    options: [
      "A new thread is scheduled for execution and eventually invokes run()",
      "run() executes only in the current thread",
      "The thread immediately becomes terminated",
      "The JVM creates a new process"
    ],
    correctAnswer:
      "A new thread is scheduled for execution and eventually invokes run()",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "What happens if run() is called directly instead of start()?",
    options: [
      "The run method executes in the current thread",
      "A new thread is always created",
      "The JVM throws an exception",
      "The thread becomes blocked"
    ],
    correctAnswer:
      "The run method executes in the current thread",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "Which statement about volatile is correct?",
    options: [
      "It provides visibility of changes between threads but does not by itself make compound operations atomic",
      "It makes every operation atomic",
      "It automatically synchronizes all methods",
      "It prevents context switching"
    ],
    correctAnswer:
      "It provides visibility of changes between threads but does not by itself make compound operations atomic",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "Which class provides atomic operations such as incrementAndGet()?",
    options: [
      "AtomicInteger",
      "IntegerAtomic",
      "ThreadInteger",
      "ConcurrentInteger"
    ],
    correctAnswer: "AtomicInteger",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "What is a deadlock?",
    options: [
      "A situation where threads wait indefinitely for resources held by each other",
      "A thread completing successfully",
      "A thread sleeping temporarily",
      "A thread being interrupted"
    ],
    correctAnswer:
      "A situation where threads wait indefinitely for resources held by each other",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "Which condition is commonly required for a deadlock?",
    options: [
      "Circular waiting",
      "Thread termination",
      "Garbage collection",
      "Serialization"
    ],
    correctAnswer: "Circular waiting",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "What is the purpose of ExecutorService.shutdown()?",
    options: [
      "It initiates an orderly shutdown in which previously submitted tasks continue executing",
      "It immediately kills every running thread",
      "It deletes all queued tasks without waiting",
      "It restarts the executor"
    ],
    correctAnswer:
      "It initiates an orderly shutdown in which previously submitted tasks continue executing",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "Which statement about synchronized methods is correct?",
    options: [
      "A synchronized instance method locks the monitor associated with the current object",
      "It locks every object in the JVM",
      "It only works with static variables",
      "It prevents all threads from executing"
    ],
    correctAnswer:
      "A synchronized instance method locks the monitor associated with the current object",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "What happens when wait() is called without owning the object's monitor?",
    options: [
      "IllegalMonitorStateException is thrown",
      "The thread automatically obtains the monitor",
      "The thread continues normally",
      "InterruptedException is always thrown"
    ],
    correctAnswer:
      "IllegalMonitorStateException is thrown",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "Which statement about serialization and transient fields is correct?",
    options: [
      "A transient instance field is skipped during default serialization",
      "Transient fields are always serialized first",
      "Transient fields must be static",
      "Transient fields cannot exist in Java classes"
    ],
    correctAnswer:
      "A transient instance field is skipped during default serialization",
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
    console.log("Topic 18 Assessment Question Seeding");
    console.log("========================================\n");

    const topic = await Topic.findOne({
      title: "Advanced Java",
      subject: "Java",
    });

    if (!topic) {
      console.log("❌ Topic 'Advanced Java' not found.");
      console.log("Please make sure Topic 18 exists in MongoDB.");
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
    console.log("Topic: Advanced Java");
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