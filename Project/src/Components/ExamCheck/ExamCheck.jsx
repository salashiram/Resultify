import React, { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../SideBar/Sidebar";
import UploadedExamsList from "../UploadedExamsList/UploadedExamsList";
import ExamResults from "../ExamResults/ExamResults";
import "./ExamCheck.css";

const ExamCheck = () => {
  const [files, setFiles] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectExams, setSelectExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [gradedResults, setGradedResults] = useState(null);

  const examProccess = async () => {};

  const handleGradeExams = async () => {
    if (!selectedExam) {
      alert("Selecciona un examen primero.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3001/api/v1/exams/grade-exams",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ exam_id: selectedExam }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al revisar los exámenes");
      }

      const data = await response.json();
      console.log("Resultados de exámenes:", data);

      setGradedResults(data); // 👉 Guardamos los resultados aquí
    } catch (error) {
      console.error("Error al calificar exámenes:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const fetchSelectExams = async () => {
    fetch("http://localhost:3001/api/v1/exams/active-exams")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setSelectExams(data.data);
        }
      })
      .catch((error) => {
        console.error("Error cargando exámenes para select:", error);
      });
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
    fetchSelectExams();
    fetchExams();
  }, []);

  if (loading) {
    return <div>Cargando exámenes...</div>;
  }

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  return (
    <div>
      <SideBar />

      <div className="check-content">
        <div className="input-bx-exam">
          {/* <label>Seleccione un examen para revisar:</label> */}
          <select
            required
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
          >
            <option value="">-- Selecciona un examen --</option>
            {selectExams.map((exam, index) => (
              <option key={index} value={exam.id}>
                {exam.id} {exam.title}
              </option>
            ))}
          </select>
        </div>

        <button onClick={handleGradeExams} disabled={loading || !selectedExam}>
          {loading ? "Revisando..." : "Revisar exámenes"}
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

        <UploadedExamsList exams={exams} loading={loading} />

        <button onClick={handleReviewClick}>
          {loading ? "Procesando..." : "Procesar exámenes"}
        </button>

        {gradedResults && <ExamResults results={gradedResults} />}
      </div>
    </div>
  );
};

export default ExamCheck;
