import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/auth.css";

export default function RoleSelect() {

  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div className="container fade">

        <h1 className="title">
          Welcome to EduPlanner
        </h1>

        <p>Select your role</p>

        <div className="roles">

          {/* 🎓 STUDENT */}
          <div
            className="card"
            onClick={() =>
              navigate("/signup?role=student")
            }
          >
            🎓

            <h3>Student</h3>

            <p>Study roadmap</p>
          </div>

          {/* 👨‍🏫 TEACHER */}
          <div
            className="card"
            onClick={() =>
              navigate("/signup?role=teacher")
            }
          >
            👨‍🏫

            <h3>Teacher</h3>

            <p>Upload resources</p>
          </div>

          {/* 🛠 ADMIN */}
          <div
            className="card"
            onClick={() =>
              navigate("/signup?role=admin")
            }
          >
            🛠

            <h3>Admin</h3>

            <p>Manage system</p>
          </div>

        </div>

      </div>
    </>
  );
}