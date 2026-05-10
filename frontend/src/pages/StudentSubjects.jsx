import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

export default function StudentSubjects() {

  const [subject, setSubject] = useState("");

  const [subjects, setSubjects] = useState([]);

  const [editIndex, setEditIndex] = useState(null);

  const [editValue, setEditValue] = useState("");

  // 🔍 Search + Filter
  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  // 🤖 AI Quiz States
  const [quizTopic, setQuizTopic] = useState("");

  const [quiz, setQuiz] = useState([]);

  const [loadingQuiz, setLoadingQuiz] = useState(false);

  const [selectedAnswers, setSelectedAnswers] = useState({});

  const [score, setScore] = useState(null);

  // ================= LOAD SUBJECTS =================

  useEffect(() => {

    const loadData = () => {

      const saved =
        JSON.parse(localStorage.getItem("subjects")) || [];

      setSubjects(saved);

    };

    loadData();

    window.addEventListener("focus", loadData);

    return () =>
      window.removeEventListener("focus", loadData);

  }, []);

  // ================= SAVE SUBJECTS =================

  useEffect(() => {

    localStorage.setItem(
      "subjects",
      JSON.stringify(subjects)
    );

  }, [subjects]);

  // ================= ADD SUBJECT =================

  const addSubject = () => {

    if (!subject.trim()) return;

    setSubjects([
      ...subjects,
      {
        name: subject,
        completed: false,
      },
    ]);

    setSubject("");

  };

  // ================= DELETE SUBJECT =================

  const deleteSubject = (index) => {

    const updated =
      subjects.filter((_, i) => i !== index);

    setSubjects(updated);

  };

  // ================= EDIT SUBJECT =================

  const startEdit = (index) => {

    setEditIndex(index);

    setEditValue(subjects[index].name);

  };

  const saveEdit = () => {

    const updated = [...subjects];

    updated[editIndex].name = editValue;

    setSubjects(updated);

    setEditIndex(null);

  };

  // ================= TOGGLE COMPLETE =================

  const toggleComplete = (index) => {

    const updated = [...subjects];

    updated[index].completed =
      !updated[index].completed;

    setSubjects(updated);

  };

  // ================= FILTER SUBJECTS =================

  const filteredSubjects = subjects
    .filter((s) =>
      s.name
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter((s) => {

      if (filter === "completed")
        return s.completed;

      if (filter === "pending")
        return !s.completed;

      return true;

    });

  // ================= GENERATE QUIZ =================

  const generateQuiz = async () => {

    if (!quizTopic.trim()) return;

    try {

      setLoadingQuiz(true);

      const response = await fetch(
        "https://edu-planner-backrnd.onrender.com/api/ai/generate-quiz",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            topic: quizTopic,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {

        setQuiz(data.quiz);

        setSelectedAnswers({});

        setScore(null);

      }

    } catch (error) {

      console.log(error);

      alert("Quiz generation failed");

    } finally {

      setLoadingQuiz(false);

    }

  };

  // ================= SUBMIT QUIZ =================

  const submitQuiz = () => {

    let correct = 0;

    quiz.forEach((q, index) => {

      if (
        selectedAnswers[index] === q.answer
      ) {

        correct++;

      }

    });

    setScore(correct);

  };

  return (

    <DashboardLayout>

      <h1 className="page-title">
        📚 My Subjects
      </h1>

      {/* ================= ADD SUBJECT ================= */}

      <div className="card">

        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >

          <input
            className="input"
            value={subject}
            onChange={(e) =>
              setSubject(e.target.value)
            }
            placeholder="Enter subject (e.g. DBMS)"
          />

          <button
            className="btn"
            onClick={addSubject}
          >
            ➕ Add
          </button>

        </div>

      </div>

      {/* ================= SEARCH + FILTER ================= */}

      <div
        className="card"
        style={{
          display: "flex",
          gap: "10px",
        }}
      >

        <input
          className="input"
          placeholder="🔍 Search subjects..."
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          className="input"
          onChange={(e) =>
            setFilter(e.target.value)
          }
        >

          <option value="all">
            All
          </option>

          <option value="completed">
            Completed
          </option>

          <option value="pending">
            Pending
          </option>

        </select>

      </div>

      {/* ================= STATS ================= */}

      <div
        className="card"
        style={{
          display: "flex",
          gap: "20px",
        }}
      >

        <span>
          📚 Total: {subjects.length}
        </span>

        <span>
          ✅ Completed:
          {" "}
          {
            subjects.filter(
              (s) => s.completed
            ).length
          }
        </span>

      </div>

      {/* ================= SUBJECT LIST ================= */}

      <div className="card">

        <h3>Your Subjects</h3>

        {filteredSubjects.length === 0 ? (

          <p
            style={{
              textAlign: "center",
              opacity: 0.6,
            }}
          >
            📭 No subjects found
          </p>

        ) : (

          filteredSubjects.map((sub, index) => (

            <div
              key={index}
              className="subject-item"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >

              {editIndex === index ? (

                <>

                  <input
                    className="input"
                    value={editValue}
                    onChange={(e) =>
                      setEditValue(e.target.value)
                    }
                  />

                  <div>

                    <button
                      className="save-btn"
                      onClick={saveEdit}
                    >
                      💾
                    </button>

                    <button
                      className="cancel-btn"
                      onClick={() =>
                        setEditIndex(null)
                      }
                    >
                      ❌
                    </button>

                  </div>

                </>

              ) : (

                <>

                  <span
                    style={{
                      textDecoration:
                        sub.completed
                          ? "line-through"
                          : "none",
                      fontWeight: "500",
                    }}
                  >
                    {sub.name}
                  </span>

                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                    }}
                  >

                    <button
                      className="complete-btn"
                      onClick={() =>
                        toggleComplete(index)
                      }
                    >
                      {sub.completed
                        ? "✅"
                        : "⬜"}
                    </button>

                    <button
                      className="edit-btn"
                      onClick={() =>
                        startEdit(index)
                      }
                    >
                      ✏️
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteSubject(index)
                      }
                    >
                      🗑
                    </button>

                  </div>

                </>

              )}

            </div>

          ))

        )}

      </div>

      {/* ================= AI QUIZ GENERATOR ================= */}

      <div
        className="card"
        style={{
          marginTop: "20px",
        }}
      >

        <h2>🤖 AI Quiz Generator</h2>

        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >

          <input
            className="input"
            placeholder="Enter topic (e.g. DBMS)"
            value={quizTopic}
            onChange={(e) =>
              setQuizTopic(e.target.value)
            }
          />

          <button
            className="btn"
            onClick={generateQuiz}
          >
            {loadingQuiz
              ? "Generating..."
              : "Generate Quiz"}
          </button>

        </div>

      </div>

      {/* ================= QUIZ ================= */}

      {quiz.length > 0 && (

        <div
          className="card"
          style={{
            marginTop: "20px",
          }}
        >

          <h2>📝 Quiz</h2>

          {quiz.map((q, index) => (

            <div
              key={index}
              style={{
                marginBottom: "25px",
                padding: "15px",
                border: "1px solid #ddd",
                borderRadius: "10px",
              }}
            >

              <h3>
                {index + 1}. {q.question}
              </h3>

              {q.options.map((option, i) => (

                <div
                  key={i}
                  style={{
                    marginTop: "10px",
                  }}
                >

                  <label>

                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={
                        selectedAnswers[index] === option
                      }
                      onChange={() =>
                        setSelectedAnswers({
                          ...selectedAnswers,
                          [index]: option,
                        })
                      }
                    />

                    <span
                      style={{
                        marginLeft: "8px",
                      }}
                    >
                      {option}
                    </span>

                  </label>

                </div>

              ))}

            </div>

          ))}

          <button
            className="btn"
            onClick={submitQuiz}
          >
            Submit Quiz
          </button>

          {score !== null && (

            <h2
              style={{
                marginTop: "20px",
              }}
            >
              🎯 Score:
              {" "}
              {score} / {quiz.length}
            </h2>

          )}

        </div>

      )}

    </DashboardLayout>

  );
}