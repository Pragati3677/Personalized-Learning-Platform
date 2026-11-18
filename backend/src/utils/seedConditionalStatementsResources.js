const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Topic = require("../models/Topic");
const LearningResource = require("../models/LearningResource");

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || process.env.MONGO_URI;

const TOPIC_TITLE = "Conditional Statements";

const resources = [
  // ================= BASIC LEVEL =================
  {
    title: "Java If Statement for Beginners",
    description: "Learn how to execute code when a condition is true.",
    type: "video",
    level: "basic",
    url: "https://www.youtube.com/watch?v=cdNhXVb5j7o",
    order: 1,
  },
  
  {
    title: "Introduction to If Statements",
    description: "Learn the syntax and working of if statements.",
    type: "note",
    level: "basic",
    content: `# Introduction to If Statements

Conditional statements allow a program to make decisions.

## The if Statement

The code inside the block executes when the condition is true.

Example:

int age = 20;

if (age >= 18) {
    System.out.println("Eligible");
}

## Syntax

if (condition) {
    // Statements execute when condition is true
}

The condition must evaluate to a boolean value in Java.`,
    order: 3,
  },
  {
    title: "If-Else Statements in Java",
    description: "Learn how to execute different blocks for true and false conditions.",
    type: "note",
    level: "basic",
    content: `# If-Else Statements

The if-else statement chooses one of two code blocks.

Example:

int number = 7;

if (number % 2 == 0) {
    System.out.println("Even");
} else {
    System.out.println("Odd");
}

## How It Works
- If the condition is true, the if block executes.
- Otherwise, the else block executes.

Only one of these blocks executes in a basic if-else statement.`,
    order: 4,
  },
  {
    title: "Comparison and Conditions",
    description: "Practice writing conditions with relational and equality operators.",
    type: "note",
    level: "basic",
    content: `# Comparison and Conditions

Conditions often use comparison operators.

- == Equal to
- != Not equal to
- > Greater than
- < Less than
- >= Greater than or equal to
- <= Less than or equal to

Example:

int marks = 75;

if (marks >= 40) {
    System.out.println("Pass");
} else {
    System.out.println("Fail");
}

Use == to compare primitive values. A single = assigns a value rather than comparing values.`,
    order: 5,
  },
  {
    title: "Conditional Statements Worksheet - Basic",
    description: "Practice simple if and if-else statements.",
    type: "worksheet",
    level: "basic",
    content: `# Basic Worksheet: Conditional Statements

1. Write an if statement that checks whether age is at least 18.
2. Write an if-else statement to check whether a number is even or odd.
3. Write a condition to check whether marks are at least 40.
4. What happens when an if condition is false and there is no else block?
5. Which operator checks equality between primitive values?
6. Write a program logic to check whether a number is positive.

Test your answers using Java.`,
    order: 6,
  },

  // ================= MEDIUM LEVEL =================
  {
    title: "Else-If Ladder in Java",
    description: "Learn how to handle multiple conditions using an else-if ladder.",
    type: "video",
    level: "medium",
    url: "https://youtu.be/I5srDu75h_M?si=Fu7uITq0RoI-u6DG",
    order: 1,
  },

  {
    title: "Else-If Ladder",
    description: "Use multiple conditions to select one matching branch.",
    type: "note",
    level: "medium",
    content: `# Else-If Ladder

An else-if ladder checks conditions from top to bottom.

Example:

int marks = 82;

if (marks >= 90) {
    System.out.println("Grade A");
} else if (marks >= 75) {
    System.out.println("Grade B");
} else if (marks >= 40) {
    System.out.println("Pass");
} else {
    System.out.println("Fail");
}

The first matching branch executes. Conditions later in the ladder are skipped once a matching branch is found.

Arrange conditions carefully, especially when one condition includes another.`,
    order: 3,
  },
  {
    title: "Switch Statements in Java",
    description: "Learn switch syntax, case labels, break, and default.",
    type: "note",
    level: "medium",
    content: `# Switch Statements

A switch statement selects a branch based on a selector value.

Example:

int day = 2;

switch (day) {
    case 1:
        System.out.println("Monday");
        break;
    case 2:
        System.out.println("Tuesday");
        break;
    default:
        System.out.println("Unknown day");
}

## Important Points
- case labels identify possible matches.
- break prevents execution from falling through to the next case.
- default handles cases without a matching label.
- Modern Java also supports switch expressions and arrow-style cases.

Choose a switch when it makes several alternatives clearer.`,
    order: 4,
  },
  {
    title: "Nested If Statements",
    description: "Understand how to place one if statement inside another.",
    type: "note",
    level: "medium",
    content: `# Nested If Statements

A nested if is an if statement inside another conditional block.

Example:

int age = 20;
boolean hasId = true;

if (age >= 18) {
    if (hasId) {
        System.out.println("Access allowed");
    } else {
        System.out.println("ID required");
    }
} else {
    System.out.println("Underage");
}

Nested conditions can handle dependent decisions. For complex logic, consider whether combining conditions or using early returns improves readability.`,
    order: 5,
  },
  {
    title: "Conditional Statements Worksheet - Medium",
    description: "Practice else-if ladders, switch, and nested conditions.",
    type: "worksheet",
    level: "medium",
    content: `# Medium Worksheet: Conditional Statements

1. Write an else-if ladder to assign grades based on marks.
2. When is a switch statement useful?
3. What is the purpose of break in a traditional switch statement?
4. Write a switch statement for a simple menu with three choices.
5. Explain nested if statements with an example.
6. What is the purpose of the default branch in a switch statement?

Write and test your solutions in Java.`,
    order: 6,
  },

  // ================= ADVANCED LEVEL =================
  {
    title: "Advanced Conditional Logic in Java",
    description: "Explore complex conditions and decision-making patterns.",
    type: "video",
    level: "advanced",
    url: "https://www.youtube.com/watch?v=LQsyrHJzNwA",
    order: 1,
  },
  
  {
    title: "Complex Conditions and Short-Circuit Logic",
    description: "Build readable conditions using logical operators.",
    type: "note",
    level: "advanced",
    content: `# Complex Conditions

Logical operators combine boolean conditions.

Example:

int age = 25;
boolean hasLicense = true;

if (age >= 18 && hasLicense) {
    System.out.println("Can drive");
}

## Short-Circuit Evaluation

With &&, Java skips the right operand when the left operand is false.

With ||, Java skips the right operand when the left operand is true.

Example:

String name = null;

if (name != null && !name.isEmpty()) {
    System.out.println(name);
}

The second condition is not evaluated when name is null, preventing a NullPointerException in this example.

Use parentheses when they help clarify complex conditions.`,
    order: 3,
  },
  {
    title: "Modern Switch Expressions",
    description: "Understand switch expressions that return values.",
    type: "note",
    level: "advanced",
    content: `# Switch Expressions

Modern Java supports switch expressions that return a value.

Example:

int day = 2;

String name = switch (day) {
    case 1 -> "Monday";
    case 2 -> "Tuesday";
    case 3 -> "Wednesday";
    default -> "Other day";
};

System.out.println(name);

## Advantages
- Arrow-style cases do not fall through.
- A switch expression can produce a value.
- Multiple labels can share a result.
- Exhaustiveness must be considered, especially with enum and sealed-type switches.

Switch expressions were finalized in Java 14. Ensure your JDK supports the syntax you use.`,
    order: 4,
  },
  {
    title: "Conditional Design and Edge Cases",
    description: "Learn to order conditions and handle boundary cases correctly.",
    type: "note",
    level: "advanced",
    content: `# Conditional Design and Edge Cases

Good conditional logic considers boundaries and invalid inputs.

Example:

int marks = 100;

if (marks < 0 || marks > 100) {
    System.out.println("Invalid marks");
} else if (marks >= 75) {
    System.out.println("Distinction");
} else if (marks >= 40) {
    System.out.println("Pass");
} else {
    System.out.println("Fail");
}

## Best Practices
- Validate input ranges.
- Check boundary values such as 0, 40, and 100.
- Order overlapping conditions carefully.
- Avoid deeply nested conditions where a simpler structure works.
- Test every branch, including invalid input cases.`,
    order: 5,
  },
  {
    title: "Conditional Statements Worksheet - Advanced",
    description: "Solve decision-making problems using complex conditions and switch expressions.",
    type: "worksheet",
    level: "advanced",
    content: `# Advanced Worksheet: Conditional Statements

1. Write a condition that checks whether a String is non-null and non-empty.
2. Explain short-circuit evaluation with an example.
3. Create a grading system that validates marks from 0 to 100.
4. Explain one difference between a switch statement and a switch expression.
5. Write a switch expression that converts a number from 1 to 3 into a weekday.
6. List boundary cases you would test for a marks-based grading system.

Implement and test your answers in Java.`,
    order: 6,
  },
];


