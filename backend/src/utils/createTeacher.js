const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("../models/User");

dotenv.config();

const createTeacher = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully.");

    const name = "Prof. Priya Nair";
    const email = "teacher@learnai.com";
    const password = "Teacher@123";

    const existingTeacher = await User.findOne({ email });

    if (existingTeacher) {
      console.log("Teacher account already exists.");
      console.log("Email:", existingTeacher.email);
      console.log("Role:", existingTeacher.role);

      await mongoose.connection.close();
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "teacher",
    });

    console.log("\n=================================");
    console.log("Teacher account created successfully");
    console.log("=================================");
    console.log("Name:", teacher.name);
    console.log("Email:", teacher.email);
    console.log("Password:", password);
    console.log("Role:", teacher.role);
    console.log("=================================\n");

    await mongoose.connection.close();
  } catch (error) {
    console.error("Error creating teacher:", error.message);

    try {
      await mongoose.connection.close();
    } catch (closeError) {}

    process.exit(1);
  }
};

createTeacher();