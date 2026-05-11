import express from "express";

import {
  generateRoadmap,
  generateQuiz,
  chatWithAI,
} from "../controllers/aiController.js";

const router = express.Router();

console.log("🚀 AI ROUTES LOADED");

// ================= ROADMAP =================
router.post(
  "/generate-roadmap",
  generateRoadmap
);

// ================= QUIZ =================
router.post(
  "/generate-quiz",
  generateQuiz
);

// ================= AI CHAT =================
router.post(
  "/chat",
  chatWithAI
);

export default router;