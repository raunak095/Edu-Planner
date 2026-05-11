import "./bootstrap.js";

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import roadmapRoutes from "./routes/roadmapRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// 👨‍🏫 Teacher Routes
import teacherRoutes from "./routes/teacherRoutes.js";

// 📚 Course Routes
import courseRoutes from "./routes/courseRoutes.js";

// 📂 Note Routes
import noteRoutes from "./routes/noteRoutes.js";

// 📢 Announcement Routes
import announcementRoutes from "./routes/announcementRoutes.js";

// 👨‍🎓 Student Routes
import studentRoutes from "./routes/studentRoutes.js";

// 👨‍💼 Admin Routes
import adminRoutes from "./routes/adminRoutes.js";

// ✅ FIXED IMPORTS
import topicRoutes from "./routes/topicRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());

app.use(express.json());

// 📂 Static Upload Folder
app.use(
  "/uploads",
  express.static("uploads")
);

// ================= ROUTES =================

// 🗺️ Roadmap Routes
app.use("/api/roadmap", roadmapRoutes);

// 📚 Topic Routes
app.use("/api/topics", topicRoutes);

// 📦 Resource Routes
app.use("/api", resourceRoutes);

// 📁 File Routes
app.use("/api/files", fileRoutes);

// 🤖 AI Routes
app.use("/api/ai", aiRoutes);

// 🔐 Auth Routes
app.use("/api/auth", authRoutes);

// 👨‍🏫 Teacher Routes
app.use("/api/teacher", teacherRoutes);

// 📚 Course Routes
app.use("/api/courses", courseRoutes);

// 📂 Note Routes
app.use("/api/notes", noteRoutes);

// 📢 Announcement Routes
app.use(
  "/api/announcements",
  announcementRoutes
);

// 👨‍🎓 Student Routes
app.use(
  "/api/students",
  studentRoutes
);

// 👨‍💼 Admin Routes
app.use(
  "/api/admin",
  adminRoutes
);

// ================= TEST ROUTE =================
app.get("/test", (req, res) => {

  res.send("Backend + MongoDB running 🚀");

});

// ================= DEBUG MIDDLEWARE =================
app.use("/api/ai", (req, res, next) => {

  console.log(
    "🔥 AI ROUTE HIT:",
    req.method,
    req.url
  );

  next();

});

// ================= DATABASE CONNECTION =================
connectDB();

// ================= SERVER START =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `🚀 Server running on port ${PORT}`
  );

});