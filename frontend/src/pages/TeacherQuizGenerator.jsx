import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

export default function TeacherQuizGenerator() {

  const [topic, setTopic] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🤖 GENERATE QUIZ
  const generateQuiz = async () => {

    if (!topic.trim()) return;

    try {

      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/ai/generate-quiz",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            topic,
          }),
        }
      );

      const data = await response.json();

      console.log(data);

      if (data.success) {
        setQuiz(data.quiz);
      }

    } catch (error) {

      console.log(error);

      alert("Quiz generation failed");

    } finally {

      setLoading(false);

    }
  };

  return (
    <DashboardLayout role="teacher">

      <h1 className="page-title">
        🤖 AI Quiz Generator
      </h1>

      {/* INPUT SECTION */}
      <div className="card">

        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >

          <input
            className="input"
            placeholder="Enter topic (e.g. DBMS)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          <button
            className="btn"
            onClick={generateQuiz}
          >
            {loading ? "Generating..." : "Generate Quiz"}
          </button>

        </div>
      </div>

      {/* QUIZ SECTION */}
      {quiz.length > 0 && (

        <div
          className="card"
          style={{ marginTop: "20px" }}
        >

          <h2>📝 Generated Quiz</h2>

          {quiz.map((q, index) => (

            <div
              key={index}
              style={{
                marginTop: "20px",
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
                  • {option}
                </div>

              ))}

              <p
                style={{
                  marginTop: "15px",
                  fontWeight: "bold",
                  color: "green",
                }}
              >
                ✅ Answer: {q.answer}
              </p>

            </div>

          ))}

        </div>

      )}

    </DashboardLayout>
  );
}