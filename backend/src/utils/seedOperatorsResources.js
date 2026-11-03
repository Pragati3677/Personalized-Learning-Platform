const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Topic = require("../models/Topic");
const LearningResource = require("../models/LearningResource");

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || process.env.MONGO_URI;

const TOPIC_TITLE = "Operators";

const resources = [
  // ==================== BASIC LEVEL ====================
  {
    title: "Java Operators for Beginners",
    description: "Introduction to arithmetic, assignment, and comparison operators.",
    type: "video",
    level: "basic",
    url: "https://www.youtube.com/results?search_query=Java+operators+for+beginners",
    order: 1,
  },
  {
    title: "Java Arithmetic Operators",
    description: "Learn addition, subtraction, multiplication, division, and modulus.",
    type: "video",
    level: "basic",
    url: "https://www.youtube.com/results?search_query=Java+arithmetic+operators",
    order: 2,
  },
  {
    title: "Introduction to Java Operators",
    description: "Understand the purpose of operators and arithmetic expressions.",
    type: "note",
    level: "basic",
    content: `# Introduction to Java Operators

Operators are symbols used to perform operations on values and variables.

## Arithmetic Operators
- + Addition
- - Subtraction
- * Multiplication
- / Division
- % Remainder

Example:
int a = 10;
int b = 3;

System.out.println(a + b); // 13
System.out.println(a - b); // 7
System.out.println(a * b); // 30
System.out.println(a / b); // 3
System.out.println(a % b); // 1

When both operands of division are integers, Java performs integer division.

## Assignment Operator
The = operator assigns a value to a variable.

int marks = 80;`,
    order: 3,
  },
  {
    title: "Relational and Equality Operators",
    description: "Compare values using relational and equality operators.",
    type: "note",
    level: "basic",
    content: `# Relational and Equality Operators

These operators compare values and return a boolean result.

- == Equal to
- != Not equal to
- > Greater than
- < Less than
- >= Greater than or equal to
- <= Less than or equal to

Example:
int a = 10;
int b = 5;

System.out.println(a > b);  // true
System.out.println(a < b);  // false
System.out.println(a == b); // false

For objects, == checks reference identity. Use equals() when logical equality is required and the class implements it appropriately.`,
    order: 4,
  },
  {
    title: "Increment, Decrement, and Assignment Operators",
    description: "Learn increment, decrement, and compound assignment operators.",
    type: "note",
    level: "basic",
    content: `# Increment and Decrement Operators

The ++ operator increases a variable by one.

int count = 5;
count++;
System.out.println(count); // 6

The -- operator decreases a variable by one.

count--;
System.out.println(count); // 5

## Compound Assignment Operators

- += Addition and assignment
- -= Subtraction and assignment
- *= Multiplication and assignment
- /= Division and assignment
- %= Remainder and assignment

Example:
int total = 10;
total += 5;

System.out.println(total); // 15`,
    order: 5,
  },
  {
    title: "Java Operators Worksheet - Basic",
    description: "Practice arithmetic, relational, and assignment operators.",
    type: "worksheet",
    level: "basic",
    content: `# Basic Worksheet: Java Operators

1. What is the result of 10 + 5?
2. What is the result of 10 % 3?
3. What does 8 > 4 return?
4. If int x = 5, what is x after x++?
5. What is the purpose of the = operator?
6. What is the result of 7 / 2 when both operands are int?

Write Java statements to verify your answers.`,
    order: 6,
  },

  // ==================== MEDIUM LEVEL ====================
  {
    title: "Logical Operators in Java",
    description: "Learn logical AND, OR, and NOT operators.",
    type: "video",
    level: "medium",
    url: "https://www.youtube.com/results?search_query=Java+logical+operators+AND+OR+NOT",
    order: 1,
  },
  {
    title: "Bitwise and Shift Operators in Java",
    description: "Explore bitwise operations and shift operators.",
    type: "video",
    level: "medium",
    url: "https://www.youtube.com/results?search_query=Java+bitwise+and+shift+operators",
    order: 2,
  },
  {
    title: "Logical Operators and Short-Circuit Evaluation",
    description: "Understand logical AND, OR, and NOT in boolean expressions.",
    type: "note",
    level: "medium",
    content: `# Logical Operators

Java provides three main logical operators:

- && Logical AND
- || Logical OR
- ! Logical NOT

Example:
int age = 20;

System.out.println(age >= 18 && age <= 60); // true

## Short-Circuit Evaluation

With &&, the right operand is skipped if the left operand is false.

With ||, the right operand is skipped if the left operand is true.

These operators are useful when combining conditions in if statements and loops.`,
    order: 3,
  },
  {
    title: "Ternary Operator and Operator Precedence",
    description: "Learn conditional expressions and operator precedence.",
    type: "note",
    level: "medium",
    content: `# Ternary Operator

The conditional operator uses this form:

condition ? valueIfTrue : valueIfFalse

Example:
int marks = 75;
String result = marks >= 40 ? "Pass" : "Fail";

## Operator Precedence

Precedence determines how operators are grouped in an expression.

Example:
int result = 2 + 3 * 4; // 14

Multiplication occurs before addition.

Parentheses can change the grouping:

int result2 = (2 + 3) * 4; // 20

Use parentheses to make complex expressions easier to understand.`,
    order: 4,
  },
  {
    title: "Bitwise Operators and Shift Operations",
    description: "Understand operations on individual bits of integer values.",
    type: "note",
    level: "medium",
    content: `# Bitwise Operators

Bitwise operators work on individual bits of integral values.

- & Bitwise AND
- | Bitwise OR
- ^ Bitwise XOR
- ~ Bitwise complement
- << Left shift
- >> Signed right shift
- >>> Unsigned right shift

Example:
int a = 5;
int b = 3;

System.out.println(a & b); // 1
System.out.println(a | b); // 7
System.out.println(a ^ b); // 6

Bitwise operators are commonly used in masks, flags, and low-level operations.`,
    order: 5,
  },
  {
    title: "Java Operators Worksheet - Medium",
    description: "Practice logical, ternary, precedence, and bitwise operators.",
    type: "worksheet",
    level: "medium",
    content: `# Medium Worksheet: Java Operators

1. What does true && false return?
2. What does false || true return?
3. What is the result of 2 + 3 * 4?
4. Rewrite a simple if-else assignment using the ternary operator.
5. What is the result of 5 & 3?
6. Explain short-circuit evaluation.

Test your answers using a Java program.`,
    order: 6,
  },

  // ==================== ADVANCED LEVEL ====================
  {
    title: "Java Operator Precedence and Evaluation",
    description: "Analyze complex expressions and evaluation order.",
    type: "video",
    level: "advanced",
    url: "https://www.youtube.com/results?search_query=Java+operator+precedence+evaluation+order",
    order: 1,
  },
  {
    title: "Java Bit Manipulation Techniques",
    description: "Explore bit masks, shifts, and common bit manipulation patterns.",
    type: "video",
    level: "advanced",
    url: "https://www.youtube.com/results?search_query=Java+bit+manipulation+techniques",
    order: 2,
  },
  {
    title: "Numeric Promotion and Operator Evaluation",
    description: "Understand numeric promotion and Java expression evaluation.",
    type: "note",
    level: "advanced",
    content: `# Numeric Promotion and Operator Evaluation

In many arithmetic expressions, byte, short, and char operands are promoted to int.

byte a = 10;
byte b = 20;
// byte c = a + b; // Compilation error
int c = a + b;

## Integer Division
int result = 7 / 2; // 3

## Floating-Point Division
double result2 = 7.0 / 2; // 3.5

Java follows defined operator precedence and operand evaluation rules.

Use parentheses and intermediate variables to make complex expressions clearer.`,
    order: 3,
  },
  {
    title: "Bit Masks and Practical Bit Manipulation",
    description: "Use bitwise operators to inspect and modify individual flags.",
    type: "note",
    level: "advanced",
    content: `# Bit Masks

A bit mask selects specific bits using bitwise operations.

Example:
int flags = 0b0101;
int mask = 0b0001;

boolean firstBitSet = (flags & mask) != 0;
System.out.println(firstBitSet); // true

## Set a Bit
flags |= mask;

## Clear a Bit
flags &= ~mask;

## Toggle a Bit
flags ^= mask;

Bit masks are useful for compact flags and low-level programming.`,
    order: 4,
  },
  {
    title: "Equality, References, and Expression Pitfalls",
    description: "Understand equality comparisons and common expression mistakes.",
    type: "note",
    level: "advanced",
    content: `# Equality and Expression Pitfalls

## Primitive Equality
For primitive values, == compares their values.

int a = 10;
int b = 10;
System.out.println(a == b); // true

## Reference Equality
For objects, == checks reference identity.

String first = new String("Java");
String second = new String("Java");

System.out.println(first == second);      // false
System.out.println(first.equals(second)); // true

## Compound Assignment
Compound assignment operators include conversion rules that may differ from writing the equivalent expression with a simple assignment.

Use readable expressions and avoid unnecessary side effects in complex statements.`,
    order: 5,
  },
  {
    title: "Java Operators Worksheet - Advanced",
    description: "Practice precedence, bitwise operations, and equality.",
    type: "worksheet",
    level: "advanced",
    content: `# Advanced Worksheet: Java Operators

1. Why does 7 / 2 produce 3 when both operands are int?
2. What is the difference between && and & for boolean operands?
3. What is the result of 5 ^ 3?
4. Explain the difference between == and equals() for objects.
5. How can a bit mask set a specific bit?
6. Why can parentheses improve expression readability?

Write and run Java examples to verify your answers.`,
    order: 6,
  },
];

async function seedOperatorsResources() {
  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI or MONGO_URI in your .env file.");
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

    if (result.upsertedCount > 0) {
      inserted++;
    } else if (result.modifiedCount > 0) {
      updated++;
    }
  }

  console.log(`Topic: ${topic.title}`);
  console.log(`Inserted: ${inserted}`);
  console.log(`Updated: ${updated}`);
  console.log(`Processed: ${resources.length}`);

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

  console.log("Active resource counts by level and type:");
  console.table(
    counts.map((item) => ({
      level: item._id.level,
      type: item._id.type,
      count: item.count,
    }))
  );
}

seedOperatorsResources()
  .catch((error) => {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });