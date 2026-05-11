import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import "../styles/auth.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function StudentDashboard() {

  const navigate = useNavigate();

  // ================= AUTH =================
  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }

  }, [navigate]);

  // ================= STATS =================
  const [stats, setStats] = useState({
    subjects: 0,
    completed: 0,
    progress: 0,
  });

  // ================= AI CHAT =================
  const [chatOpen, setChatOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text:
        "Hello 👋 I am your AI Study Assistant. Ask me anything about studying, productivity, or your roadmap.",
    },
  ]);

  const [input, setInput] = useState("");

  // ================= LOAD DATA =================
  useEffect(() => {

    const loadData = () => {

      const saved =
        JSON.parse(localStorage.getItem("subjects")) || [];

      const total = saved.length;

      const done =
        saved.filter((s) => s.completed).length;

      setStats({
        subjects: total,
        completed: done,
        progress: total
          ? Math.round((done / total) * 100)
          : 0,
      });

    };

    loadData();

    window.addEventListener("focus", loadData);

    return () => {
      window.removeEventListener("focus", loadData);
    };

  }, []);

  // ================= SEND MESSAGE =================
  const sendMessage = () => {

    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Fake AI response for now
    setTimeout(() => {

      const aiReply = {
        sender: "ai",
        text:
          "🤖 AI Assistant: I received your message — backend AI integration coming next.",
      };

      setMessages((prev) => [...prev, aiReply]);

    }, 1000);

    setInput("");

  };

  // ================= CHART DATA =================
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

          <h3>✅ Completed</h3>

          <p
            style={{
              fontSize: "34px",
              fontWeight: "700",
            }}
          >

            {stats.completed}

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

      {/* ================= ANNOUNCEMENTS ================= */}

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

          {/* HEADER */}

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

          {/* MESSAGES */}

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

          </div>

          {/* INPUT */}

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

              style={{

                padding: "12px 16px",

                borderRadius: "14px",

                border: "none",

                background:
                  "linear-gradient(90deg,#00ff99,#00c3ff)",

                color: "#000",

                fontWeight: "700",

                cursor: "pointer",

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