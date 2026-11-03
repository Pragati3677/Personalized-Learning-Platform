
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
    url: "https://www.youtube.com/results?search_query=Java+file+handling+for+beginners",
    description: "Understand files and basic file operations in Java.",
    order: 1,
  },
  {
    title: "Reading and Writing Text Files",
    type: "video",
    level: "basic",
    url: "https://www.youtube.com/results?search_query=Java+read+write+text+file+tutorial",
    description: "Learn to read and write text files.",
    order: 2,
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
    title: "BufferedReader and BufferedWriter",
    type: "video",
    level: "medium",
    url: "https://www.youtube.com/results?search_query=Java+BufferedReader+BufferedWriter+tutorial",
    description: "Learn buffered text input and output.",
    order: 1,
  },
  {
    title: "Java File Input and Output Streams",
    type: "video",
    level: "medium",
    url: "https://www.youtube.com/results?search_query=Java+FileInputStream+FileOutputStream+tutorial",
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
    url: "https://www.youtube.com/results?search_query=Java+NIO+Files+Paths+tutorial",
    description: "Explore modern Java file operations with NIO.",
    order: 1,
  },
  {
    title: "Directory Traversal and File Management",
    type: "video",
    level: "advanced",
    url: "https://www.youtube.com/results?search_query=Java+NIO+directory+traversal+file+management",
    description: "Learn to list and manage files and directories.",
    order: 2,
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
    console.log("File Handling resources seeded successfully.");
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedResources();
