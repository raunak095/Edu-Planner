import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api";

export default function TeacherDashboard() {

  const navigate = useNavigate();

  // 📊 Dynamic Dashboard Stats
  const [stats, setStats] = useState({
    courses: 0,
    quizzes: 0,
    students: 0,
    uploads: 0,
  });

  // ⏳ Loading State
  const [loading, setLoading] = useState(true);

  // ❌ Error State
  const [error, setError] = useState("");

  // 🚀 Fetch Dashboard Stats
  useEffect(() => {

    const fetchDashboardStats = async () => {

      try {

        setLoading(true);

        const response = await API.get("/teacher/dashboard");

        setStats({
          courses: response.data.courses || 0,
          quizzes: response.data.quizzes || 0,
          students: response.data.students || 0,
          uploads: response.data.uploads || 0,
        });

      } catch (err) {

        console.error("Dashboard Stats Error:", err);

        setError("Failed to load dashboard stats");

      } finally {

        setLoading(false);

      }
    };

    fetchDashboardStats();

  }, []);

  return (

    <DashboardLayout role="teacher">

      {/* 👨‍🏫 PAGE TITLE */}
      <h1 className="page-title">
        👨‍🏫 Teacher Dashboard
      </h1>

      {/* ❌ ERROR MESSAGE */}
      {error && (
        <div
          style={{
            background: "#ff4d4f",
            color: "white",
            padding: "12px",
            borderRadius: "10px",
            marginTop: "20px",
            fontWeight: "bold",
          }}
        >
          {error}
        </div>
      )}

      {/* 📊 STATS SECTION */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >

        {/* 📚 COURSES */}
        <div
          className="card"
          onClick={() => navigate("/teacher/courses")}
          style={{ cursor: "pointer" }}
        >
          <h2>📚 Courses</h2>

          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            {loading ? "..." : stats.courses}
          </p>
        </div>

        {/* 📝 QUIZZES */}
        <div
          className="card"
          onClick={() => navigate("/teacher/quiz-generator")}
          style={{ cursor: "pointer" }}
        >
          <h2>📝 Quizzes</h2>

          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            {loading ? "..." : stats.quizzes}
          </p>
        </div>

        {/* 👨‍🎓 STUDENTS */}
        <div
          className="card"
          onClick={() => navigate("/teacher/students")}
          style={{ cursor: "pointer" }}
        >
          <h2>👨‍🎓 Students</h2>

          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            {loading ? "..." : stats.students}
          </p>
        </div>

        {/* 📂 UPLOADS */}
        <div
          className="card"
          onClick={() => navigate("/teacher/uploads")}
          style={{ cursor: "pointer" }}
        >
          <h2>📂 Uploads</h2>

          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            {loading ? "..." : stats.uploads}
          </p>
        </div>

      </div>

      {/* ⚡ QUICK ACTIONS */}
      <div
        className="card"
        style={{
          marginTop: "30px",
        }}
      >

        <h2>⚡ Quick Actions</h2>

        <div
          style={{
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
            marginTop: "15px",
          }}
        >

          {/* ➕ CREATE COURSE */}
          <button
            className="btn"
            onClick={() => navigate("/teacher/courses")}
          >
            ➕ Create Course
          </button>

          {/* 🤖 GENERATE QUIZ */}
          <button
            className="btn"
            onClick={() => navigate("/teacher/quiz-generator")}
          >
            🤖 Generate Quiz
          </button>

          {/* 📂 UPLOAD NOTES */}
          <button
            className="btn"
            onClick={() => navigate("/teacher/uploads")}
          >
            📂 Upload Notes
          </button>

          {/* 👨‍🎓 STUDENTS */}
          <button
            className="btn"
            onClick={() => navigate("/teacher/students")}
          >
            👨‍🎓 Students
          </button>

          {/* 📢 ANNOUNCEMENTS */}
          <button
            className="btn"
            onClick={() => navigate("/teacher/announcements")}
          >
            📢 Announcements
          </button>

          {/* ⚙️ SETTINGS */}
          <button
            className="btn"
            onClick={() => navigate("/teacher/settings")}
          >
            ⚙️ Settings
          </button>

        </div>

      </div>

      {/* 📌 RECENT ACTIVITY */}
      <div
        className="card"
        style={{
          marginTop: "30px",
        }}
      >

        <h2>📌 Recent Activity</h2>

        <ul
          style={{
            marginTop: "15px",
            lineHeight: "2",
          }}
        >
          <li>✅ Quiz generated successfully</li>
          <li>📂 New notes uploaded</li>
          <li>👨‍🎓 Students enrolled in courses</li>
          <li>📢 Announcement posted</li>
        </ul>

      </div>

    </DashboardLayout>
  );
}