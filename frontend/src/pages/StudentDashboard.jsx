import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import "../styles/auth.css";
import API from "../api";
import {io} from "socket.io-client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
const socket = io(
  "https://edu-planner-backrnd.onrender.com",
  {
    transports: ["websocket"],
  }
);

export default function StudentDashboard() {

  const navigate = useNavigate();

  const messagesEndRef = useRef(null);

  // ================= AUTH =================

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }

  }, [navigate]);

  // ================= STATS =================

  const [onlineUsers, setOnlineUsers] =
    useState([]);
  const [stats, setStats] = useState({

    subjects: 0,

    completedSubjects: 0,

    progress: 0,

    completedTopics: 0,

    totalTopics: 0,

    totalHours: 0,

    streak: 0,

  });

  // ================= AI CHAT =================

  const [chatOpen, setChatOpen] = useState(false);

  const [loadingAI, setLoadingAI] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text:
        "Hello 👋 I am your AI Study Assistant. Ask me anything about studying, productivity, coding, exams, or your roadmap.",
    },
  ]);

  const [input, setInput] = useState("");
  // ================= FOCUS TIMER =================

const [minutes, setMinutes] = useState(25);

const [seconds, setSeconds] = useState(0);

const [isActive, setIsActive] = useState(false);

const [sessions, setSessions] = useState(

  Number(localStorage.getItem("focusSessions")) || 0

);

  // ================= AUTO SCROLL =================
  // ================= TIMER EFFECT =================

useEffect(() => {

  let interval = null;

  if (isActive) {

    interval = setInterval(() => {

      if (seconds > 0) {

        setSeconds(seconds - 1);

      }

      if (seconds === 0) {

        if (minutes === 0) {

          clearInterval(interval);

          setIsActive(false);

          setMinutes(25);

          setSeconds(0);

          const updated = sessions + 1;

          setSessions(updated);

          localStorage.setItem(
            "focusSessions",
            updated
          );

          alert(
            "🎉 Focus Session Completed!"
          );

        } else {

          setMinutes(minutes - 1);

          setSeconds(59);

        }

      }

    }, 1000);

  }

  return () => clearInterval(interval);

}, [isActive, seconds, minutes]);

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);
  // ================= ONLINE USERS =================

  useEffect(() => {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (user?._id) {

      socket.emit(
        "user-online",
        user._id
      );

    }

    socket.on(
      "online-users",
      (users) => {

        setOnlineUsers(users);

      }
    );

    return () => {

      socket.off("online-users");

    };

  }, []);

  // ================= LOAD DATA =================

  useEffect(() => {

    const loadData = () => {

      // ================= SUBJECTS =================

      const savedSubjects =
        JSON.parse(
          localStorage.getItem("subjects")
        ) || [];

      const totalSubjects =
        savedSubjects.length;

      const completedSubjects =
        savedSubjects.filter(
          (s) => s.completed
        ).length;

      // ================= ROADMAP =================

      const roadmapData =
        JSON.parse(
          localStorage.getItem("roadmap")
        );

      const completed =
        JSON.parse(
          localStorage.getItem("completed")
        ) || [];

      let totalTopics = 0;

      let totalHours = 0;

      if (
        roadmapData &&
        roadmapData.plan
      ) {

        roadmapData.plan.forEach((day) => {

          totalTopics +=
            day.topics.length;

          day.topics.forEach((topic) => {

            totalHours +=
              topic.estimatedHours;

          });

        });

      }

      // ================= PROGRESS =================

      const progress =
        totalTopics > 0

          ? Math.round(
              (completed.length /
                totalTopics) *
                100
            )

          : 0;

      // ================= STREAK =================

      const streak =
        completed.length;

      setStats({

        subjects: totalSubjects,

        completedSubjects,

        progress,

        completedTopics:
          completed.length,

        totalTopics,

        totalHours,

        streak,

      });

    };

    loadData();

    window.addEventListener("focus", loadData);

    return () => {
      window.removeEventListener("focus", loadData);
    };

  }, []);

  // ================= SEND MESSAGE =================

  const sendMessage = async () => {

    if (!input.trim()) return;

    const userInput = input;

    const userMessage = {
      sender: "user",
      text: userInput,
    };

    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    setLoadingAI(true);

    try {

      const res = await API.post("/ai/chat", {
        message: userInput,
      });

      const aiReply = {
        sender: "ai",
        text:
          res.data.reply ||
          "AI could not generate a response.",
      };

      setMessages((prev) => [...prev, aiReply]);

    } catch (error) {

      console.error(error);

      setMessages((prev) => [

        ...prev,

        {
          sender: "ai",
          text:
            "⚠ AI assistant failed to respond.",
        },

      ]);

    } finally {

      setLoadingAI(false);

    }

  };

  // ================= ENTER KEY SUPPORT =================

  const handleKeyPress = (e) => {

    if (e.key === "Enter") {

      sendMessage();

    }

  };
  const badges = [

  {
    name: "🌱 Beginner",
    requirement: 1,
    color:
      "linear-gradient(135deg,#00ff99,#00c3ff)",
  },

  {
    name: "🔥 Consistent Learner",
    requirement: 5,
    color:
      "linear-gradient(135deg,#ff9800,#ff5722)",
  },

  {
    name: "⚡ Productivity Master",
    requirement: 10,
    color:
      "linear-gradient(135deg,#ff00cc,#3333ff)",
  },

  {
    name: "🧠 Deep Focus Expert",
    requirement: 25,
    color:
      "linear-gradient(135deg,#8e2de2,#4a00e0)",
  },

  {
    name: "👑 Study Legend",
    requirement: 50,
    color:
      "linear-gradient(135deg,#ffd700,#ffb300)",
  },

];

  // ================= CHART DATA =================
  // ================= TIMER FUNCTIONS =================

