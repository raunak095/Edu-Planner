const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

require("dotenv").config();

// ================= EMAIL TRANSPORT (FIXED) =================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // MUST be Gmail App Password
  },
});

// Verify transporter on startup (important for debugging)
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter error:", error);
  } else {
    console.log("✅ Email transporter ready");
  }
});

// ================= OTP GENERATOR =================
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ================= SEND EMAIL =================
const sendOTPEmail = async (email, otp) => {
  try {
    console.log("📨 Sending OTP to:", email);

    const info = await transporter.sendMail({
      from: `"OTP Verification" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is: ${otp}`,
    });

    console.log("✅ OTP EMAIL SENT:", info.response);
  } catch (error) {
    console.error("❌ EMAIL SEND FAILED:", error);
    throw error;
  }
};

// ================= REGISTER =================
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOTP();
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      otp,
      otpExpiry,
      isVerified: true,
    });

    console.log("👤 User created, sending OTP...");

    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      console.log("❌ Email failed, deleting user...");

      await User.deleteOne({ email });

      return res.status(500).json({
        message: "Failed to send OTP email. Try again.",
      });
    }

    return res.status(201).json({
      message: "OTP sent successfully. Please verify your email.",
      email: user.email,
    });

  } catch (error) {
    console.error("❌ REGISTER ERROR:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ================= VERIFY OTP =================
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    return res.json({ message: "Account verified successfully" });

  } catch (error) {
    console.error("❌ VERIFY ERROR:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ================= LOGIN =================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify OTP first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("❌ LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyOTP,
};