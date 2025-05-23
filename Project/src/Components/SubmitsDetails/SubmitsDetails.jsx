import { useEffect, useState } from "react";
import SideBar from "../SideBar/Sidebar";
import useAuthCheck from "../../hooks/useAuthCheck";
import "./SubmitsDetails.css";

const SubmitDetails = () => {
  useAuthCheck([1, 2]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const examId = localStorage.getItem("examId");

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/submissions/getSubmissions/${examId}`,
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
      alert("Error al cargar los resultados");
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
      <div className="header">
        <h1>
          {submissions[0]?.examen ? (
            <>
              Resultados del examen: <span>{submissions[0].examen}</span>
            </>
          ) : (
            <>No hay resultados para este examen</>
          )}
        </h1>{" "}
      </div>
      <div className="header"></div>
      <div className="dashboard-container">
        {loading ? (
          <p>Cargando...</p>
        ) : submissions.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Alumno</th>
                <th>Matrícula</th>
                <th>Calificación</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission, index) => (
                <tr key={`${submission.id}-${index}`}>
                  <td>{submission.id}</td>
                  <td>{submission.alumno}</td>
                  <td>{submission.matricula || "N/A"}</td>
                  <td>{submission.calificacion}</td>
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
