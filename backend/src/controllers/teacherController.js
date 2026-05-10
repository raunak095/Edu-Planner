export const getTeacherDashboardStats = async (req, res) => {

  try {

    // Temporary static data
    // Later replace with MongoDB counts

    res.status(200).json({
      courses: 12,
      quizzes: 34,
      students: 120,
      uploads: 18,
    });

  } catch (error) {

    console.error("Teacher Dashboard Error:", error);

    res.status(500).json({
      message: "Failed to load dashboard stats",
    });
  }
};