import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SideBar from "../SideBar/Sidebar";

const SubmitDetails = () => {
  const examId = localStorage.getItem("examId");

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3001/api/v1/submissions/getSubmissions/${examId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (result.ok && Array.isArray(result.data)) {
        setSubmissions(result.data);
      } else {
        setSubmissions([]);
      }
    } catch (error) {
      console.error("Error al cargar submissions:", error);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [examId]);

  return (
    <div>
      <SideBar />
      <div className="dashboard-container">
        <h2>Entregas del examen</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : submissions.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Alumno</th>
                <th>Matrícula</th>
                <th>Calificación</th>
                <th>Examen</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.id}>
                  <td>{submission.id}</td>
                  <td>{submission.alumno}</td>
                  <td>{submission.matricula || "N/A"}</td>
                  <td>{submission.calificacion}</td>
                  <td>{submission.examen}</td>
                  <td>{submission.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay entregas para este examen.</p>
        )}
      </div>
    </div>
  );
};

export default SubmitDetails;
