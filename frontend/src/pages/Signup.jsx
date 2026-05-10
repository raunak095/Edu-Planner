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

  const [form, setForm] = useState({

    name: "",
    email: "",
    password: ""

  });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,

    });

  };

  // ================= SEND OTP =================

  const sendOTP = async () => {

    if (
      !form.name ||
      !form.email ||
      !form.password
    ) {

      alert("Please fill all fields");

      return;

    }

    try {

      setLoading(true);

      const res = await API.post(
        "/auth/register",
        {

          name: form.name,
          email: form.email,
          password: form.password,
          role,

        }
      );

      // ✅ SHOW OTP DIRECTLY
      alert(`Your OTP is: ${res.data.otp}`);

      navigate("/otp", {

        state: {
          email: form.email,
        },

      });

    } catch (error) {

      console.error(error);

      alert(

        error.response?.data?.message ||

        "Error sending OTP"

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
            {role?.toUpperCase()} SIGNUP
          </h2>

          <input
            className="input"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            className="input"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            className="input"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          <button
            className="btn"
            onClick={sendOTP}
            disabled={loading}
          >

            {loading
              ? "Sending OTP..."
              : "Send OTP"}

          </button>

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