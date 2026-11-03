
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Topic = require("../models/Topic");
const LearningResource = require("../models/LearningResource");

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || process.env.MONGO_URI;

const TOPIC_TITLE = "Polymorphism";

const resources = [
  // ==================== BASIC LEVEL ====================
  {
    title: "Introduction to Polymorphism in Java",
    description: "Understand polymorphism and its role in object-oriented programming.",
    type: "video",
    level: "basic",
    url: "https://www.youtube.com/results?search_query=Java+polymorphism+for+beginners",
    order: 1,
  },
  {
    title: "Method Overloading and Overriding",
    description: "Learn the two common forms of method polymorphism in Java.",
    type: "video",
    level: "basic",
    url: "https://www.youtube.com/results?search_query=Java+method+overloading+and+overriding",
    order: 2,
  },
  {
    title: "Polymorphism Fundamentals",
    description: "Learn the meaning and benefits of polymorphism.",
    type: "note",
    level: "basic",
    content: `# Polymorphism in Java

Polymorphism means "many forms." It allows the same method name or common parent type to represent different behaviors.

Java supports two commonly discussed forms:

1. Compile-time polymorphism through method overloading.
2. Runtime polymorphism through method overriding and dynamic method dispatch.

## Example

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

The reference is of type Animal, but the object's overridden method is selected at runtime.`,
    order: 3,
  },
  {
    title: "Method Overloading Basics",
    description: "Understand methods that share a name but have different parameter lists.",
    type: "note",
    level: "basic",
    content: `# Method Overloading

Method overloading allows a class to define multiple methods with the same name but different parameter lists.

class Calculator {
    int add(int a, int b) {
        return a + b;
    }

    double add(double a, double b) {
        return a + b;
    }

    int add(int a, int b, int c) {
        return a + b + c;
    }
}

The compiler determines which applicable overload to call based on the method arguments.

Overloaded methods must differ in their parameter lists. Changing only the return type does not create a valid overload.`,
    order: 4,
  },
  {
    title: "Method Overriding Basics",
    description: "Learn how subclasses replace inherited instance-method behavior.",
    type: "note",
    level: "basic",
    content: `# Method Overriding

A subclass overrides an inherited instance method by providing a compatible implementation with the same signature.

class Animal {
    void sound() {
        System.out.println("Animal sound");
    }
}

class Cat extends Animal {
    @Override
    void sound() {
        System.out.println("Meow");
    }
}

Animal pet = new Cat();
pet.sound(); // Meow

The @Override annotation asks the compiler to verify that the method really overrides or implements a method.

Overriding supports runtime polymorphism.`,
    order: 5,
  },
  {
    title: "Polymorphism Worksheet - Basic",
    description: "Practice the basic concepts of polymorphism.",
    type: "worksheet",
    level: "basic",
    content: `# Basic Worksheet: Polymorphism

1. Define polymorphism.
2. What is method overloading?
3. What is method overriding?
4. Explain compile-time and runtime polymorphism.
5. Write a Calculator class with two overloaded add() methods.
6. Write an Animal class and override sound() in a Dog class.

Compile and run your examples.`,
    order: 6,
  },

  // ==================== MEDIUM LEVEL ====================
  {
    title: "Runtime Polymorphism and Dynamic Dispatch",
    description: "Explore superclass references and overridden method execution.",
    type: "video",
    level: "medium",
    url: "https://www.youtube.com/results?search_query=Java+runtime+polymorphism+dynamic+method+dispatch",
    order: 1,
  },
  {
    title: "Polymorphism Using Interfaces",
    description: "Learn how interfaces enable flexible implementations.",
    type: "video",
    level: "medium",
    url: "https://www.youtube.com/results?search_query=Java+polymorphism+using+interfaces",
    order: 2,
  },
  {
    title: "Dynamic Method Dispatch",
    description: "Understand how Java chooses overridden methods at runtime.",
    type: "note",
    level: "medium",
    content: `# Dynamic Method Dispatch

Dynamic method dispatch is the process through which Java selects an overridden instance-method implementation based on the object's runtime class.

class Shape {
    void draw() {
        System.out.println("Drawing shape");
    }
}

class Circle extends Shape {
    @Override
    void draw() {
        System.out.println("Drawing circle");
    }
}

class Rectangle extends Shape {
    @Override
    void draw() {
        System.out.println("Drawing rectangle");
    }
}

Shape shape = new Circle();
shape.draw(); // Drawing circle

A Shape reference can refer to different subclass objects. The selected overridden method depends on the actual object.

The reference type still determines which members are accessible at compile time.`,
    order: 3,
  },
  {
    title: "Polymorphism with Interfaces",
    description: "Learn to write code that works with different implementations of one interface.",
    type: "note",
    level: "medium",
    content: `# Interface-Based Polymorphism

An interface defines a contract that different classes can implement.

interface Payment {
    void pay(double amount);
}

class CardPayment implements Payment {
    public void pay(double amount) {
        System.out.println("Card payment: " + amount);
    }
}

class CashPayment implements Payment {
    public void pay(double amount) {
        System.out.println("Cash payment: " + amount);
    }
}

Payment payment = new CardPayment();
payment.pay(500);

The variable uses the Payment interface, while the object supplies the implementation.

This approach allows application code to work with different payment types without depending directly on each concrete class.`,
    order: 4,
  },
  {
    title: "Overloading vs Overriding",
    description: "Compare method signatures, inheritance, and method selection.",
    type: "note",
    level: "medium",
    content: `# Overloading vs Overriding

## Method Overloading
- Uses the same method name with different parameter lists.
- Can occur within a single class.
- The compiler chooses the applicable overload.
- Return type alone cannot distinguish overloads.

## Method Overriding
- Provides a compatible implementation of an inherited instance method.
- Requires inheritance or interface implementation.
- Uses the same method signature, subject to Java's overriding rules.
- Runtime dispatch selects the implementation for an overridden instance method.

Static methods are hidden rather than overridden. Private methods are not inherited for overriding, and final methods cannot be overridden.`,
    order: 5,
  },
  {
    title: "Polymorphism Worksheet - Medium",
    description: "Practice runtime dispatch, interfaces, and method selection.",
    type: "worksheet",
    level: "medium",
    content: `# Medium Worksheet: Polymorphism

1. Explain dynamic method dispatch.
2. What is the difference between a reference type and an object's runtime type?
3. How does interface-based polymorphism work?
4. Compare overloading and overriding.
5. Can a static method be overridden? Explain.
6. Create a Shape interface with Circle and Rectangle implementations.

Write a program that calls each implementation through the same interface type.`,
    order: 6,
  },

  // ==================== ADVANCED LEVEL ====================
  {
    title: "Polymorphism and Design Patterns",
    description: "Explore polymorphism in extensible object-oriented designs.",
    type: "video",
    level: "advanced",
    url: "https://www.youtube.com/results?search_query=Java+polymorphism+design+patterns",
    order: 1,
  },
  {
    title: "Generics and Polymorphic Design",
    description: "Understand how generic types support reusable Java code.",
    type: "video",
    level: "advanced",
    url: "https://www.youtube.com/results?search_query=Java+generics+polymorphism+tutorial",
    order: 2,
  },
  {
    title: "Polymorphism and Substitutability",
    description: "Learn how polymorphic types support safe and extensible designs.",
    type: "note",
    level: "advanced",
    content: `# Polymorphism and Substitutability

Polymorphism enables code to work with objects through a common superclass or interface.

Good polymorphic design requires implementations to respect the contract of the declared type.

For example, if a service depends on a Payment interface, different payment implementations should honor the interface's documented behavior.

## Design Benefits
- Reduces direct dependencies on concrete classes.
- Makes it easier to introduce new implementations.
- Supports testing with alternative implementations.
- Helps separate application policy from implementation details.

The Liskov Substitution Principle states that subtypes should remain usable wherever their base type is expected without breaking correctness.

Polymorphism should improve flexibility without making behavior surprising.`,
    order: 3,
  },
  {
    title: "Generics and Type Safety",
    description: "Understand how generic classes and methods improve reusable code.",
    type: "note",
    level: "advanced",
    content: `# Generics in Java

Generics allow classes, interfaces, and methods to work with specified types while providing compile-time type safety.

Example:

List<String> names = new ArrayList<>();
names.add("Asha");
names.add("Rahul");

String first = names.get(0);

The List<String> declaration restricts the list to String values at compile time.

## Generic Methods

static <T> void printItem(T item) {
    System.out.println(item);
}

Generics reduce the need for unsafe casts and help create reusable APIs.

Java generics use type erasure, so generic type information is restricted at runtime compared with some languages' generic systems.`,
    order: 4,
  },
  {
    title: "Polymorphism in Maintainable Applications",
    description: "Apply interfaces and substitutable implementations to real applications.",
    type: "note",
    level: "advanced",
    content: `# Polymorphism in Application Design

Consider a notification service that can send email or SMS notifications.

interface NotificationService {
    void send(String message);
}

Application logic can depend on NotificationService instead of directly depending on an email-specific implementation.

Benefits:
- Implementations can be replaced more easily.
- Unit tests can provide mock or fake implementations.
- New notification channels can be added without rewriting all calling code.
- Responsibilities remain separated.

Choose interfaces around meaningful behavior. Avoid creating unnecessary abstractions when a simple class is sufficient.`,
    order: 5,
  },
  {
    title: "Polymorphism Worksheet - Advanced",
    description: "Apply interface design, generics, and substitutability.",
    type: "worksheet",
    level: "advanced",
    content: `# Advanced Worksheet: Polymorphism

1. Explain the Liskov Substitution Principle.
2. How can polymorphism reduce coupling?
3. Design a NotificationService interface with two implementations.
4. Explain how generics provide compile-time type safety.
5. What is type erasure in Java?
6. Describe how polymorphism can make unit testing easier.

Include Java examples and explain the design choices.`,
    order: 6,
  },
];

async function seedPolymorphismResources() {
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

seedPolymorphismResources().catch((error) => {
  console.error("Seeding failed:", error.message);
  process.exitCode = 1;
});
