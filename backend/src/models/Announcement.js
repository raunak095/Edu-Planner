import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({

  // 📌 Announcement Title
  title: {
    type: String,
    required: true,
    trim: true,
  },

  // 📝 Announcement Message
  message: {
    type: String,
    required: true,
    trim: true,
  },

  // 👨‍🏫 Teacher ID
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  // 📅 Created Date
  createdAt: {
    type: Date,
    default: Date.now,
  },

});

const Announcement = mongoose.model(
  "Announcement",
  announcementSchema
);

export default Announcement;