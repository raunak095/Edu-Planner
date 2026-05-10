import express from "express";

import {
  generateRoadmap,
  getMyRoadmap
} from "../controllers/roadmapController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ================= ROUTES =================

// Generate roadmap (protected)
router.post("/generate-roadmap", protect, generateRoadmap);

// Get user's roadmap (protected)
router.get("/my-roadmap", protect, getMyRoadmap);

export default router;