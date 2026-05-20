import { useEffect, useState } from "react";

import DarkModeToggle from "./DarkModeToggle";

import API from "../api";

import { io } from "socket.io-client";

// ================= SOCKET =================

const socket = io(
  "https://edu-planner-backrnd.onrender.com",
  {
    transports: ["websocket"],
  }
);

export default function Navbar() {

  const [notifications, setNotifications] =
    useState([]);

  const [open, setOpen] =
    useState(false);

  // ================= USER =================

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // ================= LOAD NOTIFICATIONS =================

  useEffect(() => {

    if (!user?._id) return;

    loadNotifications();

    // ================= REALTIME NOTIFICATIONS =================

    socket.on(
      "new-notification",
      (notification) => {

        setNotifications((prev) => [

          notification,

          ...prev,

        ]);

      }
    );

    return () => {

      socket.off(
        "new-notification"
      );

    };

  }, []);

  // ================= FETCH NOTIFICATIONS =================

  const loadNotifications = async () => {

    try {

      const res = await API.get(
        `/notifications/${user._id}`
      );

      setNotifications(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  // ================= UNREAD COUNT =================

  const unreadCount =
    notifications.filter(
      (n) => !n.read
    ).length;

  // ================= MARK AS READ =================

  const markAsRead = async (id) => {

    try {

      await API.put(
        `/notifications/${id}/read`
      );

      loadNotifications();

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="navbar">

      {/* ================= LOGO ================= */}

      <h2 className="logo">

        EduPlanner

      </h2>

      {/* ================= RIGHT ================= */}

      <div
        className="nav-right"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
        }}
      >

        {/* ================= NOTIFICATION BELL ================= */}

        <div
          style={{
            position: "relative",
          }}
        >

          <button
            onClick={() =>
              setOpen(!open)
            }
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              fontSize: "22px",
              background:
                "rgba(255,255,255,0.08)",
              color: "#fff",
              position: "relative",
              transition: "0.3s ease",
            }}
          >

            🔔

            {unreadCount > 0 && (

              <span
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
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
                  padding: "2px",
                  boxShadow:
                    "0 0 12px rgba(255,70,70,0.5)",
                }}
              >

                {unreadCount}

              </span>

            )}

          </button>

          {/* ================= DROPDOWN ================= */}

          {open && (

            <div
              style={{
                position: "absolute",
                right: "0",
                top: "62px",
                width: "360px",
                maxHeight: "420px",
                overflowY: "auto",
                background:
                  "rgba(20,20,20,0.95)",
                border:
                  "1px solid rgba(255,255,255,0.08)",
                borderRadius: "24px",
                backdropFilter: "blur(18px)",
                padding: "18px",
                zIndex: 999,
                boxShadow:
                  "0 0 25px rgba(0,0,0,0.45)",
              }}
            >

              <h3
                style={{
                  marginBottom: "16px",
                }}
              >

                🔔 Notifications

              </h3>

              {notifications.length === 0 ? (

                <p
                  style={{
                    opacity: 0.7,
                  }}
                >

                  No notifications yet

                </p>

              ) : (

                notifications.map((n) => (

                  <div
                    key={n._id}
                    onClick={() =>
                      markAsRead(n._id)
                    }
                    style={{
                      padding: "14px",
                      marginBottom: "12px",
                      borderRadius: "16px",
                      background: n.read

                        ? "rgba(255,255,255,0.05)"

                        : "linear-gradient(135deg, rgba(0,255,170,0.12), rgba(0,195,255,0.12))",

                      cursor: "pointer",

                      transition: "0.3s ease",
                    }}
                  >

                    <h4
                      style={{
                        marginBottom: "6px",
                      }}
                    >

                      {n.title}

                    </h4>

                    <p
                      style={{
                        opacity: 0.8,
                        fontSize: "14px",
                        lineHeight: "1.5",
                      }}
                    >

                      {n.message}

                    </p>

                  </div>

                ))

              )}

            </div>

          )}

        </div>

        {/* ================= DARK MODE ================= */}

        <DarkModeToggle />

      </div>

    </div>

  );

}