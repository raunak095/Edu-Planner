import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({

  // 📚 Course Title
  title: {
    type: String,
    required: true,
    trim: true,
  },

  // 📝 Course Description
  description: {
    type: String,
    required: true,
    trim: true,
  },

  // 👨‍🏫 Teacher ID
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  // 👨‍🎓 Enrolled Students
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  // 📅 Created Date
  createdAt: {
    type: Date,
    default: Date.now,
  },

});

const Course = mongoose.model(
  "Course",
  courseSchema
);

export default Course;