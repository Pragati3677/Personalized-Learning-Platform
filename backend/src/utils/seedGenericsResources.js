
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Topic = require("../models/Topic");
const LearningResource = require("../models/LearningResource");

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || process.env.MONGO_URI;

const TOPIC_TITLE = "Generics";

const resources = [
  {
    title: "Introduction to Generics in Java",
    type: "video",
    level: "basic",
    url: "https://www.youtube.com/watch?v=Y7X_ReDF3x8",
    description: "Understand generics and type safety in Java.",
    order: 1,
  },
  
  {
    title: "Generics Fundamentals",
    type: "note",
    level: "basic",
    content:
      "Generics allow classes, interfaces, and methods to work with specified types. They improve compile-time type safety and reduce explicit casting. Example: List<String> names = new ArrayList<>();",
    description: "Learn generic types and their benefits.",
    order: 3,
  },
  {
    title: "Generic Classes and Type Parameters",
    type: "note",
    level: "basic",
    content:
      "A generic class declares a type parameter, commonly represented by T. Example: class Box<T> { private T value; public void set(T value) { this.value = value; } public T get() { return value; } }. The type argument specifies the type used with the class.",
    description: "Understand type parameters with a simple example.",
    order: 4,
  },
  {
    title: "Basic Generics Worksheet",
    type: "worksheet",
    level: "basic",
    content:
      "1. Create a Box<T> generic class. 2. Create a generic method that prints an array. 3. Explain why List<String> is safer than a raw List. 4. Identify the type parameter in a generic class.",
    description: "Practice generic classes and methods.",
    order: 5,
  },
  {
    title: "Generics Quick Revision",
    type: "note",
    level: "basic",
    content:
      "Remember that T is a common type-parameter name. Other conventions include E for elements, K for keys, V for values, and N for numbers. Generics provide compile-time checking, but Java generally implements them using type erasure.",
    description: "Revise type parameters and type safety.",
    order: 6,
  },
  {
    title: "Bounded Type Parameters in Java",
    type: "video",
    level: "medium",
    url: "https://youtu.be/Y7X_ReDF3x8?si=IJb-lA1pPNM9V6P9",
    description: "Learn how to restrict generic type parameters.",
    order: 1,
  },

  {
    title: "Bounded Type Parameters",
    type: "note",
    level: "medium",
    content:
      "A bounded type parameter restricts the types that can be used. For example, <T extends Number> accepts Number and its subclasses. The extends keyword is used for both class and interface bounds in generic declarations.",
    description: "Study upper bounds on type parameters.",
    order: 3,
  },
  {
    title: "Wildcards and Generic Methods",
    type: "note",
    level: "medium",
    content:
      "The wildcard ? represents an unknown type. List<? extends Number> can be used to read Number values from lists of Number subtypes. List<? super Integer> can accept Integer values and is useful when writing Integers. A generic method declares its own type parameter before its return type.",
    description: "Understand wildcards and generic method syntax.",
    order: 4,
  },
  {
    title: "Intermediate Generics Worksheet",
    type: "worksheet",
    level: "medium",
    content:
      "1. Write a method accepting a bounded type parameter. 2. Explain List<? extends Number>. 3. Explain List<? super Integer>. 4. Write a generic method that returns the first element of an array.",
    description: "Practice bounds, wildcards, and generic methods.",
    order: 5,
  },
  {
    title: "Generics with Collections",
    type: "note",
    level: "medium",
    content:
      "Collections use generics to specify the types of their elements. For example, Map<String, Integer> maps names to scores. Prefer parameterized collection types over raw types to reduce unsafe operations and compiler warnings.",
    description: "Apply generics to Java collections.",
    order: 6,
  },
  {
    title: "Advanced Generics and Type Erasure",
    type: "video",
    level: "advanced",
    url: "https://youtu.be/BsBK3UZ0RGM?si=Yt9rlYPx6LqDWk0s",
    description: "Explore type erasure and advanced generic concepts.",
    order: 1,
  },
  
  {
    title: "Type Erasure and Restrictions",
    type: "note",
    level: "advanced",
    content:
      "Java uses type erasure to implement most generic type information. Consequently, you generally cannot create a new T directly, use primitive types as type arguments, or check an object using instanceof with a non-reifiable parameterized type such as List<String>.",
    description: "Review type erasure and generic limitations.",
    order: 3,
  },
  {
    title: "PECS and Type Safety",
    type: "note",
    level: "advanced",
    content:
      "PECS means Producer Extends, Consumer Super. Use an extends wildcard when a structure produces values for reading, and a super wildcard when it consumes values for writing. This guideline helps design flexible generic APIs.",
    description: "Apply wildcard guidelines in API design.",
    order: 4,
  },
  {
    title: "Advanced Generics Worksheet",
    type: "worksheet",
    level: "advanced",
    content:
      "1. Write a generic method using a bounded type parameter. 2. Explain type erasure. 3. Choose between extends and super for a method that reads numbers and another that accepts integers. 4. Explain why primitive types cannot be generic type arguments.",
    description: "Solve advanced generic programming exercises.",
    order: 5,
  },
  {
    title: "Generics Best Practices",
    type: "note",
    level: "advanced",
    content:
      "Prefer meaningful type parameters and parameterized types. Avoid raw types and unchecked casts where possible. Use bounded types and wildcards only when they improve flexibility, and keep generic APIs easy to understand.",
    description: "Review safe and maintainable generic code.",
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
