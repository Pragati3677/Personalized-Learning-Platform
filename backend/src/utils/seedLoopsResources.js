
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Topic = require("../models/Topic");
const LearningResource = require("../models/LearningResource");

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || process.env.MONGO_URI;

const TOPIC_TITLE = "Loops";

const resources = [
  // ==================== BASIC LEVEL ====================
  {
    title: "Introduction to Loops in Java",
    description: "Learn how loops repeat statements in Java programs.",
    type: "video",
    level: "basic",
    url: "https://www.youtube.com/watch?v=d6hNDJrj1bw",
    order: 1,
  },
  
  {
    title: "Introduction to Loops",
    description: "Learn the purpose and basic structure of loops.",
    type: "note",
    level: "basic",
    content: `# Introduction to Loops

A loop repeatedly executes a block of code while a condition or iteration rule allows it.

## 1. For Loop

A for loop is useful when the number of iterations is known.

Example:

for (int i = 1; i <= 5; i++) {
    System.out.println(i);
}

This prints numbers from 1 to 5.

## 2. While Loop

A while loop checks its condition before executing the body.

int i = 1;

while (i <= 5) {
    System.out.println(i);
    i++;
}

Always ensure the loop can eventually stop to avoid an unintended infinite loop.`,
    order: 3,
  },
  {
    title: "Do-While Loop in Java",
    description: "Understand loops that execute their body at least once.",
    type: "note",
    level: "basic",
    content: `# Do-While Loop

A do-while loop executes its body before checking the condition.

Example:

int i = 1;

do {
    System.out.println(i);
    i++;
} while (i <= 5);

## Important Points
- The loop body executes at least once.
- The condition is checked after the body.
- A semicolon is required after the while condition.

Unlike a while loop, a do-while loop executes once even if its condition is initially false.`,
    order: 4,
  },
  {
    title: "Loop Variables and Counters",
    description: "Learn initialization, conditions, and updates in loops.",
    type: "note",
    level: "basic",
    content: `# Loop Variables and Counters

A counter variable tracks the number of loop iterations.

Example:

for (int count = 1; count <= 3; count++) {
    System.out.println("Count: " + count);
}

The three main parts of a traditional for loop are:
1. Initialization: runs once at the beginning.
2. Condition: checked before each iteration.
3. Update: runs after each completed iteration.

Check the initial value, condition, and update carefully to avoid off-by-one errors.`,
    order: 5,
  },
  {
    title: "Loops Worksheet - Basic",
    description: "Practice simple for, while, and do-while loops.",
    type: "worksheet",
    level: "basic",
    content: `# Basic Worksheet: Loops

1. What is the purpose of a loop?
2. Write a for loop that prints numbers from 1 to 10.
3. Write a while loop that prints numbers from 1 to 5.
4. Which loop executes its body at least once?
5. What are the three parts of a traditional for loop?
6. What can cause an infinite loop?

Write and run your Java examples to verify your answers.`,
    order: 6,
  },

  // ==================== MEDIUM LEVEL ====================
  {
    title: "Nested Loops in Java",
    description: "Learn how to use one loop inside another loop.",
    type: "video",
    level: "medium",
    url: "https://youtu.be/bSrm9RXwBaI?si=NeBPqySd7U0AKpkY",
    order: 1,
  },
  
  {
    title: "Nested Loops",
    description: "Understand inner and outer loop execution.",
    type: "note",
    level: "medium",
    content: `# Nested Loops

A nested loop is a loop inside another loop.

Example:

for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= 2; j++) {
        System.out.println(i + ", " + j);
    }
}

For each iteration of the outer loop, the inner loop runs through its iterations.

Nested loops are useful for:
- Printing patterns.
- Processing two-dimensional arrays.
- Comparing combinations of values.

If the outer loop runs m times and the inner loop runs n times per outer iteration, the body runs m * n times.`,
    order: 3,
  },
  {
    title: "Break and Continue Statements",
    description: "Learn how to exit a loop or skip an iteration.",
    type: "note",
    level: "medium",
    content: `# Break and Continue

## Break

The break statement exits the nearest enclosing loop.

for (int i = 1; i <= 5; i++) {
    if (i == 3) {
        break;
    }
    System.out.println(i);
}

This prints 1 and 2.

## Continue

The continue statement skips the remainder of the current iteration and proceeds to the next iteration.

for (int i = 1; i <= 5; i++) {
    if (i == 3) {
        continue;
    }
    System.out.println(i);
}

This prints 1, 2, 4, and 5.`,
    order: 4,
  },
  {
    title: "Loop Tracing and Common Errors",
    description: "Trace iterations and identify off-by-one and termination errors.",
    type: "note",
    level: "medium",
    content: `# Loop Tracing and Common Errors

Consider:

for (int i = 0; i < 4; i++) {
    System.out.println(i);
}

The values printed are 0, 1, 2, and 3.

## Common Errors
- Using <= when < was intended.
- Forgetting to update the counter.
- Updating the counter in the wrong direction.
- Using an incorrect termination condition.
- Accidentally creating an infinite loop.

Trace the initialization, condition, body, and update for each iteration when debugging a loop.`,
    order: 5,
  },
  {
    title: "Loops Worksheet - Medium",
    description: "Practice nested loops, break, continue, and loop tracing.",
    type: "worksheet",
    level: "medium",
    content: `# Medium Worksheet: Loops

1. Write nested loops to print a 3-by-3 grid of asterisks.
2. What is the difference between break and continue?
3. How many times does the body execute in for (int i = 0; i < 5; i++)?
4. Write a loop that prints only even numbers from 2 to 20.
5. Identify the error in a loop whose counter never changes.
6. Trace a loop with initialization i = 1, condition i <= 4, and update i++.

Test your answers in Java.`,
    order: 6,
  },

  // ==================== ADVANCED LEVEL ====================
  {
    title: "Advanced Loop Patterns in Java",
    description: "Explore efficient iteration patterns and loop design.",
    type: "video",
    level: "advanced",
    url: "https://www.youtube.com/watch?v=lsOOs5J8ycw",
    order: 1,
  },
  
  {
    title: "Enhanced For Loops and Iteration",
    description: "Understand array and collection traversal using enhanced for loops.",
    type: "note",
    level: "advanced",
    content: `# Enhanced For Loop

The enhanced for loop simplifies traversal of arrays and Iterable collections.

Example:

int[] numbers = {10, 20, 30};

for (int number : numbers) {
    System.out.println(number);
}

## Benefits
- Less boilerplate for simple traversal.
- No manual index management is needed.
- Improves readability for straightforward iteration.

Use a traditional for loop when you need the index or need to control the update step.

Changing the loop variable does not replace the corresponding array element. For primitive arrays, the variable receives a copy of the element value.`,
    order: 3,
  },
  {
    title: "Loop Complexity and Performance",
    description: "Analyze iteration counts and basic time complexity.",
    type: "note",
    level: "advanced",
    content: `# Loop Complexity

The number of loop iterations helps estimate algorithmic time complexity.

## Single Loop

for (int i = 0; i < n; i++) {
    // Constant-time work
}

The body executes n times, so the work is O(n), assuming constant-time work per iteration.

## Nested Loops

for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        // Constant-time work
    }
}

The inner body executes n * n times, giving O(n^2) work under the same assumption.

Actual performance depends on the operations performed inside the loops, data size, and runtime behavior.`,
    order: 4,
  },
  {
    title: "Loop Invariants and Termination",
    description: "Learn how to reason about loop correctness and termination.",
    type: "note",
    level: "advanced",
    content: `# Loop Invariants and Termination

A loop invariant is a property that remains true at a specific point in every iteration.

To reason about a loop:
1. Initialization: show the property is true before the first iteration.
2. Maintenance: show that an iteration preserves the property.
3. Termination: show that the loop stops and the result is correct.

## Example

int sum = 0;

for (int i = 1; i <= n; i++) {
    sum += i;
}

After each iteration, sum contains the sum of the integers processed so far.

For termination, the loop's counter must progress toward a condition that eventually becomes false, assuming the loop bounds are valid.`,
    order: 5,
  },
  {
    title: "Loops Worksheet - Advanced",
    description: "Solve loop problems involving traversal, complexity, and correctness.",
    type: "worksheet",
    level: "advanced",
    content: `# Advanced Worksheet: Loops

1. Explain the difference between a traditional for loop and an enhanced for loop.
2. What is the time complexity of two nested loops that each run n times?
3. Write a loop to find the maximum value in an integer array.
4. Explain what a loop invariant is.
5. How can you detect an infinite loop during code review?
6. When should you prefer an iterator or enhanced for loop over an index-based loop?

Implement your solutions and test boundary cases.`,
    order: 6,
  },
];


