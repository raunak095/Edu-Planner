import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import API from "../api";

export default function StudentAssignments() {

  // ================= STATES =================

  const [assignments, setAssignments] =
    useState([]);

  const [submissionLink, setSubmissionLink] =
    useState({});

  const [submissionFiles, setSubmissionFiles] =
    useState({});

  // ================= USER =================

  const user = JSON.parse(
    localStorage.getItem("user")
  );

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

  // ================= SUBMIT =================

  const submitAssignment = async (
    id
  ) => {

    try {

      const formData =
        new FormData();

      formData.append(

        "studentName",

        user?.name || "Student"

      );

      formData.append(

        "submissionLink",

        submissionLink[id] || ""

      );

      if (submissionFiles[id]) {

        formData.append(

          "submissionFile",

          submissionFiles[id]

        );

      }

      await API.post(

        `/teacher/assignments/${id}/submit`,

        formData,

        {

          headers: {

            "Content-Type":
              "multipart/form-data",

          },

        }

      );

      alert(
        "✅ Assignment Submitted"
      );

      fetchAssignments();

    } catch (error) {

      console.log(error);

      alert(
        "❌ Submission failed"
      );

    }

  };

  return (

    <DashboardLayout role="student">

      {/* ================= TITLE ================= */}

      <div
        style={{
          marginBottom: "28px",
        }}
      >

        <h1
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

          📚 Student Assignments

        </h1>

      </div>

      {/* ================= LIST ================= */}

      <div
        style={{
          display: "grid",
          gap: "24px",
        }}
      >

        {assignments.map(
          (assignment) => (

            <div
              key={assignment._id}
              className="card"
              style={{
                borderRadius: "28px",
                padding: "30px",
              }}
            >

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  flexWrap: "wrap",
                  gap: "20px",
                }}
              >

                <div>

                  <h2>
                    {
                      assignment.title
                    }
                  </h2>

                  <p
                    style={{
                      marginTop: "14px",
                      opacity: 0.8,
                      lineHeight: "1.8",
                    }}
                  >

                    {
                      assignment.description
                    }

                  </p>

                </div>

                <div>

                  <p>
                    📅 Deadline:
                  </p>

                  <h3
                    style={{
                      marginTop: "8px",
                    }}
                  >

                    {new Date(
                      assignment.deadline
                    ).toLocaleDateString()}

                  </h3>

                </div>

              </div>

              {/* ================= ASSIGNMENT FILE ================= */}

              {assignment.assignmentFile && (

                <a

                  href={`${import.meta.env.VITE_API_URL}${assignment.assignmentFile}`}

                  target="_blank"

                  rel="noreferrer"

                  style={{

                    display: "inline-block",

                    marginTop: "20px",

                    padding: "12px 18px",

                    borderRadius: "14px",

                    background:
                      "linear-gradient(90deg,#00ff99,#00c3ff)",

                    color: "#000",

                    fontWeight: "700",

                    textDecoration: "none",

                  }}

                >

                  📄 View Assignment PDF

                </a>

              )}

              {/* ================= SUBMIT ================= */}

              <div
                style={{
                  marginTop: "28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >

                <input
                  type="text"
                  placeholder="Paste Drive/GitHub Link"
                  value={
                    submissionLink[
                      assignment._id
                    ] || ""
                  }
                  onChange={(e) =>
                    setSubmissionLink({

                      ...submissionLink,

                      [assignment._id]:
                        e.target.value,

                    })
                  }
                  className="auth-input"
                />

                {/* ================= FILE ================= */}

                <input
                  type="file"
                  onChange={(e) =>
                    setSubmissionFiles({

                      ...submissionFiles,

                      [assignment._id]:
                        e.target.files[0],

                    })
                  }
                />

                <button
                  onClick={() =>
                    submitAssignment(
                      assignment._id
                    )
                  }
                  className="auth-btn"
                >

                  📤 Submit Assignment

                </button>

              </div>

              {/* ================= SUBMISSIONS ================= */}

              <div
                style={{
                  marginTop: "22px",
                }}
              >

                <p>

                  📥 Total Submissions:
                  {" "}

                  {
                    assignment
                      .submissions
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