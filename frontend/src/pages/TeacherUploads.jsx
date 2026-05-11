

import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import API from "../api";

export default function TeacherUploads() {

  // ================= STATES =================

  const [notes, setNotes] = useState([]);

  const [title, setTitle] = useState("");

  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [aiLoading, setAiLoading] = useState(null);

  const [summaries, setSummaries] = useState({});

  // ================= FETCH NOTES =================

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

  // ================= UPLOAD NOTE =================

  const handleUpload = async (e) => {

    e.preventDefault();

    setError("");

    setSuccess("");

    if (!title || !file) {

      setError(
        "Please provide title and file"
      );

      return;

    }

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("title", title);

      formData.append("file", file);

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

      setNotes([
        response.data,
        ...notes,
      ]);

      setTitle("");

      setFile(null);

      setSuccess(
        "✨ File uploaded successfully"
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

  // ================= DELETE NOTE =================

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete this note?"
      );

    if (!confirmDelete) return;

    try {

      await API.delete(`/notes/${id}`);

      setNotes(

        notes.filter(
          (note) =>
            note._id !== id
        )

      );

      setSuccess(
        "🗑 Note deleted successfully"
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

  // ================= AI SUMMARY =================

  const generateSummary = async (note) => {

    try {

      setAiLoading(note._id);

      const response = await API.post(
        "/ai/chat",
        {
          message: `
Generate smart study notes summary for this file title:

"${note.title}"

Return:
1. Short summary
2. Key concepts
3. Important exam topics
4. Quick revision tips

Keep response concise and student-friendly.
          `,
        }
      );

      setSummaries((prev) => ({
        ...prev,
        [note._id]: response.data.reply,
      }));

    } catch (err) {

      console.error(err);

      setError(
        "AI summary generation failed"
      );

    } finally {

      setAiLoading(null);

    }

  };

  // ================= INITIAL FETCH =================

  useEffect(() => {

    fetchNotes();

  }, []);

  return (

    <DashboardLayout role="teacher">

      {/* ================= HEADER ================= */}

      <div
        style={{
          marginBottom: "30px",
        }}
      >

        <h1
          style={{
            fontSize: "36px",
            fontWeight: "800",
            background:
              "linear-gradient(90deg,#00ff99,#00c3ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >

          📂 AI Notes Upload Center

        </h1>

        <p
          style={{
            opacity: 0.7,
            marginTop: "8px",
          }}
        >

          Upload notes and generate AI-powered summaries.

        </p>

      </div>

      {/* ================= UPLOAD FORM ================= */}

      <div
        className="card"
        style={{
          borderRadius: "28px",
          background:
            "rgba(255,255,255,0.04)",
          backdropFilter: "blur(16px)",
          border:
            "1px solid rgba(255,255,255,0.08)",
        }}
      >

        <h2>
          📤 Upload Study Material
        </h2>

        {/* ERROR */}

        {error && (

          <div
            style={{
              background: "#ff4d4f",
              color: "white",
              padding: "12px",
              borderRadius: "12px",
              marginTop: "15px",
            }}
          >

            {error}

          </div>

        )}

        {/* SUCCESS */}

        {success && (

          <div
            style={{
              background: "#52c41a",
              color: "white",
              padding: "12px",
              borderRadius: "12px",
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

          <input
            type="text"
            placeholder="Enter note title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="input"
          />

          <input
            type="file"
            onChange={(e) =>
              setFile(
                e.target.files[0]
              )
            }
            className="input"
          />

          <button
            type="submit"
            className="btn"
            disabled={loading}
          >

            {loading
              ? "Uploading..."
              : "🚀 Upload Note"}

          </button>

        </form>

      </div>

      {/* ================= NOTES GRID ================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px",
          marginTop: "35px",
        }}
      >

        {/* LOADING */}

        {loading &&
          notes.length === 0 && (

          <p>
            Loading uploaded notes...
          </p>

        )}

        {/* EMPTY */}

        {!loading &&
          notes.length === 0 && (

          <div className="card">

            <p>
              No notes uploaded yet.
            </p>

          </div>

        )}

        {/* NOTES */}

        {notes.map((note) => (

          <div

            key={note._id}

            className="card"

            style={{

              borderRadius: "28px",

              background:
                "linear-gradient(135deg, rgba(0,255,170,0.05), rgba(0,195,255,0.05))",

              border:
                "1px solid rgba(255,255,255,0.06)",

              backdropFilter: "blur(18px)",

            }}

          >

            <h2>
              📄 {note.title}
            </h2>

            {/* FILE */}

            <a
              href={`https://edu-planner-backrnd.onrender.com${note.fileUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                marginTop: "15px",
                color: "#00c3ff",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >

              📥 View / Download File

            </a>

            {/* DATE */}

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

            {/* AI BUTTON */}

            <button

              className="btn"

              style={{
                marginTop: "18px",
              }}

              onClick={() =>
                generateSummary(note)
              }

              disabled={
                aiLoading === note._id
              }

            >

              {aiLoading === note._id
                ? "Generating..."
                : "🤖 Generate AI Summary"}

            </button>

            {/* AI SUMMARY */}

            {summaries[note._id] && (

              <div

                style={{

                  marginTop: "18px",

                  padding: "16px",

                  borderRadius: "18px",

                  background:
                    "rgba(255,255,255,0.05)",

                  border:
                    "1px solid rgba(255,255,255,0.06)",

                  whiteSpace: "pre-wrap",

                  lineHeight: "1.7",

                  fontSize: "14px",

                }}

              >

                <h3>
                  🧠 AI Summary
                </h3>

                <p
                  style={{
                    marginTop: "10px",
                  }}
                >

                  {summaries[note._id]}

                </p>

              </div>

            )}

            {/* DELETE */}

            <button

              className="btn"

              style={{
                marginTop: "20px",
                background: "#ff4d4f",
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