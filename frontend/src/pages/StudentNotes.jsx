import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import API from "../api";

export default function StudentNotes() {

  const [notes, setNotes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  // ================= QUIZ STATES =================

  const [quizLoading, setQuizLoading] =
    useState(false);

  const [quizData, setQuizData] =
    useState([]);

  const [selectedNote, setSelectedNote] =
    useState("");

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

  // ================= PDF QUIZ GENERATOR =================

  const generateQuiz = async (note) => {

    try {

      setQuizLoading(true);

      setSelectedNote(note.title);

      setQuizData([]);

      // ================= FETCH PDF =================

      const pdfResponse =
        await fetch(

          `https://edu-planner-backrnd.onrender.com${note.fileUrl}`

        );

      const pdfBlob =
        await pdfResponse.blob();

      // ================= CREATE FORM DATA =================

      const formData =
        new FormData();

      formData.append(
        "file",
        pdfBlob,
        `${note.title}.pdf`
      );

      // ================= SEND TO AI =================

      const response =
        await API.post(

          "/ai/generate-pdf-quiz",

          formData,

          {

            headers: {

              "Content-Type":
                "multipart/form-data",

            },

          }

        );

      if (
        response.data.success
      ) {

        setQuizData(
          response.data.quiz
        );

      }

    } catch (error) {

      console.error(
        "PDF Quiz Error:",
        error
      );

      alert(
        "Failed to generate AI PDF quiz"
      );

    } finally {

      setQuizLoading(false);

    }

  };

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

            {/* BUTTONS */}

            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "20px",
                flexWrap: "wrap",
              }}
            >

              {/* OPEN NOTE */}

              <a

                href={`https://edu-planner-backrnd.onrender.com${note.fileUrl}`}

                target="_blank"

                rel="noopener noreferrer"

                style={{

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

              {/* AI PDF QUIZ */}

              <button

                onClick={() =>
                  generateQuiz(
                    note
                  )
                }

                style={{

                  padding:
                    "12px 18px",

                  borderRadius: "14px",

                  border: "none",

                  background:
                    "linear-gradient(90deg,#ff9a00,#ff2d55)",

                  color: "#fff",

                  fontWeight: "700",

                  cursor: "pointer",

                }}

              >

                🧠 Generate AI Quiz

              </button>

            </div>

          </div>

        ))}

      </div>

      {/* ================= QUIZ SECTION ================= */}

      {selectedNote && (

        <div
          className="card"
          style={{
            marginTop: "40px",
            borderRadius: "28px",
          }}
        >

          <h2>

            🧠 AI Quiz:
            {" "}
            {selectedNote}

          </h2>

          {quizLoading && (

            <p
              style={{
                marginTop: "20px",
              }}
            >

              AI is reading PDF and generating quiz...

            </p>

          )}

          {!quizLoading &&
            quizData.length > 0 && (

            <div
              style={{
                marginTop: "25px",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >

              {quizData.map(
                (q, index) => (

                  <div
                    key={index}
                    style={{
                      padding: "20px",
                      borderRadius:
                        "18px",
                      background:
                        "rgba(255,255,255,0.04)",
                    }}
                  >

                    <h3>

                      Q{index + 1}.
                      {" "}
                      {q.question}

                    </h3>

                    <div
                      style={{
                        marginTop:
                          "14px",
                        display: "flex",
                        flexDirection:
                          "column",
                        gap: "10px",
                      }}
                    >

                      {q.options.map(
                        (
                          option,
                          i
                        ) => (

                          <div
                            key={i}
                            style={{
                              padding:
                                "10px",
                              borderRadius:
                                "12px",
                              background:
                                "rgba(255,255,255,0.05)",
                            }}
                          >

                            {option}

                          </div>

                        )
                      )}

                    </div>

                    <p
                      style={{
                        marginTop:
                          "16px",
                        color:
                          "#00ff99",
                        fontWeight:
                          "700",
                      }}
                    >

                      ✅ Answer:
                      {" "}
                      {q.answer}

                    </p>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      )}

    </DashboardLayout>

  );

}
