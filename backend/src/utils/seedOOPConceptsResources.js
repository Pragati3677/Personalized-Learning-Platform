
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Topic = require("../models/Topic");
const LearningResource = require("../models/LearningResource");

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || process.env.MONGO_URI;

const TOPIC_TITLE = "OOP Concepts";

const resources = [
  // ==================== BASIC ====================
  {
    title: "Introduction to OOP in Java",
    description: "Learn the basics of object-oriented programming.",
    type: "video",
    level: "basic",
    url: "https://www.youtube.com/results?search_query=Java+OOP+concepts+for+beginners",
    order: 1,
  },
  {
    title: "Four Pillars of OOP",
    description: "Explore encapsulation, inheritance, polymorphism, and abstraction.",
    type: "video",
    level: "basic",
    url: "https://www.youtube.com/results?search_query=Java+four+pillars+of+OOP",
    order: 2,
  },
  {
    title: "OOP Fundamentals",
    description: "Understand classes, objects, and the purpose of OOP.",
    type: "note",
    level: "basic",
    content: `# Object-Oriented Programming

Object-oriented programming (OOP) organizes programs around objects that contain data and behavior.

## Important Concepts

- Class: a blueprint used to create objects.
- Object: an instance of a class.
- Encapsulation: combines data and methods while controlling access.
- Inheritance: allows a class to inherit members from another class.
- Polymorphism: allows a common interface or parent type to represent different implementations.
- Abstraction: exposes essential behavior while hiding implementation details.

OOP helps organize code, support reuse, and make complex applications easier to maintain.`,
    order: 3,
  },
  {
    title: "Understanding Encapsulation",
    description: "Learn how to protect object data using access modifiers.",
    type: "note",
    level: "basic",
    content: `# Encapsulation in Java

Encapsulation controls access to an object's internal state.

Example:

class Student {
    private String name;

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}

The private field cannot be accessed directly from unrelated classes. Public methods provide controlled access.

Encapsulation helps enforce rules and protect object invariants. Getters and setters should be provided when they make sense for the class design.`,
    order: 4,
  },
  {
    title: "Abstraction Basics",
    description: "Understand abstraction and the separation of interface from implementation.",
    type: "note",
    level: "basic",
    content: `# Abstraction in Java

Abstraction focuses on what an object can do rather than how it performs the task.

Java supports abstraction through abstract classes and interfaces.

Example:

interface Shape {
    double area();
}

A class implementing Shape provides its own area() implementation.

Abstraction helps callers use a consistent interface without needing to know the internal implementation.`,
    order: 5,
  },
  {
    title: "OOP Worksheet - Basic",
    description: "Practice the fundamental concepts of object-oriented programming.",
    type: "worksheet",
    level: "basic",
    content: `# Basic OOP Worksheet

1. What is object-oriented programming?
2. Explain the difference between a class and an object.
3. Define encapsulation.
4. What is inheritance?
5. Explain polymorphism with a simple example.
6. What is abstraction, and why is it useful?

Write short Java examples where appropriate.`,
    order: 6,
  },

  // ==================== MEDIUM ====================
  {
    title: "Encapsulation and Access Modifiers",
    description: "Learn how Java access modifiers control visibility.",
    type: "video",
    level: "medium",
    url: "https://www.youtube.com/results?search_query=Java+encapsulation+access+modifiers+tutorial",
    order: 1,
  },
  {
    title: "Abstract Classes and Interfaces",
    description: "Compare abstract classes and interfaces in Java.",
    type: "video",
    level: "medium",
    url: "https://www.youtube.com/results?search_query=Java+abstract+classes+and+interfaces",
    order: 2,
  },
  {
    title: "Access Modifiers and Encapsulation",
    description: "Understand public, protected, package-private, and private access.",
    type: "note",
    level: "medium",
    content: `# Java Access Modifiers

Java provides four common access levels:

- public: accessible wherever the declaring type and member are accessible.
- protected: accessible within the same package and through inheritance under Java's access rules.
- package-private: the default when no access modifier is specified; accessible within the same package.
- private: accessible within the declaring top-level class, including its nested members under Java's access rules.

Encapsulation combines state and behavior and controls access to internal details.

Prefer the least permissive access level that meets the design requirements.`,
    order: 3,
  },
  {
    title: "Abstract Classes vs Interfaces",
    description: "Learn when to use abstract classes and interfaces.",
    type: "note",
    level: "medium",
    content: `# Abstract Classes and Interfaces

## Abstract Class
- Declared using the abstract keyword.
- Can contain fields, constructors, concrete methods, and abstract methods.
- A class can extend only one class.

## Interface
- Defines a contract that implementing classes agree to support.
- Can declare abstract methods, default methods, static methods, and constants.
- A class can implement multiple interfaces.

Use an abstract class when related classes share common state or implementation. Use interfaces to describe capabilities or contracts that different classes can implement.`,
    order: 4,
  },
  {
    title: "Polymorphism and Dynamic Dispatch",
    description: "Understand how Java chooses overridden methods at runtime.",
    type: "note",
    level: "medium",
    content: `# Polymorphism

Polymorphism allows code to work with objects through a common parent class or interface.

Example:

class Animal {
    void sound() {
        System.out.println("Animal sound");
    }
}

class Dog extends Animal {
    @Override
    void sound() {
        System.out.println("Bark");
    }
}

Animal animal = new Dog();
animal.sound(); // Bark

The overridden instance method is selected based on the actual object's class at runtime. This is called dynamic method dispatch.

Overloading, by contrast, is resolved by the compiler using the method signature and argument types.`,
    order: 5,
  },
  {
    title: "OOP Worksheet - Medium",
    description: "Practice access control, abstraction, and polymorphism.",
    type: "worksheet",
    level: "medium",
    content: `# Medium OOP Worksheet

1. Compare public, protected, package-private, and private.
2. Explain the difference between an abstract class and an interface.
3. Why is encapsulation useful?
4. What is dynamic method dispatch?
5. Explain how method overriding supports polymorphism.
6. Give an example of abstraction in a Java application.

Include code examples for at least two questions.`,
    order: 6,
  },

  // ==================== ADVANCED ====================
  {
    title: "SOLID Principles in Java",
    description: "Learn object-oriented design principles for maintainable code.",
    type: "video",
    level: "advanced",
    url: "https://www.youtube.com/results?search_query=SOLID+principles+Java+tutorial",
    order: 1,
  },
  {
    title: "OOP Design and Composition",
    description: "Explore composition, coupling, and reusable object design.",
    type: "video",
    level: "advanced",
    url: "https://www.youtube.com/results?search_query=Java+object+composition+inheritance+design",
    order: 2,
  },
  {
    title: "SOLID Object-Oriented Design",
    description: "Understand five principles that support maintainable software.",
    type: "note",
    level: "advanced",
    content: `# SOLID Principles

SOLID is a set of object-oriented design principles.

- Single Responsibility: a class should have one focused reason to change.
- Open/Closed: software entities should be open to extension and closed to unnecessary modification.
- Liskov Substitution: subtypes should be usable wherever their base types are expected without breaking correctness.
- Interface Segregation: prefer focused interfaces over large interfaces that force unused methods on clients.
- Dependency Inversion: high-level policy should depend on abstractions rather than concrete implementation details.

These principles are guidelines, not rigid rules. Apply them in ways that improve clarity and reduce unnecessary coupling.`,
    order: 3,
  },
  {
    title: "Composition vs Inheritance",
    description: "Learn how object composition can improve flexibility.",
    type: "note",
    level: "advanced",
    content: `# Composition vs Inheritance

Inheritance represents an "is-a" relationship.

For example, Dog extends Animal when Dog is a suitable kind of Animal.

Composition represents a "has-a" relationship. An object holds another object and delegates work to it.

Example:

class Engine {
    void start() {
        System.out.println("Engine started");
    }
}

class Car {
    private final Engine engine = new Engine();

    void start() {
        engine.start();
    }
}

Composition can reduce tight coupling and allow behavior to be changed by replacing collaborators. Inheritance is useful when the subtype genuinely satisfies the parent type's contract.`,
    order: 4,
  },
  {
    title: "OOP Testing and Object Design",
    description: "Understand object responsibilities and testable class design.",
    type: "note",
    level: "advanced",
    content: `# Testable Object-Oriented Design

Good object design makes classes easier to understand, test, and maintain.

## Guidelines
- Give each class a clear responsibility.
- Keep fields as private as practical.
- Depend on interfaces when this improves flexibility.
- Avoid unnecessary global or static mutable state.
- Prefer constructor injection for required dependencies.
- Keep methods focused and avoid unexpected side effects.

Unit tests should verify observable behavior, including important edge cases. A class with clear inputs, outputs, and responsibilities is usually easier to test than a class that performs many unrelated tasks.`,
    order: 5,
  },
  {
    title: "OOP Worksheet - Advanced",
    description: "Apply SOLID, composition, and object-design principles.",
    type: "worksheet",
    level: "advanced",
    content: `# Advanced OOP Worksheet

1. Explain each of the five SOLID principles.
2. Compare inheritance and composition with Java examples.
3. Why should a subtype satisfy the contract of its parent type?
4. How can interfaces reduce coupling?
5. Explain dependency inversion with a practical example.
6. Identify two ways to make a Java class easier to unit test.

Support your answers with short code examples or diagrams.`,
    order: 6,
  },
];

async function seedOOPConceptsResources() {
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

seedOOPConceptsResources().catch((error) => {
  console.error("Seeding failed:", error.message);
  process.exitCode = 1;
});
