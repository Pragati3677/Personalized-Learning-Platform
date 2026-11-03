
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Topic = require("../models/Topic");
const LearningResource = require("../models/LearningResource");

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || process.env.MONGO_URI;

const TOPIC_TITLE = "Inheritance";

const resources = [
  // ==================== BASIC LEVEL ====================
  {
    title: "Introduction to Inheritance in Java",
    description: "Learn how one class can inherit members from another class.",
    type: "video",
    level: "basic",
    url: "https://www.youtube.com/results?search_query=Java+inheritance+for+beginners",
    order: 1,
  },
  {
    title: "Extends Keyword and Parent Classes",
    description: "Understand superclasses, subclasses, and the extends keyword.",
    type: "video",
    level: "basic",
    url: "https://www.youtube.com/results?search_query=Java+extends+keyword+inheritance+tutorial",
    order: 2,
  },
  {
    title: "Inheritance Fundamentals",
    description: "Understand parent classes, child classes, and code reuse.",
    type: "note",
    level: "basic",
    content: `# Inheritance in Java

Inheritance allows a class to inherit accessible members from another class.

- Superclass: the parent class.
- Subclass: the child class.
- extends: the keyword used to inherit from a class.

Example:

class Animal {
    void eat() {
        System.out.println("Eating");
    }
}

class Dog extends Animal {
    void bark() {
        System.out.println("Barking");
    }
}

Dog dog = new Dog();
dog.eat();
dog.bark();

The Dog class inherits the accessible eat() method from Animal.

Java classes support single class inheritance: a class can extend only one direct superclass.`,
    order: 3,
  },
  {
    title: "Types of Class Inheritance",
    description: "Learn single, multilevel, and hierarchical inheritance.",
    type: "note",
    level: "basic",
    content: `# Common Inheritance Structures

## Single Inheritance
One child class extends one parent class.

class Dog extends Animal {}

## Multilevel Inheritance
A class extends a class that already extends another class.

class Animal {}
class Mammal extends Animal {}
class Dog extends Mammal {}

## Hierarchical Inheritance
Multiple child classes extend the same parent.

class Animal {}
class Dog extends Animal {}
class Cat extends Animal {}

Java does not support multiple inheritance of classes. Similar behavior can be achieved through interfaces.

Inheritance should represent a valid is-a relationship.`,
    order: 4,
  },
  {
    title: "The super Keyword",
    description: "Understand how subclasses refer to superclass constructors and members.",
    type: "note",
    level: "basic",
    content: `# The super Keyword

The super keyword refers to superclass members and constructors.

Example:

class Animal {
    String name = "Animal";
}

class Dog extends Animal {
    String name = "Dog";

    void display() {
        System.out.println(super.name);
        System.out.println(this.name);
    }
}

super.name accesses the inherited field, while this.name accesses the current object's field.

A superclass constructor can be invoked using super(...). In Java, an explicit superclass constructor invocation must appear first in the constructor, subject to the language version's constructor rules.`,
    order: 5,
  },
  {
    title: "Inheritance Worksheet - Basic",
    description: "Practice inheritance syntax, class relationships, and super.",
    type: "worksheet",
    level: "basic",
    content: `# Basic Worksheet: Inheritance

1. Define inheritance in Java.
2. What are a superclass and a subclass?
3. What is the purpose of extends?
4. Write a Dog class that extends Animal.
5. Explain single, multilevel, and hierarchical inheritance.
6. What is the purpose of the super keyword?

Write and test small Java examples.`,
    order: 6,
  },

  // ==================== MEDIUM LEVEL ====================
  {
    title: "Method Overriding in Java",
    description: "Learn how subclasses provide their own method implementations.",
    type: "video",
    level: "medium",
    url: "https://www.youtube.com/results?search_query=Java+method+overriding+tutorial",
    order: 1,
  },
  {
    title: "Inheritance Constructors and Initialization",
    description: "Understand constructor chaining and initialization order.",
    type: "video",
    level: "medium",
    url: "https://www.youtube.com/results?search_query=Java+inheritance+constructor+chaining",
    order: 2,
  },
  {
    title: "Method Overriding and @Override",
    description: "Understand overriding rules and runtime behavior.",
    type: "note",
    level: "medium",
    content: `# Method Overriding

A subclass overrides an inherited instance method by providing a compatible implementation with the same signature.

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

The @Override annotation lets the compiler check that the method actually overrides or implements a method.

A static method is hidden rather than overridden. Private methods are not inherited for overriding, and final methods cannot be overridden.`,
    order: 3,
  },
  {
    title: "Constructor Chaining in Inheritance",
    description: "Learn the order of superclass and subclass construction.",
    type: "note",
    level: "medium",
    content: `# Constructor Chaining

When an object of a subclass is created, its superclass construction must also occur.

class Animal {
    Animal() {
        System.out.println("Animal constructor");
    }
}

class Dog extends Animal {
    Dog() {
        System.out.println("Dog constructor");
    }
}

new Dog();

For this example, the superclass constructor runs before the subclass constructor body.

Use super(arguments) to select a superclass constructor explicitly.

Constructors are not inherited. If the superclass has no accessible no-argument constructor, the subclass must explicitly call an appropriate superclass constructor.`,
    order: 4,
  },
  {
    title: "Protected Members and Inheritance",
    description: "Understand access rules for inherited fields and methods.",
    type: "note",
    level: "medium",
    content: `# Protected Access

The protected modifier allows access within the same package and through inheritance subject to Java's access rules.

class Animal {
    protected String name;
}

class Dog extends Animal {
    void setName(String value) {
        name = value;
    }
}

Protected access is not the same as public access. In a different package, access through a subclass has additional restrictions.

Prefer private fields with suitable protected or public methods when direct field access would weaken encapsulation.`,
    order: 5,
  },
  {
    title: "Inheritance Worksheet - Medium",
    description: "Practice overriding, constructor chaining, and access control.",
    type: "worksheet",
    level: "medium",
    content: `# Medium Worksheet: Inheritance

1. Explain method overriding and the purpose of @Override.
2. What is the difference between overriding and overloading?
3. Describe constructor execution when a subclass object is created.
4. Why are constructors not inherited?
5. Explain protected access in Java.
6. Can a final method be overridden? Explain.

Include Java examples in your answers.`,
    order: 6,
  },

  // ==================== ADVANCED LEVEL ====================
  {
    title: "Inheritance and Runtime Polymorphism",
    description: "Explore dynamic method dispatch through superclass references.",
    type: "video",
    level: "advanced",
    url: "https://www.youtube.com/results?search_query=Java+inheritance+runtime+polymorphism+dynamic+dispatch",
    order: 1,
  },
  {
    title: "Inheritance Design and Liskov Substitution",
    description: "Learn to design safe and maintainable class hierarchies.",
    type: "video",
    level: "advanced",
    url: "https://www.youtube.com/results?search_query=Java+inheritance+Liskov+substitution+principle",
    order: 2,
  },
  {
    title: "Runtime Dispatch and Inheritance Design",
    description: "Understand method selection and inheritance contracts.",
    type: "note",
    level: "advanced",
    content: `# Runtime Dispatch

For an overridden instance method, Java selects the implementation based on the actual object's runtime class.

Animal animal = new Dog();
animal.sound();

If Dog overrides sound(), Dog's implementation runs.

The declared reference type controls which members can be accessed at compile time. Runtime dispatch determines which overridden instance method implementation executes.

## Design Considerations

Inheritance creates a relationship between a subclass and its superclass. A subclass should preserve the behavior promised by the superclass contract.

Prefer composition when a class does not genuinely satisfy the is-a relationship.`,
    order: 3,
  },
  {
    title: "Abstract Classes and Inheritance Contracts",
    description: "Explore abstract superclasses and required subclass implementations.",
    type: "note",
    level: "advanced",
    content: `# Abstract Classes and Inheritance

An abstract class cannot be instantiated directly. It can define shared behavior and abstract methods that concrete subclasses must implement.

abstract class Shape {
    abstract double area();

    void describe() {
        System.out.println("A shape");
    }
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

A concrete subclass must implement inherited abstract methods unless it is also abstract.

Abstract classes are useful when related types share implementation as well as a common contract.`,
    order: 4,
  },
  {
    title: "Composition vs Inheritance",
    description: "Evaluate when composition is preferable to class inheritance.",
    type: "note",
    level: "advanced",
    content: `# Composition vs Inheritance

Inheritance models an is-a relationship. Composition models a has-a relationship.

Inheritance example:
class Dog extends Animal {}

Composition example:
class Car {
    private final Engine engine;

    Car(Engine engine) {
        this.engine = engine;
    }
}

Composition allows a class to delegate work to a separate object. This can reduce coupling and make behavior easier to replace or test.

Use inheritance when the subclass genuinely satisfies the superclass contract. Use composition when the relationship is better represented by collaboration between objects.`,
    order: 5,
  },
  {
    title: "Inheritance Worksheet - Advanced",
    description: "Apply runtime dispatch, abstract classes, and inheritance design.",
    type: "worksheet",
    level: "advanced",
    content: `# Advanced Worksheet: Inheritance

1. Explain runtime method dispatch with a Java example.
2. How does the declared reference type differ from the object's runtime type?
3. What is an abstract class?
4. Why must a concrete subclass implement inherited abstract methods?
5. Explain the Liskov Substitution Principle.
6. Compare inheritance and composition in software design.

Support your answers with concise code examples.`,
    order: 6,
  },
];

async function seedInheritanceResources() {
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

seedInheritanceResources().catch((error) => {
  console.error("Seeding failed:", error.message);
  process.exitCode = 1;
});