async function seedConditionalStatementsResources() {
  try {
    // 1. Check MongoDB connection URL
    if (!MONGODB_URI) {
      throw new Error(
        "Missing MONGODB_URI or MONGO_URI in your .env file."
      );
    }

    // 2. Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    // 3. Find Conditional Statements topic
    const topic = await Topic.findOne({
      title: TOPIC_TITLE,
    });

    if (!topic) {
      throw new Error(
        `Topic "${TOPIC_TITLE}" was not found. Check its exact title in MongoDB.`
      );
    }

    // 4. Delete old videos ONLY for Conditional Statements.
    // Notes and worksheets will remain unchanged.
    const deleteResult = await LearningResource.deleteMany({
      topicId: topic._id,
      type: "video",
    });

    console.log(
      `Old video resources removed: ${deleteResult.deletedCount}`
    );

    // 5. Insert or update resources
    let inserted = 0;
    let updated = 0;
    let unchanged = 0;

    for (const resource of resources) {
      const cleanResource = {
        ...resource,
        url: resource.url?.trim(),
        topicId: topic._id,
        isActive: true,
      };

      const filter = {
        topicId: topic._id,
        title: resource.title,
        type: resource.type,
        level: resource.level,
      };

      const result = await LearningResource.updateOne(
        filter,
        {
          $set: cleanResource,
        },
        {
          upsert: true,
          runValidators: true,
        }
      );

      if (result.upsertedCount > 0) {
        inserted++;
      } else if (result.modifiedCount > 0) {
        updated++;
      } else {
        unchanged++;
      }
    }

    // 6. Display seeding summary
    console.log("--------------------------------");
    console.log(`Topic: ${topic.title}`);
    console.log(`Inserted: ${inserted}`);
    console.log(`Updated: ${updated}`);
    console.log(`Unchanged: ${unchanged}`);
    console.log(`Processed: ${resources.length}`);
    console.log("--------------------------------");

    // 7. Count active resources by level and type
    const counts = await LearningResource.aggregate([
      {
        $match: {
          topicId: topic._id,
          isActive: true,
          level: {
            $in: ["basic", "medium", "advanced"],
          },
        },
      },
      {
        $group: {
          _id: {
            level: "$level",
            type: "$type",
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.level": 1,
          "_id.type": 1,
        },
      },
    ]);

    console.log("Active resource counts by level and type:");

    console.table(
      counts.map((item) => ({
        level: item._id.level,
        type: item._id.type,
        count: item.count,
      }))
    );

    console.log(
      "Conditional Statements resources seeded successfully!"
    );

  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;

  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log("MongoDB connection closed.");
    }
  }
}

// Run the seed function
seedConditionalStatementsResources();
