import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import { io } from "socket.io-client";

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

    return () => {

      socket.off("online-users");

    };

  }, []);

  return (

    <>

      {/* ================= NAVBAR ================= */}

      <Navbar />

      {/* ================= SIDEBAR ================= */}

      <Sidebar
        role={role}
        onlineUsers={onlineUsers}
      />

      {/* ================= MAIN CONTENT ================= */}

      <div className="main-content">

        {/* ================= TOP BAR ================= */}

        <div

          style={{

            marginBottom: "24px",

            display: "flex",

            justifyContent: "flex-end",

            alignItems: "center",

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

        </div>

        {/* ================= PAGE CONTENT ================= */}

        {children}

      </div>

    </>

  );

}