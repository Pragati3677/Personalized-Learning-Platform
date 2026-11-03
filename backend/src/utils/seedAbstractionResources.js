
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Topic = require("../models/Topic");
const LearningResource = require("../models/LearningResource");

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || process.env.MONGO_URI;

const TOPIC_TITLE = "Abstraction & Interfaces";

const resources = [
  // ==================== BASIC LEVEL ====================
  {
    title: "Introduction to Abstraction in Java",
    description: "Understand abstraction and hiding implementation details.",
    type: "video",
    level: "basic",
    url: "https://www.youtube.com/results?search_query=Java+abstraction+for+beginners",
    order: 1,
  },
  {
    title: "Abstract Classes and Methods",
    description: "Learn the basics of abstract classes and abstract methods.",
    type: "video",
    level: "basic",
    url: "https://www.youtube.com/results?search_query=Java+abstract+classes+and+methods+beginner",
    order: 2,
  },
  {
    title: "Abstraction Fundamentals",
    description: "Learn how abstraction exposes essential behavior while hiding implementation details.",
    type: "note",
    level: "basic",
    content: `# Abstraction in Java

Abstraction focuses on what an object does rather than how it performs the task.

Java supports abstraction through:
- Abstract classes
- Interfaces

## Example

abstract class Shape {
    abstract double area();
}

The abstract method area() declares behavior without providing its implementation.

A concrete subclass must implement the inherited abstract method unless the subclass is also abstract.

Abstraction helps reduce complexity by exposing a clear contract to the code that uses an object.`,
    order: 3,
  },
  {
    title: "Abstract Classes and Objects",
    description: "Understand abstract classes and why they cannot be instantiated directly.",
    type: "note",
    level: "basic",
    content: `# Abstract Classes

An abstract class is declared using the abstract keyword.

abstract class Animal {
    void eat() {
        System.out.println("Eating");
    }

    abstract void sound();
}

An abstract class can contain:
- Abstract methods without method bodies.
- Concrete methods with implementations.
- Fields and constructors.

You cannot create an instance of an abstract class directly.

A concrete subclass must implement inherited abstract methods before it can be instantiated.`,
    order: 4,
  },
  {
    title: "Introduction to Interfaces",
    description: "Learn how interfaces define behavior contracts in Java.",
    type: "note",
    level: "basic",
    content: `# Interfaces in Java

An interface defines a contract that implementing classes agree to support.

interface Printable {
    void print();
}

class Report implements Printable {
    public void print() {
        System.out.println("Printing report");
    }
}

Report report = new Report();
report.print();

A class can implement multiple interfaces.

Interfaces can declare abstract methods, default methods, static methods, and constants. They are useful for defining common capabilities across different classes.`,
    order: 5,
  },
  {
    title: "Abstraction Worksheet - Basic",
    description: "Practice abstract classes, abstract methods, and interfaces.",
    type: "worksheet",
    level: "basic",
    content: `# Basic Worksheet: Abstraction

1. Define abstraction in Java.
2. What is an abstract class?
3. Can an abstract class be instantiated directly?
4. What is an abstract method?
5. What is an interface?
6. Write an interface named Printable with a print() method and implement it in a class.

Compile and test your examples.`,
    order: 6,
  },

  // ==================== MEDIUM LEVEL ====================
  {
    title: "Abstract Classes vs Interfaces",
    description: "Compare abstract classes and interfaces using Java examples.",
    type: "video",
    level: "medium",
    url: "https://www.youtube.com/results?search_query=Java+abstract+class+vs+interface",
    order: 1,
  },
  {
    title: "Implementing Multiple Interfaces",
    description: "Learn how a class can implement several interfaces.",
    type: "video",
    level: "medium",
    url: "https://www.youtube.com/results?search_query=Java+implementing+multiple+interfaces",
    order: 2,
  },
  {
    title: "Abstract Classes vs Interfaces in Practice",
    description: "Understand when to use an abstract class or interface.",
    type: "note",
    level: "medium",
    content: `# Abstract Classes vs Interfaces

## Abstract Classes
- Can have instance fields and constructors.
- Can provide shared concrete method implementations.
- A class can extend only one class.

## Interfaces
- Define contracts and capabilities.
- Can include abstract, default, and static methods.
- A class can implement multiple interfaces.
- Fields declared in an interface are implicitly public, static, and final.

Choose an abstract class when related classes need shared state or implementation.

Choose an interface when different classes need to support a common contract, even if they do not share a superclass.`,
    order: 3,
  },
  {
    title: "Multiple Interfaces and Default Methods",
    description: "Understand interface implementation and default method behavior.",
    type: "note",
    level: "medium",
    content: `# Multiple Interfaces

A Java class can implement more than one interface.

interface Flyable {
    void fly();
}

interface Swimmable {
    void swim();
}

class Duck implements Flyable, Swimmable {
    public void fly() {
        System.out.println("Flying");
    }

    public void swim() {
        System.out.println("Swimming");
    }
}

Interfaces can also provide default methods with implementations.

If conflicting default methods are inherited from multiple interfaces, the implementing class may need to override the conflicting method and resolve the ambiguity.`,
    order: 4,
  },
  {
    title: "Abstraction and Polymorphism",
    description: "Learn how abstract types support interchangeable implementations.",
    type: "note",
    level: "medium",
    content: `# Abstraction and Polymorphism

Abstraction defines a common contract. Polymorphism allows different implementations to be used through that contract.

abstract class Shape {
    abstract double area();
}

class Circle extends Shape {
    private final double radius;

    Circle(double radius) {
        this.radius = radius;
    }

    @Override
    double area() {
        return Math.PI * radius * radius;
    }
}

Shape shape = new Circle(2);
System.out.println(shape.area());

The calling code uses the Shape abstraction without needing to know every detail of Circle's implementation.`,
    order: 5,
  },
  {
    title: "Abstraction Worksheet - Medium",
    description: "Practice choosing abstract classes and interfaces.",
    type: "worksheet",
    level: "medium",
    content: `# Medium Worksheet: Abstraction

1. Compare an abstract class with an interface.
2. Can a class implement multiple interfaces?
3. What is a default interface method?
4. How does abstraction support polymorphism?
5. When should shared implementation be placed in an abstract class?
6. Design a Shape abstraction with Circle and Rectangle implementations.

Provide Java examples for your answers.`,
    order: 6,
  },

  // ==================== ADVANCED LEVEL ====================
  {
    title: "Advanced Interface Design in Java",
    description: "Explore interface contracts and maintainable abstractions.",
    type: "video",
    level: "advanced",
    url: "https://www.youtube.com/results?search_query=Java+advanced+interface+design",
    order: 1,
  },
  {
    title: "Abstraction and Dependency Inversion",
    description: "Learn how abstractions reduce coupling between application components.",
    type: "video",
    level: "advanced",
    url: "https://www.youtube.com/results?search_query=Java+abstraction+dependency+inversion+principle",
    order: 2,
  },
  {
    title: "Designing Effective Abstractions",
    description: "Learn how to create useful interfaces and abstract types.",
    type: "note",
    level: "advanced",
    content: `# Designing Effective Abstractions

A good abstraction exposes the operations callers need without revealing unnecessary implementation details.

## Design Guidelines
- Define a clear and cohesive contract.
- Avoid exposing internal mutable state unnecessarily.
- Keep interfaces focused on related responsibilities.
- Use meaningful method names and documented behavior.
- Avoid creating abstractions that add complexity without a practical benefit.

An abstraction should describe behavior that implementations can reasonably provide.

For example, a repository interface can describe data-access operations while allowing the application to use different storage implementations.`,
    order: 3,
  },
  {
    title: "Dependency Inversion and Interfaces",
    description: "Understand how high-level code can depend on abstractions.",
    type: "note",
    level: "advanced",
    content: `# Dependency Inversion

The Dependency Inversion Principle encourages high-level policy and low-level implementation details to depend on abstractions.

interface MessageSender {
    void send(String message);
}

class NotificationService {
    private final MessageSender sender;

    NotificationService(MessageSender sender) {
        this.sender = sender;
    }

    void notifyUser(String message) {
        sender.send(message);
    }
}

NotificationService receives its dependency through its constructor.

This makes it possible to supply different implementations and simplifies testing with fake or mock implementations.`,
    order: 4,
  },
  {
    title: "Abstraction, Testing, and Maintainability",
    description: "Explore testable abstractions and practical design trade-offs.",
    type: "note",
    level: "advanced",
    content: `# Abstraction and Testing

Well-designed abstractions make software easier to test and maintain.

## Benefits
- Callers depend on stable contracts.
- Implementations can change behind the contract.
- Tests can supply alternative implementations.
- Responsibilities can remain separated.

## Example

A payment service can depend on a PaymentGateway interface rather than a specific payment provider.

Tests can use a fake gateway to verify business logic without making real payments.

Avoid adding interfaces for every class automatically. Introduce an abstraction when it clarifies responsibilities, supports variation, or improves testing.`,
    order: 5,
  },
  {
    title: "Abstraction Worksheet - Advanced",
    description: "Apply interface design, dependency inversion, and testing concepts.",
    type: "worksheet",
    level: "advanced",
    content: `# Advanced Worksheet: Abstraction

1. What makes an abstraction effective?
2. Explain the Dependency Inversion Principle.
3. How can constructor injection reduce coupling?
4. How can an interface simplify unit testing?
5. Why should interfaces remain focused?
6. Design a MessageSender interface with two possible implementations.

Explain how your design allows implementations to change without rewriting the calling service.`,
    order: 6,
  },
];

async function seedAbstractionResources() {
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

seedAbstractionResources().catch((error) => {
  console.error("Seeding failed:", error.message);
  process.exitCode = 1;
});
