import express from "express";

import {
  getAdminStats,
} from "../controllers/adminController.js";

const router = express.Router();

// 👨‍💼 Admin Dashboard Stats
router.get(
  "/dashboard",
  getAdminStats
);

export default router;