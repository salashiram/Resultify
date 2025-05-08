import React from "react";
import "./DetectedExams.css";

const DetectedExams = ({ exams, loading }) => {
  if (loading) {
    return <div>Cargando exámenes...</div>;
  }

  return (
    <div>
      <div className="exams-list-container">
        <div className="exams-list-content">
          <h2>Exámenes procesados</h2>
          {exams.length === 0 ? (
            <p>No hay exámenes procesados.</p>
          ) : (
            <ul>
              {exams.map((exam, index) => (
                <li key={index}>{exam}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetectedExams;
