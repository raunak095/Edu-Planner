import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import { io } from "socket.io-client";

import API from "../api";

// ================= SOCKET =================

const socket = io(
  import.meta.env.VITE_API_URL
);

export default function DashboardLayout({

  children,
  role,

}) {

  // ================= STATES =================

  const [onlineUsers, setOnlineUsers] =
    useState([]);

  const [notifications, setNotifications] =
    useState([]);

  // ================= USER =================

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // ================= SOCKET CONNECTION =================

  useEffect(() => {

    if (user?._id) {

      socket.emit(
        "user-online",
        user._id
      );

    }

    // ================= ONLINE USERS =================

    socket.on(
      "online-users",
      (users) => {

        setOnlineUsers(users);

      }
    );

    // ================= LIVE MESSAGES =================

    socket.on(
      "receive-message",
      (message) => {

        setNotifications((prev) => [

          {

            text:
              `💬 New message from ${message.senderName}`,

            time: new Date(),

          },

          ...prev,

        ]);

      }
    );

    return () => {

      socket.off("online-users");

      socket.off("receive-message");

    };

  }, []);

  return (

    <>
      <Navbar />

      {/* ================= SIDEBAR ================= */}

      <Sidebar role={role} />

      {/* ================= MAIN CONTENT ================= */}

      <div className="main-content">

        {/* ================= TOP REALTIME BAR ================= */}

        <div

          style={{

            marginBottom: "24px",

            display: "flex",

            justifyContent: "space-between",

            alignItems: "center",

            gap: "20px",

            flexWrap: "wrap",

          }}

        >

          {/* ================= ONLINE USERS ================= */}

          <div

            style={{

              padding: "14px 18px",

              borderRadius: "18px",

              background:
                "rgba(0,255,170,0.08)",

              border:
                "1px solid rgba(0,255,170,0.15)",

              backdropFilter: "blur(14px)",

              display: "flex",

              alignItems: "center",

              gap: "10px",

              color: "#fff",

              fontWeight: "600",

            }}

          >

            🟢 Online Users:
            {" "}
            {onlineUsers.length}

          </div>

          {/* ================= NOTIFICATIONS ================= */}

          <div

            style={{

              padding: "14px 18px",

              borderRadius: "18px",

              background:
                "rgba(0,195,255,0.08)",

              border:
                "1px solid rgba(0,195,255,0.15)",

              backdropFilter: "blur(14px)",

              color: "#fff",

              minWidth: "280px",

            }}

          >

            <div
              style={{
                fontWeight: "700",
                marginBottom: "8px",
              }}
            >

              🔔 Live Notifications

            </div>

            {notifications.length === 0 ? (

              <p
                style={{
                  opacity: 0.7,
                  fontSize: "14px",
                }}
              >

                No new notifications

              </p>

            ) : (

              notifications
                .slice(0, 3)
                .map((note, i) => (

                  <div
                    key={i}
                    style={{
                      marginBottom: "8px",
                      fontSize: "14px",
                      lineHeight: "1.5",
                    }}
                  >

                    {note.text}

                  </div>

                ))

            )}

          </div>

        </div>

        {/* ================= PAGE CONTENT ================= */}

        {children}

      </div>

    </>
  );

}