const startTimer = () => {

  setIsActive(true);

};

const pauseTimer = () => {

  setIsActive(false);

};

const resetTimer = () => {

  setIsActive(false);

  setMinutes(25);

  setSeconds(0);
};

  const data = [
    { name: "Mon", study: 2 },
    { name: "Tue", study: 3 },
    { name: "Wed", study: 1 },
    { name: "Thu", study: 4 },
    { name: "Fri", study: 2 },
  ];

  return (

    <DashboardLayout role="student">

      {/* ================= TITLE ================= */}

      <div
        style={{
          marginBottom: "30px",
        }}
      >

        <h1
          className="page-title"
          style={{
            fontSize: "36px",
            fontWeight: "800",
            background:
              "linear-gradient(90deg,#00ff99,#00c3ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >

          📊 Student Dashboard

        </h1>

        <p
          style={{
            opacity: 0.7,
            marginTop: "8px",
          }}
        >

          AI-powered learning analytics & productivity

        </p>

      </div>

      {/* ================= STATS ================= */}

      <div
        className="stats"
        style={{
          gap: "20px",
        }}
      >

        <div
          className="card"
          style={{
            borderRadius: "24px",
            background:
              "linear-gradient(135deg, rgba(0,255,170,0.08), rgba(0,195,255,0.08))",
            backdropFilter: "blur(14px)",
          }}
        >

          <h3>📚 Subjects</h3>

          <p
            style={{
              fontSize: "34px",
              fontWeight: "700",
            }}
          >

            {stats.subjects}

          </p>

        </div>

        <div
          className="card"
          style={{
            borderRadius: "24px",
            background:
              "linear-gradient(135deg, rgba(255,0,150,0.08), rgba(255,0,220,0.08))",
            backdropFilter: "blur(14px)",
          }}
        >

          <h3>✅ Completed Topics</h3>

          <p
            style={{
              fontSize: "34px",
              fontWeight: "700",
            }}
          >

            {stats.completedTopics}

          </p>

        </div>

        <div
          className="card"
          style={{
            borderRadius: "24px",
            background:
              "linear-gradient(135deg, rgba(255,180,0,0.08), rgba(255,80,0,0.08))",
            backdropFilter: "blur(14px)",
          }}
        >

          <h3>📈 Progress</h3>

          <p
            style={{
              fontSize: "34px",
              fontWeight: "700",
            }}
          >

            {stats.progress}%

          </p>

        </div>

        <div
          className="card"
          style={{
            borderRadius: "24px",
            background:
              "linear-gradient(135deg, rgba(255,120,0,0.08), rgba(255,0,80,0.08))",
            backdropFilter: "blur(14px)",
          }}
        >

          <h3>🔥 Streak</h3>

          <p
            style={{
              fontSize: "34px",
              fontWeight: "700",
            }}
          >

            {stats.streak}

          </p>

        </div>

        <div
          className="card"
          style={{
            borderRadius: "24px",
            background:
              "linear-gradient(135deg, rgba(170,0,255,0.08), rgba(0,140,255,0.08))",
            backdropFilter: "blur(14px)",
          }}
        >

          <h3>⏱ Hours</h3>

          <p
            style={{
              fontSize: "34px",
              fontWeight: "700",
            }}
          >

            {stats.totalHours}h

          </p>

        </div>

      </div>

      {/* ================= CHART ================= */}

      <div
        className="card"
        style={{
          marginTop: "24px",
          borderRadius: "24px",
          backdropFilter: "blur(14px)",
        }}
      >

        <h3>📊 Weekly Study Hours</h3>

        <ResponsiveContainer
          width="100%"
          height={250}
        >

          <BarChart data={data}>

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar dataKey="study" />

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* ================= PROGRESS ================= */}

      <div
        className="card"
        style={{
          marginTop: "24px",
          borderRadius: "24px",
        }}
      >

        <h3>📈 Course Progress</h3>

        <div
          style={{
            height: "14px",
            borderRadius: "20px",
            overflow: "hidden",
            background:
              "rgba(255,255,255,0.08)",
            marginTop: "14px",
          }}
        >

          <div
            style={{
              width: `${stats.progress}%`,
              height: "100%",
              background:
                "linear-gradient(90deg,#00ff99,#00c3ff)",
              borderRadius: "20px",
              transition: "0.4s ease",
              boxShadow:
                "0 0 18px rgba(0,255,180,0.5)",
            }}
          />

        </div>

        <p
          style={{
            marginTop: "12px",
          }}
        >

          {stats.progress}% Completed

        </p>

      </div>

      {/* ================= AI INSIGHTS ================= */}

      <div
        className="card"
        style={{
          marginTop: "24px",
          borderRadius: "24px",
          background:
            "linear-gradient(135deg, rgba(0,255,170,0.08), rgba(0,195,255,0.08))",
        }}
      >

        <h3>🤖 AI Productivity Insights</h3>

        <div
          style={{
            marginTop: "16px",
            lineHeight: "1.9",
          }}
        >

          <p>
            📚 Total Topics:
            {" "}
            {stats.totalTopics}
          </p>

          <p>
            ✅ Completed Topics:
            {" "}
            {stats.completedTopics}
          </p>

          <p>
            🔥 Current Streak:
            {" "}
            {stats.streak}
          </p>

          <p>
            ⏱ Estimated Study Hours:
            {" "}
            {stats.totalHours}h
          </p>

          <p>
            🚀 You are currently
            {" "}
            {stats.progress}% on track.
          </p>

        </div>

      </div>

      {/* ================= ACHIEVEMENTS ================= */}

<div
  className="card"
  style={{
    marginTop: "24px",
    borderRadius: "24px",
  }}
>

  <h3>🏆 Achievement Badges</h3>

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit,minmax(260px,1fr))",
      gap: "20px",
      marginTop: "20px",
      alignItems: "stretch",
    }}
  >

    {badges.map((badge, i) => {

      const unlocked =
        sessions >= badge.requirement;

      return (

        <div
          key={i}
          style={{
            padding: "24px",
            minHeight: "170px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden",
            borderRadius: "22px",
            background: unlocked

              ? badge.color

              : "rgba(255,255,255,0.05)",

            color: unlocked
              ? "#fff"
              : "rgba(255,255,255,0.4)",

            border: unlocked

              ? "1px solid rgba(255,255,255,0.2)"

              : "1px solid rgba(255,255,255,0.06)",

            transform: unlocked
              ? "scale(1.02)"
              : "scale(1)",

            transition: "0.3s ease",

            boxShadow: unlocked

              ? "0 0 20px rgba(0,255,180,0.2)"

              : "none",

          }}
        >

          <h2
            style={{
              fontSize: "24px",
              lineHeight: "1.4",
              wordBreak: "break-word",
            }}
          >

            {badge.name}

          </h2>

          <p
            style={{
              marginTop: "10px",
              lineHeight: "1.7",
            }}
          >

            {unlocked

              ? "✅ Badge Unlocked"

              : `🔒 Complete ${badge.requirement} focus sessions`}

          </p>

        </div>

      );

    })}

  </div>

