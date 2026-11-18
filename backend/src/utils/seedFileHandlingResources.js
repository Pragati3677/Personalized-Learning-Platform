
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Topic = require("../models/Topic");
const LearningResource = require("../models/LearningResource");

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || process.env.MONGO_URI;

const TOPIC_TITLE = "File Handling";

const resources = [
  // BASIC
  {
    title: "Introduction to File Handling in Java",
    type: "video",
    level: "basic",
    url: "https://youtu.be/7HJ6mG64lGY?si=IKXSALFfBQqDLNpy",
    description: "Understand files and basic file operations in Java.",
    order: 1,
  },
  
  {
    title: "File Handling Fundamentals",
    type: "note",
    level: "basic",
    content:
      "Java provides classes for file operations. The File class represents file and directory paths. FileReader and FileWriter support character-based file operations, while BufferedReader and BufferedWriter improve efficiency when processing text.",
    description: "Learn the main Java file-handling classes.",
    order: 3,
  },
  {
    title: "Creating and Checking Files",
    type: "note",
    level: "basic",
    content:
      "The java.io.File class can represent a file or directory path. Methods such as exists(), isFile(), isDirectory(), getName(), and getAbsolutePath() help inspect paths. File creation and deletion methods may fail, so always check their return values or handle exceptions.",
    description: "Understand file paths and file properties.",
    order: 4,
  },
  {
    title: "Basic File Handling Worksheet",
    type: "worksheet",
    level: "basic",
    content:
      "1. Create a File object for a text file. 2. Check whether the file exists. 3. Write text to a file. 4. Read and display the file contents. Handle any required IOException.",
    description: "Practice basic file operations.",
    order: 5,
  },
  {
    title: "File Handling Quick Revision",
    type: "note",
    level: "basic",
    content:
      "Remember: File represents a path, FileReader reads characters, and FileWriter writes characters. Use try-with-resources to close resources automatically. File paths can be relative or absolute.",
    description: "Revise basic file classes and operations.",
    order: 6,
  },

  // MEDIUM
  
  {
    title: "Java File Input and Output Streams",
    type: "video",
    level: "medium",
    url: "https://youtu.be/Vy2l3lGAb2I?si=ZbaBghQjy2Pa3s5u",
    description: "Understand byte streams for file operations.",
    order: 2,
  },
  {
    title: "Buffered File Operations",
    type: "note",
    level: "medium",
    content:
      "BufferedReader can read text efficiently and provides readLine(). BufferedWriter supports efficient text output and provides newLine(). These classes are commonly wrapped around FileReader and FileWriter. Close resources using try-with-resources.",
    description: "Study buffered character streams.",
    order: 3,
  },
  {
    title: "Byte Streams and Character Streams",
    type: "note",
    level: "medium",
    content:
      "InputStream and OutputStream are base classes for byte-oriented I/O. FileInputStream and FileOutputStream are useful for binary data. Reader and Writer classes handle character data and are usually preferred for text.",
    description: "Compare byte-based and character-based I/O.",
    order: 4,
  },
  {
    title: "Intermediate File Handling Worksheet",
    type: "worksheet",
    level: "medium",
    content:
      "1. Copy a binary file using FileInputStream and FileOutputStream. 2. Count the lines in a text file using BufferedReader. 3. Append text to a file. 4. Explain when to use byte streams instead of character streams.",
    description: "Practice buffered I/O and stream operations.",
    order: 5,
  },
  {
    title: "Exception Handling in File Operations",
    type: "note",
    level: "medium",
    content:
      "File operations can throw IOException and related exceptions. Use try-with-resources to close resources reliably. Handle errors appropriately, and avoid assuming that a path exists or that the program has permission to access it.",
    description: "Handle file I/O errors safely.",
    order: 6,
  },

  // ADVANCED
  {
    title: "Java NIO Files and Paths",
    type: "video",
    level: "advanced",
    url: "https://youtu.be/tyKb5WXiViQ?si=0kpvS5OCIMZC1soC",
    description: "Explore modern Java file operations with NIO.",
    order: 1,
  },
  
  {
    title: "Java NIO Files and Paths",
    type: "note",
    level: "advanced",
    content:
      "The java.nio.file package provides Path to represent a path and Files for common operations. Methods include Files.exists(), Files.readString(), Files.writeString(), Files.copy(), Files.move(), and Files.deleteIfExists(). Availability of some methods depends on the Java version.",
    description: "Review the modern NIO file API.",
    order: 3,
  },
  {
    title: "File Attributes and Directory Operations",
    type: "note",
    level: "advanced",
    content:
      "Java NIO supports directory listing, path resolution, file copying, moving, and attribute access. Use Files.list() or Files.walk() with care, and close returned streams. Validate input paths and handle access errors.",
    description: "Understand directory traversal and file attributes.",
    order: 4,
  },
  {
    title: "Advanced File Handling Worksheet",
    type: "worksheet",
    level: "advanced",
    content:
      "1. List all files in a directory using Java NIO. 2. Copy a file to another path. 3. Read a text file using Files.readString(). 4. Handle missing files and access errors safely.",
    description: "Practice modern file management.",
    order: 5,
  },
  {
    title: "File Handling Best Practices",
    type: "note",
    level: "advanced",
    content:
      "Use try-with-resources for closeable resources, choose byte or character streams according to the data, and handle I/O failures. Validate paths, avoid unsafe assumptions about permissions, and use the NIO API where it simplifies file operations.",
    description: "Review reliable and safe file handling.",
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
