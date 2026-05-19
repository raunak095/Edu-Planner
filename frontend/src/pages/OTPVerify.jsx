import { useState } from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import Navbar from "../components/Navbar";

import API from "../api";

import "../styles/auth.css";

export default function OTPVerify() {

  const navigate = useNavigate();

  const location = useLocation();

  // ================= EMAIL =================

  const email =
    location.state?.email || "";

  // ================= STATES =================

  const [otp, setOtp] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // ================= VERIFY OTP =================

  const verifyOTP = async () => {

    // ================= VALIDATION =================

    if (!otp) {

      alert(
        "Please enter OTP"
      );

      return;

    }

    try {

      setLoading(true);

      // ================= API CALL =================

      const res = await API.post(

        "/auth/verify-otp",

        {
          email,
          otp,
        }

      );

      // ================= SUCCESS =================

      alert(res.data.message);

      // ================= REDIRECT =================

      navigate("/login");

    } catch (error) {

      console.error(
        "OTP VERIFY ERROR:",
        error
      );

      alert(

        error.response?.data?.message ||

        "OTP verification failed"

      );

    } finally {

      setLoading(false);

    }

  };

  // ================= UI =================

  return (

    <>
      <Navbar />

      <div className="container fade">

        <div className="form-box">

          <h2>
            Enter OTP
          </h2>

          <p
            style={{
              marginBottom: "10px",
            }}
          >

            OTP sent to:
            <b> {email}</b>

          </p>

          {/* ================= OTP INPUT ================= */}

          <input
            className="input"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value)
            }
          />

          {/* ================= VERIFY BUTTON ================= */}

          <button
            className="btn"
            onClick={verifyOTP}
            disabled={loading}
          >

            {loading
              ? "Verifying..."
              : "Verify OTP"}

          </button>

        </div>

      </div>
    </>
  );

}