</div>
      {/* ================= ANNOUNCEMENTS ================= */}
      {/* ================= AI FOCUS TIMER ================= */}

<div
  className="card"
  style={{
    marginTop: "24px",
    borderRadius: "24px",
    background:
      "linear-gradient(135deg, rgba(0,255,170,0.08), rgba(0,195,255,0.08))",
    backdropFilter: "blur(14px)",
  }}
>

  <h3>⏳ AI Focus Timer</h3>

  <div
    style={{
      marginTop: "20px",
      textAlign: "center",
    }}
  >

    <h1
      style={{
        fontSize: "72px",
        fontWeight: "800",
      }}
    >

      {String(minutes).padStart(2, "0")}:
      {String(seconds).padStart(2, "0")}

    </h1>

    <p
      style={{
        opacity: 0.7,
        marginTop: "8px",
      }}
    >

      Pomodoro Study Session

    </p>

  </div>

  <div
    style={{
      display: "flex",
      gap: "12px",
      marginTop: "24px",
      justifyContent: "center",
      flexWrap: "wrap",
    }}
  >

    <button
      onClick={startTimer}
      style={{
        padding: "12px 18px",
        borderRadius: "14px",
        border: "none",
        cursor: "pointer",
        fontWeight: "700",
        background:
          "linear-gradient(90deg,#00ff99,#00c3ff)",
      }}
    >

      ▶ Start

    </button>

    <button
      onClick={pauseTimer}
      style={{
        padding: "12px 18px",
        borderRadius: "14px",
        border: "none",
        cursor: "pointer",
        fontWeight: "700",
      }}
    >

      ⏸ Pause

    </button>

    <button
      onClick={resetTimer}
      style={{
        padding: "12px 18px",
        borderRadius: "14px",
        border: "none",
        cursor: "pointer",
        fontWeight: "700",
      }}
    >

      🔄 Reset

    </button>

  </div>

  <div
    style={{
      marginTop: "26px",
      lineHeight: "1.9",
    }}
  >

    <p>
      🔥 Focus Sessions Completed:
      {" "}
      {sessions}
    </p>

    <p>
      🧠 Productivity:
      {" "}
      {sessions >= 10
        ? "Excellent"
        : sessions >= 5
        ? "Good"
        : "Average"}
    </p>

  </div>
{/* ================= FOCUS MUSIC ================= */}

