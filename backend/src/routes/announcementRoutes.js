import express from "express";

import {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement,
} from "../controllers/announcementController.js";

const router = express.Router();

// 📢 CREATE ANNOUNCEMENT
router.post(
  "/",
  createAnnouncement
);

// 📋 GET ALL ANNOUNCEMENTS
router.get(
  "/",
  getAnnouncements
);

// ❌ DELETE ANNOUNCEMENT
router.delete(
  "/:id",
  deleteAnnouncement
);

export default router;