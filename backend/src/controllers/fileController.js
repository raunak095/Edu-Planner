const File = require("../models/File");
const path = require("path");

// ================= UPLOAD FILE TO MONGODB =================
// This function handles file uploads and stores them directly in MongoDB as binary data
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { uploadedBy, role } = req.body;

    if (!uploadedBy || !role) {
      return res.status(400).json({ message: "uploadedBy and role are required" });
    }

    // Get file extension
    const fileExt = path.extname(req.file.originalname).toLowerCase().substring(1);

    // Create file record in MongoDB
    const file = await File.create({
      fileName: req.file.originalname,
      fileData: req.file.buffer, // Store buffer directly in DB
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      fileType: fileExt,
      uploadedBy,
      role
    });

    res.status(201).json({
      message: "File uploaded successfully to MongoDB",
      file: {
        id: file._id,
        fileName: file.fileName,
        fileSize: file.fileSize,
        fileType: file.fileType,
        uploadedBy: file.uploadedBy,
        uploadedAt: file.createdAt
      }
    });
  } catch (error) {
    console.error("❌ UPLOAD ERROR:", error);
    res.status(500).json({ message: "File upload failed" });
  }
};

// ================= GET ALL FILES (Metadata Only) =================
// This function retrieves all file records without the binary data for listing purposes
const getAllFiles = async (req, res) => {
  try {
    const files = await File.find().select("-fileData").sort({ createdAt: -1 });
    res.json({
      message: "Files retrieved successfully",
      totalFiles: files.length,
      files
    });
  } catch (error) {
    console.error("❌ GET FILES ERROR:", error);
    res.status(500).json({ message: "Failed to retrieve files" });
  }
};

// ================= GET FILE BY ID (Metadata Only) =================
// This function retrieves a single file record by ID without the binary data
const getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id).select("-fileData");
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    res.json({
      message: "File retrieved successfully",
      file
    });
  } catch (error) {
    console.error("❌ GET FILE ERROR:", error);
    res.status(500).json({ message: "Failed to retrieve file" });
  }
};

// ================= DOWNLOAD FILE FROM MONGODB =================
// This function allows users to download the raw file content stored in MongoDB
const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Send file as attachment with correct MIME type
    res.setHeader("Content-Type", file.mimeType);
    res.setHeader("Content-Disposition", `attachment; filename="${file.fileName}"`);
    res.send(file.fileData);
  } catch (error) {
    console.error("❌ DOWNLOAD ERROR:", error);
    res.status(500).json({ message: "Failed to download file" });
  }
};

// ================= DELETE FILE FROM MONGODB =================
// This function deletes a file record from MongoDB by its ID
const deleteFile = async (req, res) => {
  try {
    const file = await File.findByIdAndDelete(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    res.json({
      message: "File deleted successfully from MongoDB",
      fileId: file._id,
      fileName: file.fileName
    });
  } catch (error) {
    console.error("❌ DELETE ERROR:", error);
    res.status(500).json({ message: "Failed to delete file" });
  }
};

// ================= GET FILES BY USER =================
// This function retrieves all files uploaded by a specific user (identified by email or ID)
const getFilesByUser = async (req, res) => {
  try {
    const { uploadedBy } = req.params;
    const files = await File.find({ uploadedBy }).select("-fileData").sort({ createdAt: -1 });

    res.json({
      message: "User files retrieved successfully",
      totalFiles: files.length,
      files
    });
  } catch (error) {
    console.error("❌ GET USER FILES ERROR:", error);
    res.status(500).json({ message: "Failed to retrieve user files" });
  }
};

// ================= GET FILES BY ROLE =================
// This function retrieves all files associated with a specific role (student, teacher, admin)
const getFilesByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const files = await File.find({ role }).select("-fileData").sort({ createdAt: -1 });

    res.json({
      message: `${role} files retrieved successfully`,
      totalFiles: files.length,
      files
    });
  } catch (error) {
    console.error("❌ GET ROLE FILES ERROR:", error);
    res.status(500).json({ message: "Failed to retrieve files" });
  }
};

// ================= PREVIEW FILE (View in Browser) =================
// This function allows users to preview the file in the browser when supported (e.g., PDFs, TXT)
const previewFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // For PDFs and TXT - display inline; for DOCX - force download
    const disposition = file.fileType === "docx" ? "attachment" : "inline";
    
    res.setHeader("Content-Type", file.mimeType);
    res.setHeader("Content-Disposition", `${disposition}; filename="${file.fileName}"`);
    res.send(file.fileData);
  } catch (error) {
    console.error("❌ PREVIEW ERROR:", error);
    res.status(500).json({ message: "Failed to preview file" });
  }
};

module.exports = {
  uploadFile,
  getAllFiles,
  getFileById,
  downloadFile,
  deleteFile,
  getFilesByUser,
  getFilesByRole,
  previewFile
};