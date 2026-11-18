
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Topic = require("../models/Topic");
const LearningResource = require("../models/LearningResource");

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || process.env.MONGO_URI;

const TOPIC_TITLE = "Exception Handling";

const resources = [
  // BASIC
  {
    title: "Introduction to Exception Handling in Java",
    type: "video",
    level: "basic",
    url: " https://www.youtube.com/watch?v=mJg9iQZJEpw",
    description: "Understand exceptions and why exception handling is needed.",
    order: 1,
  },
  
  {
    title: "Exception Handling Basics",
    type: "note",
    level: "basic",
    content:
      "An exception is an event that interrupts the normal flow of a program. Java uses try to enclose risky code and catch to handle an exception. The finally block is commonly used for cleanup operations.",
    description: "Notes on exceptions, try, catch, and finally.",
    order: 3,
  },
  {
    title: "Common Java Exceptions",
    type: "note",
    level: "basic",
    content:
      "Common exceptions include ArithmeticException, NullPointerException, ArrayIndexOutOfBoundsException, NumberFormatException, and IOException. Choose suitable exception handling based on the operation being performed.",
    description: "Learn common exceptions and their causes.",
    order: 4,
  },
  {
    title: "Basic Try-Catch Practice",
    type: "worksheet",
    level: "basic",
    content:
      "1. Handle division by zero. 2. Handle invalid array indexes. 3. Explain the purpose of try and catch. 4. Write a program using finally.",
    description: "Practice basic exception-handling programs.",
    order: 5,
  },
  {
    title: "Exception Handling Quick Revision",
    type: "note",
    level: "basic",
    content:
      "Remember: try contains risky statements, catch handles matching exceptions, and finally executes during normal or exceptional completion in ordinary cases. Multiple catch blocks can handle different exception types.",
    description: "Revise the fundamental concepts.",
    order: 6,
  },

  // MEDIUM
  {
    title: "Throw and Throws in Java",
    type: "video",
    level: "medium",
    url: "https://youtu.be/uSLSswpvlEU?si=QO2lxOuBAZ_PSmRt",
    description: "Understand the difference between throw and throws.",
    order: 1,
  },
  
  {
    title: "Throw and Throws Notes",
    type: "note",
    level: "medium",
    content:
      "The throw keyword explicitly throws an exception object. The throws keyword declares exceptions that a method may pass to its caller. Checked exceptions are generally checked by the compiler, while unchecked exceptions include RuntimeException and its subclasses.",
    description: "Compare throw, throws, and exception categories.",
    order: 3,
  },
  {
    title: "Multiple Catch and Nested Try",
    type: "note",
    level: "medium",
    content:
      "Multiple catch blocks can handle different exception types. When using related exception types, place more specific catches before broader catches. Nested try blocks allow exception handling at different levels.",
    description: "Learn multiple catch blocks and nested try.",
    order: 4,
  },
  {
    title: "Intermediate Exception Exercises",
    type: "worksheet",
    level: "medium",
    content:
      "1. Write a method using throws. 2. Explicitly throw an IllegalArgumentException. 3. Handle two different exception types. 4. Explain checked versus unchecked exceptions.",
    description: "Practice intermediate Java exception handling.",
    order: 5,
  },
  {
    title: "Finally Block and Resource Cleanup",
    type: "note",
    level: "medium",
    content:
      "The finally block is generally used for cleanup and normally executes whether an exception occurs or not. For resources implementing AutoCloseable, try-with-resources is often a safer way to close them automatically.",
    description: "Review cleanup and resource management.",
    order: 6,
  },

  // ADVANCED
  {
    title: "Custom Exceptions in Java",
    type: "video",
    level: "advanced",
    url: "https://youtu.be/bxcZ7cXbDI0?si=3Q91Ge7tnP7Gp9Fr",
    description: "Create and use custom exception classes.",
    order: 1,
  },
  
  {
    title: "Custom Exception Design",
    type: "note",
    level: "advanced",
    content:
      "Create a custom checked exception by extending Exception, or an unchecked exception by extending RuntimeException. Constructors can pass a message to the superclass. Exception chaining preserves the original cause when wrapping an exception.",
    description: "Understand custom exceptions and exception chaining.",
    order: 3,
  },
  {
    title: "Exception Handling Best Practices",
    type: "note",
    level: "advanced",
    content:
      "Catch exceptions you can handle meaningfully. Avoid empty catch blocks and overly broad catches. Preserve useful error information, use try-with-resources for closeable resources, and do not use exceptions as ordinary control flow.",
    description: "Learn robust exception-handling practices.",
    order: 4,
  },
  {
    title: "Advanced Exception Handling Exercises",
    type: "worksheet",
    level: "advanced",
    content:
      "1. Create a custom InvalidAgeException. 2. Implement a method that declares a checked exception. 3. Use try-with-resources to read a file. 4. Wrap an exception while preserving its original cause.",
    description: "Apply advanced exception-handling techniques.",
    order: 5,
  },
  {
    title: "Exception Handling Revision",
    type: "note",
    level: "advanced",
    content:
      "Review exception hierarchy, checked and unchecked exceptions, throw, throws, finally, custom exceptions, try-with-resources, and exception chaining. Test both successful execution and failure cases.",
    description: "Consolidate advanced exception-handling concepts.",
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
