const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("../config/db");
const Topic = require("../models/Topic");
const EngagementQuestion = require("../models/EngagementQuestion");

// =====================================================
// TOPIC 17: FILE HANDLING
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
    question: "Which package contains the main classes used for traditional Java file I/O?",
    options: ["java.io", "java.util", "java.sql", "java.net"],
    correctAnswer: "java.io",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which class represents a file or directory path in Java?",
    options: ["File", "PathFile", "Directory", "FilePath"],
    correctAnswer: "File",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which class is commonly used to read character data from a file?",
    options: ["FileReader", "FileWriter", "FileInputStream", "FileOutputStream"],
    correctAnswer: "FileReader",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which class is commonly used to write character data to a file?",
    options: ["FileWriter", "FileReader", "FileInputStream", "BufferedReader"],
    correctAnswer: "FileWriter",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which class is commonly used to read raw byte data from a file?",
    options: ["FileInputStream", "FileReader", "FileWriter", "BufferedWriter"],
    correctAnswer: "FileInputStream",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which class is commonly used to write raw byte data to a file?",
    options: ["FileOutputStream", "FileInputStream", "FileReader", "BufferedReader"],
    correctAnswer: "FileOutputStream",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which class is commonly used to read text efficiently line by line?",
    options: ["BufferedReader", "BufferedWriter", "FileWriter", "FileOutputStream"],
    correctAnswer: "BufferedReader",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which class is commonly used to write character data efficiently?",
    options: ["BufferedWriter", "BufferedReader", "FileReader", "FileInputStream"],
    correctAnswer: "BufferedWriter",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which method of File checks whether a file or directory exists?",
    options: ["exists()", "isPresent()", "check()", "available()"],
    correctAnswer: "exists()",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which exception is commonly associated with file I/O operations?",
    options: ["IOException", "ArithmeticException", "ClassCastException", "NumberFormatException"],
    correctAnswer: "IOException",
    marks: 3,
    difficulty: "basic",
  },

  // =====================================================
  // MEDIUM - 10 × 3 = 30
  // =====================================================

  {
    question: "Which File method creates a new empty file if it does not already exist?",
    options: ["createNewFile()", "makeFile()", "create()", "newFile()"],
    correctAnswer: "createNewFile()",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which File method deletes a file or empty directory?",
    options: ["delete()", "remove()", "erase()", "destroy()"],
    correctAnswer: "delete()",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which File method returns the name of the file or directory?",
    options: ["getName()", "name()", "getFile()", "fileName()"],
    correctAnswer: "getName()",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which File method returns whether the path represents a directory?",
    options: ["isDirectory()", "directory()", "isFolder()", "checkDirectory()"],
    correctAnswer: "isDirectory()",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which method of BufferedReader reads one complete line of text?",
    options: ["readLine()", "readText()", "nextLine()", "getLine()"],
    correctAnswer: "readLine()",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which method of Writer is used to write character data?",
    options: ["write()", "put()", "send()", "appendFile()"],
    correctAnswer: "write()",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What is the purpose of close() on a file stream?",
    options: [
      "To release the associated resource",
      "To delete the file",
      "To rename the file",
      "To create a new file"
    ],
    correctAnswer: "To release the associated resource",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which mode of FileWriter appends data to an existing file?",
    options: [
      "new FileWriter(file, true)",
      "new FileWriter(file, append)",
      "new FileWriter(file, add)",
      "new FileWriter(file, write)"
    ],
    correctAnswer: "new FileWriter(file, true)",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which class can be used to read primitive data types from an input stream?",
    options: [
      "DataInputStream",
      "DataReader",
      "PrimitiveReader",
      "ObjectInputStream"
    ],
    correctAnswer: "DataInputStream",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which class can be used to write primitive data types to an output stream?",
    options: [
      "DataOutputStream",
      "DataWriter",
      "PrimitiveWriter",
      "ObjectOutputStream"
    ],
    correctAnswer: "DataOutputStream",
    marks: 3,
    difficulty: "medium",
  },

  // =====================================================
  // ADVANCED - 10 × 4 = 40
  // =====================================================

  {
    question:
      "What is the main advantage of BufferedReader over directly using FileReader for repeated character reads?",
    options: [
      "It provides buffering that can reduce the number of underlying I/O operations",
      "It automatically encrypts the file",
      "It converts every file into binary",
      "It prevents all IOException errors"
    ],
    correctAnswer:
      "It provides buffering that can reduce the number of underlying I/O operations",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "Which statement correctly distinguishes character streams from byte streams?",
    options: [
      "Character streams are designed for character data, while byte streams handle raw bytes",
      "Character streams can only read binary files",
      "Byte streams can only work with text files",
      "There is no difference between them"
    ],
    correctAnswer:
      "Character streams are designed for character data, while byte streams handle raw bytes",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "Which class is appropriate for reading raw binary data such as image bytes?",
    options: [
      "FileInputStream",
      "FileReader",
      "BufferedReader",
      "FileWriter"
    ],
    correctAnswer: "FileInputStream",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "Which feature automatically closes resources after a try-with-resources block completes?",
    options: [
      "AutoCloseable",
      "Serializable",
      "Cloneable",
      "Runnable"
    ],
    correctAnswer: "AutoCloseable",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "What is the output?\n\ntry (FileReader reader = new FileReader(\"data.txt\")) {\n    System.out.println(\"File opened\");\n} catch (IOException e) {\n    System.out.println(\"Error\");\n}",
    options: [
      "File opened if the file can be opened successfully",
      "Error always",
      "Compilation error",
      "No output in every case"
    ],
    correctAnswer:
      "File opened if the file can be opened successfully",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "Which class is commonly used to serialize Java objects to a stream?",
    options: [
      "ObjectOutputStream",
      "ObjectWriter",
      "SerializationStream",
      "FileObjectWriter"
    ],
    correctAnswer: "ObjectOutputStream",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "Which class is commonly used to deserialize Java objects from a stream?",
    options: [
      "ObjectInputStream",
      "ObjectReader",
      "DeserializationStream",
      "FileObjectReader"
    ],
    correctAnswer: "ObjectInputStream",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "Which interface must a class generally implement to support default Java object serialization?",
    options: [
      "Serializable",
      "Serialize",
      "Persistable",
      "Storable"
    ],
    correctAnswer: "Serializable",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "What is the purpose of the flush() method on an output stream or writer?",
    options: [
      "To force buffered output to be written to the underlying destination",
      "To delete buffered data permanently",
      "To close the file automatically",
      "To rename the file"
    ],
    correctAnswer:
      "To force buffered output to be written to the underlying destination",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "Which modern Java API provides Path and Files classes for file and directory operations?",
    options: [
      "java.nio.file",
      "java.io.file",
      "java.util.file",
      "java.net.file"
    ],
    correctAnswer: "java.nio.file",
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
    console.log("Topic 17 Assessment Question Seeding");
    console.log("========================================\n");

    const topic = await Topic.findOne({
      title: "File Handling",
      subject: "Java",
    });

    if (!topic) {
      console.log("❌ Topic 'File Handling' not found.");
      console.log("Please make sure Topic 17 exists in MongoDB.");
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
    console.log("Topic: File Handling");
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