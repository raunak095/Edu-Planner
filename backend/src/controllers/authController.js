import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// ================= EMAIL TRANSPORT =================
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },

  // ✅ FIXED TIMEOUT ISSUES
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

transporter.verify((error, success) => {
  if (error) {
    console.error(
      "❌ Email transporter error:",
      error
    );
  } else {
    console.log(
      "✅ Email transporter ready"
    );
  }
});

// ================= OTP GENERATOR =================
const generateOTP = () => {
  return Math.floor(
    100000 + Math.random() * 900000
  ).toString();
};

// ================= SEND EMAIL =================
const sendOTPEmail = async (
  email,
  otp
) => {

  const info =
    await transporter.sendMail({

      from:
        `"OTP Verification" <${process.env.EMAIL_USER}>`,

      to: email,

      subject: "OTP Verification",

      text: `Your OTP is: ${otp}`,
    });

  console.log(
    "✅ OTP EMAIL SENT:",
    info.response
  );
};

// ================= REGISTER =================
export const registerUser = async (
  req,
  res
) => {

  try {

    const {
      name,
      email,
      password,
      role,
    } = req.body;

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {

      return res.status(400).json({
        message:
          "User already exists",
      });

    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const otp = generateOTP();

    const otpExpiry =
      Date.now() + 5 * 60 * 1000;

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      otp,
      otpExpiry,
      isVerified: false,
    });

    try {

      await sendOTPEmail(
        email,
        otp
      );

    } catch (error) {

      console.error(
        "❌ EMAIL SEND ERROR:",
        error
      );

      await User.deleteOne({
        email,
      });

      return res.status(500).json({
        message:
          "Failed to send OTP email",
      });

    }

    return res.status(201).json({
      message:
        "OTP sent successfully",
      email: user.email,
    });

  } catch (error) {

    console.error(
      "❌ REGISTER ERROR:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });

  }

};

// ================= VERIFY OTP =================
export const verifyOTP = async (
  req,
  res
) => {

  try {

    const { email, otp } =
      req.body;

    const user =
      await User.findOne({
        email,
      });

    if (!user) {

      return res.status(400).json({
        message: "User not found",
      });

    }

    if (
      user.otpExpiry < Date.now()
    ) {

      return res.status(400).json({
        message: "OTP expired",
      });

    }

    if (user.otp !== otp) {

      return res.status(400).json({
        message: "Invalid OTP",
      });

    }

    user.isVerified = true;

    user.otp = null;

    user.otpExpiry = null;

    await user.save();

    return res.json({
      message:
        "Account verified successfully",
    });

  } catch (error) {

    console.error(
      "❌ VERIFY ERROR:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });

  }

};

// ================= LOGIN =================
export const loginUser = async (
  req,
  res
) => {

  try {

    const { email, password } =
      req.body;

    const user =
      await User.findOne({
        email,
      });

    if (!user) {

      return res.status(400).json({
        message: "User not found",
      });

    }

    if (!user.isVerified) {

      return res.status(403).json({
        message:
          "Verify OTP first",
      });

    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {

      return res.status(400).json({
        message:
          "Invalid credentials",
      });

    }

    const token = jwt.sign(

      {
        id: user._id,
        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "1d",
      }

    );

    return res.json({

      message:
        "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },

    });

  } catch (error) {

    console.error(
      "❌ LOGIN ERROR:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });

  }

};