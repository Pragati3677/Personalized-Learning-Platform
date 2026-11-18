
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
    url: "https://youtu.be/Eex25gBotB0?si=7mBRZUSkswDm1_Lz",
    description: "Review advanced Java concepts and their applications.",
    order: 1,
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
    url: "https://youtu.be/P8kJGjbGNv4?si=TsperGn5W_WyTOqd",
    description: "Learn to process collections using streams.",
    order: 1,
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
    url: "https://youtu.be/WkKT5M-ABnY?si=vsjp0yHrYfzj220h",
    description: "Explore concurrency and asynchronous programming.",
    order: 1,
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

async function seedLoopsResources() {
  try {
    if (!MONGODB_URI) {
      throw new Error("Missing MONGODB_URI or MONGO_URI in your .env file.");
    }

    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    const topic = await Topic.findOne({ title: TOPIC_TITLE });

    if (!topic) {
      throw new Error(`Topic "${TOPIC_TITLE}" was not found.`);
    }

    // Remove old videos belonging only to the Loops topic
    const deletedVideos = await LearningResource.deleteMany({
      topicId: topic._id,
      type: "video",
    });

    console.log("Old Loops videos removed:", deletedVideos.deletedCount);

    let insertedCount = 0;
    let updatedCount = 0;

    // Insert or update all 15 resources
    for (const resource of resources) {
      if (!resource.title || !resource.type || !resource.level) {
        throw new Error(`Invalid resource: ${resource.title || "Unknown"}`);
      }

      const filter = {
        topicId: topic._id,
        title: resource.title,
        type: resource.type,
        level: resource.level,
      };

      const resourceData = {
        ...resource,
        url: resource.url?.trim(),
        topicId: topic._id,
        isActive: true,
      };

      const result = await LearningResource.updateOne(
        filter,
        { $set: resourceData },
        { upsert: true, runValidators: true }
      );

      if (result.upsertedCount > 0) {
        insertedCount++;
      } else if (result.modifiedCount > 0) {
        updatedCount++;
      }
    }

    // Verify actual active resources in MongoDB
    const counts = await LearningResource.aggregate([
      {
        $match: {
          topicId: topic._id,
          isActive: true,
          level: { $in: ["basic", "medium", "advanced"] },
        },
      },
      {
        $group: {
          _id: {
            level: "$level",
            type: "$type",
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.level": 1,
          "_id.type": 1,
        },
      },
    ]);

    console.log("\n========== LOOPS SEEDING SUMMARY ==========");
    console.log("Topic:", topic.title);
    console.log("Total resources in seed file:", resources.length);
    console.log("Old videos deleted:", deletedVideos.deletedCount);
    console.log("Inserted:", insertedCount);
    console.log("Updated:", updatedCount);

    console.log("\nActive Resource Counts:");

    console.table(
      counts.map((item) => ({
        Level: item._id.level,
        Type: item._id.type,
        Count: item.count,
      }))
    );

    console.log("\nLoops resources seeded successfully!");

  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected.");
  }
}

seedLoopsResources();
