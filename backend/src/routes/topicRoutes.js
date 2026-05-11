import express from "express";

import {
  getTopicsBySubject,
  createTopic,
} from "../controllers/topicController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// 📚 Get Topics By Subject
router.get(
  "/:subject",
  protect,
  getTopicsBySubject
);

// ➕ Create Topic
router.post(
  "/",
  protect,
  createTopic
);

export default router;