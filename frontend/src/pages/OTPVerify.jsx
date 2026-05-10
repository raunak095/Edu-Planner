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

  const email =
    location.state?.email || "";

  const [otp, setOtp] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // ================= VERIFY OTP =================

  const verifyOTP = async () => {

    if (!otp) {

      alert("Please enter OTP");

      return;

    }

    try {

      setLoading(true);

      const res = await API.post(
        "/auth/verify-otp",
        {
          email,
          otp,
        }
      );

      alert(res.data.message);

      // ✅ Redirect to Login
      navigate("/login");

    } catch (error) {

      console.error(error);

      alert(

        error.response?.data?.message ||

        "OTP verification failed"

      );

    } finally {

      setLoading(false);

    }

  };

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

          <input
            className="input"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value)
            }
          />

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