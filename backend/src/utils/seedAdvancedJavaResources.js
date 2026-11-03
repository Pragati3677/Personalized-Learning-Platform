
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Topic = require("../models/Topic");
const LearningResource = require("../models/LearningResource");

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || process.env.MONGO_URI;

const TOPIC_TITLE = "Advanced Java";

const resources = [
  // BASIC
  {
    title: "Introduction to Advanced Java Concepts",
    type: "video",
    level: "basic",
    url: "https://www.youtube.com/results?search_query=Java+advanced+concepts+tutorial",
    description: "Review advanced Java concepts and their applications.",
    order: 1,
  },
  {
    title: "Java Lambda Expressions",
    type: "video",
    level: "basic",
    url: "https://www.youtube.com/results?search_query=Java+lambda+expressions+for+beginners",
    description: "Learn concise functional-style expressions in Java.",
    order: 2,
  },
  {
    title: "Advanced Java Fundamentals",
    type: "note",
    level: "basic",
    content:
      "Advanced Java builds on core Java, OOP, collections, generics, and exception handling. Important topics include lambda expressions, functional interfaces, streams, and modern language features.",
    description: "Review the main advanced Java topics.",
    order: 3,
  },
  {
    title: "Functional Interfaces",
    type: "note",
    level: "basic",
    content:
      "A functional interface has exactly one abstract method, although it may contain default and static methods. The @FunctionalInterface annotation allows the compiler to check the intended design. Functional interfaces are commonly used with lambda expressions.",
    description: "Understand functional interfaces and lambdas.",
    order: 4,
  },
  {
    title: "Advanced Java Basics Worksheet",
    type: "worksheet",
    level: "basic",
    content:
      "1. Define a functional interface. 2. Write a lambda expression for a Runnable. 3. Explain the purpose of streams. 4. Identify how generics and collections work together.",
    description: "Practice basic advanced Java concepts.",
    order: 5,
  },
  {
    title: "Advanced Java Quick Revision",
    type: "note",
    level: "basic",
    content:
      "Remember: lambdas implement functional interfaces, streams process sequences of data, generics provide compile-time type safety, and exception handling helps manage failures.",
    description: "Revise the core concepts.",
    order: 6,
  },

  // MEDIUM
  {
    title: "Java Stream API Tutorial",
    type: "video",
    level: "medium",
    url: "https://www.youtube.com/results?search_query=Java+Stream+API+filter+map+reduce+tutorial",
    description: "Learn to process collections using streams.",
    order: 1,
  },
  {
    title: "Optional Class and Method References",
    type: "video",
    level: "medium",
    url: "https://www.youtube.com/results?search_query=Java+Optional+class+method+references+tutorial",
    description: "Explore Optional and method references.",
    order: 2,
  },
  {
    title: "Stream Operations",
    type: "note",
    level: "medium",
    content:
      "The Stream API supports operations such as filter(), map(), sorted(), and reduce(). Intermediate operations are generally lazy, while terminal operations such as collect(), count(), and forEach() trigger processing.",
    description: "Understand intermediate and terminal operations.",
    order: 3,
  },
  {
    title: "Optional and Method References",
    type: "note",
    level: "medium",
    content:
      "Optional represents a value that may or may not be present. Methods include of(), ofNullable(), empty(), map(), orElse(), and ifPresent(). Method references provide a compact way to refer to existing methods, such as System.out::println.",
    description: "Learn safer optional values and concise syntax.",
    order: 4,
  },
  {
    title: "Intermediate Advanced Java Worksheet",
    type: "worksheet",
    level: "medium",
    content:
      "1. Filter even numbers using streams. 2. Convert strings to uppercase using map(). 3. Count elements using count(). 4. Use Optional to provide a default value when a result is absent.",
    description: "Practice streams and Optional.",
    order: 5,
  },
  {
    title: "Date and Time API",
    type: "note",
    level: "medium",
    content:
      "The java.time package provides modern date and time classes. LocalDate represents a date, LocalTime represents a time, LocalDateTime represents both without a time zone, and ZonedDateTime includes zone information. These classes are generally immutable.",
    description: "Understand modern Java date and time handling.",
    order: 6,
  },

  // ADVANCED
  {
    title: "Java Multithreading and Concurrency",
    type: "video",
    level: "advanced",
    url: "https://www.youtube.com/results?search_query=Java+concurrency+ExecutorService+CompletableFuture+tutorial",
    description: "Explore concurrency and asynchronous programming.",
    order: 1,
  },
  {
    title: "Reflection and Annotations in Java",
    type: "video",
    level: "advanced",
    url: "https://www.youtube.com/results?search_query=Java+reflection+annotations+tutorial",
    description: "Learn runtime inspection and metadata.",
    order: 2,
  },
  {
    title: "Concurrency Fundamentals",
    type: "note",
    level: "advanced",
    content:
      "Java supports concurrent execution using threads and higher-level APIs. ExecutorService manages task execution, while synchronization and concurrent utilities help coordinate shared state. Correct concurrency design must consider race conditions, visibility, and deadlocks.",
    description: "Review thread coordination and concurrency risks.",
    order: 3,
  },
  {
    title: "Reflection and Annotations",
    type: "note",
    level: "advanced",
    content:
      "Reflection allows programs to inspect classes, methods, fields, and constructors at runtime. Annotations provide metadata that tools and frameworks can process. Reflection should be used carefully because it can reduce clarity and may be restricted by access controls.",
    description: "Understand runtime reflection and metadata.",
    order: 4,
  },
  {
    title: "Advanced Java Worksheet",
    type: "worksheet",
    level: "advanced",
    content:
      "1. Submit tasks using ExecutorService. 2. Explain a race condition. 3. Describe how reflection can inspect a class. 4. Create a custom annotation and explain how annotations provide metadata.",
    description: "Apply advanced Java concepts.",
    order: 5,
  },
  {
    title: "Advanced Java Best Practices",
    type: "note",
    level: "advanced",
    content:
      "Use streams when they improve readability, handle optional values deliberately, and prefer high-level concurrency utilities over manually managing threads when appropriate. Keep reflection limited to suitable use cases and write clear, testable code.",
    description: "Review maintainable advanced Java practices.",
    order: 6,
  },
];

async function seedResources() {
  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI or MONGO_URI is missing from .env");
    }

    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    const topic = await Topic.findOne({ title: TOPIC_TITLE });

    if (!topic) {
      throw new Error(
        `Topic "${TOPIC_TITLE}" was not found. Check the exact title in MongoDB.`
      );
    }

    let inserted = 0;
    let updated = 0;
    let unchanged = 0;

    for (const resource of resources) {
      const filter = {
        topicId: topic._id,
        title: resource.title,
        type: resource.type,
        level: resource.level,
      };

      const existing = await LearningResource.findOne(filter).lean();

      const result = await LearningResource.updateOne(
        filter,
        {
          $set: {
            ...resource,
            topicId: topic._id,
            isActive: true,
          },
        },
        { upsert: true, runValidators: true }
      );

      if (result.upsertedCount > 0) {
        inserted++;
      } else if (existing && result.modifiedCount > 0) {
        updated++;
      } else {
        unchanged++;
      }
    }

    console.log(`Topic: ${topic.title}`);
    console.log(`Inserted: ${inserted}`);
    console.log(`Updated: ${updated}`);
    console.log(`Unchanged: ${unchanged}`);
    console.log(`Total resources processed: ${resources.length}`);
    console.log("Advanced Java resources seeded successfully.");
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedResources();
