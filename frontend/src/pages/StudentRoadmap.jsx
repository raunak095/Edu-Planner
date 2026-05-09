import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api";

export default function StudentRoadmap() {
  const [subject, setSubject] = useState("");
  const [daysLeft, setDaysLeft] = useState("");
  const [roadmap, setRoadmap] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-load subject from Subjects page
  useEffect(() => {
    const savedSubjects = JSON.parse(localStorage.getItem("subjects")) || [];
    if (savedSubjects.length > 0) {
      setSubject(savedSubjects[0].name);
    }
  }, []);

  // Load completed topics from localStorage
  useEffect(() => {
    const savedCompleted = JSON.parse(localStorage.getItem("completed"));
    if (savedCompleted) setCompleted(savedCompleted);
  }, []);

  // Persist completed state
  useEffect(() => {
    localStorage.setItem("completed", JSON.stringify(completed));
  }, [completed]);

  const generateRoadmap = async () => {
    if (!subject.trim()) {
      setError("Please enter a subject.");
      return;
    }
    if (!daysLeft || Number(daysLeft) <= 0) {
      setError("Please enter a valid number of days.");
      return;
    }

    setError("");
    setLoading(true);
    setRoadmap(null);
    setCompleted([]);

    try {
      const token = localStorage.getItem("token");

      const res = await API.post(
        "/roadmap/generate-roadmap",
        {
          subject: subject.trim(),
          daysLeft: Number(daysLeft),
          difficulty: "medium", // hardcoded for now
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRoadmap(res.data.roadmap);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate roadmap.");
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = (topicName) => {
    setCompleted((prev) =>
      prev.includes(topicName)
        ? prev.filter((t) => t !== topicName)
        : [...prev, topicName]
    );
  };

  const getProgress = () => {
    if (!roadmap) return 0;
    const total = roadmap.plan.reduce(
      (sum, day) => sum + day.topics.length,
      0
    );
    if (total === 0) return 0;
    return Math.round((completed.length / total) * 100);
  };

  return (
    <DashboardLayout>
      <h1>🗺 AI Study Roadmap</h1>

      {/* INPUT FORM */}
      <div className="dashboard-card">
        <h3>🤖 Generate Roadmap</h3>

        <input
          className="input"
          placeholder="Enter subject (e.g. DBMS)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <input
          className="input"
          type="number"
          placeholder="Days left to study (e.g. 7)"
          value={daysLeft}
          onChange={(e) => setDaysLeft(e.target.value)}
          style={{ marginTop: "10px" }}
        />

        {error && (
          <p style={{ color: "red", marginTop: "8px", fontSize: "14px" }}>
            {error}
          </p>
        )}

        <button
          className="btn"
          onClick={generateRoadmap}
          disabled={loading}
          style={{ marginTop: "10px" }}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {/* PROGRESS */}
      {roadmap && (
        <div className="dashboard-card">
          <h3>📊 Progress</h3>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${getProgress()}%` }}
            />
          </div>
          <p style={{ marginTop: "8px" }}>{getProgress()}% Completed</p>
        </div>
      )}

      {/* DAY-WISE PLAN */}
      {roadmap &&
        roadmap.plan.map((dayEntry) => (
          <div className="dashboard-card" key={dayEntry.day}>
            <h3>📅 Day {dayEntry.day}</h3>

            {dayEntry.topics.length === 0 ? (
              <p style={{ opacity: 0.6 }}>No topics scheduled.</p>
            ) : (
              dayEntry.topics.map((topic, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginTop: "8px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={completed.includes(topic.name)}
                    onChange={() => toggleComplete(topic.name)}
                  />
                  <span
                    style={{
                      textDecoration: completed.includes(topic.name)
                        ? "line-through"
                        : "none",
                    }}
                  >
                    {topic.name}
                  </span>
                  <span style={{ opacity: 0.6, fontSize: "13px" }}>
                    ({topic.estimatedHours}h)
                  </span>
                </div>
              ))
            )}
          </div>
        ))}
    </DashboardLayout>
  );
}