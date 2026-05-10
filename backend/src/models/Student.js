import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({

  // 👨‍🎓 Student Name
  name: {
    type: String,
    required: true,
    trim: true,
  },

  // 📧 Email
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  // 📚 Enrolled Courses
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],

  // 📅 Created Date
  createdAt: {
    type: Date,
    default: Date.now,
  },

});

const Student = mongoose.model(
  "Student",
  studentSchema
);

export default Student;