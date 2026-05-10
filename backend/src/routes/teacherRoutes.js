import express from "express";

import {
  getTeacherDashboardStats,
} from "../controllers/teacherController.js";

const router = express.Router();

// 📊 Teacher Dashboard Stats
router.get(
  "/dashboard",
  getTeacherDashboardStats
);

// ✅ EXPORT ROUTER
export default router;