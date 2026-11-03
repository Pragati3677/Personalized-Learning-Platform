const mongoose = require("mongoose");
require("dotenv").config();

async function updateLearningLevels() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URL is missing from the .env file");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "edupath_ai"
    });

    console.log("MongoDB connected successfully");

    const db = mongoose.connection.db;

    // Update existing resources without a level
    const resourceResult = await db
      .collection("learningresources")
      .updateMany(
        {
          $or: [
            { level: { $exists: false } },
            { level: null },
            { level: "" }
          ]
        },
        {
          $set: { level: "basic" }
        }
      );

    console.log(
      "Resources updated:",
      resourceResult.modifiedCount
    );

    // Update existing users without a learning level
    const userResult = await db.collection("users").updateMany(
      {
        $or: [
          { learningLevel: { $exists: false } },
          { learningLevel: null },
          { learningLevel: "" }
        ]
      },
      {
        $set: { learningLevel: "basic" }
      }
    );

    console.log(
      "Users updated:",
      userResult.modifiedCount
    );
  } catch (error) {
    console.error("Update failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

updateLearningLevels();