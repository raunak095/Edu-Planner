import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api";

export default function TeacherCourses() {

  // 📚 Courses State
  const [courses, setCourses] = useState([]);

  // ➕ Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // ⏳ Loading State
  const [loading, setLoading] = useState(false);

  // ❌ Error State
  const [error, setError] = useState("");

  // ✅ Success Message
  const [success, setSuccess] = useState("");

  // 🚀 Fetch Courses
  const fetchCourses = async () => {

    try {

      setLoading(true);

      const response = await API.get("/courses");

      setCourses(response.data || []);

    } catch (err) {

      console.error("Fetch Courses Error:", err);

      setError("Failed to fetch courses");

    } finally {

      setLoading(false);

    }
  };

  // ➕ Create Course
  const handleCreateCourse = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    // ✅ Validation
    if (!title || !description) {
      setError("Please fill all fields");
      return;
    }

    try {

      setLoading(true);

      const response = await API.post("/courses", {
        title,
        description,
      });

      // ✅ Add New Course Instantly
      setCourses([response.data, ...courses]);

      // ✅ Reset Form
      setTitle("");
      setDescription("");

      setSuccess("Course created successfully");

    } catch (err) {

      console.error("Create Course Error:", err);

      setError("Failed to create course");

    } finally {

      setLoading(false);

    }
  };

  // ❌ Delete Course
  const handleDeleteCourse = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) return;

    try {

      await API.delete(`/courses/${id}`);

      // ✅ Remove Deleted Course
      setCourses(courses.filter((course) => course._id !== id));

    } catch (err) {

      console.error("Delete Course Error:", err);

      setError("Failed to delete course");

    }
  };

  // 🚀 Initial Fetch
  useEffect(() => {
    fetchCourses();
  }, []);

  return (

    <DashboardLayout role="teacher">

      {/* 📚 PAGE TITLE */}
      <h1 className="page-title">
        📚 Teacher Courses
      </h1>

      {/* ➕ CREATE COURSE FORM */}
      <div
        className="card"
        style={{
          marginTop: "20px",
        }}
      >

        <h2>➕ Create New Course</h2>

        {/* ❌ ERROR */}
        {error && (
          <div
            style={{
              background: "#ff4d4f",
              color: "white",
              padding: "10px",
              borderRadius: "8px",
              marginTop: "15px",
            }}
          >
            {error}
          </div>
        )}

        {/* ✅ SUCCESS */}
        {success && (
          <div
            style={{
              background: "#52c41a",
              color: "white",
              padding: "10px",
              borderRadius: "8px",
              marginTop: "15px",
            }}
          >
            {success}
          </div>
        )}

        <form
          onSubmit={handleCreateCourse}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            marginTop: "20px",
          }}
        >

          {/* COURSE TITLE */}
          <input
            type="text"
            placeholder="Enter course title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
          />

          {/* COURSE DESCRIPTION */}
          <textarea
            placeholder="Enter course description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input"
            rows="4"
          />

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="btn"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Course"}
          </button>

        </form>

      </div>

      {/* 📋 COURSE LIST */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >

        {/* ⏳ LOADING */}
        {loading && courses.length === 0 && (
          <p>Loading courses...</p>
        )}

        {/* ❌ NO COURSES */}
        {!loading && courses.length === 0 && (
          <div className="card">
            <p>No courses found.</p>
          </div>
        )}

        {/* 📚 COURSE CARDS */}
        {courses.map((course) => (

          <div
            key={course._id}
            className="card"
          >

            <h2>
              📘 {course.title}
            </h2>

            <p
              style={{
                marginTop: "10px",
                lineHeight: "1.6",
              }}
            >
              {course.description}
            </p>

            {/* ACTION BUTTONS */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "20px",
              }}
            >

              {/* ✏️ EDIT BUTTON */}
              <button
                className="btn"
              >
                ✏️ Edit
              </button>

              {/* ❌ DELETE BUTTON */}
              <button
                className="btn"
                onClick={() => handleDeleteCourse(course._id)}
              >
                ❌ Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </DashboardLayout>
  );
}