import mongoose from "mongoose";

// 📂 File Schema
const fileSchema = new mongoose.Schema(

  {

    // 📄 Original File Name
    fileName: {

      type: String,

      required: true,

    },

    // 💾 Binary File Data
    fileData: {

      type: Buffer,

      required: true,

    },

    // 🧾 MIME Type
    mimeType: {

      type: String,

      required: true,

    },

    // 📏 File Size
    fileSize: {

      type: Number,

      required: true,

    },

    // 📎 File Extension
    fileType: {

      type: String,

      required: true,

    },

    // 👤 Uploaded By
    uploadedBy: {

      type: String,

      required: true,

    },

    // 🧑‍💼 User Role
    role: {

      type: String,

      enum: [
        "student",
        "teacher",
        "admin",
      ],

      required: true,

    },

  },

  {

    timestamps: true,

  }

);

// ✅ Export Model
export default mongoose.model(
  "File",
  fileSchema
);