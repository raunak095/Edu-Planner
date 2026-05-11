import Topic from "../models/Topic.js";

// ================= GET TOPICS BY SUBJECT =================
export const getTopicsBySubject = async (req, res) => {

  try {

    const { subject } = req.params;

    const topics = await Topic.find({
      subject: new RegExp(`^${subject}$`, "i"),
    });

    if (!topics.length) {

      return res.status(404).json({
        message: "No topics found for this subject",
      });

    }

    res.status(200).json({
      topics,
    });

  } catch (err) {

    console.error(
      "Get Topics Error:",
      err
    );

    res.status(500).json({
      message: err.message,
    });

  }

};

// ================= CREATE TOPIC =================
export const createTopic = async (req, res) => {

  try {

    const {
      subject,
      name,
      estimatedHours,
      priorityScore,
    } = req.body;

    // 🔐 Role Check
    if (
      req.user.role !== "teacher" &&
      req.user.role !== "admin"
    ) {

      return res.status(403).json({
        message:
          "Access denied. Only teachers/admins can add topics.",
      });

    }

    // ✅ Validation
    if (!subject || !name) {

      return res.status(400).json({
        message:
          "Subject and topic name are required",
      });

    }

    // ✅ Create Topic
    const topic = await Topic.create({

      subject: subject.toLowerCase(),

      name,

      estimatedHours,

      priorityScore,

    });

    res.status(201).json({

      message:
        "Topic created successfully",

      topic,

    });

  } catch (err) {

    console.error(
      "Create Topic Error:",
      err
    );

    res.status(500).json({
      message: err.message,
    });

  }

};