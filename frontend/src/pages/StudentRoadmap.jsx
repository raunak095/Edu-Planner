import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api";

export default function StudentRoadmap() {

  const [subject, setSubject] = useState("");
  const [daysLeft, setDaysLeft] = useState("");
  const [roadmap, setRoadmap] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // ================= LOAD SUBJECT =================
  useEffect(() => {

    const savedSubjects =
      JSON.parse(localStorage.getItem("subjects")) || [];

    if (savedSubjects.length > 0) {
      setSubject(savedSubjects[0].name);
    }

  }, []);

  // ================= LOAD COMPLETED =================
  useEffect(() => {

    const savedCompleted =
      JSON.parse(localStorage.getItem("completed"));

    if (savedCompleted) {
      setCompleted(savedCompleted);
    }

  }, []);

  // ================= SAVE COMPLETED =================
  useEffect(() => {

    localStorage.setItem(
      "completed",
      JSON.stringify(completed)
    );

  }, [completed]);

  // ================= FETCH ROADMAP =================
  useEffect(() => {

    const fetchRoadmap = async () => {

      try {

        const res = await API.get(
          "/roadmap/my-roadmap",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (
          res.data.roadmap &&
          res.data.roadmap.length > 0
        ) {
          setRoadmap(res.data.roadmap[0]);
        }

      } catch (err) {

        if (err.response?.status !== 404) {
          setError(
            "Failed to load your roadmap."
          );
        }

      } finally {
        setFetching(false);
      }

    };

    fetchRoadmap();

  }, [token]);

  // ================= GENERATE ROADMAP =================
  const generateRoadmap = async () => {

    if (!subject.trim()) {
      setError("Please enter a subject.");
      return;
    }

    if (!daysLeft || Number(daysLeft) <= 0) {
      setError("Please enter valid days.");
      return;
    }

    setLoading(true);
    setError("");
    setRoadmap(null);
    setCompleted([]);

    try {

      const res = await API.post(

        "/roadmap/generate-roadmap",

        {
          subject: subject.trim(),
          daysLeft: Number(daysLeft),
          difficulty: "medium",
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

      );

      setRoadmap(res.data.roadmap);

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Failed to generate roadmap."
      );

    } finally {

      setLoading(false);

    }

  };

  // ================= COMPLETE =================
  const toggleComplete = (topicName) => {

    setCompleted((prev) =>

      prev.includes(topicName)

        ? prev.filter((t) => t !== topicName)

        : [...prev, topicName]

    );

  };

  // ================= PROGRESS =================
  const getProgress = () => {

    if (!roadmap) return 0;

    const total = roadmap.plan.reduce(
      (sum, day) => sum + day.topics.length,
      0
    );

    if (total === 0) return 0;

    return Math.round(
      (completed.length / total) * 100
    );

  };

  // ================= LOADING =================
  if (fetching) {

    return (

      <DashboardLayout>

        <div className="dashboard-card">

          <p>Loading roadmap...</p>

        </div>

      </DashboardLayout>

    );

  }

  return (

    <DashboardLayout>

      {/* ================= TITLE ================= */}

      <div
        style={{
          marginBottom: "30px",
        }}
      >

        <h1
          style={{
            fontSize: "36px",
            fontWeight: "800",
            background:
              "linear-gradient(90deg,#00ff99,#00c3ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >

          🗺 AI Study Roadmap

        </h1>

        <p
          style={{
            opacity: 0.7,
            marginTop: "8px",
          }}
        >

          Smart AI-powered personalized study planner

        </p>

      </div>

      {/* ================= GENERATOR ================= */}

      <div
        className="dashboard-card"
        style={{
          background:
            "rgba(255,255,255,0.05)",
          border:
            "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(14px)",
          borderRadius: "24px",
          padding: "28px",
          boxShadow:
            "0 0 30px rgba(0,0,0,0.25)",
        }}
      >

        <h3>
          🤖 Generate Smart Plan
        </h3>

        <input
          className="input"
          placeholder="Enter subject"
          value={subject}
          onChange={(e) =>
            setSubject(e.target.value)
          }
        />

        <input
          className="input"
          type="number"
          placeholder="Days left"
          value={daysLeft}
          onChange={(e) =>
            setDaysLeft(e.target.value)
          }
          style={{
            marginTop: "12px",
          }}
        />

        {error && (

          <p
            style={{
              color: "#ff4d4f",
              marginTop: "12px",
            }}
          >

            {error}

          </p>

        )}

        <button
          className="btn"
          onClick={generateRoadmap}
          disabled={loading}
          style={{
            marginTop: "18px",
            width: "100%",
            borderRadius: "16px",
            padding: "14px",
            border: "none",
            background:
              "linear-gradient(90deg,#00ff99,#00c3ff)",
            color: "#000",
            fontWeight: "700",
            fontSize: "15px",
            cursor: "pointer",
          }}
        >

          {loading
            ? "Generating AI Plan..."
            : "Generate AI Roadmap"}

        </button>

      </div>

      {/* ================= PROGRESS ================= */}

      {roadmap && (

        <div
          className="dashboard-card"
          style={{
            marginTop: "24px",
            borderRadius: "24px",
            background:
              "rgba(255,255,255,0.05)",
            backdropFilter: "blur(14px)",
          }}
        >

          <h3>
            📊 Progress
          </h3>

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
                width: `${getProgress()}%`,
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
              fontWeight: "600",
            }}
          >

            {getProgress()}% Completed

          </p>

        </div>

      )}

      {/* ================= AI INSIGHTS ================= */}

      {roadmap && (

        <div
          className="dashboard-card"
          style={{
            marginTop: "24px",
            borderRadius: "24px",
            background:
              "linear-gradient(135deg, rgba(0,255,170,0.08), rgba(0,195,255,0.08))",
            border:
              "1px solid rgba(0,255,180,0.15)",
            backdropFilter: "blur(14px)",
          }}
        >

          <h3>
            🤖 AI Insights
          </h3>

          <div
            style={{
              marginTop: "15px",
              lineHeight: "1.9",
            }}
          >

            <p>
              📌 Prioritize difficult topics early.
            </p>

            <p>
              🔥 You're currently {getProgress()}% on track.
            </p>

            <p>
              🚀 Daily consistency improves retention.
            </p>

            <p>
              ⏳ Break study sessions into focused intervals.
            </p>

          </div>

        </div>

      )}

      {/* ================= EMPTY STATE ================= */}

      {!roadmap && (

        <div
          className="dashboard-card"
          style={{
            marginTop: "24px",
            textAlign: "center",
            opacity: 0.7,
          }}
        >

          No roadmap generated yet.

        </div>

      )}

      {/* ================= PLAN ================= */}

      {roadmap &&
        roadmap.plan.map((dayEntry) => (

          <div
            className="dashboard-card"
            key={dayEntry.day}
            style={{
              marginTop: "24px",
              borderRadius: "24px",
              background:
                "rgba(255,255,255,0.05)",
              backdropFilter: "blur(14px)",
            }}
          >

            <h3>

              📅 Day {dayEntry.day}

            </h3>

            {dayEntry.topics.length === 0 ? (

              <p
                style={{
                  opacity: 0.6,
                }}
              >

                No topics scheduled.

              </p>

            ) : (

              dayEntry.topics.map((topic, i) => (

                <div

                  key={i}

                  style={{

                    display: "flex",

                    alignItems: "center",

                    justifyContent:
                      "space-between",

                    gap: "10px",

                    marginTop: "14px",

                    padding: "16px",

                    borderRadius: "18px",

                    background:

                      completed.includes(
                        topic.name
                      )

                        ? "linear-gradient(135deg, rgba(0,255,150,0.15), rgba(0,255,255,0.08))"

                        : "rgba(255,255,255,0.06)",

                    border:

                      completed.includes(
                        topic.name
                      )

                        ? "1px solid rgba(0,255,150,0.4)"

                        : "1px solid rgba(255,255,255,0.08)",

                    backdropFilter:
                      "blur(14px)",

                    transition:
                      "all 0.35s ease",

                    cursor: "pointer",

                    boxShadow:

                      completed.includes(
                        topic.name
                      )

                        ? "0 0 18px rgba(0,255,150,0.2)"

                        : "0 0 12px rgba(0,0,0,0.18)",

                  }}

                  onMouseEnter={(e) => {

                    e.currentTarget.style.transform =
                      "translateY(-3px) scale(1.01)";

                  }}

                  onMouseLeave={(e) => {

                    e.currentTarget.style.transform =
                      "translateY(0px) scale(1)";

                  }}

                >

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >

                    <input
                      type="checkbox"
                      checked={completed.includes(topic.name)}
                      onChange={() =>
                        toggleComplete(topic.name)
                      }
                    />

                    <span
                      style={{

                        textDecoration:

                          completed.includes(topic.name)

                            ? "line-through"

                            : "none",

                        fontWeight: "600",

                        color:

                          completed.includes(topic.name)

                            ? "#00ff99"

                            : "#fff",

                      }}
                    >

                      {topic.name}

                    </span>

                  </div>

                  <span
                    style={{
                      opacity: 0.7,
                      fontSize: "13px",
                    }}
                  >

                    ⏱ {topic.estimatedHours}h

                  </span>

                </div>

              ))

            )}

          </div>

        ))}

    </DashboardLayout>

  );

}