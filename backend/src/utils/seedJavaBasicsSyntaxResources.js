const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Topic = require("../models/Topic");
const LearningResource = require("../models/LearningResource");

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGODB_URI) {
  console.error("❌ MongoDB connection string not found.");
  process.exit(1);
}

const seedJavaBasicsResources = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected.");

    const topic = await Topic.findOne({
      title: "Java Basics & Syntax",
      isActive: true,
    });

    if (!topic) {
      throw new Error(
        'Active topic "Java Basics & Syntax" was not found.'
      );
    }

    console.log(`📘 Topic: ${topic.title}`);
    console.log(`🆔 Topic ID: ${topic._id}`);

    const resources = [
      // ==================================================
      // BASIC LEVEL
      // ==================================================
      {
        title: "Java Program Structure - Beginner Video",
        description: "Introduction to Java, classes, the main method, and output.",
        type: "video",
        level: "basic",
        content: "Learn the structure of a Java program and how to display output.",
        url: "https://www.youtube.com/results?search_query=Java+program+structure+beginner+tutorial",
        order: 1,
        isActive: true,
      },
      {
        title: "Writing Your First Java Program",
        description: "Learn to write and run a simple Hello Java program.",
        type: "video",
        level: "basic",
        content: "Practise writing, compiling, and running a simple Java program.",
        url: "https://www.youtube.com/watch?v=zIdg7hkqNE0",
        order: 2,
        isActive: true,
      },
      {
        title: "Introduction to Java - Basic Notes",
        description: "Beginner-friendly introduction to Java and its characteristics.",
        type: "note",
        level: "basic",
        content: `
JAVA BASICS & SYNTAX — BASIC NOTES

1. What is Java?
Java is a high-level, object-oriented programming language used to build desktop, web, mobile, and enterprise applications.

2. Characteristics of Java
• Object-oriented
• Platform-independent through bytecode and the JVM
• Strongly typed
• Portable
• Supports multithreading

3. How Java runs
Java source code is saved in a .java file. The javac compiler translates it into bytecode in a .class file. The Java Virtual Machine (JVM) executes that bytecode.

Flow:
Source code (.java) → Compiler → Bytecode (.class) → JVM → Output

4. First Java program
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello Java");
    }
}

Output:
Hello Java

5. Important parts
• class Main: declares a class named Main.
• main(): the standard entry point of a simple Java application.
• System.out.println(): prints text and moves to a new line.
• Semicolon (;): ends most Java statements.
• Curly braces { }: mark code blocks.

6. Comments
Single-line comment:
// This is a comment

Multi-line comment:
/* This is a comment */

7. Remember
Java is case-sensitive. Main and main are different names. A public class normally uses the same name as its source file.
        `,
        url: "",
        order: 3,
        isActive: true,
      },
      {
        title: "Java Syntax Rules - Basic Notes",
        description: "Learn statements, identifiers, comments, strings, and braces.",
        type: "note",
        level: "basic",
        content: `
BASIC JAVA SYNTAX RULES

1. Statements
Most Java statements end with a semicolon.
Example:
System.out.println("Welcome");

2. Classes
A class groups code and can contain methods and variables.
Example:
public class Student {
}

3. The main method
public static void main(String[] args) {
    // program statements
}

4. Displaying text
Text values are enclosed in double quotes.
Example:
System.out.println("Computer Science");

5. Variables
A variable stores a value.
String studentName = "Asha";
int age = 20;

6. Comments
// Single-line comment

/*
 Multi-line comment
*/

7. Naming
Use meaningful names such as studentName, totalMarks, and StudentDetails. Identifiers are case-sensitive.

8. Common errors
• Missing semicolon
• Mismatched braces
• Incorrect capitalisation
• Public class name not matching the file name
        `,
        url: "",
        order: 4,
        isActive: true,
      },
      {
        title: "Simple Java Program Examples",
        description: "Examples for printing text, variables, and basic output.",
        type: "note",
        level: "basic",
        content: `
BASIC JAVA PROGRAM EXAMPLES

Example 1: Print a message
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello Java");
    }
}

Example 2: Print two lines
System.out.println("Name: Student");
System.out.println("Course: Computer Science");

Example 3: Use variables
String name = "Asha";
int marks = 85;

System.out.println(name);
System.out.println(marks);

Example 4: Print a calculation
int a = 10;
int b = 5;
System.out.println(a + b); // 15

Remember:
• String values use double quotes.
• Integer values do not need quotes.
• Java statements normally end with semicolons.
• Opening and closing braces must match.
        `,
        url: "",
        order: 5,
        isActive: true,
      },
      {
        title: "Java Basics & Syntax Worksheet - Basic",
        description: "Beginner worksheet on Java, program structure, and syntax.",
        type: "worksheet",
        level: "basic",
        content: `
JAVA BASICS & SYNTAX — BASIC WORKSHEET

SECTION A: SHORT ANSWERS

1. What is Java?
2. Write four characteristics of Java.
3. What is the JVM?
4. What is bytecode?
5. What is the purpose of main()?
6. What does System.out.println() do?

SECTION B: COMPLETE THE STATEMENTS

7. Most Java statements end with a __________.
8. Java source files use the __________ extension.
9. The JVM executes Java __________.
10. Curly braces define code __________.

SECTION C: FIND THE ERROR

11. Identify the error:
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello Java")
    }
}

12. Why are Main and main treated as different identifiers?

SECTION D: CODING

13. Write a Java program that prints "Hello Java".
14. Print your name and course on separate lines.
15. Declare an int variable named age and print its value.

SELF-CHECK
[ ] I can explain Java, bytecode, and JVM.
[ ] I understand the main method.
[ ] I can write a simple Java program.
[ ] I can identify common syntax errors.
        `,
        url: "",
        order: 6,
        isActive: true,
      },

      // ==================================================
      // MEDIUM LEVEL
      // ==================================================
      {
        title: "Java Compilation and Program Structure",
        description: "Learn Java compilation, class structure, and program execution.",
        type: "video",
        level: "medium",
        content: "Focus on how source code becomes bytecode and how the JVM executes a class.",
        url: "https://www.youtube.com/results?search_query=Java+compilation+JVM+program+structure+tutorial",
        order: 1,
        isActive: true,
      },
      {
        title: "Java Syntax and Common Errors",
        description: "Practise Java syntax, identifiers, methods, and debugging.",
        type: "video",
        level: "medium",
        content: "Identify syntax errors and understand compiler diagnostics.",
        url: "https://www.youtube.com/results?search_query=Java+syntax+common+errors+tutorial",
        order: 2,
        isActive: true,
      },
      {
        title: "Java Execution Model - Intermediate Notes",
        description: "Understand source files, compilation, bytecode, JVM, and portability.",
        type: "note",
        level: "medium",
        content: `
JAVA EXECUTION MODEL — INTERMEDIATE NOTES

1. Source code and bytecode
Java source is written in .java files. The javac compiler translates it into bytecode stored in .class files.

2. Runtime
The JVM loads and executes bytecode. JVM implementations may interpret bytecode and use just-in-time compilation to improve performance.

3. Platform independence
The same bytecode can run on compatible JVM implementations across different operating systems, subject to runtime and environment requirements.

4. Program structure
public class Main {
    public static void main(String[] args) {
        int first = 12;
        int second = 8;
        System.out.println(first + second);
    }
}

Output:
20

5. Main method components
• public: permits access by the launcher.
• static: allows invocation without creating a Main object.
• void: the method does not return a value.
• String[] args: receives command-line arguments.

6. Compile and run
javac Main.java
java Main

The java command normally receives the class name, not the .class extension.

7. Common issues
• Public class name and file name mismatch
• Missing semicolons
• Incorrect braces
• Incorrect method signature
• Running from the wrong directory
        `,
        url: "",
        order: 3,
        isActive: true,
      },
      {
        title: "Identifiers, Output, and Syntax - Intermediate Notes",
        description: "Explore naming rules, literals, comments, and structured code.",
        type: "note",
        level: "medium",
        content: `
JAVA IDENTIFIERS AND SYNTAX — INTERMEDIATE NOTES

1. Identifiers
Identifiers name classes, methods, and variables. They are case-sensitive and cannot be Java keywords.

Examples:
studentName
totalMarks
StudentDetails

2. Literals
int count = 12;
double average = 78.5;
char grade = 'A';
boolean passed = true;
String course = "Java";

3. Output
System.out.print("Hello ");
System.out.println("Java");

print() does not automatically move to a new line; println() does.

4. Comments
// Single-line

/* Multi-line */

/** Documentation comment */

5. Scope
A local variable declared inside a method or block is generally available only within that scope.

6. Readability
Use indentation, meaningful names, and one statement per line.

7. Debugging checklist
• Check compiler messages.
• Check semicolons and braces.
• Check capitalisation.
• Check quotation marks.
• Confirm the public class name matches the file.
        `,
        url: "",
        order: 4,
        isActive: true,
      },
      {
        title: "Java Program Structure - Intermediate Examples",
        description: "Analyse command-line arguments, variables, output, and compile errors.",
        type: "note",
        level: "medium",
        content: `
JAVA PROGRAM STRUCTURE — WORKED EXAMPLES

Example 1: Command-line arguments
public class Welcome {
    public static void main(String[] args) {
        if (args.length > 0) {
            System.out.println("Hello " + args[0]);
        } else {
            System.out.println("Hello student");
        }
    }
}

Example 2: Output order
int a = 4;
int b = 6;
System.out.print(a);
System.out.println(b);

Output:
46

Example 3: Find the syntax issue
public class Test {
    public static void main(String[] args) {
        int total = 5
        System.out.println(total);
    }
}

Issue: the declaration is missing a semicolon.

Example 4: Identifier case
int score = 10;
System.out.println(Score);

Issue: score and Score are different identifiers.

Example 5: File naming
If the source contains public class Student, save it as Student.java.
        `,
        url: "",
        order: 5,
        isActive: true,
      },
      {
        title: "Java Basics & Syntax Worksheet - Medium",
        description: "Intermediate worksheet on compilation, syntax, identifiers, and debugging.",
        type: "worksheet",
        level: "medium",
        content: `
JAVA BASICS & SYNTAX — INTERMEDIATE WORKSHEET

1. Explain the steps from Java source code to program execution.
2. Differentiate JDK, JRE, and JVM.
3. Explain public, static, void, main, and String[] args.
4. Why can Java bytecode run on different operating systems?
5. What is the difference between print() and println()?
6. List four rules for valid Java identifiers.
7. Explain local variable scope with an example.
8. Correct the errors:
public class Demo {
    public static void main(String[] args) {
        int value = 10
        System.out.println(Value);
    }
}
9. What command compiles Main.java?
10. What command runs the Main class?
11. Write a program that accepts a name from args and prints a greeting.
12. Explain why a public class named Student should be saved in Student.java.

CODING TASK
Create a class named StudentInfo that prints a student's name, course, and marks using suitable variable types.

SELF-CHECK
[ ] I understand compilation and execution.
[ ] I can explain the main method signature.
[ ] I can debug common syntax errors.
        `,
        url: "",
        order: 6,
        isActive: true,
      },

      // ==================================================
      // ADVANCED LEVEL
      // ==================================================
      {
        title: "Java Bytecode, JVM, and Runtime",
        description: "Explore compilation, bytecode inspection, class loading, and JVM execution.",
        type: "video",
        level: "advanced",
        content: "Study source code, bytecode, class loading, and JVM execution.",
        url: "https://www.youtube.com/results?search_query=Java+bytecode+JVM+classloader+runtime+explained",
        order: 1,
        isActive: true,
      },
      {
        title: "Java Command-Line Arguments and Debugging",
        description: "Practise command-line arguments, compiler diagnostics, and debugging.",
        type: "video",
        level: "advanced",
        content: "Focus on command-line compilation, diagnosing errors, and robust entry points.",
        url: "https://www.youtube.com/results?search_query=Java+command+line+arguments+compiler+debugging+tutorial",
        order: 2,
        isActive: true,
      },
      {
        title: "Java Compilation, Bytecode, and Runtime - Advanced Notes",
        description: "Detailed notes on compilation artifacts, class loading, and portability.",
        type: "note",
        level: "advanced",
        content: `
JAVA COMPILATION AND RUNTIME — ADVANCED NOTES

1. Compilation pipeline
A .java source file is compiled by javac into a .class file containing JVM bytecode. Compilation catches many language and type errors before execution.

2. Inspecting bytecode
The javap tool can disassemble compiled class files:
javap -c Main

3. Class loading and linking
At runtime, the JVM loads class definitions, verifies bytecode, and prepares classes before execution. Exact implementation details can vary.

4. Runtime execution
A JVM may interpret bytecode and compile frequently executed code into native machine code using a just-in-time compiler.

5. Portability limits
Programs can depend on native libraries, file paths, environment variables, platform-specific behaviour, or runtime versions. Bytecode portability does not remove every environmental difference.

6. Entry point
A conventional launcher entry point is:
public static void main(String[] args)

7. Packaging
Large applications commonly organise code into packages and may be built into JAR files. Maven and Gradle can manage dependencies and compilation.

8. Diagnostics
Use compiler messages, stack traces, a debugger, and tools such as javap to investigate problems.
        `,
        url: "",
        order: 3,
        isActive: true,
      },
      {
        title: "Robust Java Structure and Maintainability",
        description: "Apply packages, naming, documentation, and error diagnosis.",
        type: "note",
        level: "advanced",
        content: `
ROBUST JAVA STRUCTURE — ADVANCED NOTES

1. Package organisation
Packages group related types and help avoid name conflicts.
Example:
package com.example.student;

A package declaration should appear near the start of the source file, after comments if present.

2. Naming and API clarity
Use PascalCase for class names and camelCase for methods and variables. Public classes and methods should communicate their purpose clearly.

3. Documentation
JavaDoc comments can document public APIs:
 /**
  * Returns the total of two values.
  */
public int add(int first, int second) {
    return first + second;
}

4. Separation of concerns
Keep input, business logic, and output responsibilities distinct as a program grows.

5. Error diagnosis
Distinguish compile-time errors from runtime exceptions and incorrect program logic.

6. Reproducible execution
Document the Java version, build command, required arguments, and external dependencies.

7. Maintainability checklist
• Consistent formatting
• Meaningful identifiers
• Small, focused methods
• Useful documentation
• No unexplained magic values
• Tests for important behaviour
        `,
        url: "",
        order: 4,
        isActive: true,
      },
      {
        title: "Java Program Structure - Advanced Examples",
        description: "Advanced exercises for arguments, packages, compilation errors, and bytecode inspection.",
        type: "note",
        level: "advanced",
        content: `
ADVANCED JAVA STRUCTURE — WORKED EXAMPLES

Example 1: Validate command-line arguments
public class SumArgs {
    public static void main(String[] args) {
        if (args.length != 2) {
            System.out.println("Usage: java SumArgs <a> <b>");
            return;
        }

        try {
            int a = Integer.parseInt(args[0]);
            int b = Integer.parseInt(args[1]);
            System.out.println(a + b);
        } catch (NumberFormatException ex) {
            System.out.println("Both arguments must be integers.");
        }
    }
}

Example 2: Compile and inspect
javac Main.java
javap -c Main
java Main

Example 3: Package layout
If a class declares package com.example, use a matching directory structure and appropriate classpath conventions.

Example 4: Diagnose a failure
• Compilation fails: inspect compiler diagnostics.
• Class cannot be found: check class name, package, working directory, and classpath.
• Runtime exception: inspect the exception and stack trace.
• Incorrect output: trace inputs and logic.

Task:
Explain why a program that compiles successfully can still fail at runtime or produce an incorrect result.
        `,
        url: "",
        order: 5,
        isActive: true,
      },
      {
        title: "Java Basics & Syntax Worksheet - Advanced",
        description: "Advanced worksheet on bytecode, JVM execution, arguments, packaging, and debugging.",
        type: "worksheet",
        level: "advanced",
        content: `
JAVA BASICS & SYNTAX — ADVANCED WORKSHEET

SECTION A: EXPLANATION
1. Describe the Java source-to-runtime pipeline.
2. What information can javap -c provide?
3. Explain the purpose of class loading and bytecode verification.
4. Why does bytecode portability not guarantee identical behaviour on every system?
5. Distinguish compile-time errors, runtime exceptions, and logic errors.

SECTION B: COMMANDS AND PACKAGES
6. Write the command to compile Main.java.
7. Write the command to execute the Main class.
8. What is the purpose of a package declaration?
9. Why should package directory structure match the declared package in common Java workflows?
10. How can a classpath problem cause a class-not-found error?

SECTION C: DEBUGGING
11. A public class named Report is stored in Main.java. Explain the issue and fix.
12. A program compiles but throws NumberFormatException when parsing an argument. Explain why.
13. List a systematic sequence for diagnosing a Java compilation failure.
14. Explain the benefits of meaningful identifiers and JavaDoc for maintainability.

SECTION D: CODING
15. Write a program that accepts exactly two integer command-line arguments, prints their sum, and handles invalid input.
16. Create a short Java class with a package declaration and one documented method.
17. Describe how you would inspect bytecode for a compiled class.

SELF-CHECK
[ ] I understand the compilation and runtime pipeline.
[ ] I can use basic bytecode inspection commands.
[ ] I can distinguish common classes of program errors.
[ ] I can design maintainable Java source structure.
        `,
        url: "",
        order: 6,
        isActive: true,
      },
    ];

    // Attach the MongoDB Topic ObjectId to every resource.
    const documents = resources.map((resource) => ({
      ...resource,
      topicId: topic._id,
    }));

    // Insert or update matching records without deleting other resources.
    let insertedCount = 0;
    let updatedCount = 0;

    for (const resource of documents) {
      const result = await LearningResource.updateOne(
        {
          topicId: topic._id,
          title: resource.title,
          type: resource.type,
          level: resource.level,
        },
        { $set: resource },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        insertedCount++;
      } else {
        updatedCount++;
      }
    }

    const summary = await LearningResource.aggregate([
      {
        $match: {
          topicId: topic._id,
          isActive: true,
        },
      },
      {
        $group: {
          _id: { level: "$level", type: "$type" },
          count: { $sum: 1 },
        },
      },
    ]);

    console.log("\n======================================");
    console.log("✅ JAVA BASICS RESOURCES SEEDED");
    console.log("======================================");
    console.log(`Resources in this seed: ${documents.length}`);
    console.log("Per level: 2 videos, 3 notes, 1 worksheet");
    console.log(`Inserted: ${insertedCount}`);
    console.log(`Updated : ${updatedCount}`);
    console.log("\nActive resources stored for this topic:");

    for (const row of summary) {
      console.log(`${row._id.level} / ${row._id.type}: ${row.count}`);
    }

    console.log("\nExisting assessment questions were not modified.");
    console.log("======================================");

    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error while seeding Java Basics resources:");
    console.error(error);

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    process.exit(1);
  }
};

seedJavaBasicsResources();