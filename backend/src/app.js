import "./bootstrap.js";

import express from "express";
import cors from "cors";
import path from "path";

import { createServer } from "http";

import { Server } from "socket.io";

import connectDB from "./config/db.js";

import roadmapRoutes from "./routes/roadmapRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import teacherRoutes from "./routes/teacherRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import topicRoutes from "./routes/topicRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";

const app = express();

// ================= SERVER =================

const httpServer = createServer(app);

// ================= SOCKET =================

const io = new Server(httpServer, {

  cors: {

    origin: "*",

    methods: ["GET", "POST"],

  },

});

// ================= ONLINE USERS =================

// store like:
// {
//   socketId: userId
// }

const onlineUsers = {};

// ================= SOCKET CONNECTION =================

io.on("connection", (socket) => {

  console.log(
    "🟢 User Connected:",
    socket.id
  );

  // ================= USER ONLINE =================

  socket.on("user-online", (userId) => {

    onlineUsers[socket.id] = userId;

    console.log(
      "✅ Online Users:",
      Object.values(onlineUsers)
    );

    io.emit(
      "online-users",
      Object.values(onlineUsers)
    );

  });

  // ================= SEND MESSAGE =================

  socket.on("send-message", (data) => {

    console.log(
      "📩 Message:",
      data
    );

    io.emit("receive-message", {

      ...data,

      createdAt: new Date(),

    });

  });

  // ================= TYPING =================

  socket.on("typing", (data) => {

    socket.broadcast.emit(
      "typing",
      data
    );

  });

  // ================= DISCONNECT =================

  socket.on("disconnect", () => {

    console.log(
      "🔴 User Disconnected:",
      socket.id
    );

    delete onlineUsers[socket.id];

    io.emit(
      "online-users",
      Object.values(onlineUsers)
    );

  });

});

// ================= MIDDLEWARE =================

app.use(cors());

app.use(express.json());

app.use(

  "/uploads",

  express.static(
    path.join(process.cwd(), "uploads")
  )

);

// ================= ROUTES =================

app.use("/api/roadmap", roadmapRoutes);

app.use("/api/topics", topicRoutes);

app.use("/api", resourceRoutes);

app.use("/api/files", fileRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/teacher", teacherRoutes);

app.use("/api/courses", courseRoutes);

app.use("/api/notes", noteRoutes);

app.use(
  "/api/announcements",
  announcementRoutes
);

app.use(
  "/api/students",
  studentRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

// ================= TEST =================

app.get("/test", (req, res) => {

  res.send("Backend + MongoDB running 🚀");

});

// ================= DB =================

connectDB();

// ================= START =================

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {

  console.log(
    `🚀 Server running on port ${PORT}`
  );

});