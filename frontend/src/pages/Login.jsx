import { useState } from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import Navbar from "../components/Navbar";

import API from "../api";

import "../styles/auth.css";

export default function Login() {

  const navigate = useNavigate();

  const location = useLocation();

  const role =
    new URLSearchParams(
      location.search
    ).get("role");

  // ================= FORM STATE =================

  const [form, setForm] = useState({

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

  // ================= LOGIN =================

  const handleLogin = async () => {

    // ================= VALIDATION =================

    if (
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
        "/auth/login",
        form
      );

      // ================= SUCCESS =================

      alert(res.data.message);

      // ================= STORE TOKEN =================

      localStorage.setItem(
        "token",
        res.data.token
      );

      // ================= STORE USER =================

      localStorage.setItem(
        "user",
        JSON.stringify(
          res.data.user
        )
      );

      // ================= STORE ROLE =================

      localStorage.setItem(
        "role",
        res.data.user.role
      );

      // ================= ROLE REDIRECT =================

      const userRole =
        res.data.user.role;

      switch (userRole) {

        case "student":

          navigate(
            "/student/dashboard"
          );

          break;

        case "teacher":

          navigate(
            "/teacher/dashboard"
          );

          break;

        case "admin":

          navigate(
            "/admin/dashboard"
          );

          break;

        default:

          navigate("/");

      }

    } catch (error) {

      console.error(
        "LOGIN ERROR:",
        error
      );

      alert(

        error.response?.data?.message ||

        "Login failed"

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
            {role?.toUpperCase()} LOGIN
          </h2>

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
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          {/* ================= LOGIN BUTTON ================= */}

          <button
            className="btn"
            onClick={handleLogin}
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>

          {/* ================= SIGNUP LINK ================= */}

          <p
            className="link"
            onClick={() =>
              navigate(
                `/signup?role=${role}`
              )
            }
          >

            Not registered?
            Sign up

          </p>

        </div>

      </div>
    </>
  );

}