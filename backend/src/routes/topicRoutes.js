import express from "express";

import {
  getTopicsBySubject,
  createTopic,
} from "../controllers/topicController.js";

import {
  authMiddleware,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// 📚 Get Topics By Subject
router.get(
  "/:subject",
  authMiddleware,
  getTopicsBySubject
);

// ➕ Create Topic
router.post(
  "/",
  authMiddleware,
  createTopic
);

export default router;