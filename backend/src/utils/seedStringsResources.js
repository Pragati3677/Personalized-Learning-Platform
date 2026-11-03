
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Topic = require("../models/Topic");
const LearningResource = require("../models/LearningResource");

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || process.env.MONGO_URI;

const TOPIC_TITLE = "Strings";

const resources = [
  // ==================== BASIC ====================
  {
    title: "Introduction to Strings in Java",
    description: "Learn how to create and use String objects in Java.",
    type: "video",
    level: "basic",
    url: "https://www.youtube.com/results?search_query=Java+Strings+for+beginners",
    order: 1,
  },
  {
    title: "String Declaration and Basic Operations",
    description: "Understand String initialization, concatenation, and length.",
    type: "video",
    level: "basic",
    url: "https://www.youtube.com/results?search_query=Java+String+declaration+concatenation+length",
    order: 2,
  },
  {
    title: "String Basics",
    description: "Learn String declaration, initialization, and concatenation.",
    type: "note",
    level: "basic",
    content: `# Strings in Java

A String represents a sequence of characters. Java uses the String class to work with text.

## Creating Strings

String name = "Java";
String language = new String("Programming");

## Concatenation

String message = "Hello " + name;
System.out.println(message); // Hello Java

## Length

System.out.println(name.length()); // 4

Remember that length() is a method for Strings, while length is a field for arrays.

String objects are immutable, meaning their contents cannot be changed after creation. Operations such as concatenation produce a new String.`,
    order: 3,
  },
  {
    title: "Accessing Characters and String Indexes",
    description: "Learn charAt(), indexing, and common boundary errors.",
    type: "note",
    level: "basic",
    content: `# Accessing String Characters

String text = "Java";

System.out.println(text.charAt(0)); // J
System.out.println(text.charAt(2)); // v

String indexes start at 0. The last valid index is text.length() - 1.

## Important Points
- Use charAt(index) to access a character.
- Use length() to get the number of characters.
- Accessing an invalid index throws StringIndexOutOfBoundsException.
- An empty String has length 0.

Always check the index before accessing a character.`,
    order: 4,
  },
  {
    title: "String Comparison Basics",
    description: "Understand equals() and the difference between content and references.",
    type: "note",
    level: "basic",
    content: `# Comparing Strings

Use equals() to compare String contents.

String first = "Java";
String second = new String("Java");

System.out.println(first.equals(second)); // true

The == operator checks whether two references point to the same object, not whether their String contents are equal.

Use equalsIgnoreCase() when a case-insensitive comparison is needed.

For example:
"JAVA".equalsIgnoreCase("java") // true

For reliable content comparison, use equals() rather than ==.`,
    order: 5,
  },
  {
    title: "Strings Worksheet - Basic",
    description: "Practice String creation, indexing, and comparison.",
    type: "worksheet",
    level: "basic",
    content: `# Basic Worksheet: Strings

1. What is a String in Java?
2. Create a String containing the word Programming.
3. Which method returns a String's length?
4. What does charAt(0) return for "Java"?
5. What is the difference between equals() and ==?
6. Why is a String described as immutable?

Write and run Java examples to verify your answers.`,
    order: 6,
  },

  // ==================== MEDIUM ====================
  {
    title: "Common String Methods in Java",
    description: "Learn substring, indexOf, contains, replace, and trim.",
    type: "video",
    level: "medium",
    url: "https://www.youtube.com/results?search_query=Java+String+methods+substring+indexOf+replace",
    order: 1,
  },
  {
    title: "StringBuilder and StringBuffer",
    description: "Understand mutable character sequences in Java.",
    type: "video",
    level: "medium",
    url: "https://www.youtube.com/results?search_query=Java+StringBuilder+StringBuffer+tutorial",
    order: 2,
  },
  {
    title: "Common String Methods",
    description: "Explore useful methods for searching and transforming text.",
    type: "note",
    level: "medium",
    content: `# Common String Methods

String text = "  Learn Java  ";

## Useful Methods

text.length()       // Number of characters
text.trim()         // Removes leading and trailing basic whitespace
text.contains("Java")
text.indexOf("Java")
text.replace("Java", "Python")
text.substring(2, 7)

The end index in substring(begin, end) is excluded.

Many String methods return a new String because Strings are immutable.

Note: trim() and strip() have different whitespace-handling rules. strip() is available from Java 11.`,
    order: 3,
  },
  {
    title: "StringBuilder and StringBuffer",
    description: "Compare mutable String alternatives and their uses.",
    type: "note",
    level: "medium",
    content: `# StringBuilder and StringBuffer

StringBuilder and StringBuffer represent mutable sequences of characters.

## StringBuilder

StringBuilder result = new StringBuilder("Hello");
result.append(" Java");
System.out.println(result); // Hello Java

## StringBuffer

StringBuffer buffer = new StringBuffer("Hello");
buffer.append(" World");

## Differences
- String is immutable.
- StringBuilder is mutable and generally preferred for single-threaded modifications.
- StringBuffer provides synchronized methods for thread-safe operations.

For repeated concatenation inside loops, StringBuilder can avoid creating many intermediate String objects.`,
    order: 4,
  },
  {
    title: "String Immutability and String Pool",
    description: "Understand immutable objects and String literal reuse.",
    type: "note",
    level: "medium",
    content: `# String Immutability and the String Pool

String literals can be stored in the String pool so equal literals may share an object.

String a = "Java";
String b = "Java";

System.out.println(a == b); // typically true for these literals

String c = new String("Java");
System.out.println(a.equals(c)); // true

The String class is immutable. A method that transforms a String returns a result rather than changing the original object.

Use equals() to compare content. Do not rely on == for content comparisons.`,
    order: 5,
  },
  {
    title: "Strings Worksheet - Medium",
    description: "Practice String methods, mutability, and comparison.",
    type: "worksheet",
    level: "medium",
    content: `# Medium Worksheet: Strings

1. Find the length of "Programming".
2. Extract "Java" from "Learn Java" using substring().
3. Explain the difference between indexOf() and contains().
4. Why is StringBuilder useful inside a loop?
5. Compare StringBuilder and StringBuffer.
6. Explain why equals() is preferred over == for comparing String contents.

Run each example and observe the output.`,
    order: 6,
  },

  // ==================== ADVANCED ====================
  {
    title: "Advanced String Processing in Java",
    description: "Explore efficient text processing and regular expressions.",
    type: "video",
    level: "advanced",
    url: "https://www.youtube.com/results?search_query=Java+advanced+String+processing+regular+expressions",
    order: 1,
  },
  {
    title: "String Performance and Best Practices",
    description: "Learn efficient concatenation and safe String handling.",
    type: "video",
    level: "advanced",
    url: "https://www.youtube.com/results?search_query=Java+String+performance+best+practices",
    order: 2,
  },
  {
    title: "Regular Expressions with Strings",
    description: "Learn pattern matching, splitting, and replacement.",
    type: "note",
    level: "advanced",
    content: `# Regular Expressions in Java

Regular expressions define patterns for searching and manipulating text.

## Matching

String input = "Java123";
boolean matches = input.matches("[A-Za-z]+[0-9]+");
System.out.println(matches); // true

## Splitting

String csv = "apple,banana,orange";
String[] items = csv.split(",");

## Replacement

String result = "Java 123".replaceAll("[0-9]+", "XYZ");

Java regular expressions use the Pattern syntax. Remember that backslashes inside Java String literals generally need escaping.

For repeated matching with the same pattern, consider compiling a Pattern once and reusing it.`,
    order: 3,
  },
  {
    title: "String Performance and Complexity",
    description: "Understand concatenation costs and efficient text construction.",
    type: "note",
    level: "advanced",
    content: `# String Performance

Because String objects are immutable, repeated concatenation may create intermediate objects.

For example, repeated concatenation in a large loop can be inefficient:

String result = "";
for (int i = 0; i < 1000; i++) {
    result += i;
}

A StringBuilder is generally a better choice:

StringBuilder result = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    result.append(i);
}
String output = result.toString();

The exact performance depends on the Java version, compiler optimizations, and workload. Choose the clearest approach first, then measure if performance matters.`,
    order: 4,
  },
  {
    title: "String Equality, Unicode, and Edge Cases",
    description: "Understand Unicode characters and robust text comparisons.",
    type: "note",
    level: "advanced",
    content: `# String Equality and Unicode

Java Strings use UTF-16 code units.

The length() method counts UTF-16 code units, not necessarily user-perceived characters.

Some Unicode characters, including many emoji, use a surrogate pair and contribute 2 to String.length().

## Safe Comparisons

Use equals() for exact content comparison.

Use equalsIgnoreCase() for case-insensitive comparison when appropriate.

For language-sensitive sorting and comparison, java.text.Collator may be more suitable.

When processing Unicode text, remember that one visible character may consist of multiple code points or combining characters.`,
    order: 5,
  },
  {
    title: "Strings Worksheet - Advanced",
    description: "Solve problems involving regular expressions, performance, and Unicode.",
    type: "worksheet",
    level: "advanced",
    content: `# Advanced Worksheet: Strings

1. Validate a simple identifier using String.matches().
2. Split a comma-separated String into an array.
3. Explain why StringBuilder can improve repeated concatenation.
4. What does String.length() count in UTF-16?
5. Why should == not be used for general String content comparison?
6. When would you use Pattern and Matcher instead of repeated matches() calls?

Implement your answers in Java and test boundary cases.`,
    order: 6,
  },
];

async function seedStringsResources() {
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

seedStringsResources().catch((error) => {
  console.error("Seeding failed:", error.message);
  process.exitCode = 1;
});
