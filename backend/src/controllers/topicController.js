const Topic = require("../models/topic");

// GET /topics/:subject
const getTopicsBySubject = async (req, res) => {
  try {
    const { subject } = req.params;

    const topics = await Topic.find({
      subject: new RegExp(`^${subject}$`, "i")
    });

    if (!topics.length) {
      return res.status(404).json({
        message: "No topics found for this subject"
      });
    }

    res.status(200).json({ topics });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /topics
const createTopic = async (req, res) => {
  try {
    const { subject, name, estimatedHours, priorityScore } = req.body;

    // 🔐 Role check (basic)
    if (req.user.role !== "teacher" && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Only teachers/admins can add topics."
      });
    }

    if (!subject || !name) {
      return res.status(400).json({
        message: "Subject and topic name are required"
      });
    }

    const topic = await Topic.create({
      subject: subject.toLowerCase(),
      name,
      estimatedHours,
      priorityScore
    });

    res.status(201).json({
      message: "Topic created successfully",
      topic
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getTopicsBySubject,
  createTopic
};