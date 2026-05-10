import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import API from "../api";

export default function AdminStudents() {

  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);

  // ================= FETCH STUDENTS =================

  useEffect(() => {

    fetchStudents();

  }, []);

  const fetchStudents = async () => {

    try {

      const res = await API.get(
        "/students"
      );

      console.log(
        "Students API Response:",
        res.data
      );

      setStudents(res.data);

    } catch (error) {

      console.error(
        "Failed to fetch students:",
        error
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <DashboardLayout role="admin">

      <h1 className="page-title">
        👨‍🎓 Manage Students
      </h1>

      {/* ================= LOADING ================= */}

      {loading && (

        <div className="card">

          <p>Loading students...</p>

        </div>

      )}

      {/* ================= NO STUDENTS ================= */}

      {!loading &&
        students.length === 0 && (

        <div className="card">

          <p>No students found.</p>

        </div>

      )}

      {/* ================= STUDENTS LIST ================= */}

      <div
        style={{
          marginTop: "20px",
        }}
      >

        {students.map((student) => (

          <div
            key={student._id}
            className="card"
            style={{
              marginBottom: "15px",
            }}
          >

            <h2>
              {student.name}
            </h2>

            <p>
              📧 {student.email}
            </p>

            <button
              className="btn"
              style={{
                marginTop: "10px",
              }}
            >
              ❌ Remove Student
            </button>

          </div>

        ))}

      </div>

    </DashboardLayout>
  );
}