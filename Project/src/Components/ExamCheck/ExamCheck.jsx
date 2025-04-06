import React, { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../SideBar/Sidebar";
import UploadedExamsList from "../UploadedExamsList/UploadedExamsList";
import "./ExamCheck.css";

const ExamCheck = () => {
  const [files, setFiles] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);

  //
  const [results, setResults] = useState(null);

  const handleReviewClick = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3001/api/v1/exams/process-all",
        {
          method: "POST",
        }
      );

      const data = await response.json();
      setResults(data.results);
    } catch (err) {
      alert("Error al procesar los examenes");
      console.error("Error al procesar los exámenes:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchExams = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/v1/uploads/get-uploaded-exams"
      );
      setExams(response.data);
    } catch (err) {
      console.error("Error al obtener los exámenes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  if (loading) {
    return <div>Cargando exámenes...</div>;
  }

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files)); // 🔥 Ahora guardamos todos los archivos
  };

  return (
    <div>
      <SideBar />

      <div className="check-content">
        <button onClick={handleReviewClick} disabled={loading}>
          {loading ? "Procesando..." : "Revisar Exámenes"}
        </button>
        {results && (
          <div>
            <h2>Resultados:</h2>
            {results.map((result, index) => (
              <div key={index}>
                <h3>Examen de {result.folder}:</h3>{" "}
                {/* Mostramos el nombre de la carpeta */}
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>
            ))}
          </div>
        )}
      </div>

      <UploadedExamsList exams={exams} loading={loading} />
    </div>
  );
};

export default ExamCheck;
