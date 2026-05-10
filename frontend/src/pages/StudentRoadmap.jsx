import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

export default function StudentRoadmap() {
  const [subject, setSubject] = useState("");
  const [roadmap, setRoadmap] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(false);

  // Auto-load subject
  useEffect(() => {
    const savedSubjects =
      JSON.parse(localStorage.getItem("subjects")) || [];

    if (savedSubjects.length > 0) {
      setSubject(savedSubjects[0].name);
    }
  }, []);

  // Load saved roadmap
  useEffect(() => {
    const savedRoadmap =
      JSON.parse(localStorage.getItem("aiRoadmap")) || [];

    const savedCompleted =
      JSON.parse(localStorage.getItem("completed")) || [];

    setRoadmap(savedRoadmap);
    setCompleted(savedCompleted);
  }, []);

  // Save roadmap
  useEffect(() => {
    localStorage.setItem(
      "aiRoadmap",
      JSON.stringify(roadmap)
    );

    localStorage.setItem(
      "completed",
      JSON.stringify(completed)
    );
  }, [roadmap, completed]);

  // Generate AI roadmap
  const generateRoadmap = async () => {
    if (!subject.trim()) return;

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/ai/generate-roadmap",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic: subject,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setRoadmap(data.steps);
        setCompleted([]);
      }

    } catch (error) {
      console.log(error);
      alert("Failed to generate roadmap");
    } finally {
      setLoading(false);
    }
  };

  // Toggle completion
  const toggleComplete = (title) => {
    setCompleted((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  // Progress
  const getProgress = () => {
    if (!roadmap.length) return 0;

    return Math.round(
      (completed.length / roadmap.length) * 100
    );
  };

  return (
    <DashboardLayout>
      <div
        style={{
          padding: "20px",
        }}
      >
        <h1
          style={{
            fontSize: "40px",
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          🗺 AI Study Roadmap
        </h1>

        {/* INPUT SECTION */}
        <div className="dashboard-card">
          <h2>🤖 Generate AI Roadmap</h2>

          <input
            className="input"
            placeholder="Enter topic (e.g. Machine Learning)"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <button
            className="btn"
            onClick={generateRoadmap}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {/* PROGRESS */}
        {roadmap.length > 0 && (
          <div className="dashboard-card">
            <h2>📊 Progress Tracker</h2>

            <div
              style={{
                width: "100%",
                height: "20px",
                background: "#ddd",
                borderRadius: "10px",
                overflow: "hidden",
                marginTop: "10px",
              }}
            >
              <div
                style={{
                  width: `${getProgress()}%`,
                  height: "100%",
                  background:
                    "linear-gradient(90deg,#00ff87,#60efff)",
                  transition: "0.4s",
                }}
              />
            </div>

            <p
              style={{
                marginTop: "10px",
                fontWeight: "bold",
              }}
            >
              {getProgress()}% Completed
            </p>
          </div>
        )}

        {/* ROADMAP CARDS */}
        <div
          style={{
            display: "grid",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {roadmap.map((item, index) => (
            <div
              key={index}
              className="dashboard-card"
              style={{
                borderLeft:
                  item.priority === "High"
                    ? "6px solid red"
                    : item.priority === "Medium"
                    ? "6px solid orange"
                    : "6px solid green",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2>{item.title}</h2>

                <input
                  type="checkbox"
                  checked={completed.includes(item.title)}
                  onChange={() =>
                    toggleComplete(item.title)
                  }
                />
              </div>

              <p>
                <strong>Level:</strong> {item.level}
              </p>

              <p>
                <strong>Duration:</strong> {item.duration}
              </p>

              <p>
                <strong>Priority:</strong> {item.priority}
              </p>

              <p
                style={{
                  marginTop: "10px",
                  lineHeight: "1.6",
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}