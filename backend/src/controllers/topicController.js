const Topic = require("../models/Topic");

// ======================================================
// CREATE TOPIC
// ======================================================

const createTopic = async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      order,
    } = req.body;

    if (!title || !subject) {
      return res.status(400).json({
        success: false,
        message: "Title and subject are required.",
      });
    }

    const existingTopic = await Topic.findOne({
      title: title.trim(),
      subject: subject.trim(),
    });

    if (existingTopic) {
      return res.status(409).json({
        success: false,
        message: "This topic already exists.",
      });
    }

    const topic = await Topic.create({
      title: title.trim(),
      description: description?.trim() || "",
      subject: subject.trim(),
      order: order || 0,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Topic created successfully.",
      topic,
    });
  } catch (error) {
    console.error("Create topic error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};


// ======================================================
// GET ALL TOPICS
// ======================================================

const getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find({
      isActive: true,
    }).sort({
      order: 1,
      createdAt: 1,
    });

    return res.status(200).json({
      success: true,
      count: topics.length,
      topics,
    });
  } catch (error) {
    console.error("Get topics error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};


// ======================================================
// GET TOPIC BY ID
// ======================================================

const getTopicById = async (req, res) => {
  try {
    const { topicId } = req.params;

    const topic = await Topic.findOne({
      _id: topicId,
      isActive: true,
    });

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found.",
      });
    }

    return res.status(200).json({
      success: true,
      topic,
    });
  } catch (error) {
    console.error("Get topic error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};


// ======================================================
// UPDATE TOPIC
// ======================================================

const updateTopic = async (req, res) => {
  try {
    const { topicId } = req.params;

    const {
      title,
      description,
      subject,
      order,
      isActive,
    } = req.body;

    const topic = await Topic.findById(topicId);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found.",
      });
    }

    if (title !== undefined) {
      topic.title = title.trim();
    }

    if (description !== undefined) {
      topic.description = description.trim();
    }

    if (subject !== undefined) {
      topic.subject = subject.trim();
    }

    if (order !== undefined) {
      topic.order = order;
    }

    if (isActive !== undefined) {
      topic.isActive = isActive;
    }

    await topic.save();

    return res.status(200).json({
      success: true,
      message: "Topic updated successfully.",
      topic,
    });
  } catch (error) {
    console.error("Update topic error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};


// ======================================================
// DELETE TOPIC
// ======================================================

const deleteTopic = async (req, res) => {
  try {
    const { topicId } = req.params;

    const topic = await Topic.findById(topicId);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found.",
      });
    }

    // Soft delete
    topic.isActive = false;

    await topic.save();

    return res.status(200).json({
      success: true,
      message: "Topic deleted successfully.",
    });
  } catch (error) {
    console.error("Delete topic error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};


module.exports = {
  createTopic,
  getAllTopics,
  getTopicById,
  updateTopic,
  deleteTopic,
};