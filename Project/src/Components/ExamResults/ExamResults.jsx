import { useState } from "react";
import "./ExamResults.css";

const ExamResults = ({ results }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  if (!results) return null;

  const openDetails = (student) => {
    setSelectedStudent(student);
  };

  const closeModal = () => {
    setSelectedStudent(null);
  };

  return (
    <div>
      <div className="results-main-content">
        <h2>Resultados del examen #{results.exam_id}</h2>
        <p>Total de exámenes procesados: {results.total_exams_processed}</p>

        {/* Tabla */}
        <table className="results-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Matrícula</th>
              <th>Calificación</th>
              <th>Correctas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {results.results.map((student, index) => (
              <tr key={index}>
                <td>{student.nombre_completo}</td>
                <td>{student.matricula}</td>
                <td>{student.grade}</td>
                <td>
                  {student.correct_answers} de {student.total_questions}
                </td>
                <td>
                  <button onClick={() => openDetails(student)}>
                    Ver detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal */}
        {selectedStudent && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Detalles de {selectedStudent.nombre_completo}</h3>
              <ul>
                {selectedStudent.details.map((question, qIndex) => (
                  <li key={qIndex}>
                    Pregunta {question.question_number}: Respuesta usuario:{" "}
                    {question.user_answer} | Respuesta correcta:{" "}
                    {question.correct_answer} |{" "}
                    {question.is_correct ? "✅ Correcta" : "❌ Incorrecta"}
                  </li>
                ))}
              </ul>
              <button onClick={closeModal}>Cerrar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamResults;
