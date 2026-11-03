
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Topic = require("../models/Topic");
const LearningResource = require("../models/LearningResource");

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || process.env.MONGO_URI;

const TOPIC_TITLE = "Classes & Objects";

const resources = [
  // ==================== BASIC LEVEL ====================
  {
    title: "Introduction to Classes and Objects",
    description: "Understand classes, objects, fields, and methods in Java.",
    type: "video",
    level: "basic",
    url: "https://www.youtube.com/results?search_query=Java+classes+and+objects+for+beginners",
    order: 1,
  },
  {
    title: "Creating Objects and Calling Methods",
    description: "Learn how to create objects and access their methods.",
    type: "video",
    level: "basic",
    url: "https://www.youtube.com/results?search_query=Java+creating+objects+and+calling+methods",
    order: 2,
  },
  {
    title: "Classes and Objects Fundamentals",
    description: "Learn class declarations, fields, methods, and objects.",
    type: "note",
    level: "basic",
    content: `# Classes and Objects in Java

A class is a blueprint that defines the data and behavior of objects.

An object is an instance of a class.

## Example

class Student {
    String name;

    void displayName() {
        System.out.println(name);
    }
}

## Creating an Object

Student student = new Student();
student.name = "Asha";
student.displayName();

The new keyword creates an object and invokes a constructor.

A class can contain fields, constructors, methods, and nested types. Objects have their own instance fields.`,
    order: 3,
  },
  {
    title: "Instance Variables and Object State",
    description: "Understand instance fields and how objects store data.",
    type: "note",
    level: "basic",
    content: `# Instance Variables

Instance variables belong to individual objects.

class Student {
    String name;
    int age;
}

Student first = new Student();
first.name = "Asha";
first.age = 20;

Student second = new Student();
second.name = "Rahul";
second.age = 21;

Each object has its own name and age fields.

Instance fields receive default values when an object is created. Local variables declared inside methods do not receive automatic default values and must be initialized before use.`,
    order: 4,
  },
  {
    title: "Introduction to Constructors",
    description: "Learn how constructors initialize new objects.",
    type: "note",
    level: "basic",
    content: `# Constructors in Java

A constructor initializes a new object.

class Student {
    String name;

    Student(String studentName) {
        name = studentName;
    }
}

Create an object:

Student student = new Student("Asha");

Important points:
- A constructor has the same name as its class.
- A constructor has no return type, not even void.
- Constructors can accept parameters.
- Constructors can be overloaded.
- If no constructor is declared, Java may provide a default constructor.

If you declare a constructor yourself, Java does not automatically add the no-argument default constructor.`,
    order: 5,
  },
  {
    title: "Classes and Objects Worksheet - Basic",
    description: "Practice defining classes, creating objects, and initializing fields.",
    type: "worksheet",
    level: "basic",
    content: `# Basic Worksheet: Classes and Objects

1. What is a class?
2. What is an object?
3. Create a Student class with name and age fields.
4. Create two Student objects with different values.
5. What is a constructor?
6. Explain the difference between a field and a local variable.

Compile and test your examples in Java.`,
    order: 6,
  },

  // ==================== MEDIUM LEVEL ====================
  {
    title: "Constructors and Constructor Overloading",
    description: "Explore parameterized constructors and overloaded constructors.",
    type: "video",
    level: "medium",
    url: "https://www.youtube.com/results?search_query=Java+constructors+and+constructor+overloading",
    order: 1,
  },
  {
    title: "The this Keyword in Java",
    description: "Learn how this refers to the current object.",
    type: "video",
    level: "medium",
    url: "https://www.youtube.com/results?search_query=Java+this+keyword+in+classes",
    order: 2,
  },
  {
    title: "Constructor Overloading and Initialization",
    description: "Understand multiple constructors and object initialization.",
    type: "note",
    level: "medium",
    content: `# Constructor Overloading

A class can define multiple constructors with different parameter lists.

class Book {
    String title;
    int pages;

    Book(String title) {
        this(title, 0);
    }

    Book(String title, int pages) {
        this.title = title;
        this.pages = pages;
    }
}

Book book = new Book("Java Basics", 250);

The this(...) call invokes another constructor in the same class. In Java, it must be the first statement in the constructor.

Constructor overloading provides different ways to initialize objects.`,
    order: 3,
  },
  {
    title: "The this Keyword and Object Members",
    description: "Learn to distinguish fields from parameters and access current members.",
    type: "note",
    level: "medium",
    content: `# The this Keyword

Inside an instance method or constructor, this refers to the current object.

class Student {
    String name;

    Student(String name) {
        this.name = name;
    }

    void display() {
        System.out.println(this.name);
    }
}

Here, this.name refers to the object's field, while name in the constructor refers to the parameter.

The this keyword cannot be used in a static context because a static method is not invoked on a particular instance.`,
    order: 4,
  },
  {
    title: "Access Modifiers and Encapsulation in Classes",
    description: "Learn how visibility rules help protect object data.",
    type: "note",
    level: "medium",
    content: `# Access Modifiers and Encapsulation

Java access modifiers control which code can access class members.

Common access levels:
- public: accessible wherever the member's declaring type is accessible.
- protected: accessible within the package and under inheritance access rules.
- package-private: accessible within the same package.
- private: accessible within the declaring top-level class and its nested members.

Example:

class BankAccount {
    private double balance;

    public double getBalance() {
        return balance;
    }

    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }
}

Keeping fields private allows the class to control how its state changes.`,
    order: 5,
  },
  {
    title: "Classes and Objects Worksheet - Medium",
    description: "Practice constructors, this, and access control.",
    type: "worksheet",
    level: "medium",
    content: `# Medium Worksheet: Classes and Objects

1. Create a class with two overloaded constructors.
2. Explain the purpose of this.name in a constructor.
3. Why must this(...) be the first constructor statement?
4. Explain the difference between instance fields and static fields.
5. How does private access support encapsulation?
6. Design a BankAccount class with a private balance and a deposit method.

Test valid and invalid inputs where appropriate.`,
    order: 6,
  },

  // ==================== ADVANCED LEVEL ====================
  {
    title: "Static Members and Object Lifecycle",
    description: "Explore static fields, static methods, and instance initialization.",
    type: "video",
    level: "advanced",
    url: "https://www.youtube.com/results?search_query=Java+static+members+object+lifecycle",
    order: 1,
  },
  {
    title: "Immutable Classes and Defensive Copying",
    description: "Learn techniques for creating objects with stable state.",
    type: "video",
    level: "advanced",
    url: "https://www.youtube.com/results?search_query=Java+immutable+classes+defensive+copying",
    order: 2,
  },
  {
    title: "Static Members and Initialization Order",
    description: "Understand class-level state and object initialization.",
    type: "note",
    level: "advanced",
    content: `# Static Members and Initialization

Static fields belong to the class rather than to an individual instance.

class Counter {
    static int totalCreated = 0;

    Counter() {
        totalCreated++;
    }
}

Creating multiple Counter objects updates the shared totalCreated field.

## Important Points
- Static methods can be called using the class name.
- Static methods cannot directly access instance members without an object.
- Instance field initializers and instance initializer blocks run as part of object initialization before the constructor body.
- Static initialization occurs when the class is initialized.

Use static mutable state carefully because all instances share it.`,
    order: 3,
  },
  {
    title: "Designing Immutable Classes",
    description: "Learn how to prevent unwanted changes to object state.",
    type: "note",
    level: "advanced",
    content: `# Immutable Classes

An immutable object cannot have its observable state changed after construction.

Common techniques include:
- Make the class final when subclassing could compromise immutability.
- Keep fields private and final.
- Initialize fields through constructors.
- Provide no mutating methods.
- Make defensive copies of mutable inputs and outputs when necessary.

Example:

final class Point {
    private final int x;
    private final int y;

    Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public int getX() {
        return x;
    }

    public int getY() {
        return y;
    }
}

The fields are primitive values, so no defensive copying is needed in this example. Objects containing mutable collections may require defensive copies.`,
    order: 4,
  },
  {
    title: "Object Composition and Coupling",
    description: "Understand object relationships and maintainable class design.",
    type: "note",
    level: "advanced",
    content: `# Object Composition and Coupling

Composition means a class contains or collaborates with objects of other classes.

class Engine {
    void start() {
        System.out.println("Engine started");
    }
}

class Car {
    private final Engine engine;

    Car(Engine engine) {
        this.engine = engine;
    }

    void start() {
        engine.start();
    }
}

Passing Engine into the Car constructor makes the dependency explicit and allows different engine implementations or test doubles to be supplied.

Good object design aims for clear responsibilities and avoids unnecessary coupling between classes.`,
    order: 5,
  },
  {
    title: "Classes and Objects Worksheet - Advanced",
    description: "Apply object initialization, immutability, and composition concepts.",
    type: "worksheet",
    level: "advanced",
    content: `# Advanced Worksheet: Classes and Objects

1. Explain the difference between static and instance members.
2. Describe the order in which object initialization occurs.
3. Design an immutable class containing only primitive fields.
4. Why might an immutable class need defensive copying?
5. Explain composition using a Car and Engine example.
6. How does constructor injection help reduce coupling and improve testability?

Provide short Java examples for your answers.`,
    order: 6,
  },
];

async function seedClassesObjectsResources() {
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

seedClassesObjectsResources().catch((error) => {
  console.error("Seeding failed:", error.message);
  process.exitCode = 1;
});
