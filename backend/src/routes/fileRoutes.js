import express from "express";

import upload from "../middleware/uploadMiddleware.js";

import {

  uploadFile,

  getAllFiles,

  getFileById,

  downloadFile,

  deleteFile,

  getFilesByUser,

  getFilesByRole,

  previewFile,

} from "../controllers/fileController.js";

const router = express.Router();

// 📤 Upload File
router.post(
  "/upload",
  upload.single("file"),
  uploadFile
);

// 📂 Get All Files
router.get(
  "/",
  getAllFiles
);

// 📄 Get File By ID
router.get(
  "/:id",
  getFileById
);

// ⬇️ Download File
router.get(
  "/download/:id",
  downloadFile
);

// 👁️ Preview File
router.get(
  "/preview/:id",
  previewFile
);

// ❌ Delete File
router.delete(
  "/:id",
  deleteFile
);

// 👤 Get Files By User
router.get(
  "/user/:uploadedBy",
  getFilesByUser
);

// 🧑‍💼 Get Files By Role
router.get(
  "/role/:role",
  getFilesByRole
);

export default router;