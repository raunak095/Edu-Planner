import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

import { io } from "socket.io-client";

// ================= SOCKET =================

const socket = io(
  "https://edu-planner-backrnd.onrender.com",
  {
    transports: ["websocket"],
  }
);

export default function Sidebar({ role }) {

  const navigate = useNavigate();

  // ================= STATES =================

  const [onlineUsers, setOnlineUsers] =
    useState([]);

  const [unreadMessages, setUnreadMessages] =
    useState(0);

  // ================= USER =================

  const token =
    localStorage.getItem("token");

  const user = token

    ? JSON.parse(
        atob(token.split(".")[1])
      )

    : null;

  // ================= SOCKET =================

  useEffect(() => {

    if (user?.id) {

      socket.emit(
        "user-online",
        user.id
      );

    }

    socket.on(
      "online-users",
      (users) => {

        console.log(
          "ONLINE USERS:",
          users
        );

        setOnlineUsers(users);

      }
    );

    socket.on(
      "receive-message",
      () => {

        setUnreadMessages(
          (prev) => prev + 1
        );

      }
    );

    return () => {

      socket.off("online-users");

      socket.off("receive-message");

    };

  }, []);

  // ================= LOGOUT =================

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/");

  };

  return (

    <div className="sidebar">

      {/* ================= LOGO ================= */}

      <h2
        style={{
          background:
            "linear-gradient(90deg,#00ff99,#00c3ff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: "800",
        }}
      >

        EduPlanner

      </h2>

      {/* ================= ONLINE STATUS ================= */}

      <div
        style={{
          marginTop: "18px",
          marginBottom: "24px",
          padding: "12px",
          borderRadius: "16px",
          background:
            "rgba(0,255,170,0.08)",
          border:
            "1px solid rgba(0,255,170,0.15)",
          textAlign: "center",
          fontSize: "14px",
          fontWeight: "600",
        }}
      >

        🟢 Online Users:
        {" "}
        {onlineUsers.length}

      </div>

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
              navigate("/student/notes")
            }
          >
            📖 Notes Library
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
    window.open(
      "https://forms.gle/nBhN2BdvmpGKajNn8",
      "_blank"
    )
  }
>
  📝 Feedback & Reviews
</div>

          {/* ================= LIVE CHAT ================= */}

          <div
            className="menu-item"
            onClick={() => {

              setUnreadMessages(0);

              navigate(
                "/student/messages"
              );

            }}
            style={{
              position: "relative",
            }}
          >

            💬 Live Chat

            {unreadMessages > 0 && (

              <span
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "10px",
                  minWidth: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(90deg,#ff4b2b,#ff416c)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: "700",
                  padding: "4px",
                }}
              >

                {unreadMessages}

              </span>

            )}

          </div>
          <div
  className="menu-item"
  onClick={() =>
    navigate("/student/video-room")
  }
>
  🎥 Video Room
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
          <div
  className="menu-item"
  onClick={() =>
    window.open(
      "https://forms.gle/nBhN2BdvmpGKajNn8",
      "_blank"
    )
  }
>
  📝 Feedback & Reviews
</div>

          <div
            className="menu-item"
            onClick={() => {

              setUnreadMessages(0);

              navigate(
                "/teacher/messages"
              );

            }}
            style={{
              position: "relative",
            }}
          >

            💬 Live Chat

            {unreadMessages > 0 && (

              <span
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "10px",
                  minWidth: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(90deg,#ff4b2b,#ff416c)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: "700",
                  padding: "4px",
                }}
              >

                {unreadMessages}

              </span>

            )}

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
          <div
  className="menu-item"
  onClick={() =>
    window.open(
      "https://forms.gle/nBhN2BdvmpGKajNn8",
      "_blank"
    )
  }
>
  📝 Feedback & Reviews
</div>

        </>

      )}

      {/* ================= LOGOUT ================= */}

      <div
        className="menu-item"
        onClick={handleLogout}
        style={{
          marginTop: "24px",
          color: "#ff5b5b",
          fontWeight: "700",
        }}
      >

        🚪 Logout

      </div>

    </div>

  );

}