async function seedLoopsResources() {
  try {
    if (!MONGODB_URI) {
      throw new Error(
        "Missing MONGODB_URI or MONGO_URI in your .env file."
      );
    }

    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    // Find the Loops topic
    const topic = await Topic.findOne({
      title: TOPIC_TITLE,
    });

    if (!topic) {
      throw new Error(
        `Topic "${TOPIC_TITLE}" was not found. Check the exact title in MongoDB.`
      );
    }

    let insertedCount = 0;
    let updatedCount = 0;

    // Validate and insert/update resources
    for (const resource of resources) {
      if (!resource.title || !resource.type || !resource.level) {
        throw new Error(
          `Invalid resource found: ${resource.title || "Unknown resource"}`
        );
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
        {
          $set: resourceData,
        },
        {
          upsert: true,
          runValidators: true,
        }
      );

      if (result.upsertedCount > 0) {
        insertedCount++;
      } else if (result.modifiedCount > 0) {
        updatedCount++;
      }
    }

    // Display summary
    console.log("\n========== LOOPS SEEDING SUMMARY ==========");
    console.log("Topic:", topic.title);
    console.log("Total Resources:", resources.length);
    console.log("Inserted:", insertedCount);
    console.log("Updated:", updatedCount);

    // Count active resources by level and type
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

    console.log("\nActive Resource Counts:");
    console.table(
      counts.map((item) => ({
        Level: item._id.level,
        Type: item._id.type,
        Count: item.count,
      }))
    );

    console.log("===========================================\n");
    console.log("Loops resources seeded successfully!");

  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected.");
  }
}

seedLoopsResources();
