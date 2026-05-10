import express from "express";

import {
    registerUser,
    loginUser,
    verifyOTP
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ================= AUTH ROUTES =================
router.post("/register", registerUser);
router.post("/login", loginUser);

// 🔥 OTP ROUTE
router.post("/verify-otp", verifyOTP);

// ================= PROTECTED ROUTE =================
router.get("/profile", protect, (req, res) => {
    res.json({
        message: "You accessed protected route",
        user: req.user
    });
});

export default router;