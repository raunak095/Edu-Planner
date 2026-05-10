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

  // 🔐 AUTH CHECK (IMPORTANT)
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // 🔥 Stats state
  const [stats, setStats] = useState({
    subjects: 0,
    completed: 0,
    progress: 0,
  });

  // 🔄 Load local data
  useEffect(() => {
    const loadData = () => {
      const saved = JSON.parse(localStorage.getItem("subjects")) || [];

      const total = saved.length;
      const done = saved.filter((s) => s.completed).length;

      setStats({
        subjects: total,
        completed: done,
        progress: total ? Math.round((done / total) * 100) : 0,
      });
    };

    loadData();

    window.addEventListener("focus", loadData);

    return () => {
      window.removeEventListener("focus", loadData);
    };
  }, []);

  // 📊 Chart Data
  const data = [
    { name: "Mon", study: 2 },
    { name: "Tue", study: 3 },
    { name: "Wed", study: 1 },
    { name: "Thu", study: 4 },
    { name: "Fri", study: 2 },
  ];

  return (
    <DashboardLayout role="student">
      <h1 className="page-title">📊 Student Dashboard</h1>

      {/* ===== STATS ===== */}
      <div className="stats">
        <div className="card">
          <h3>📚 Subjects</h3>
          <p>{stats.subjects}</p>
        </div>

        <div className="card">
          <h3>✅ Completed</h3>
          <p>{stats.completed}</p>
        </div>

        <div className="card">
          <h3>📈 Progress</h3>
          <p>{stats.progress}%</p>
        </div>
      </div>

      {/* ===== CHART ===== */}
      <div className="card">
        <h3>📊 Weekly Study Hours</h3>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="study" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ===== PROGRESS ===== */}
      <div className="card">
        <h3>📈 Course Progress</h3>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${stats.progress}%` }}
          ></div>
        </div>

        <p>{stats.progress}% Completed</p>
      </div>

      {/* ===== ANNOUNCEMENTS ===== */}
      <div className="card">
        <h3>📢 Announcements</h3>
        <p>Exam next week</p>
        <p>New syllabus uploaded</p>
      </div>

      {/* ===== TODAY PLAN ===== */}
      <div className="card">
        <h3>📅 Today's Plan</h3>
        <p>✔ Study DBMS</p>
        <p>✔ Practice DSA</p>
      </div>
    </DashboardLayout>
  );
}