<div
  className="card"
  style={{
    marginTop: "24px",
    borderRadius: "24px",
    background:
      "linear-gradient(135deg, rgba(255,0,150,0.08), rgba(0,195,255,0.08))",
    backdropFilter: "blur(14px)",
  }}
>

  <h3>🎵 Focus Music</h3>

  <p
    style={{
      marginTop: "10px",
      opacity: 0.7,
    }}
  >

    Relax and study with AI-selected lo-fi beats.

  </p>

  <div
    style={{
      marginTop: "20px",
      borderRadius: "18px",
      overflow: "hidden",
    }}
  >

    <iframe
      width="100%"
      height="300"
      src="https://www.youtube.com/embed/jfKfPfyJRdk"
      title="LoFi Music"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />

  </div>

</div>

</div>

      <div
        className="card"
        style={{
          marginTop: "24px",
          borderRadius: "24px",
        }}
      >

        <h3>📢 Announcements</h3>

        <p>🔥 Exam next week</p>

        <p>📚 New syllabus uploaded</p>

      </div>

      {/* ================= TODAY PLAN ================= */}

      <div
        className="card"
        style={{
          marginTop: "24px",
          borderRadius: "24px",
        }}
      >

        <h3>📅 Today's Plan</h3>

        <p>✔ Study DBMS</p>

        <p>✔ Practice DSA</p>

      </div>

      {/* ================= FLOATING AI BUTTON ================= */}

      <button

        onClick={() =>
          setChatOpen(!chatOpen)
        }

        style={{

          position: "fixed",

          bottom: "25px",

          right: "25px",

          width: "70px",

          height: "70px",

          borderRadius: "50%",

          border: "none",

          background:
            "linear-gradient(135deg,#00ff99,#00c3ff)",

          color: "#000",

          fontSize: "28px",

          fontWeight: "700",

          cursor: "pointer",

          boxShadow:
            "0 0 25px rgba(0,255,180,0.45)",

          zIndex: 999,

        }}

      >

        🤖

      </button>

      {/* ================= AI CHAT PANEL ================= */}

      {chatOpen && (

        <div

          style={{

            position: "fixed",

            bottom: "110px",

            right: "25px",

            width: "360px",

            height: "520px",

            background:
              "rgba(20,20,20,0.92)",

            border:
              "1px solid rgba(255,255,255,0.08)",

            borderRadius: "28px",

            backdropFilter: "blur(18px)",

            display: "flex",

            flexDirection: "column",

            overflow: "hidden",

            zIndex: 999,

            boxShadow:
              "0 0 30px rgba(0,0,0,0.45)",

          }}

        >

          <div

            style={{

              padding: "18px",

              background:
                "linear-gradient(90deg,#00ff99,#00c3ff)",

              color: "#000",

              fontWeight: "700",

              fontSize: "18px",

            }}

          >

            🤖 AI Study Assistant

          </div>

          <div

            style={{

              flex: 1,

              overflowY: "auto",

              padding: "18px",

              display: "flex",

              flexDirection: "column",

              gap: "14px",

            }}

          >

            {messages.map((msg, i) => (

              <div

                key={i}

                style={{

                  alignSelf:

                    msg.sender === "user"

                      ? "flex-end"

                      : "flex-start",

                  background:

                    msg.sender === "user"

                      ? "linear-gradient(135deg,#00ff99,#00c3ff)"

                      : "rgba(255,255,255,0.08)",

                  color:

                    msg.sender === "user"

                      ? "#000"

                      : "#fff",

                  padding: "12px 14px",

                  borderRadius: "18px",

                  maxWidth: "80%",

                  fontSize: "14px",

                  lineHeight: "1.5",

                }}

              >

                {msg.text}

              </div>

            ))}

            {loadingAI && (

              <div

                style={{

                  alignSelf: "flex-start",

                  background:
                    "rgba(255,255,255,0.08)",

                  padding: "12px 14px",

                  borderRadius: "18px",

                  color: "#fff",

                  fontSize: "14px",

                }}

              >

                ✨ AI is thinking...

              </div>

            )}

            <div ref={messagesEndRef} />

          </div>

          <div

            style={{

              padding: "14px",

              display: "flex",

              gap: "10px",

              borderTop:
                "1px solid rgba(255,255,255,0.08)",

            }}

          >

            <input

              value={input}

              onChange={(e) =>
                setInput(e.target.value)
              }

              onKeyDown={handleKeyPress}

              placeholder="Ask AI anything..."

              style={{

                flex: 1,

                padding: "12px",

                borderRadius: "14px",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                background:
                  "rgba(255,255,255,0.06)",

                color: "#fff",

                outline: "none",

              }}

            />

            <button

              onClick={sendMessage}

              disabled={loadingAI}

              style={{

                padding: "12px 16px",

                borderRadius: "14px",

                border: "none",

                background:
                  "linear-gradient(90deg,#00ff99,#00c3ff)",

                color: "#000",

                fontWeight: "700",

                cursor: "pointer",

                opacity:
                  loadingAI ? 0.7 : 1,

              }}

            >

              Send

            </button>

          </div>

        </div>

      )}

    </DashboardLayout>

  );

}