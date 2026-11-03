const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("../config/db");
const Topic = require("../models/Topic");
const EngagementQuestion = require("../models/EngagementQuestion");

// =====================================================
// TOPIC 16: GENERICS
// 30 Questions | 100 Marks
// Basic: 10 × 3 = 30
// Medium: 10 × 3 = 30
// Advanced: 10 × 4 = 40
// =====================================================

const questions = [
  // =====================================================
  // BASIC - 10 × 3 = 30
  // =====================================================

  {
    question: "What is the main purpose of generics in Java?",
    options: [
      "To provide type safety",
      "To create threads",
      "To handle exceptions",
      "To manage files"
    ],
    correctAnswer: "To provide type safety",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which symbol is used to specify a generic type parameter?",
    options: ["<>", "()", "[]", "{}"],
    correctAnswer: "<>",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which of the following is a generic collection declaration?",
    options: [
      "ArrayList<String>",
      "ArrayListString",
      "String<ArrayList>",
      "ArrayList(String)"
    ],
    correctAnswer: "ArrayList<String>",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "What does T commonly represent in a generic class?",
    options: [
      "A type parameter",
      "A thread",
      "A temporary variable",
      "A method"
    ],
    correctAnswer: "A type parameter",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Can generics be used with Java classes?",
    options: ["Yes", "No", "Only abstract classes", "Only final classes"],
    correctAnswer: "Yes",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Can generics be used with methods?",
    options: ["Yes", "No", "Only constructors", "Only static blocks"],
    correctAnswer: "Yes",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which is a valid generic class declaration?",
    options: [
      "class Box<T>",
      "class Box(T)",
      "generic class Box<T>",
      "class<T> Box"
    ],
    correctAnswer: "class Box<T>",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which type cannot directly be used as a generic type argument?",
    options: ["int", "Integer", "String", "Double"],
    correctAnswer: "int",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "Which wrapper class corresponds to the primitive type int?",
    options: ["Integer", "Int", "NumberInt", "LongInt"],
    correctAnswer: "Integer",
    marks: 3,
    difficulty: "basic",
  },
  {
    question: "What problem do generics help reduce?",
    options: [
      "Unnecessary type casting",
      "Memory allocation",
      "Network errors",
      "Syntax highlighting"
    ],
    correctAnswer: "Unnecessary type casting",
    marks: 3,
    difficulty: "basic",
  },

  // =====================================================
  // MEDIUM - 10 × 3 = 30
  // =====================================================

  {
    question:
      "What is the output?\n\nArrayList<String> list = new ArrayList<>();\nlist.add(\"Java\");\nString value = list.get(0);\nSystem.out.println(value);",
    options: ["Java", "String", "null", "Compilation error"],
    correctAnswer: "Java",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which syntax represents a generic method?",
    options: [
      "<T> void display(T value)",
      "void <T> display(T value)",
      "generic void display(T value)",
      "void display<T>(T value)"
    ],
    correctAnswer: "<T> void display(T value)",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which statement about generic type parameters is correct?",
    options: [
      "A class can have multiple type parameters",
      "A class can have only one type parameter",
      "Generic classes cannot have methods",
      "Generic parameters must always be String"
    ],
    correctAnswer: "A class can have multiple type parameters",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which is a valid declaration using two generic type parameters?",
    options: [
      "class Pair<K, V>",
      "class Pair<K V>",
      "class<K,V> Pair",
      "generic Pair<K,V>"
    ],
    correctAnswer: "class Pair<K, V>",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What does the diamond operator <> help reduce?",
    options: [
      "Repeated specification of generic type arguments",
      "The size of an object",
      "The number of methods",
      "The number of classes"
    ],
    correctAnswer:
      "Repeated specification of generic type arguments",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which keyword is used to define an upper bounded type parameter?",
    options: ["extends", "super", "implements", "bound"],
    correctAnswer: "extends",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which keyword is used with a lower bounded wildcard?",
    options: ["super", "extends", "implements", "lower"],
    correctAnswer: "super",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "What does List<?> represent?",
    options: [
      "A list of an unknown type",
      "A list containing only String values",
      "A list containing only integers",
      "An empty list only"
    ],
    correctAnswer: "A list of an unknown type",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which wildcard represents an upper bounded type?",
    options: [
      "? extends Number",
      "? super Number",
      "? Number",
      "? implements Number"
    ],
    correctAnswer: "? extends Number",
    marks: 3,
    difficulty: "medium",
  },
  {
    question: "Which wildcard represents a lower bounded type?",
    options: [
      "? super Integer",
      "? extends Integer",
      "? Integer",
      "? implements Integer"
    ],
    correctAnswer: "? super Integer",
    marks: 3,
    difficulty: "medium",
  },

  // =====================================================
  // ADVANCED - 10 × 4 = 40
  // =====================================================

  {
    question:
      "What is the output?\n\nclass Box<T> {\n    T value;\n\n    Box(T value) {\n        this.value = value;\n    }\n\n    T getValue() {\n        return value;\n    }\n}\n\nBox<Integer> box = new Box<>(100);\nSystem.out.println(box.getValue());",
    options: ["100", "Integer", "null", "Compilation error"],
    correctAnswer: "100",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "What is the output?\n\nstatic <T> T getFirst(T a, T b) {\n    return a;\n}\n\nSystem.out.println(getFirst(\"Java\", \"Python\"));",
    options: ["Java", "Python", "null", "Compilation error"],
    correctAnswer: "Java",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "What does type erasure mean in Java generics?",
    options: [
      "Generic type information is primarily removed at runtime",
      "Generic types are converted into primitive types",
      "All generic classes are deleted",
      "Generic methods cannot be compiled"
    ],
    correctAnswer:
      "Generic type information is primarily removed at runtime",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "Which statement about generic arrays is correct?",
    options: [
      "Direct creation of arrays of a concrete parameterized type is generally not allowed",
      "All generic arrays are always allowed",
      "Generic arrays must use primitive types",
      "Generic arrays can only contain String"
    ],
    correctAnswer:
      "Direct creation of arrays of a concrete parameterized type is generally not allowed",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "Which declaration correctly restricts T to Number or its subclasses?",
    options: [
      "class Box<T extends Number>",
      "class Box<T super Number>",
      "class Box<T implements Number>",
      "class Box<Number extends T>"
    ],
    correctAnswer: "class Box<T extends Number>",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "Which statement about List<? extends Number> is correct?",
    options: [
      "It can refer to a List of Number or any subclass of Number",
      "It can accept only List<Integer>",
      "It can safely add any Number to the list",
      "It represents only List<Object>"
    ],
    correctAnswer:
      "It can refer to a List of Number or any subclass of Number",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "Why can you generally not add an arbitrary Number to List<? extends Number>?",
    options: [
      "The actual element type could be a specific subtype such as Integer",
      "Number is not a class",
      "Lists cannot store numbers",
      "Generics allow only String"
    ],
    correctAnswer:
      "The actual element type could be a specific subtype such as Integer",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "Which statement about List<? super Integer> is correct?",
    options: [
      "You can safely add Integer values to it",
      "You cannot add Integer values",
      "It can only reference List<Double>",
      "It represents an upper bound"
    ],
    correctAnswer: "You can safely add Integer values to it",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question: "Which principle is commonly associated with PECS in Java generics?",
    options: [
      "Producer Extends, Consumer Super",
      "Producer Exception, Consumer String",
      "Private Extends, Public Super",
      "Producer Equals, Consumer Static"
    ],
    correctAnswer: "Producer Extends, Consumer Super",
    marks: 4,
    difficulty: "advanced",
  },
  {
    question:
      "Why are generics primarily implemented using type erasure in Java?",
    options: [
      "To maintain compatibility with older Java bytecode and code",
      "To make all collections synchronized",
      "To allow primitive generic types directly",
      "To remove object-oriented programming"
    ],
    correctAnswer:
      "To maintain compatibility with older Java bytecode and code",
    marks: 4,
    difficulty: "advanced",
  },
];

