import { useNavigate, useLocation } from "react-router-dom";

import { useState } from "react";

import Navbar from "../components/Navbar";

import API from "../api";

import "../styles/auth.css";

export default function Signup() {

  const navigate = useNavigate();

  const role =
    new URLSearchParams(
      useLocation().search
    ).get("role");

  // ================= FORM STATE =================

  const [form, setForm] = useState({

    name: "",
    email: "",
    password: ""

  });

  const [loading, setLoading] =
    useState(false);

  // ================= HANDLE INPUT =================

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,

    });

  };

  // ================= SEND OTP =================

  const sendOTP = async () => {

    // ================= VALIDATION =================

    if (
      !form.name ||
      !form.email ||
      !form.password
    ) {

      alert(
        "Please fill all fields"
      );

      return;

    }

    try {

      setLoading(true);

      // ================= API CALL =================

      const res = await API.post(

        "/auth/register",

        {

          name: form.name,

          email: form.email,

          password: form.password,

          role,

        }

      );

      // ================= SUCCESS =================

      alert(
        "OTP sent successfully to your email"
      );

      // ================= NAVIGATE OTP PAGE =================

      navigate("/otp", {

        state: {

          email: form.email,

        },

      });

    } catch (error) {

      console.error(
        "SIGNUP ERROR:",
        error
      );

      alert(

        error.response?.data?.message ||

        "Error sending OTP"

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
            {role?.toUpperCase()} SIGNUP
          </h2>

          {/* ================= NAME ================= */}

          <input
            className="input"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />

          {/* ================= EMAIL ================= */}

          <input
            className="input"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          {/* ================= PASSWORD ================= */}

          <input
            className="input"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          {/* ================= BUTTON ================= */}

          <button
            className="btn"
            onClick={sendOTP}
            disabled={loading}
          >

            {loading
              ? "Sending OTP..."
              : "Send OTP"}

          </button>

          {/* ================= LOGIN LINK ================= */}

          <p
            className="link"
            onClick={() =>
              navigate(
                `/login?role=${role}`
              )
            }
          >

            Already have account? Login

          </p>

        </div>

      </div>
    </>
  );

}