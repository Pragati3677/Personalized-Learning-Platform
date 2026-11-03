const LearningResource = require("../models/LearningResource");
const Topic = require("../models/Topic");
const User = require("../models/User");

const VALID_LEVELS = ["basic", "medium", "advanced"];
const VALID_TYPES = ["note", "video", "worksheet"];

// ======================================================
// GET AUTHENTICATED USER
// ======================================================

const getAuthenticatedUser = async (req) => {
  const userId = req.user?.id || req.user?._id;

  if (!userId) {
    return null;
  }

  return User.findById(userId);
};

// ======================================================
// BUILD RESOURCE FILTER BY LEARNING LEVEL
// ======================================================

const getLevelFilter = (learningLevel) => {
  if (learningLevel === "basic") {
    return {
      $or: [
        { level: "basic" },
        { level: { $exists: false } },
        { level: null },
      ],
    };
  }

  return {
    level: learningLevel,
  };
};

// ======================================================
// CREATE LEARNING RESOURCE
// TEACHER ONLY
// ======================================================

const createResource = async (req, res) => {
  try {
    const {
      topicId,
      title,
      description,
      type,
      level,
      content,
      url,
      order,
    } = req.body;

    if (!topicId || !title || !type) {
      return res.status(400).json({
        success: false,
        message: "topicId, title and type are required.",
      });
    }

    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource type.",
      });
    }

    const resourceLevel = level || "basic";

    if (!VALID_LEVELS.includes(resourceLevel)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid level. Use basic, medium or advanced.",
      });
    }

    const topic = await Topic.findOne({
      _id: topicId,
      isActive: true,
    });

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Active topic not found.",
      });
    }

    const resource = await LearningResource.create({
      topicId,
      title: title.trim(),
      description: description?.trim() || "",
      type,
      level: resourceLevel,
      content: content || "",
      url: url?.trim() || "",
      order: order ?? 0,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Learning resource created successfully.",
      resource,
    });
  } catch (error) {
    console.error("Create resource error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ======================================================
// GET ALL RESOURCES
// STUDENTS: THEIR LEVEL ONLY
// TEACHERS: ALL LEVELS
// ======================================================

const getAllResources = async (req, res) => {
  try {
    let filter = {
      isActive: true,
    };

    if (req.user?.role === "student") {
      const user = await getAuthenticatedUser(req);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Authenticated user not found.",
        });
      }

      const learningLevel = user.learningLevel || "basic";

      if (!VALID_LEVELS.includes(learningLevel)) {
        return res.status(400).json({
          success: false,
          message: "Invalid student learning level.",
        });
      }

      filter = {
        isActive: true,
        ...getLevelFilter(learningLevel),
      };
    }

    const resources = await LearningResource.find(filter)
      .populate("topicId", "title subject")
      .sort({
        order: 1,
        createdAt: 1,
      });

    return res.status(200).json({
      success: true,
      count: resources.length,
      resources,
    });
  } catch (error) {
    console.error("Get resources error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ======================================================
// GET RESOURCES BY TOPIC
// STUDENTS: THEIR LEVEL ONLY
// TEACHERS: ALL LEVELS
// ======================================================

const getResourcesByTopic = async (req, res) => {
  try {
    const { topicId } = req.params;

    const topic = await Topic.findOne({
      _id: topicId,
      isActive: true,
    });

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Active topic not found.",
      });
    }

    let filter = {
      topicId,
      isActive: true,
    };

    let studentLevel = null;

    if (req.user?.role === "student") {
      const user = await getAuthenticatedUser(req);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Authenticated user not found.",
        });
      }

      studentLevel = user.learningLevel || "basic";

      if (!VALID_LEVELS.includes(studentLevel)) {
        return res.status(400).json({
          success: false,
          message: "Invalid student learning level.",
        });
      }

      filter = {
        topicId,
        isActive: true,
        ...getLevelFilter(studentLevel),
      };
    }

    const resources = await LearningResource.find(filter).sort({
      order: 1,
      createdAt: 1,
    });

    return res.status(200).json({
      success: true,
      topic: {
        id: topic._id,
        title: topic.title,
        subject: topic.subject,
      },
      ...(studentLevel ? { learningLevel: studentLevel } : {}),
      count: resources.length,
      resources,
    });
  } catch (error) {
    console.error("Get topic resources error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ======================================================
// GET RESOURCE BY ID
// STUDENTS: THEIR LEVEL ONLY
// TEACHERS: ALL LEVELS
// ======================================================

const getResourceById = async (req, res) => {
  try {
    const { resourceId } = req.params;

    const filter = {
      _id: resourceId,
      isActive: true,
    };

    if (req.user?.role === "student") {
      const user = await getAuthenticatedUser(req);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Authenticated user not found.",
        });
      }

      const learningLevel = user.learningLevel || "basic";

      if (!VALID_LEVELS.includes(learningLevel)) {
        return res.status(400).json({
          success: false,
          message: "Invalid student learning level.",
        });
      }

      Object.assign(filter, getLevelFilter(learningLevel));
    }

    const resource = await LearningResource.findOne(filter).populate(
      "topicId",
      "title subject"
    );

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Learning resource not found for your level.",
      });
    }

    return res.status(200).json({
      success: true,
      resource,
    });
  } catch (error) {
    console.error("Get resource error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ======================================================
// UPDATE RESOURCE
// TEACHER ONLY
// ======================================================

const updateResource = async (req, res) => {
  try {
    const { resourceId } = req.params;

    const {
      title,
      description,
      type,
      level,
      content,
      url,
      order,
      isActive,
    } = req.body;

    const resource = await LearningResource.findById(resourceId);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Learning resource not found.",
      });
    }

    if (type !== undefined) {
      if (!VALID_TYPES.includes(type)) {
        return res.status(400).json({
          success: false,
          message: "Invalid resource type.",
        });
      }

      resource.type = type;
    }

    if (level !== undefined) {
      if (!VALID_LEVELS.includes(level)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid level. Use basic, medium or advanced.",
        });
      }

      resource.level = level;
    }

    if (title !== undefined) {
      resource.title = title.trim();
    }

    if (description !== undefined) {
      resource.description = description.trim();
    }

    if (content !== undefined) {
      resource.content = content;
    }

    if (url !== undefined) {
      resource.url = url.trim();
    }

    if (order !== undefined) {
      resource.order = order;
    }

    if (isActive !== undefined) {
      resource.isActive = isActive;
    }

    await resource.save();

    return res.status(200).json({
      success: true,
      message: "Learning resource updated successfully.",
      resource,
    });
  } catch (error) {
    console.error("Update resource error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ======================================================
// DELETE RESOURCE
// TEACHER ONLY - SOFT DELETE
// ======================================================

const deleteResource = async (req, res) => {
  try {
    const { resourceId } = req.params;

    const resource = await LearningResource.findById(resourceId);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Learning resource not found.",
      });
    }

    resource.isActive = false;

    await resource.save();

    return res.status(200).json({
      success: true,
      message: "Learning resource deleted successfully.",
    });
  } catch (error) {
    console.error("Delete resource error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ======================================================
// EXPORT CONTROLLER FUNCTIONS
// ======================================================

module.exports = {
  createResource,
  getAllResources,
  getResourcesByTopic,
  getResourceById,
  updateResource,
  deleteResource,
};