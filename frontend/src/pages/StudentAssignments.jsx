import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import API from "../api";

export default function StudentAssignments() {

  // ================= STATES =================

  const [assignments, setAssignments] =
    useState([]);

  const [fileUrl, setFileUrl] =
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

      if (!fileUrl[id]) {

        alert(
          "Please add submission link"
        );

        return;

      }

      await API.post(

        `/teacher/assignments/${id}/submit`,

        {

          studentName:
            user?.name || "Student",

          fileUrl: fileUrl[id],

        }

      );

      alert(
        "✅ Assignment Submitted"
      );

      fetchAssignments();

    } catch (error) {

      console.log(error);

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

              {/* ================= SUBMIT ================= */}

              <div
                style={{
                  marginTop: "28px",
                  display: "flex",
                  gap: "14px",
                  flexWrap: "wrap",
                }}
              >

                <input
                  type="text"
                  placeholder="Paste Drive/GitHub/File Link"
                  value={
                    fileUrl[
                      assignment._id
                    ] || ""
                  }
                  onChange={(e) =>
                    setFileUrl({

                      ...fileUrl,

                      [assignment._id]:
                        e.target.value,

                    })
                  }
                  className="auth-input"
                  style={{
                    flex: 1,
                    minWidth: "260px",
                  }}
                />

                <button
                  onClick={() =>
                    submitAssignment(
                      assignment._id
                    )
                  }
                  className="auth-btn"
                >

                  📤 Submit

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