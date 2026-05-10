import { useNavigate } from "react-router-dom";

export default function Sidebar({ role }) {

  const navigate = useNavigate();

  // ================= LOGOUT =================

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/");

  };

  return (

    <div className="sidebar">

      <h2>EduPlanner</h2>

      {/* ================= STUDENT SIDEBAR ================= */}

      {role === "student" && (

        <>

          <div
            className="menu-item"
            onClick={() =>
              navigate("/student/dashboard")
            }
          >
            🏠 Dashboard
          </div>

          <div
            className="menu-item"
            onClick={() =>
              navigate("/student/subjects")
            }
          >
            📚 My Subjects
          </div>

          <div
            className="menu-item"
            onClick={() =>
              navigate("/student/roadmap")
            }
          >
            🗺️ Roadmap
          </div>

          <div
            className="menu-item"
            onClick={() =>
              navigate(
                "/student/announcements"
              )
            }
          >
            📢 Announcements
          </div>

          <div
            className="menu-item"
            onClick={() =>
              navigate("/student/settings")
            }
          >
            ⚙️ Settings
          </div>

        </>

      )}

      {/* ================= TEACHER SIDEBAR ================= */}

      {role === "teacher" && (

        <>

          <div
            className="menu-item"
            onClick={() =>
              navigate("/teacher/dashboard")
            }
          >
            🏠 Dashboard
          </div>

          <div
            className="menu-item"
            onClick={() =>
              navigate("/teacher/courses")
            }
          >
            📚 Courses
          </div>

          <div
            className="menu-item"
            onClick={() =>
              navigate(
                "/teacher/quiz-generator"
              )
            }
          >
            📝 Quiz Generator
          </div>

          <div
            className="menu-item"
            onClick={() =>
              navigate("/teacher/uploads")
            }
          >
            📂 Upload Notes
          </div>

          <div
            className="menu-item"
            onClick={() =>
              navigate(
                "/teacher/announcements"
              )
            }
          >
            📢 Announcements
          </div>

        </>

      )}

      {/* ================= ADMIN SIDEBAR ================= */}

      {role === "admin" && (

        <>

          <div
            className="menu-item"
            onClick={() =>
              navigate("/admin/dashboard")
            }
          >
            🏠 Dashboard
          </div>

          <div
            className="menu-item"
            onClick={() =>
              navigate("/admin/students")
            }
          >
            👨‍🎓 Students
          </div>

          <div
            className="menu-item"
            onClick={() =>
              navigate("/admin/courses")
            }
          >
            📚 Courses
          </div>

          <div
            className="menu-item"
            onClick={() =>
              navigate("/admin/teachers")
            }
          >
            👨‍🏫 Teachers
          </div>

          <div
            className="menu-item"
            onClick={() =>
              navigate("/admin/settings")
            }
          >
            ⚙️ Settings
          </div>

        </>

      )}

      {/* ================= LOGOUT ================= */}

      <div
        className="menu-item"
        onClick={handleLogout}
      >
        🚪 Logout
      </div>

    </div>
  );
}