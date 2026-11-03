
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Topic = require("../models/Topic");
const LearningResource = require("../models/LearningResource");

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || process.env.MONGO_URI;

const TOPIC_TITLE = "Methods";

const resources = [
  // ==================== BASIC LEVEL ====================
  {
    title: "Introduction to Methods in Java",
    description: "Understand methods and why they make programs reusable.",
    type: "video",
    level: "basic",
    url: "https://www.youtube.com/results?search_query=Java+methods+for+beginners",
    order: 1,
  },
  {
    title: "Method Declaration and Calling",
    description: "Learn method syntax, declaration, and method calls.",
    type: "video",
    level: "basic",
    url: "https://www.youtube.com/results?search_query=Java+method+declaration+and+calling",
    order: 2,
  },
  {
    title: "Method Syntax and Structure",
    description: "Learn the parts of a Java method.",
    type: "note",
    level: "basic",
    content: `# Methods in Java

A method is a block of code that performs a specific task. Methods help make code reusable and organized.

## Method Declaration

static void greet() {
    System.out.println("Hello!");
}

## Calling a Method

greet();

## Method Components
- Access modifier, such as public.
- Optional static keyword.
- Return type, such as void or int.
- Method name.
- Parentheses, which may contain parameters.
- Method body enclosed in braces.

The void keyword means the method does not return a value.`,
    order: 3,
  },
  {
    title: "Parameters and Arguments",
    description: "Understand how to pass information to methods.",
    type: "note",
    level: "basic",
    content: `# Parameters and Arguments

Parameters are variables declared in a method definition. Arguments are the actual values passed when calling the method.

static void greet(String name) {
    System.out.println("Hello, " + name);
}

Call the method:

greet("Asha");

Here, name is the parameter and "Asha" is the argument.

A method can accept multiple parameters:

static void add(int a, int b) {
    System.out.println(a + b);
}

Call it using add(10, 20).

The argument types and order must be compatible with the method parameters.`,
    order: 4,
  },
  {
    title: "Return Types in Java Methods",
    description: "Learn how methods return results to their callers.",
    type: "note",
    level: "basic",
    content: `# Return Types

A method's return type specifies what kind of value it returns.

static int add(int a, int b) {
    return a + b;
}

Use the returned value:

int result = add(10, 20);
System.out.println(result); // 30

A void method does not return a value.

Important points:
- The returned value must match the declared return type.
- A non-void method must return an appropriate value on every possible path.
- A return statement ends the current method execution.
- A returned value can be stored in a variable or used in an expression.`,
    order: 5,
  },
  {
    title: "Methods Worksheet - Basic",
    description: "Practice method declarations, calls, parameters, and return values.",
    type: "worksheet",
    level: "basic",
    content: `# Basic Worksheet: Java Methods

1. What is a method in Java?
2. Write a method named greet() that prints a welcome message.
3. Explain the difference between a parameter and an argument.
4. Write a method that accepts two integers and prints their sum.
5. What does void mean?
6. Write a method that returns the square of an integer.

Compile and test your methods in Java.`,
    order: 6,
  },

  // ==================== MEDIUM LEVEL ====================
  {
    title: "Method Overloading in Java",
    description: "Learn how methods can share a name with different parameter lists.",
    type: "video",
    level: "medium",
    url: "https://www.youtube.com/results?search_query=Java+method+overloading+tutorial",
    order: 1,
  },
  {
    title: "Static and Instance Methods",
    description: "Understand class methods and object methods.",
    type: "video",
    level: "medium",
    url: "https://www.youtube.com/results?search_query=Java+static+and+instance+methods",
    order: 2,
  },
  {
    title: "Method Overloading",
    description: "Understand compile-time polymorphism through overloaded methods.",
    type: "note",
    level: "medium",
    content: `# Method Overloading

Method overloading allows multiple methods in the same class to have the same name but different parameter lists.

static int add(int a, int b) {
    return a + b;
}

static double add(double a, double b) {
    return a + b;
}

Both methods are named add, but their parameter types differ.

Overloading can differ by:
- Number of parameters.
- Parameter types.
- Parameter order, when the resulting signatures differ.

Changing only the return type is not enough to overload a method.

The compiler chooses an applicable overload based on the arguments supplied.`,
    order: 3,
  },
  {
    title: "Static Methods and Instance Methods",
    description: "Learn how static and non-static methods are accessed.",
    type: "note",
    level: "medium",
    content: `# Static vs Instance Methods

## Static Method

A static method belongs to the class.

static int square(int n) {
    return n * n;
}

It can be called using the class name:

int result = MathExample.square(5);

## Instance Method

An instance method belongs to an object.

class Counter {
    int value;

    void increment() {
        value++;
    }
}

Create an object before calling increment():

Counter counter = new Counter();
counter.increment();

A static method cannot directly access instance fields or call instance methods without an object reference.`,
    order: 4,
  },
  {
    title: "Variable Scope and Method Parameters",
    description: "Understand local variables, scope, and Java argument passing.",
    type: "note",
    level: "medium",
    content: `# Scope and Parameter Passing

Variables declared inside a method are local to that method.

static int calculate(int number) {
    int result = number * 2;
    return result;
}

The variable result is only available within calculate().

## Java Passes Arguments by Value

Java passes a copy of the argument value to a method.

For primitive arguments, the method receives a copy of the primitive value.

For object references, the reference value is copied. A method may use that reference to modify the referenced object's state, but reassigning the parameter does not reassign the caller's variable.

Understanding scope and pass-by-value helps avoid unexpected behavior.`,
    order: 5,
  },
  {
    title: "Methods Worksheet - Medium",
    description: "Practice overloading, static methods, and scope.",
    type: "worksheet",
    level: "medium",
    content: `# Medium Worksheet: Java Methods

1. Create two overloaded methods named multiply().
2. Can two methods be overloaded using only different return types? Explain.
3. Explain the difference between static and instance methods.
4. Why does an instance method usually require an object to be called?
5. What is the scope of a local variable?
6. Explain how Java passes an object reference to a method.

Write and run examples to verify your answers.`,
    order: 6,
  },

  // ==================== ADVANCED LEVEL ====================
  {
    title: "Recursion in Java Methods",
    description: "Learn recursive calls and base cases.",
    type: "video",
    level: "advanced",
    url: "https://www.youtube.com/results?search_query=Java+recursion+methods+tutorial",
    order: 1,
  },
  {
    title: "Varargs and Advanced Method Design",
    description: "Explore variable-length arguments and method design.",
    type: "video",
    level: "advanced",
    url: "https://www.youtube.com/results?search_query=Java+varargs+methods+tutorial",
    order: 2,
  },
  {
    title: "Recursion and Base Cases",
    description: "Understand recursive problem-solving and termination.",
    type: "note",
    level: "advanced",
    content: `# Recursion

Recursion occurs when a method calls itself to solve a smaller version of a problem.

static int factorial(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * factorial(n - 1);
}

factorial(5) returns 120.

## Base Case

The base case stops further recursive calls.

## Recursive Case

The recursive case reduces the problem toward the base case.

Without a valid base case or progress toward it, recursion may continue until a StackOverflowError occurs.

Recursive algorithms use stack space for active method calls. Iteration may be more appropriate for some problems.`,
    order: 3,
  },
  {
    title: "Varargs and Method Parameters",
    description: "Learn methods that accept a variable number of arguments.",
    type: "note",
    level: "advanced",
    content: `# Variable-Length Arguments (Varargs)

Java supports methods that accept a variable number of arguments using ... .

static int sum(int... numbers) {
    int total = 0;

    for (int number : numbers) {
        total += number;
    }

    return total;
}

Example calls:

sum(1, 2);
sum(1, 2, 3, 4);
sum();

Inside the method, numbers behaves like an array.

A method can have only one varargs parameter, and it must be the final parameter.

For example, printNames(String prefix, String... names) is valid.

Varargs improves calling convenience, but the method should still define sensible behavior for empty inputs.`,
    order: 4,
  },
  {
    title: "Method Contracts and Design",
    description: "Learn to design methods with clear inputs, outputs, and responsibilities.",
    type: "note",
    level: "advanced",
    content: `# Method Design

A well-designed method should have a clear responsibility and a meaningful name.

## Good Practices
- Use descriptive method names.
- Keep methods focused on one task.
- Validate inputs when necessary.
- Choose appropriate return types.
- Document important assumptions and exceptions.
- Avoid unnecessary side effects.

## Example

static double average(int total, int count) {
    if (count <= 0) {
        throw new IllegalArgumentException(
            "Count must be positive"
        );
    }

    return (double) total / count;
}

The method checks its precondition before calculating the average.

Method contracts describe expected inputs, outputs, and behavior, helping make code easier to test and maintain.`,
    order: 5,
  },
  {
    title: "Methods Worksheet - Advanced",
    description: "Solve recursion, varargs, and method design problems.",
    type: "worksheet",
    level: "advanced",
    content: `# Advanced Worksheet: Java Methods

1. Write a recursive method to calculate factorial.
2. Explain why a recursive method needs a base case.
3. What is a StackOverflowError, and how can uncontrolled recursion cause it?
4. Write a varargs method that returns the sum of its integer arguments.
5. Explain Java's pass-by-value behavior for object references.
6. Design a method to calculate an average and handle invalid input.

Compile, test, and explain your solutions.`,
    order: 6,
  },
];

async function seedMethodsResources() {
  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI or MONGO_URI in your .env file.");
  }

  try {
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

      if (result.upsertedCount > 0) inserted++;
      else if (result.modifiedCount > 0) updated++;
      else unchanged++;
    }

    console.log(`Topic: ${topic.title}`);
    console.log(`Inserted: ${inserted}`);
    console.log(`Updated: ${updated}`);
    console.log(`Unchanged: ${unchanged}`);
    console.log(`Total processed: ${resources.length}`);

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
          _id: { level: "$level", type: "$type" },
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

    console.log("Active resource counts by level and type:");
    console.table(
      counts.map((item) => ({
        level: item._id.level,
        type: item._id.type,
        count: item.count,
      }))
    );
  } finally {
    await mongoose.disconnect();
  }
}

seedMethodsResources().catch((error) => {
  console.error("Seeding failed:", error.message);
  process.exitCode = 1;
});
