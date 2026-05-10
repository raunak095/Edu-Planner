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

  const [form, setForm] = useState({

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

  // ================= LOGIN =================

  const handleLogin = async () => {

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

      const res = await API.post(
        "/auth/login",
        form
      );

      alert(res.data.message);

      // ✅ Store Token
      localStorage.setItem(
        "token",
        res.data.token
      );

      // ✅ Store User
      localStorage.setItem(
        "user",
        JSON.stringify(
          res.data.user
        )
      );

      // ================= ROLE REDIRECT =================

      const userRole =
        res.data.user.role;

      if (
        userRole === "student"
      ) {

        navigate(
          "/student/dashboard"
        );

      }

      else if (
        userRole === "teacher"
      ) {

        navigate(
          "/teacher/dashboard"
        );

      }

      else if (
        userRole === "admin"
      ) {

        navigate(
          "/admin/dashboard"
        );

      }

    } catch (error) {

      console.error(error);

      alert(

        error.response?.data?.message ||

        "Login failed"

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
            {role?.toUpperCase()} LOGIN
          </h2>

          <input
            className="input"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            className="input"
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          <button
            className="btn"
            onClick={handleLogin}
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>

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