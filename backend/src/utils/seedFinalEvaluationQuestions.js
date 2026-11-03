
const mongoose = require("mongoose");
require("dotenv").config();

const Topic = require("../models/Topic");
const FinalEvaluationQuestion = require("../models/FinalEvaluationQuestion");

const JAVA_TOPICS = [
  "Java Basics & Syntax",
  "Variables & Data Types",
  "Operators",
  "Conditional Statements",
  "Loops",
  "Arrays",
  "Strings",
  "Methods",
  "OOP Concepts",
  "Classes & Objects",
  "Inheritance",
  "Polymorphism",
  "Abstraction & Interfaces",
  "Exception Handling",
  "Collections Framework",
  "Generics",
  "File Handling",
  "Advanced Java",
];

const mcqQuestions = [
  {
    topicTitle: "Java Basics & Syntax",
    question: "Which method is the entry point of a Java application?",
    options: ["start()", "main()", "run()", "init()"],
    correctAnswer: "main()",
  },
  {
    topicTitle: "Java Basics & Syntax",
    question: "Which keyword is used to create an object in Java?",
    options: ["class", "this", "new", "static"],
    correctAnswer: "new",
  },
  {
    topicTitle: "Variables & Data Types",
    question: "Which is a primitive data type in Java?",
    options: ["String", "Integer", "boolean", "ArrayList"],
    correctAnswer: "boolean",
  },
  {
    topicTitle: "Variables & Data Types",
    question: "What is the default value of an instance int variable?",
    options: ["1", "null", "0", "undefined"],
    correctAnswer: "0",
  },
  {
    topicTitle: "Operators",
    question: "What is the result of 10 % 3 in Java?",
    options: ["1", "3", "0", "10"],
    correctAnswer: "1",
  },
  {
    topicTitle: "Conditional Statements",
    question: "Which statement is used to select between alternatives?",
    options: ["if", "import", "package", "break"],
    correctAnswer: "if",
  },
  {
    topicTitle: "Loops",
    question: "Which loop executes its body at least once?",
    options: ["for", "while", "do-while", "enhanced for"],
    correctAnswer: "do-while",
  },
  {
    topicTitle: "Arrays",
    question: "What is the index of the first element in a Java array?",
    options: ["0", "1", "-1", "Depends on the array"],
    correctAnswer: "0",
  },
  {
    topicTitle: "Strings",
    question: "Which method compares the contents of two Java strings?",
    options: ["==", "equals()", "compare()", "same()"],
    correctAnswer: "equals()",
  },
  {
    topicTitle: "Methods",
    question: "What does a void method return?",
    options: ["An integer", "A string", "No value", "A boolean"],
    correctAnswer: "No value",
  },
  {
    topicTitle: "OOP Concepts",
    question: "Which OOP concept bundles data and methods together?",
    options: ["Encapsulation", "Inheritance", "Compilation", "Iteration"],
    correctAnswer: "Encapsulation",
  },
  {
    topicTitle: "Classes & Objects",
    question: "A class is best described as a:",
    options: ["Blueprint for objects", "Loop", "Primitive value", "Package manager"],
    correctAnswer: "Blueprint for objects",
  },
  {
    topicTitle: "Inheritance",
    question: "Which keyword allows one Java class to inherit another class?",
    options: ["implements", "extends", "inherits", "superclass"],
    correctAnswer: "extends",
  },
  {
    topicTitle: "Polymorphism",
    question: "Method overloading means:",
    options: [
      "Same method name with different parameter lists",
      "Deleting a method",
      "Changing a variable type",
      "Creating an interface",
    ],
    correctAnswer: "Same method name with different parameter lists",
  },
  {
    topicTitle: "Abstraction & Interfaces",
    question: "Which keyword is used to declare an interface?",
    options: ["interface", "abstract", "implements", "extends"],
    correctAnswer: "interface",
  },
  {
    topicTitle: "Exception Handling",
    question: "Which block is normally used to handle an exception?",
    options: ["try", "catch", "final", "throws"],
    correctAnswer: "catch",
  },
  {
    topicTitle: "Collections Framework",
    question: "Which collection does not allow duplicate elements?",
    options: ["ArrayList", "LinkedList", "HashSet", "Vector"],
    correctAnswer: "HashSet",
  },
  {
    topicTitle: "Generics",
    question: "What is a main benefit of Java generics?",
    options: [
      "Compile-time type safety",
      "Faster internet access",
      "Automatic database creation",
      "Removing all exceptions",
    ],
    correctAnswer: "Compile-time type safety",
  },
  {
    topicTitle: "File Handling",
    question: "Which class can read character data from a text file?",
    options: ["FileReader", "FileWriter", "PrintWriter", "File"],
    correctAnswer: "FileReader",
  },
  {
    topicTitle: "Advanced Java",
    question: "Which Java API is commonly used to connect to relational databases?",
    options: ["JDBC", "JDK", "JVM", "JAR"],
    correctAnswer: "JDBC",
  },
];

