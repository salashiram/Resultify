import { useState } from "react";

const ExamResults = ({ results }) => {
  const [showDetails, setShowDetails] = useState({});

  if (!results) return null;

  const toggleDetails = (index) => {
    setShowDetails((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div>
      <h2>Resultados del examen #{results.exam_id}</h2>
      <p>Total de exámenes procesados: {results.total_exams_processed}</p>

      {results.results.map((student, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            margin: "1rem 0",
            padding: "1rem",
            borderRadius: "8px",
          }}
        >
          <h3>{student.nombre_completo}</h3>
          <p>
            <strong>Matrícula:</strong> {student.matricula}
          </p>
          <p>
            <strong>Calificación:</strong> {student.grade}
          </p>
          <p>
            <strong>Correctas:</strong> {student.correct_answers} de{" "}
            {student.total_questions}
          </p>

          <button onClick={() => toggleDetails(index)}>
            {showDetails[index] ? "Ocultar detalles" : "Ver detalles"}
          </button>

          {showDetails[index] && (
            <div style={{ marginTop: "1rem" }}>
              <h4>Detalles de respuestas:</h4>
              <ul>
                {student.details.map((question, qIndex) => (
                  <li key={qIndex}>
                    Pregunta {question.question_number}: Respuesta usuario:{" "}
                    {question.user_answer} | Respuesta correcta:{" "}
                    {question.correct_answer} |
                    {question.is_correct ? "✅ Correcta" : "❌ Incorrecta"}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExamResults;
