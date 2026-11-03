
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Topic = require("../models/Topic");
const LearningResource = require("../models/LearningResource");

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || process.env.MONGO_URI;

const TOPIC_TITLE = "Collections Framework";

const resources = [
  // BASIC
  {
    title: "Introduction to Java Collections Framework",
    type: "video",
    level: "basic",
    url: "https://www.youtube.com/results?search_query=Java+Collections+Framework+for+beginners",
    description: "Introduction to collections and their importance in Java.",
    order: 1,
  },
  {
    title: "ArrayList and LinkedList in Java",
    type: "video",
    level: "basic",
    url: "https://www.youtube.com/results?search_query=Java+ArrayList+LinkedList+tutorial",
    description: "Learn how ArrayList and LinkedList store elements.",
    order: 2,
  },
  {
    title: "Collections Framework Basics",
    type: "note",
    level: "basic",
    content:
      "The Java Collections Framework provides interfaces and classes to store and manage groups of objects. Collection is a root interface for many collection types. List, Set, and Queue are important interfaces. Map stores key-value pairs and is part of the framework but does not extend Collection.",
    description: "Understand the main collection interfaces.",
    order: 3,
  },
  {
    title: "List Interface and ArrayList",
    type: "note",
    level: "basic",
    content:
      "A List maintains element order and allows duplicates. ArrayList is a resizable array implementation of List. It provides efficient indexed access, while inserting or removing elements in the middle may require shifting elements.",
    description: "Learn List operations and ArrayList features.",
    order: 4,
  },
  {
    title: "Basic Collections Worksheet",
    type: "worksheet",
    level: "basic",
    content:
      "1. Create an ArrayList of integers. 2. Add and remove elements. 3. Display elements using a loop. 4. Explain two differences between arrays and ArrayList.",
    description: "Practice basic collection operations.",
    order: 5,
  },
  {
    title: "List and Collection Revision",
    type: "note",
    level: "basic",
    content:
      "Remember the differences between arrays and collections. Lists allow duplicates and preserve order. Common ArrayList methods include add(), get(), set(), remove(), size(), and contains().",
    description: "Revise the basic List methods.",
    order: 6,
  },

  // MEDIUM
  {
    title: "HashSet and TreeSet in Java",
    type: "video",
    level: "medium",
    url: "https://www.youtube.com/results?search_query=Java+HashSet+TreeSet+tutorial",
    description: "Learn how Set implementations store unique elements.",
    order: 1,
  },
  {
    title: "HashMap and Map Interface",
    type: "video",
    level: "medium",
    url: "https://www.youtube.com/results?search_query=Java+HashMap+Map+interface+tutorial",
    description: "Understand key-value storage using HashMap.",
    order: 2,
  },
  {
    title: "Set Interface and Set Implementations",
    type: "note",
    level: "medium",
    content:
      "A Set does not allow duplicate elements. HashSet does not guarantee iteration order. LinkedHashSet maintains insertion order. TreeSet stores elements in sorted order according to natural ordering or a supplied Comparator.",
    description: "Compare common Set implementations.",
    order: 3,
  },
  {
    title: "Map Interface and HashMap",
    type: "note",
    level: "medium",
    content:
      "A Map stores key-value pairs, with unique keys. HashMap provides average constant-time lookup for well-distributed hashes and does not guarantee iteration order. Common methods include put(), get(), remove(), containsKey(), and keySet().",
    description: "Learn Map operations and HashMap behaviour.",
    order: 4,
  },
  {
    title: "Intermediate Collections Worksheet",
    type: "worksheet",
    level: "medium",
    content:
      "1. Remove duplicate numbers using HashSet. 2. Store student names and marks in a HashMap. 3. Sort a list of integers. 4. Compare HashSet, LinkedHashSet, and TreeSet.",
    description: "Practice Sets, Maps, and sorting.",
    order: 5,
  },
  {
    title: "Queue and Deque Basics",
    type: "note",
    level: "medium",
    content:
      "Queue commonly supports FIFO processing. PriorityQueue orders elements by priority rather than insertion order. Deque supports insertion and removal at both ends. ArrayDeque can be used as a queue or stack.",
    description: "Understand Queue, PriorityQueue, and Deque.",
    order: 6,
  },

  // ADVANCED
  {
    title: "Java Iterator and ListIterator",
    type: "video",
    level: "advanced",
    url: "https://www.youtube.com/results?search_query=Java+Iterator+ListIterator+fail+fast+tutorial",
    description: "Learn collection traversal and iterator behaviour.",
    order: 1,
  },
  {
    title: "Comparable and Comparator in Java",
    type: "video",
    level: "advanced",
    url: "https://www.youtube.com/results?search_query=Java+Comparable+Comparator+sorting+tutorial",
    description: "Explore natural ordering and custom sorting.",
    order: 2,
  },
  {
    title: "Iterators and Safe Traversal",
    type: "note",
    level: "advanced",
    content:
      "Iterator provides a standard way to traverse collections using hasNext() and next(). Its remove() method can remove the last returned element when supported. Structural modification outside an iterator may cause ConcurrentModificationException for many fail-fast iterators.",
    description: "Review iterator methods and safe traversal.",
    order: 3,
  },
  {
    title: "Comparable, Comparator, and Generics",
    type: "note",
    level: "advanced",
    content:
      "Comparable defines natural ordering through compareTo(). Comparator defines an external or custom ordering through compare(). Generics provide compile-time type safety and reduce the need for explicit casts when retrieving collection elements.",
    description: "Understand sorting strategies and type safety.",
    order: 4,
  },
  {
    title: "Advanced Collections Worksheet",
    type: "worksheet",
    level: "advanced",
    content:
      "1. Sort Employee objects by salary using Comparator. 2. Traverse a list with Iterator. 3. Count word frequencies using HashMap. 4. Use a PriorityQueue to process numbers in ascending order.",
    description: "Solve practical collection problems.",
    order: 5,
  },
  {
    title: "Collections Performance and Best Practices",
    type: "note",
    level: "advanced",
    content:
      "Choose a collection based on required operations. ArrayList is useful for indexed access, HashSet for uniqueness, HashMap for key-value lookup, and TreeSet or TreeMap for sorted data. Consider ordering, null handling, thread safety, and expected data size.",
    description: "Review collection selection and performance.",
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
    console.log("Collections Framework resources seeded successfully.");
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedResources();
