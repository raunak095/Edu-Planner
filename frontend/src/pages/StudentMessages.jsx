import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import io from "socket.io-client";

const socket = io("https://edu-planner-backrnd.onrender.com",
    {
        transports: ["websocket"],
});

export default function StudentMessages() {

  const user =
    JSON.parse(localStorage.getItem("user"));

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [typing, setTyping] =
    useState("");

  // ================= SOCKET CONNECT =================

  useEffect(() => {

    if (user?._id) {

      socket.emit(
        "user-online",
        user._id
      );

    }

  }, []);

  // ================= RECEIVE MESSAGE =================

  useEffect(() => {

    socket.on(
      "receive-message",
      (data) => {

        setMessages((prev) => [
          ...prev,
          data,
        ]);

      }
    );

    socket.on("typing", (data) => {

      setTyping(data);

      setTimeout(() => {

        setTyping("");

      }, 2000);

    });

    return () => {

      socket.off("receive-message");

      socket.off("typing");

    };

  }, []);

  // ================= SEND MESSAGE =================

  const sendMessage = () => {

    if (!message.trim()) return;

    const msgData = {

      sender:
        user?.name || "Student",

      text: message,

    };

    socket.emit(
      "send-message",
      msgData
    );

    setMessage("");

  };

  // ================= TYPING =================

  const handleTyping = (e) => {

    setMessage(e.target.value);

    socket.emit(
      "typing",
      `${user?.name} is typing...`
    );

  };

  return (

    <DashboardLayout role="student">

      <div
        className="card"
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          borderRadius: "24px",
        }}
      >

        <h2>
          💬 Student Live Chat
        </h2>

        <div
          style={{
            height: "500px",
            overflowY: "auto",
            marginTop: "20px",
            padding: "20px",
            background:
              "rgba(255,255,255,0.03)",
            borderRadius: "18px",
          }}
        >

          {messages.map((msg, i) => (

            <div
              key={i}
              style={{
                marginBottom: "16px",
              }}
            >

              <b>
                {msg.sender}
              </b>

              <p>
                {msg.text}
              </p>

            </div>

          ))}

          {typing && (

            <p
              style={{
                opacity: 0.6,
              }}
            >

              {typing}

            </p>

          )}

        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "20px",
          }}
        >

          <input
            value={message}
            onChange={handleTyping}
            placeholder="Type message..."
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: "14px",
              border: "none",
              outline: "none",
            }}
          />

          <button
            onClick={sendMessage}
            style={{
              padding: "14px 20px",
              borderRadius: "14px",
              border: "none",
              cursor: "pointer",
              fontWeight: "700",
              background:
                "linear-gradient(90deg,#00ff99,#00c3ff)",
            }}
          >

            Send

          </button>

        </div>

      </div>

    </DashboardLayout>

  );

}