// =====================================================
// SEED FUNCTION
// =====================================================

const seedQuestions = async () => {
  try {
    await connectDB();

    console.log("\n========================================");
    console.log("Topic 16 Assessment Question Seeding");
    console.log("========================================\n");

    const topic = await Topic.findOne({
      title: "Generics",
      subject: "Java",
    });

    if (!topic) {
      console.log("❌ Topic 'Generics' not found.");
      console.log("Please make sure Topic 16 exists in MongoDB.");
      process.exit(1);
    }

    console.log(`✅ Topic found: ${topic.title}`);
    console.log(`Topic ID: ${topic._id}\n`);

    const existingCount = await EngagementQuestion.countDocuments({
      topicId: topic._id,
    });

    if (existingCount > 0) {
      console.log(
        `⚠️ This topic already has ${existingCount} question(s).`
      );
      console.log("No new questions were inserted.");
      process.exit(0);
    }

    if (questions.length !== 30) {
      console.log(
        `❌ Expected 30 questions, but found ${questions.length}.`
      );
      process.exit(1);
    }

    const basicCount = questions.filter(
      (q) => q.difficulty === "basic"
    ).length;

    const mediumCount = questions.filter(
      (q) => q.difficulty === "medium"
    ).length;

    const advancedCount = questions.filter(
      (q) => q.difficulty === "advanced"
    ).length;

    console.log("Question Distribution:");
    console.log(`Basic: ${basicCount}`);
    console.log(`Medium: ${mediumCount}`);
    console.log(`Advanced: ${advancedCount}\n`);

    if (
      basicCount !== 10 ||
      mediumCount !== 10 ||
      advancedCount !== 10
    ) {
      console.log("❌ Difficulty distribution is incorrect.");
      process.exit(1);
    }

    const totalMarks = questions.reduce(
      (total, question) => total + question.marks,
      0
    );

    console.log(`Total Marks: ${totalMarks}`);

    if (totalMarks !== 100) {
      console.log("❌ Total marks must be exactly 100.");
      process.exit(1);
    }

    const questionsWithTopic = questions.map((question) => ({
      ...question,
      topicId: topic._id,
      isActive: true,
    }));

    await EngagementQuestion.insertMany(questionsWithTopic);

    console.log("\n========================================");
    console.log("✅ SUCCESS");
    console.log("========================================");
    console.log("Topic: Generics");
    console.log("Questions inserted: 30");
    console.log("Basic: 10 × 3 = 30 marks");
    console.log("Medium: 10 × 3 = 30 marks");
    console.log("Advanced: 10 × 4 = 40 marks");
    console.log("Total: 100 marks");
    console.log("========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error while seeding questions:");
    console.error(error.message);
    process.exit(1);
  }
};

seedQuestions();