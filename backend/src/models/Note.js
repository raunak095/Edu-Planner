import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({

  // 📄 Note Title
  title: {
    type: String,
    required: true,
    trim: true,
  },

  // 📎 Uploaded File URL
  fileUrl: {
    type: String,
    required: true,
  },

  // 👨‍🏫 Teacher ID
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  // 📅 Upload Date
  createdAt: {
    type: Date,
    default: Date.now,
  },

});

const Note = mongoose.model(
  "Note",
  noteSchema
);

export default Note;