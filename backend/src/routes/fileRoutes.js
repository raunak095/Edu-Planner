const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const {
  uploadFile,
  getAllFiles,
  getFileById,
  downloadFile,
  deleteFile,
  getFilesByUser,
  getFilesByRole,
  previewFile
} = require("../controllers/fileController");

// Upload a single file to MongoDB
// The request must be multipart/form-data, with the file field named "file"
router.post("/upload", upload.single("file"), uploadFile);

// Retrieve metadata for all uploaded files
router.get("/", getAllFiles);

// Retrieve metadata for a single file by its MongoDB ID
router.get("/:id", getFileById);

// Download the raw file content
router.get("/download/:id", downloadFile);

// Preview the file in the browser when supported
router.get("/preview/:id", previewFile);

// Delete a file by its MongoDB ID
router.delete("/:id", deleteFile);

// Retrieve files uploaded by a specific user
router.get("/user/:uploadedBy", getFilesByUser);

// Retrieve files associated with a specific role
router.get("/role/:role", getFilesByRole);

export default router;