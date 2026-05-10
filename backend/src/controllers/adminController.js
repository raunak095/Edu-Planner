import Course from "../models/Course.js";
import Note from "../models/Note.js";
import Announcement from "../models/Announcement.js";
import Student from "../models/Student.js";

// 👨‍💼 ADMIN DASHBOARD STATS
export const getAdminStats = async (
  req,
  res
) => {

  try {

    // 📚 Total Courses
    const totalCourses =
      await Course.countDocuments();

    // 📂 Total Notes
    const totalNotes =
      await Note.countDocuments();

    // 📢 Total Announcements
    const totalAnnouncements =
      await Announcement.countDocuments();

    // 👨‍🎓 Total Students
    const totalStudents =
      await Student.countDocuments();

    // 👨‍🏫 Dummy Teacher Count
    // (Until Teacher model created)
    const totalTeachers = 5;

    // 👥 Total Users
    const totalUsers =
      totalStudents + totalTeachers;

    // ✅ Return Stats
    res.status(200).json({

      totalCourses,
      totalNotes,
      totalAnnouncements,
      totalStudents,
      totalTeachers,
      totalUsers,

    });

  } catch (error) {

    console.error(
      "Admin Dashboard Error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch admin stats",
    });
  }
};