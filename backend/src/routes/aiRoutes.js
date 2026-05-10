import express from "express";
import { generateRoadmap,generateQuiz, } from "../controllers/aiController.js";

const router = express.Router();
console.log("🚀 AI ROUTES LOADED");

router.post("/generate-roadmap", generateRoadmap);
router.post("/generate-quiz", generateQuiz);

export default router;