const express = require("express");
const router = express.Router();

const { getTopicsBySubject, createTopic } = require("../controllers/topicController");
const { authMiddleware } = require("../middleware/authMiddleware");

// GET topics by subject (protected or optional — your choice)
router.get("/:subject", authMiddleware, getTopicsBySubject);

// POST create topic (teacher/admin only)
router.post("/", authMiddleware, createTopic);

module.exports = router;