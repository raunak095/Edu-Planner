const multer = require("multer");
const path = require("path");

// Use memory storage instead of disk
const storage = multer.memoryStorage();

// File filter - only allow PDF, DOCX, TXT
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain"
  ];

  // Also check file extension for extra safety
  const allowedExtensions = [".pdf", ".docx", ".txt"];

  // Get the file extension
  const fileExt = path.extname(file.originalname).toLowerCase();

  // Check MIME type and file extension
  if (allowedMimes.includes(file.mimetype) || allowedExtensions.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOCX, and TXT files are allowed"), false);
  }
};

// Create multer instance with 3MB limit
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024 // 3 MB
  }
});

module.exports = upload;