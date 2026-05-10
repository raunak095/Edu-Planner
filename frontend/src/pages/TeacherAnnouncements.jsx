import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api";

export default function TeacherAnnouncements() {

  // 📢 Announcement State
  const [announcements, setAnnouncements] = useState([]);

  // 📝 Form State
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  // ⏳ Loading State
  const [loading, setLoading] = useState(false);

  // ❌ Error State
  const [error, setError] = useState("");

  // ✅ Success State
  const [success, setSuccess] = useState("");

  // 🚀 Fetch Announcements
  const fetchAnnouncements = async () => {

    try {

      setLoading(true);

      const response = await API.get("/announcements");

      setAnnouncements(response.data || []);

    } catch (err) {

      console.error("Fetch Announcements Error:", err);

      setError("Failed to fetch announcements");

    } finally {

      setLoading(false);

    }
  };

  // 📢 Create Announcement
  const handleCreateAnnouncement = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    // ✅ Validation
    if (!title || !message) {

      setError("Please fill all fields");

      return;
    }

    try {

      setLoading(true);

      const response = await API.post(
        "/announcements",
        {
          title,
          message,
        }
      );

      // ✅ Update UI Instantly
      setAnnouncements([
        response.data,
        ...announcements,
      ]);

      // ✅ Reset Form
      setTitle("");
      setMessage("");

      setSuccess("Announcement posted successfully");

    } catch (err) {

      console.error("Create Announcement Error:", err);

      setError("Failed to create announcement");

    } finally {

      setLoading(false);

    }
  };

  // ❌ Delete Announcement
  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this announcement?"
    );

    if (!confirmDelete) return;

    try {

      await API.delete(`/announcements/${id}`);

      // ✅ Remove from UI
      setAnnouncements(
        announcements.filter(
          (announcement) => announcement._id !== id
        )
      );

    } catch (err) {

      console.error("Delete Announcement Error:", err);

      setError("Failed to delete announcement");

    }
  };

  // 🚀 Initial Fetch
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (

    <DashboardLayout role="teacher">

      {/* 📢 PAGE TITLE */}
      <h1 className="page-title">
        📢 Teacher Announcements
      </h1>

      {/* 📝 CREATE ANNOUNCEMENT */}
      <div
        className="card"
        style={{
          marginTop: "20px",
        }}
      >

        <h2>📝 Create Announcement</h2>

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
          onSubmit={handleCreateAnnouncement}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            marginTop: "20px",
          }}
        >

          {/* 📌 TITLE */}
          <input
            type="text"
            placeholder="Enter announcement title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
          />

          {/* 📝 MESSAGE */}
          <textarea
            placeholder="Enter announcement message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="input"
            rows="5"
          />

          {/* 🚀 SUBMIT BUTTON */}
          <button
            type="submit"
            className="btn"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post Announcement"}
          </button>

        </form>

      </div>

      {/* 📋 ANNOUNCEMENT LIST */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >

        {/* ⏳ LOADING */}
        {loading && announcements.length === 0 && (
          <p>Loading announcements...</p>
        )}

        {/* ❌ EMPTY */}
        {!loading && announcements.length === 0 && (
          <div className="card">
            <p>No announcements available.</p>
          </div>
        )}

        {/* 📢 ANNOUNCEMENT CARDS */}
        {announcements.map((announcement) => (

          <div
            key={announcement._id}
            className="card"
          >

            <h2>
              📌 {announcement.title}
            </h2>

            {/* 📝 MESSAGE */}
            <p
              style={{
                marginTop: "15px",
                lineHeight: "1.7",
              }}
            >
              {announcement.message}
            </p>

            {/* 🕒 DATE */}
            <p
              style={{
                marginTop: "15px",
                fontSize: "14px",
                opacity: "0.7",
              }}
            >
              Posted:
              {" "}
              {new Date(
                announcement.createdAt
              ).toLocaleDateString()}
            </p>

            {/* ❌ DELETE BUTTON */}
            <button
              className="btn"
              style={{
                marginTop: "20px",
              }}
              onClick={() => handleDelete(announcement._id)}
            >
              ❌ Delete
            </button>

          </div>

        ))}

      </div>

    </DashboardLayout>
  );
}