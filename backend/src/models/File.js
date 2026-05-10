const mongoose = require("mongoose");

// Define the File schema
const fileSchema = new mongoose.Schema({
  // Original file name (e.g., resume.pdf)
  fileName: {
    type: String,
    required: true
  },
  // Store binary file data
  fileData: {
    type: Buffer, 
    required: true
  },
  // MIME type of the file (e.g., application/pdf)
  mimeType: {
    type: String,
    required: true
  },
  // in bytes
  fileSize: {
    type: Number, 
    required: true
  },
  // pdf, docx, txt
  fileType: {
    type: String, 
    required: true
  },
  // user email or ID who uploaded the file
  uploadedBy: {
    type: String, 
    required: true
  },
  // role of the uploader (student, teacher, admin)
  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    required: true
  }
}, { timestamps: true });

// Create and export the File model
module.exports = mongoose.model("File", fileSchema);