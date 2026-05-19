import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import API from "../api";

export default function StudentSettings() {

  // ================= USER =================

  const user =
    JSON.parse(localStorage.getItem("user"));

  // ================= STATES =================

  const [focusDuration, setFocusDuration] =
    useState(25);

  const [dailyGoal, setDailyGoal] =
    useState(4);

  const [musicAutoplay, setMusicAutoplay] =
    useState(true);

  const [notifications, setNotifications] =
    useState(true);

  const [aiMode, setAiMode] =
    useState("Balanced");

  const [loading, setLoading] =
    useState(false);

  // ================= LOAD SETTINGS =================

  useEffect(() => {

    const fetchSettings = async () => {

      try {

        const res = await API.get(

          `/students/settings/${user._id}`

        );

        const settings = res.data;

        setFocusDuration(
          settings.focusDuration
        );

        setDailyGoal(
          settings.dailyGoal
        );

        setMusicAutoplay(
          settings.musicAutoplay
        );

        setNotifications(
          settings.notifications
        );

        setAiMode(settings.aiMode);

      } catch (error) {

        console.error(
          "Failed to load settings",
          error
        );

      }

    };

    if (user?._id) {

      fetchSettings();

    }

  }, []);

  // ================= SAVE SETTINGS =================

  const saveSettings = async () => {

    try {

      setLoading(true);

      await API.put(

        `/students/settings/${user._id}`,

        {

          focusDuration,

          dailyGoal,

          musicAutoplay,

          notifications,

          aiMode,

        }

      );

      alert(
        "✅ Settings saved successfully"
      );

    } catch (error) {

      console.error(
        "Save Settings Error:",
        error
      );

      alert(
        "❌ Failed to save settings"
      );

    } finally {

      setLoading(false);

    }

  };

  // ================= RESET =================

  const resetProgress = () => {

    localStorage.clear();

    alert(
      "⚠ Local progress reset"
    );

    window.location.reload();

  };

  return (

    <DashboardLayout role="student">

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

          ⚙ Student Settings

        </h1>

        <p
          style={{
            opacity: 0.7,
            marginTop: "8px",
          }}
        >

          Personalize your AI learning experience

        </p>

      </div>

      {/* ================= SETTINGS CARD ================= */}

      <div
        className="card"
        style={{
          borderRadius: "24px",
          padding: "30px",
          background:
            "linear-gradient(135deg, rgba(0,255,170,0.08), rgba(0,195,255,0.08))",
        }}
      >

        {/* ================= FOCUS DURATION ================= */}

        <div
          style={{
            marginBottom: "24px",
          }}
        >

          <h3>
            ⏳ Focus Timer Duration
          </h3>

          <select

            value={focusDuration}

            onChange={(e) =>
              setFocusDuration(
                Number(e.target.value)
              )
            }

            style={{

              marginTop: "10px",

              padding: "12px",

              borderRadius: "12px",

              width: "100%",

              background:
                "rgba(255,255,255,0.08)",

              color: "#fff",

              border:
                "1px solid rgba(255,255,255,0.1)",

            }}

          >

            <option value={25}>
              25 Minutes
            </option>

            <option value={45}>
              45 Minutes
            </option>

            <option value={60}>
              60 Minutes
            </option>

          </select>

        </div>

        {/* ================= DAILY GOAL ================= */}

        <div
          style={{
            marginBottom: "24px",
          }}
        >

          <h3>
            🎯 Daily Study Goal
          </h3>

          <input

            type="number"

            value={dailyGoal}

            onChange={(e) =>
              setDailyGoal(
                Number(e.target.value)
              )
            }

            style={{

              marginTop: "10px",

              padding: "12px",

              borderRadius: "12px",

              width: "100%",

              background:
                "rgba(255,255,255,0.08)",

              color: "#fff",

              border:
                "1px solid rgba(255,255,255,0.1)",

            }}

          />

        </div>

        {/* ================= AI MODE ================= */}

        <div
          style={{
            marginBottom: "24px",
          }}
        >

          <h3>
            🤖 AI Assistant Mode
          </h3>

          <select

            value={aiMode}

            onChange={(e) =>
              setAiMode(e.target.value)
            }

            style={{

              marginTop: "10px",

              padding: "12px",

              borderRadius: "12px",

              width: "100%",

              background:
                "rgba(255,255,255,0.08)",

              color: "#fff",

              border:
                "1px solid rgba(255,255,255,0.1)",

            }}

          >

            <option value="Balanced"style={{
    background: "#1e1e2f",
    color: "white",
  }}>
              Balanced
            </option>

            <option value="Strict Coach"style={{
    background: "#1e1e2f",
    color: "white",
  }}>
              Strict Coach
            </option>

            <option value="Friendly Mentor"style={{
    background: "#1e1e2f",
    color: "white",
  }}>
              Friendly Mentor
            </option>

            <option value="Exam Mode"style={{
    background: "#1e1e2f",
    color: "white",
  }}>
              Exam Mode
            </option>

          </select>

        </div>

        {/* ================= TOGGLES ================= */}

        <div
          style={{
            marginBottom: "20px",
            lineHeight: "2.5",
          }}
        >

          <label>

            <input

              type="checkbox"

              checked={musicAutoplay}

              onChange={() =>
                setMusicAutoplay(
                  !musicAutoplay
                )
              }

            />

            {" "}🎵 Music Autoplay

          </label>

          <br />

          <label>

            <input

              type="checkbox"

              checked={notifications}

              onChange={() =>
                setNotifications(
                  !notifications
                )
              }

            />

            {" "}🔔 Notifications

          </label>

        </div>

        {/* ================= BUTTONS ================= */}

        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            marginTop: "30px",
          }}
        >

          <button

            onClick={saveSettings}

            disabled={loading}

            style={{

              padding: "14px 22px",

              borderRadius: "14px",

              border: "none",

              cursor: "pointer",

              fontWeight: "700",

              background:
                "linear-gradient(90deg,#00ff99,#00c3ff)",

              color: "#000",

            }}

          >

            {loading
              ? "Saving..."
              : "💾 Save Settings"}

          </button>

          <button

            onClick={resetProgress}

            style={{

              padding: "14px 22px",

              borderRadius: "14px",

              border: "none",

              cursor: "pointer",

              fontWeight: "700",

              background:
                "linear-gradient(90deg,#ff4b2b,#ff416c)",

              color: "#fff",

            }}

          >

            ⚠ Reset Progress

          </button>

        </div>

      </div>

    </DashboardLayout>

  );

}