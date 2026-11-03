
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
    url: "https://www.youtube.com/results?search_query=Java+exception+handling+for+beginners",
    description: "Understand exceptions and why exception handling is needed.",
    order: 1,
  },
  {
    title: "Try and Catch Blocks in Java",
    type: "video",
    level: "basic",
    url: "https://www.youtube.com/results?search_query=Java+try+catch+blocks+tutorial",
    description: "Learn to handle runtime exceptions using try and catch.",
    order: 2,
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
    url: "https://www.youtube.com/results?search_query=Java+throw+throws+keyword+tutorial",
    description: "Understand the difference between throw and throws.",
    order: 1,
  },
  {
    title: "Checked and Unchecked Exceptions",
    type: "video",
    level: "medium",
    url: "https://www.youtube.com/results?search_query=Java+checked+unchecked+exceptions+tutorial",
    description: "Learn exception categories and compiler checking.",
    order: 2,
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
    url: "https://www.youtube.com/results?search_query=Java+custom+user+defined+exceptions+tutorial",
    description: "Create and use custom exception classes.",
    order: 1,
  },
  {
    title: "Try-With-Resources and Exception Chaining",
    type: "video",
    level: "advanced",
    url: "https://www.youtube.com/results?search_query=Java+try+with+resources+exception+chaining",
    description: "Explore automatic resource management and exception causes.",
    order: 2,
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
    console.log("Exception Handling resources seeded successfully.");
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedResources();
