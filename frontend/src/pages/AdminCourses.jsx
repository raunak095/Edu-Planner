import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import API from "../api";

export default function AdminCourses() {

  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);

  // ================= FETCH COURSES =================

  useEffect(() => {

    fetchCourses();

  }, []);

  const fetchCourses = async () => {

    try {

      const res = await API.get(
        "/courses"
      );

      console.log(
        "Courses API Response:",
        res.data
      );

      setCourses(res.data);

    } catch (error) {

      console.error(
        "Failed to fetch courses:",
        error
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <DashboardLayout role="admin">

      <h1 className="page-title">
        📚 Manage Courses
      </h1>

      {/* ================= LOADING ================= */}

      {loading && (

        <div className="card">

          <p>Loading courses...</p>

        </div>

      )}

      {/* ================= EMPTY ================= */}

      {!loading &&
        courses.length === 0 && (

        <div className="card">

          <p>No courses found.</p>

        </div>

      )}

      {/* ================= COURSE LIST ================= */}

      <div
        style={{
          marginTop: "20px",
        }}
      >

        {courses.map((course) => (

          <div
            key={course._id}
            className="card"
            style={{
              marginBottom: "15px",
            }}
          >

            <h2>
              {course.title}
            </h2>

            <p>
              {course.description}
            </p>

            <button
              className="btn"
              style={{
                marginTop: "10px",
              }}
            >
              ❌ Delete Course
            </button>

          </div>

        ))}

      </div>

    </DashboardLayout>
  );
}