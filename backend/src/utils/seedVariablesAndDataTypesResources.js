const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Topic = require("../models/Topic");
const LearningResource = require("../models/LearningResource");

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || process.env.MONGO_URI;

const TOPIC_TITLE = "Variables & Data Types";

const resources = [
  // ================= BASIC LEVEL =================
  {
    title: "Java Variables for Beginners",
    description: "Learn variable declaration and initialization in Java.",
    type: "video",
    level: "basic",
    url: "https://www.youtube.com/results?search_query=Java+variables+for+beginners",
    order: 1,
  },
  {
    title: "Java Data Types Explained",
    description: "Introduction to Java primitive data types and String.",
    type: "video",
    level: "basic",
    url: "https://www.youtube.com/results?search_query=Java+data+types+for+beginners",
    order: 2,
  },
  {
    title: "Introduction to Variables",
    description: "Understand variable declaration, initialization, and naming rules.",
    type: "note",
    level: "basic",
    content: `# Introduction to Variables

A variable stores a value that a Java program can use.

## Declaration
int age;

## Initialization
age = 20;

You can declare and initialize a variable together:

int age = 20;
String name = "Asha";

## Naming Rules
- Variable names cannot start with a digit.
- Names cannot be Java keywords.
- Variable names are case-sensitive.
- Use meaningful names such as studentName or totalMarks.`,
    order: 3,
  },
  {
    title: "Primitive Data Types in Java",
    description: "Learn the eight primitive data types in Java.",
    type: "note",
    level: "basic",
    content: `# Primitive Data Types

Java has eight primitive data types:

1. byte - small integer values
2. short - integer values
3. int - common integer values
4. long - large integer values
5. float - decimal values with single precision
6. double - decimal values with double precision
7. char - a single UTF-16 code unit
8. boolean - true or false

Examples:

int age = 20;
double percentage = 85.5;
char grade = 'A';
boolean passed = true;

String is a reference type, not a primitive type.`,
    order: 4,
  },
  {
    title: "String and Character Values",
    description: "Understand the difference between char and String.",
    type: "note",
    level: "basic",
    content: `# String and Character Values

A char stores one UTF-16 code unit and uses single quotes.

char grade = 'A';

A String represents text and uses double quotes.

String name = "Ravi";
String city = "Kolhapur";

Examples:
'A' is a character literal.
"A" is a String literal.

Java is case-sensitive, so write String with a capital S.`,
    order: 5,
  },
  {
    title: "Variables and Data Types Worksheet - Basic",
    description: "Practice declaring variables and identifying data types.",
    type: "worksheet",
    level: "basic",
    content: `# Basic Worksheet

1. Declare an int variable named age with value 19.
2. Declare a double variable named percentage with value 82.5.
3. Which data type stores true or false?
4. Declare a char variable containing A.
5. Declare a String variable named city.
6. Identify the data type in: long population = 500000L;

Write the Java statements and test them in your IDE.`,
    order: 6,
  },

  // ================= MEDIUM LEVEL =================
  {
    title: "Java Type Casting and Conversion",
    description: "Learn widening and narrowing conversions.",
    type: "video",
    level: "medium",
    url: "https://www.youtube.com/results?search_query=Java+type+casting+widening+narrowing",
    order: 1,
  },
  {
    title: "Java Variable Scope",
    description: "Learn about local, instance, and static variables.",
    type: "video",
    level: "medium",
    url: "https://www.youtube.com/results?search_query=Java+local+instance+static+variables",
    order: 2,
  },
  {
    title: "Type Conversion and Casting",
    description: "Understand automatic and explicit numeric conversion.",
    type: "note",
    level: "medium",
    content: `# Type Conversion and Casting

## Widening Conversion
A numeric value can often be converted to a wider numeric type automatically.

int number = 25;
double result = number;

## Narrowing Conversion
An explicit cast is generally required to convert to a narrower numeric type.

double price = 19.95;
int value = (int) price;

The value of value becomes 19 because the fractional part is discarded.

Narrowing conversions may lose information. Boolean values cannot be converted to numeric types.`,
    order: 3,
  },
  {
    title: "Local, Instance, and Static Variables",
    description: "Understand the scope and purpose of different variables.",
    type: "note",
    level: "medium",
    content: `# Variable Scope

## Local Variable
Declared inside a method or block. It must be assigned before it is read.

void display() {
    int score = 90;
    System.out.println(score);
}

## Instance Variable
Declared in a class outside methods without static. Each object has its own instance fields.

## Static Variable
Declared using static and shared at the class level.

class Student {
    String name;
    static int studentCount = 0;
}

Fields receive default values. Local variables do not receive automatic default values.`,
    order: 4,
  },
  {
    title: "Constants and the final Keyword",
    description: "Learn about final variables and local variable type inference.",
    type: "note",
    level: "medium",
    content: `# Constants and final

A variable declared final can only be assigned once.

final double PI = 3.14159;

## The var Keyword
Java supports var for local variables when the compiler can infer the type.

var message = "Hello";
var quantity = 10;

The compiler infers String for message and int for quantity.

A var declaration requires an initializer. The final keyword prevents reassignment of the variable, but does not automatically make a referenced object immutable.`,
    order: 5,
  },
  {
    title: "Variables and Data Types Worksheet - Medium",
    description: "Practice casting, variable scope, and constants.",
    type: "worksheet",
    level: "medium",
    content: `# Medium Worksheet

1. What is the result of int n = (int) 8.9?
2. Explain widening conversion with an example.
3. State one difference between local and instance variables.
4. What does final prevent?
5. What type is inferred by var total = 42?
6. Why must a local variable be initialized before use?

Write a Java class that demonstrates one instance variable and one static variable.`,
    order: 6,
  },

  // ================= ADVANCED LEVEL =================
  {
    title: "Java Numeric Promotion and Overflow",
    description: "Explore arithmetic promotion and integer overflow.",
    type: "video",
    level: "advanced",
    url: "https://www.youtube.com/results?search_query=Java+numeric+promotion+integer+overflow",
    order: 1,
  },
  {
    title: "Java Pass-by-Value and Object References",
    description: "Understand how Java passes primitive values and object references.",
    type: "video",
    level: "advanced",
    url: "https://www.youtube.com/results?search_query=Java+pass+by+value+object+references",
    order: 2,
  },
  {
    title: "Numeric Promotion and Integer Overflow",
    description: "Learn about numeric promotion and fixed-width integer behavior.",
    type: "note",
    level: "advanced",
    content: `# Numeric Promotion and Overflow

In many arithmetic expressions, byte, short, and char operands are promoted to int.

byte a = 10;
byte b = 20;
// byte c = a + b; // Compilation error
int c = a + b;

## Integer Overflow

int max = Integer.MAX_VALUE;
int next = max + 1;

Integer arithmetic can overflow and wrap around instead of throwing an exception.

## Floating-Point Precision

float and double cannot represent every decimal fraction exactly.

For precise decimal financial calculations, consider BigDecimal and construct it carefully, for example from a decimal String.`,
    order: 3,
  },
  {
    title: "Object References and Mutability",
    description: "Understand object references, mutability, and final references.",
    type: "note",
    level: "advanced",
    content: `# Object References and Mutability

Reference variables refer to objects.

StringBuilder first = new StringBuilder("Hi");
StringBuilder second = first;
second.append("!");

System.out.println(first); // Hi!

Both variables refer to the same mutable object.

## Final References

final StringBuilder builder = new StringBuilder("Java");
builder.append("!");

The reference cannot be reassigned, but the object can still be modified.

String objects are immutable. Operations that appear to modify a String produce another String rather than changing the original object.`,
    order: 4,
  },
  {
    title: "Variable Initialization and Definite Assignment",
    description: "Understand initialization rules enforced by the Java compiler.",
    type: "note",
    level: "advanced",
    content: `# Variable Initialization

Local variables must be definitely assigned before being read.

int value;
// System.out.println(value); // Compilation error
value = 5;
System.out.println(value);

Fields receive default values when initialized:
- Numeric fields: zero
- boolean fields: false
- Reference fields: null

Local variables do not automatically receive these default values.

The compiler checks all possible control-flow paths to ensure a local variable is assigned before use.`,
    order: 5,
  },
  {
    title: "Variables and Data Types Worksheet - Advanced",
    description: "Practice numeric promotion, references, and initialization rules.",
    type: "worksheet",
    level: "advanced",
    content: `# Advanced Worksheet

1. Why does assigning a + b to a byte variable fail when both operands are bytes?
2. What happens when Integer.MAX_VALUE + 1 is calculated as an int?
3. Why can changing an object through one reference affect another reference?
4. What does final mean for an object reference?
5. Why must local variables be definitely assigned before reading?
6. Why can floating-point calculations appear slightly inaccurate?

Write Java examples to demonstrate your answers.`,
    order: 6,
  },
];

async function seedVariablesAndDataTypesResources() {
  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI or MONGO_URI in your .env file.");
  }

  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB.");

  const topic = await Topic.findOne({ title: TOPIC_TITLE });

  if (!topic) {
    throw new Error(
      `Topic "${TOPIC_TITLE}" was not found. Check its exact title in MongoDB.`
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
  console.log("Expected: 6 resources per level.");

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

seedVariablesAndDataTypesResources()
  .catch((error) => {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });