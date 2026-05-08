import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios"; // ✅ ADDED
import "../styles/auth.css";

export default function Signup() {
  const navigate = useNavigate();
  const role = new URLSearchParams(useLocation().search).get("role");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOTP = async () => {
    console.log("FORM DATA:", form);

    // Prevent empty request
    if (!form.name || !form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      // ✅ DIRECT API CALL (FINAL FIX)
      const res = await axios.post(
        "https://edu-planner-backrnd.onrender.com/api/auth/register",
        {
          name: form.name,
          email: form.email,
          password: form.password,
          role
        }
      );

      alert(res.data.message);

      navigate("/otp", { state: { email: form.email } });

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error sending OTP");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container fade">
        <div className="form-box">
          <h2>{role?.toUpperCase()} SIGNUP</h2>

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

          <button className="btn" onClick={sendOTP}>
            Send OTP
          </button>

          <p className="link" onClick={() => navigate(`/login?role=${role}`)}>
            Already have account? Login
          </p>
        </div>
      </div>
    </>
  );
}