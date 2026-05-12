import express from "express";

import {
  generateRoadmap,
  generateQuiz,
  generateQuizFromPDF,
  chatWithAI,
} from "../controllers/aiController.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

console.log("🚀 AI ROUTES LOADED");

// ================= ROADMAP =================
router.post(
  "/generate-roadmap",
  generateRoadmap
);

// ================= NORMAL QUIZ =================
router.post(
  "/generate-quiz",
  generateQuiz
);

// ================= PDF QUIZ =================
router.post(
  "/generate-pdf-quiz",
  upload.single("file"),
  generateQuizFromPDF
);

// ================= AI CHAT =================
router.post(
  "/chat",
  chatWithAI
);

export default router;