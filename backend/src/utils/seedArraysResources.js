
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Topic = require("../models/Topic");
const LearningResource = require("../models/LearningResource");

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || process.env.MONGO_URI;

const TOPIC_TITLE = "Arrays";

const resources = [
  // ==================== BASIC LEVEL ====================
  {
    title: "Introduction to Arrays in Java",
    description: "Learn how arrays store multiple values of the same type.",
    type: "video",
    level: "basic",
    url: "https://www.youtube.com/results?search_query=Java+arrays+for+beginners",
    order: 1,
  },
  {
    title: "Array Declaration and Initialization",
    description: "Learn how to declare, create, and initialize arrays.",
    type: "video",
    level: "basic",
    url: "https://www.youtube.com/results?search_query=Java+array+declaration+initialization",
    order: 2,
  },
  {
    title: "Array Basics",
    description: "Understand array declaration, indexing, and length.",
    type: "note",
    level: "basic",
    content: `# Introduction to Arrays

An array stores multiple values of the same declared component type.

## Declaration and Initialization

int[] numbers = {10, 20, 30, 40};

You can also create an array with a fixed length:

int[] values = new int[5];

## Accessing Elements

Array indexes start at 0.

System.out.println(numbers[0]); // 10
System.out.println(numbers[2]); // 30

## Array Length

System.out.println(numbers.length); // 4

The length of an array is fixed after it is created.`,
    order: 3,
  },
  {
    title: "Accessing and Updating Array Elements",
    description: "Learn how to read and change values using array indexes.",
    type: "note",
    level: "basic",
    content: `# Accessing Array Elements

Example:

int[] marks = {75, 80, 90};

System.out.println(marks[1]); // 80

You can update an element using its index:

marks[1] = 85;

System.out.println(marks[1]); // 85

## Important Rules
- The first index is 0.
- The last valid index is length - 1.
- An invalid index causes ArrayIndexOutOfBoundsException.
- Arrays created with new receive default element values.

For example, a new int array contains zeros initially.`,
    order: 4,
  },
  {
    title: "Traversing Arrays with Loops",
    description: "Learn to visit each array element using a for loop.",
    type: "note",
    level: "basic",
    content: `# Traversing Arrays

A loop can process each element of an array.

int[] numbers = {10, 20, 30};

for (int i = 0; i < numbers.length; i++) {
    System.out.println(numbers[i]);
}

An enhanced for loop is useful when you do not need the index:

for (int number : numbers) {
    System.out.println(number);
}

Use i < numbers.length to avoid accessing an invalid index.`,
    order: 5,
  },
  {
    title: "Arrays Worksheet - Basic",
    description: "Practice creating, accessing, and traversing arrays.",
    type: "worksheet",
    level: "basic",
    content: `# Basic Worksheet: Arrays

1. Declare an integer array containing 10, 20, and 30.
2. What is the first valid index of an array?
3. How do you get the length of an array?
4. What happens when you access an invalid index?
5. Write a loop that prints all elements of an integer array.
6. What are the initial values of elements in a newly created int array?

Write and run Java examples to check your answers.`,
    order: 6,
  },

  // ==================== MEDIUM LEVEL ====================
  {
    title: "Searching Arrays in Java",
    description: "Learn linear search and finding values in arrays.",
    type: "video",
    level: "medium",
    url: "https://www.youtube.com/results?search_query=Java+linear+search+array+tutorial",
    order: 1,
  },
  {
    title: "Sorting Arrays in Java",
    description: "Learn basic sorting and the Arrays utility class.",
    type: "video",
    level: "medium",
    url: "https://www.youtube.com/results?search_query=Java+Arrays.sort+sorting+tutorial",
    order: 2,
  },
  {
    title: "Searching and Finding Array Elements",
    description: "Understand linear search and index tracking.",
    type: "note",
    level: "medium",
    content: `# Linear Search

Linear search checks elements one at a time until a match is found or the array ends.

int[] numbers = {12, 25, 37, 49};
int target = 37;
int index = -1;

for (int i = 0; i < numbers.length; i++) {
    if (numbers[i] == target) {
        index = i;
        break;
    }
}

System.out.println(index); // 2

If the target is not found, index remains -1.

Linear search takes O(n) time in the worst case.`,
    order: 3,
  },
  {
    title: "Sorting Arrays with Arrays.sort",
    description: "Learn how to sort primitive arrays using Java utilities.",
    type: "note",
    level: "medium",
    content: `# Sorting Arrays

Java provides the Arrays utility class for common array operations.

import java.util.Arrays;

int[] numbers = {40, 10, 30, 20};

Arrays.sort(numbers);

System.out.println(Arrays.toString(numbers));
// [10, 20, 30, 40]

Arrays.sort sorts this primitive array in ascending order.

Remember to import java.util.Arrays when using Arrays.sort or Arrays.toString.

Sorting changes the order of elements in the original array.`,
    order: 4,
  },
  {
    title: "Copying and Comparing Arrays",
    description: "Understand array copying and common equality pitfalls.",
    type: "note",
    level: "medium",
    content: `# Copying and Comparing Arrays

## Copying

import java.util.Arrays;

int[] original = {1, 2, 3};
int[] copy = Arrays.copyOf(original, original.length);

The copy is a separate array.

## Reference Equality

For arrays, == checks whether two references refer to the same array object.

## Content Equality

Use Arrays.equals for one-dimensional arrays:

boolean same = Arrays.equals(original, copy);

For nested arrays, Arrays.deepEquals can compare nested contents.

A simple assignment such as int[] second = first does not copy the array; both references point to the same object.`,
    order: 5,
  },
  {
    title: "Arrays Worksheet - Medium",
    description: "Practice searching, sorting, and copying arrays.",
    type: "worksheet",
    level: "medium",
    content: `# Medium Worksheet: Arrays

1. Implement linear search to find a target value.
2. What is the worst-case time complexity of linear search?
3. How do you sort an integer array using the standard Java library?
4. Explain the difference between == and Arrays.equals.
5. What is the difference between copying an array and assigning its reference?
6. Write a loop to calculate the sum of all array elements.

Test your solutions in Java.`,
    order: 6,
  },

  // ==================== ADVANCED LEVEL ====================
  {
    title: "Two-Dimensional Arrays in Java",
    description: "Learn multidimensional arrays and nested-loop traversal.",
    type: "video",
    level: "advanced",
    url: "https://www.youtube.com/results?search_query=Java+2D+arrays+nested+loops",
    order: 1,
  },
  {
    title: "Array Algorithms and Complexity",
    description: "Explore common array algorithms and their time complexity.",
    type: "video",
    level: "advanced",
    url: "https://www.youtube.com/results?search_query=Java+array+algorithms+time+complexity",
    order: 2,
  },
  {
    title: "Two-Dimensional and Jagged Arrays",
    description: "Understand matrices, nested arrays, and irregular row lengths.",
    type: "note",
    level: "advanced",
    content: `# Two-Dimensional Arrays

A two-dimensional array is an array whose elements are references to other arrays.

int[][] matrix = {
    {1, 2, 3},
    {4, 5, 6}
};

Access an element using two indexes:

System.out.println(matrix[1][2]); // 6

## Traversal

for (int row = 0; row < matrix.length; row++) {
    for (int col = 0; col < matrix[row].length; col++) {
        System.out.println(matrix[row][col]);
    }
}

Java also supports jagged arrays, where different rows have different lengths. Use matrix[row].length to get the length of each row.`,
    order: 3,
  },
  {
    title: "Array Algorithm Complexity",
    description: "Analyze searching, traversal, insertion, and deletion costs.",
    type: "note",
    level: "advanced",
    content: `# Array Algorithm Complexity

Common array operations have different costs.

- Access by index: O(1).
- Traverse all n elements: O(n).
- Linear search: O(n) worst case.
- Binary search on a sorted array: O(log n).
- Comparison-based sorting: commonly O(n log n), depending on the algorithm.

## Insertion and Deletion

Arrays have fixed length once created. Inserting or removing an element while preserving order may require shifting other elements, which can take O(n) time.

For frequent insertions and removals, consider whether a collection such as ArrayList is more appropriate.

Complexity describes how work grows as input size increases; actual runtime also depends on implementation and environment.`,
    order: 4,
  },
  {
    title: "Array References and Defensive Copying",
    description: "Understand aliasing, mutation, and safe array handling.",
    type: "note",
    level: "advanced",
    content: `# Array References and Defensive Copying

Arrays are mutable objects.

int[] first = {1, 2, 3};
int[] second = first;

second[0] = 99;

System.out.println(first[0]); // 99

Both references point to the same array.

## Defensive Copying

If a method needs to protect its internal array, it can return a copy:

return Arrays.copyOf(values, values.length);

A defensive copy prevents callers from modifying the original array through the returned reference.

For arrays of objects, a shallow copy duplicates the array but does not automatically clone the objects stored inside it.`,
    order: 5,
  },
  {
    title: "Arrays Worksheet - Advanced",
    description: "Solve problems involving matrices, complexity, and array references.",
    type: "worksheet",
    level: "advanced",
    content: `# Advanced Worksheet: Arrays

1. Create a 3-by-3 integer matrix and print every element.
2. Explain the difference between a rectangular and jagged array.
3. Compare the worst-case time complexity of linear and binary search.
4. Why can inserting an element into the middle of an array require O(n) work?
5. Explain aliasing using two references to the same array.
6. What is defensive copying, and when is it useful?

Implement and test your solutions in Java.`,
    order: 6,
  },
];

async function seedArraysResources() {
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

seedArraysResources()
  .catch((error) => {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
