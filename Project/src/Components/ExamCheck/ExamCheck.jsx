import React, { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../SideBar/Sidebar";
import UploadedExamsList from "../UploadedExamsList/UploadedExamsList";
import DetectedExams from "../DetectedExams/DetectedExams";
import ExamResults from "../ExamResults/ExamResults";
import "./ExamCheck.css";

const ExamCheck = () => {
  const [files, setFiles] = useState([]);
  const [exams, setExams] = useState([]);
  const [detectedExams, setDetectedExams] = useState([]);
  const [selectExams, setSelectExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [gradedResults, setGradedResults] = useState(null);
  const [savedData, setSavedData] = useState({
    results: null,
    gradedResults: null,
  });

  const handleSaveData = () => {
    if (!results && !gradedResults) {
      alert("No hay datos para guardar.");
      return;
    }

    setSavedData({
      results,
      gradedResults,
    });

    alert("Datos guardados en memoria (useState)!");
  };

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

      setGradedResults(data); // Guardamos los resultados aquí
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
      window.location.reload();
    } catch (err) {
      alert("Error al procesar los examenes");
      console.error("Error al procesar los exámenes:", err);
      window.location.reload();
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

  const fetchDetectedExams = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/v1/uploads/get-detected-exams"
      );
      setDetectedExams(response.data);
    } catch (err) {
      console.error("Error al obtener os examenes procesados", err);
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
    fetchSelectExams();
    fetchExams();
    fetchDetectedExams();
  }, []);

  if (loading) {
    return <div>Cargando exámenes...</div>;
  }

  const handleClearTemp = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:3001/api/v1/exams/clear-temp-folders"
      );
      alert(response.data.message);
      window.location.reload();
    } catch (error) {
      console.error("Error al limpiar carpetas:", error);
      alert("Hubo un error al intentar limpiar las carpetas.");
    }
  };

  const handleSaveResults = async () => {
    if (!gradedResults || !Array.isArray(gradedResults.results)) {
      alert("No hay resultados para guardar.");
      return;
    }

    const payload = {
      exam_id: gradedResults.exam_id,
      results: gradedResults.results.map((result) => ({
        matricula: result.matricula,
        nombre_completo: result.nombre_completo,
        grade: result.score, // aseguramos que coincida con `score` esperado en el backend
      })),
    };

    try {
      const response = await fetch(
        "http://localhost:3001/api/v1/submissions/saveResults",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("No se pudieron guardar los resultados");
      }

      const data = await response.json();
      alert("Resultados guardados correctamente");
      console.log("Respuesta del servidor:", data);
    } catch (error) {
      console.error("Error al guardar resultados:", error);
      alert("Error al guardar resultados");
    }
  };

  return (
    <div>
      <SideBar />
      <div className="option-content">
        <button onClick={handleClearTemp}>Borrar datos</button>
        <button onClick={handleReviewClick}>
          {loading ? "Procesando..." : "Procesar exámenes"}
        </button>
        <button onClick={handleSaveResults}>Guardar datos</button>
      </div>

      <div className="exam-check-content">
        <div className="exam-check-left-content">
          <UploadedExamsList exams={exams} loading={loading} />
        </div>

        <div className="exam-check-medium-content">
          <DetectedExams exams={detectedExams} loading={loading} />
        </div>
      </div>

      <div className="exam-processed-cotent">
        <div className="exam-check-right-content">
          <div className="input-bx-exam">
            <select
              required
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
            >
              <option value="">Selecciona un examen</option>
              {selectExams.map((exam, index) => (
                <option key={index} value={exam.id}>
                  {exam.id} {exam.title}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGradeExams}
            disabled={loading || !selectedExam}
          >
            {loading ? "Revisando..." : "Revisar exámenes"}
          </button>

          {results && (
            <div>
              <h2>Resultados:</h2>
              {results.map((result, index) => (
                <div key={index}>
                  <h3>Examen de {result.folder}:</h3>{" "}
                  <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
              ))}
            </div>
          )}

          {gradedResults && <ExamResults results={gradedResults} />}
        </div>
      </div>
    </div>
  );
};

export default ExamCheck;
