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

const app = express();

const topicRoutes = require("./routes/topicRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const fileRoutes = require("./routes/fileRoutes");

// ================= MIDDLEWARE =================
app.use(cors()); // 🔥 allow frontend connection
app.use(express.json());
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api", resourceRoutes);
app.use("/api/files", fileRoutes);


app.use(express.json());

// 📂 Static Upload Folder
app.use(
  "/uploads",
  express.static("uploads")
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

// ================= ROUTES =================

// 🤖 AI Routes
app.use("/api/ai", aiRoutes);

// 🗺️ Roadmap Routes
app.use("/api/roadmap", roadmapRoutes);

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

// ================= DATABASE CONNECTION =================
connectDB();

// ================= SERVER START =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `🚀 Server running on port ${PORT}`
  );

});