require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");


const app = express();

const roadmapRoutes = require("./routes/roadmapRoutes");

// ================= MIDDLEWARE =================
app.use(cors()); // 🔥 allow frontend connection
app.use(express.json());
app.use("/api/roadmap", roadmapRoutes);

// ================= DATABASE CONNECTION =================
connectDB();

// ================= ROUTES =================
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// ================= TEST ROUTE =================
app.get("/test", (req, res) => {
    res.send("Backend + MongoDB running 🚀");
});

// ================= SERVER START =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});