const codingQuestions = [
  {
    topicTitle: "Java Basics & Syntax",
    question: "Write a Java program that prints Hello Java.",
    starterCode: `public class Main {
    public static void main(String[] args) {
        // Write your code here
    }
}`,
    testCases: [{ input: "", expectedOutput: "Hello Java", isHidden: false }],
  },
  {
    topicTitle: "Variables & Data Types",
    question: "Read two integers and print their sum.",
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read two integers and print their sum
    }
}`,
    testCases: [
      { input: "2 3", expectedOutput: "5", isHidden: false },
      { input: "10 20", expectedOutput: "30", isHidden: true },
    ],
  },
  {
    topicTitle: "Operators",
    question: "Read two integers and print their product.",
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution
    }
}`,
    testCases: [
      { input: "4 5", expectedOutput: "20", isHidden: false },
      { input: "7 8", expectedOutput: "56", isHidden: true },
    ],
  },
  {
    topicTitle: "Conditional Statements",
    question: "Read an integer and print Even if it is even, otherwise print Odd.",
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution
    }
}`,
    testCases: [
      { input: "4", expectedOutput: "Even", isHidden: false },
      { input: "7", expectedOutput: "Odd", isHidden: true },
    ],
  },
  {
    topicTitle: "Loops",
    question: "Read n and print the sum of integers from 1 through n.",
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution
    }
}`,
    testCases: [
      { input: "5", expectedOutput: "15", isHidden: false },
      { input: "10", expectedOutput: "55", isHidden: true },
    ],
  },
  {
    topicTitle: "Arrays",
    question: "Read n followed by n integers and print their sum.",
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read the array and print its sum
    }
}`,
    testCases: [
      { input: "4 1 2 3 4", expectedOutput: "10", isHidden: false },
      { input: "3 10 20 30", expectedOutput: "60", isHidden: true },
    ],
  },
  {
    topicTitle: "Strings",
    question: "Read a single word and print its reverse.",
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Reverse the input word
    }
}`,
    testCases: [
      { input: "java", expectedOutput: "avaj", isHidden: false },
      { input: "hello", expectedOutput: "olleh", isHidden: true },
    ],
  },
  {
    topicTitle: "Methods",
    question: "Read two integers and print the larger value.",
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Use a method to find the larger value
    }
}`,
    testCases: [
      { input: "8 5", expectedOutput: "8", isHidden: false },
      { input: "3 9", expectedOutput: "9", isHidden: true },
    ],
  },
  {
    topicTitle: "OOP Concepts",
    question: "Read an integer and print its square using a separate method.",
    starterCode: `import java.util.Scanner;
public class Main {
    static int square(int n) {
        // Return the square
        return 0;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Call square() and print the result
    }
}`,
    testCases: [
      { input: "4", expectedOutput: "16", isHidden: false },
      { input: "7", expectedOutput: "49", isHidden: true },
    ],
  },
  {
    topicTitle: "Classes & Objects",
    question: "Create a class with a method that prints Welcome, then call it from main.",
    starterCode: `public class Main {
    static class Greeter {
        void greet() {
            // Print Welcome
        }
    }
    public static void main(String[] args) {
        // Create object and call greet()
    }
}`,
    testCases: [{ input: "", expectedOutput: "Welcome", isHidden: false }],
  },
];

async function seedFinalEvaluationQuestions() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from backend/.env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    const topicDocs = await Topic.find({
      title: { $in: JAVA_TOPICS },
      isActive: true,
    });

    const topicMap = new Map(
      topicDocs.map((topic) => [topic.title, topic])
    );

    const missingTopics = JAVA_TOPICS.filter(
      (title) => !topicMap.has(title)
    );

    if (missingTopics.length) {
      console.error(
        "These Java topics were not found in the Topic collection:"
      );
      missingTopics.forEach((title) => console.error(`- ${title}`));
      console.error(
        "Check the topic titles in MongoDB. They must match the titles used by MyLearning.jsx."
      );
      process.exitCode = 1;
      return;
    }

    // Prevent duplicate questions if the seed script is run again.
    await FinalEvaluationQuestion.deleteMany({
      topicId: { $in: topicDocs.map((topic) => topic._id) },
    });

    const mcqDocs = mcqQuestions.map((q) => ({
      topicId: topicMap.get(q.topicTitle)._id,
      questionType: "mcq",
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      difficulty: "medium",
      marks: 3,
      isActive: true,
    }));

    const codingDocs = codingQuestions.map((q) => ({
      topicId: topicMap.get(q.topicTitle)._id,
      questionType: "coding",
      question: q.question,
      options: [],
      correctAnswer: "",
      starterCode: q.starterCode,
      testCases: q.testCases,
      difficulty: "medium",
      marks: 4,
      isActive: true,
    }));

    const inserted = await FinalEvaluationQuestion.insertMany([
      ...mcqDocs,
      ...codingDocs,
    ]);

    console.log(`Inserted ${mcqDocs.length} Java MCQs.`);
    console.log(`Inserted ${codingDocs.length} Java coding questions.`);
    console.log(`Total questions: ${inserted.length}`);
    console.log("Total marks: 20 × 3 + 10 × 4 = 100.");
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedFinalEvaluationQuestions();
