import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import API from "../api";

export default function TeacherAssignments() {

  // ================= STATES =================

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [deadline, setDeadline] =
    useState("");

  const [assignmentFile, setAssignmentFile] =
    useState(null);

  const [assignments, setAssignments] =
    useState([]);

  // ================= LOAD =================

  useEffect(() => {

    fetchAssignments();

  }, []);

  // ================= FETCH =================

  const fetchAssignments = async () => {

    try {

      const res = await API.get(
        "/teacher/assignments"
      );

      setAssignments(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  // ================= CREATE =================

  const createAssignment = async () => {

    if (
      !title ||
      !description ||
      !deadline
    ) {

      alert(
        "Please fill all fields"
      );

      return;

    }

    try {

      const formData =
        new FormData();

      formData.append(
        "title",
        title
      );

      formData.append(
        "description",
        description
      );

      formData.append(
        "deadline",
        deadline
      );

      formData.append(
        "teacherName",
        "Teacher"
      );

      if (assignmentFile) {

        formData.append(
          "assignmentFile",
          assignmentFile
        );

      }

      await API.post(

        "/teacher/assignments",

        formData,

        {

          headers: {

            "Content-Type":
              "multipart/form-data",

          },

        }

      );

      alert(
        "✅ Assignment Created"
      );

      setTitle("");

      setDescription("");

      setDeadline("");

      setAssignmentFile(null);

      fetchAssignments();

    } catch (error) {

      console.log(error);

      alert(
        "❌ Failed to create assignment"
      );

    }

  };

  return (

    <DashboardLayout role="teacher">

      {/* ================= TITLE ================= */}

      <div
        style={{
          marginBottom: "28px",
        }}
      >

        <h1
          className="page-title"
          style={{
            fontSize: "36px",
            fontWeight: "800",
            background:
              "linear-gradient(90deg,#00ff99,#00c3ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor:
              "transparent",
          }}
        >

          📚 Assignment Manager

        </h1>

      </div>

      {/* ================= CREATE CARD ================= */}

      <div
        className="card"
        style={{
          borderRadius: "30px",
          padding: "34px",
          maxWidth: "900px",
          margin: "0 auto",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
          backdropFilter: "blur(18px)",
          border:
            "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 0 30px rgba(0,0,0,0.2)",
        }}
      >

        <h2
          style={{
            marginBottom: "24px",
            fontSize: "30px",
            fontWeight: "800",
          }}
        >

          ✨ Create Assignment

        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >

          <input
            placeholder="Assignment Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="auth-input"
            style={{
              padding: "18px",
              borderRadius: "18px",
              fontSize: "16px",
            }}
          />

          <textarea
            placeholder="Assignment Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            className="auth-input"
            rows={6}
            style={{
              padding: "18px",
              borderRadius: "18px",
              fontSize: "16px",
            }}
          />

          <input
            type="date"
            value={deadline}
            onChange={(e) =>
              setDeadline(e.target.value)
            }
            className="auth-input"
            style={{
              padding: "18px",
              borderRadius: "18px",
            }}
          />

          {/* ================= FILE ================= */}

          <input
            type="file"
            onChange={(e) =>
              setAssignmentFile(
                e.target.files[0]
              )
            }
            style={{
              padding: "12px",
            }}
          />

          <button
            onClick={createAssignment}
            className="auth-btn"
            style={{
              padding: "18px",
              borderRadius: "18px",
              fontSize: "18px",
              fontWeight: "700",
            }}
          >

            ➕ Create Assignment

          </button>

        </div>

      </div>

      {/* ================= LIST ================= */}

      <div
        style={{
          marginTop: "28px",
          display: "grid",
          gap: "20px",
        }}
      >

        {assignments.map(
          (assignment) => (

            <div
              key={assignment._id}
              className="card"
              style={{
                borderRadius: "24px",
                padding: "24px",
              }}
            >

              <h2>
                {assignment.title}
              </h2>

              <p
                style={{
                  marginTop: "10px",
                  opacity: 0.8,
                  lineHeight: "1.7",
                }}
              >

                {
                  assignment.description
                }

              </p>

              {/* ================= FILE BUTTON ================= */}

              {assignment.assignmentFile && (

                <a

                  href={`${import.meta.env.VITE_API_URL}${assignment.assignmentFile}`}

                  target="_blank"

                  rel="noreferrer"

                  style={{

                    display: "inline-block",

                    marginTop: "18px",

                    padding: "12px 18px",

                    borderRadius: "14px",

                    background:
                      "linear-gradient(90deg,#00ff99,#00c3ff)",

                    color: "#000",

                    fontWeight: "700",

                    textDecoration: "none",

                  }}

                >

                  📄 View Assignment File

                </a>

              )}

              <div
                style={{
                  marginTop: "16px",
                  display: "flex",
                  justifyContent:
                    "space-between",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >

                <p>
                  📅 Deadline:
                  {" "}
                  {new Date(
                    assignment.deadline
                  ).toLocaleDateString()}
                </p>

                <p>
                  📥 Submissions:
                  {" "}
                  {
                    assignment.submissions
                      .length
                  }
                </p>

              </div>

            </div>

          )
        )}

      </div>

    </DashboardLayout>

  );

}