import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import API from "../api";

export default function TeacherUploads() {

  // 📂 Notes State
  const [notes, setNotes] = useState([]);

  // 📄 Form State
  const [title, setTitle] = useState("");

  const [file, setFile] = useState(null);

  // ⏳ Loading State
  const [loading, setLoading] = useState(false);

  // ❌ Error State
  const [error, setError] = useState("");

  // ✅ Success State
  const [success, setSuccess] = useState("");

  // 🚀 Fetch Uploaded Notes
  const fetchNotes = async () => {

    try {

      setLoading(true);

      const response = await API.get("/notes");

      setNotes(response.data || []);

    } catch (err) {

      console.error(
        "Fetch Notes Error:",
        err
      );

      setError(
        "Failed to fetch uploaded notes"
      );

    } finally {

      setLoading(false);

    }

  };

  // 📤 Upload Note
  const handleUpload = async (e) => {

    e.preventDefault();

    setError("");

    setSuccess("");

    // ✅ Validation
    if (!title || !file) {

      setError(
        "Please provide title and file"
      );

      return;

    }

    try {

      setLoading(true);

      // 📦 FormData for file upload
      const formData = new FormData();

      formData.append(
        "title",
        title
      );

      formData.append(
        "file",
        file
      );

      const response = await API.post(

        "/notes/upload",

        formData,

        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }

      );

      // ✅ Update UI Instantly
      setNotes([
        response.data,
        ...notes,
      ]);

      // ✅ Reset Form
      setTitle("");

      setFile(null);

      setSuccess(
        "File uploaded successfully"
      );

    } catch (err) {

      console.error(
        "Upload Error:",
        err
      );

      setError(
        "Failed to upload note"
      );

    } finally {

      setLoading(false);

    }

  };

  // ❌ Delete Note
  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this note?"
      );

    if (!confirmDelete) return;

    try {

      await API.delete(
        `/notes/${id}`
      );

      // ✅ Remove from UI
      setNotes(

        notes.filter(
          (note) =>
            note._id !== id
        )

      );

      setSuccess(
        "Note deleted successfully"
      );

    } catch (err) {

      console.error(
        "Delete Error:",
        err
      );

      setError(
        "Failed to delete note"
      );

    }

  };

  // 🚀 Initial Fetch
  useEffect(() => {

    fetchNotes();

  }, []);

  return (

    <DashboardLayout role="teacher">

      {/* 📂 PAGE TITLE */}

      <h1 className="page-title">
        📂 Upload Notes
      </h1>

      {/* 📤 UPLOAD FORM */}

      <div
        className="card"
        style={{
          marginTop: "20px",
        }}
      >

        <h2>
          📤 Upload Study Material
        </h2>

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

          onSubmit={handleUpload}

          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            marginTop: "20px",
          }}

        >

          {/* 📄 NOTE TITLE */}

          <input
            type="text"
            placeholder="Enter note title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="input"
          />

          {/* 📎 FILE INPUT */}

          <input
            type="file"
            onChange={(e) =>
              setFile(
                e.target.files[0]
              )
            }
            className="input"
          />

          {/* 📤 SUBMIT BUTTON */}

          <button
            type="submit"
            className="btn"
            disabled={loading}
          >

            {loading
              ? "Uploading..."
              : "Upload Note"}

          </button>

        </form>

      </div>

      {/* 📋 UPLOADED NOTES */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >

        {/* ⏳ LOADING */}

        {loading &&
          notes.length === 0 && (
            <p>
              Loading uploaded notes...
            </p>
          )}

        {/* ❌ EMPTY */}

        {!loading &&
          notes.length === 0 && (

          <div className="card">

            <p>
              No notes uploaded yet.
            </p>

          </div>

        )}

        {/* 📂 NOTE CARDS */}

        {notes.map((note) => (

          <div
            key={note._id}
            className="card"
          >

            <h2>
              📄 {note.title}
            </h2>

            {/* 📎 FILE LINK */}

            <a
              href={`http://localhost:5000${note.fileUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                marginTop: "15px",
                color: "#1890ff",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              📥 View / Download File
            </a>

            {/* 🕒 DATE */}

            <p
              style={{
                marginTop: "15px",
                fontSize: "14px",
                opacity: "0.7",
              }}
            >

              Uploaded:

              {" "}

              {new Date(
                note.createdAt
              ).toLocaleDateString()}

            </p>

            {/* ❌ DELETE BUTTON */}

            <button
              className="btn"
              style={{
                marginTop: "20px",
              }}
              onClick={() =>
                handleDelete(note._id)
              }
            >
              ❌ Delete
            </button>

          </div>

        ))}

      </div>

    </DashboardLayout>

  );

}