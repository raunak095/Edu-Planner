import express from "express";

import upload from "../middleware/uploadMiddleware.js";

import {
  uploadNote,
  getNotes,
  deleteNote,
} from "../controllers/noteController.js";

const router = express.Router();

// 📤 Upload Note
router.post(
  "/upload",
  upload.single("file"),
  uploadNote
);

// 📋 Get Notes
router.get(
  "/",
  getNotes
);

// ❌ Delete Note
router.delete(
  "/:id",
  deleteNote
);

export default router;