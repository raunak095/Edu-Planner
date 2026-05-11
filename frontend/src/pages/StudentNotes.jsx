import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import API from "../api";

export default function StudentNotes() {

  const [notes, setNotes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  // ================= FETCH NOTES =================

  useEffect(() => {

    const fetchNotes = async () => {

      try {

        const response =
          await API.get("/notes");

        setNotes(response.data || []);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

      }

    };

    fetchNotes();

  }, []);

  // ================= FILTER =================

  const filteredNotes =
    notes.filter((note) =>
      note.title
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (

    <DashboardLayout role="student">

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

          📚 Notes Library

        </h1>

        <p
          style={{
            opacity: 0.7,
            marginTop: "8px",
          }}
        >

          Access all teacher uploaded study materials.

        </p>

      </div>

      {/* ================= SEARCH ================= */}

      <div
        className="card"
        style={{
          borderRadius: "24px",
          marginBottom: "25px",
        }}
      >

        <input

          type="text"

          placeholder="🔍 Search notes..."

          value={search}

          onChange={(e) =>
            setSearch(e.target.value)
          }

          className="input"

        />

      </div>

      {/* ================= NOTES GRID ================= */}

      <div

        style={{

          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit, minmax(320px, 1fr))",

          gap: "24px",

        }}

      >

        {/* LOADING */}

        {loading && (

          <p>
            Loading notes...
          </p>

        )}

        {/* EMPTY */}

        {!loading &&
          filteredNotes.length === 0 && (

          <div className="card">

            <p>
              No notes found.
            </p>

          </div>

        )}

        {/* NOTES */}

        {filteredNotes.map((note) => (

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

            {/* DATE */}

            <p
              style={{
                opacity: 0.7,
                marginTop: "10px",
              }}
            >

              Uploaded:
              {" "}

              {new Date(
                note.createdAt
              ).toLocaleDateString()}

            </p>

            {/* VIEW BUTTON */}

            <a

              href={`https://edu-planner-backrnd.onrender.com${note.fileUrl}`}

              target="_blank"

              rel="noopener noreferrer"

              style={{

                display: "inline-block",

                marginTop: "20px",

                padding:
                  "12px 18px",

                borderRadius: "14px",

                background:
                  "linear-gradient(90deg,#00ff99,#00c3ff)",

                color: "#000",

                textDecoration: "none",

                fontWeight: "700",

              }}

            >

              📥 Open Note

            </a>

          </div>

        ))}

      </div>

    </DashboardLayout>

  );

}