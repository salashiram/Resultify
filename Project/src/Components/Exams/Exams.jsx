import React, { useEffect, useState } from "react";
import SideBar from "../SideBar/Sidebar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useAuthCheck from "../../hooks/useAuthCheck";
import "./Exams.css";

const Exams = () => {
  useAuthCheck([1, 2]);
  const navigate = useNavigate();
  const [examData, setExamData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getExamId = async (id) => {
    alert(id);
    localStorage.setItem("examId", id);
  };

  const fetchExams = async () => {
    try {
      const url = "http://localhost:3001/api/v1/exams/";

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Ocurrió un error insesperado");
        return;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al cargar los examanes");
      }

      const data = await response.json();

      const examsArray = Array.isArray(data)
        ? data.flat()
        : data.data
        ? Array.isArray(data.data)
          ? data.data.flat()
          : [data.data]
        : [];

      setExamData(examsArray);

      console.log("Datos recibidos:", examsArray);
    } catch (err) {
      console.error("Error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  return (
    <div>
      <SideBar />
      <div className="option-content">
        <Link to="/NewExam">
          <button>Nuevo</button>
        </Link>
      </div>
      <div className="dashboard-container">
        <div className="exam-table-content">
          <div className="exam-table">
            {loading ? (
              <p>Cargando...</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Titulo</th>
                    <th>Descripción</th>
                    <th>Grupo</th>
                    <th>Carrera</th>
                    <th>Autor</th>
                    <th>Estatus</th>
                  </tr>
                </thead>
                <tbody>
                  {examData.length > 0 ? (
                    examData.map((exam) => (
                      <tr key={exam.id}>
                        <td>
                          <a
                            onClick={() => getExamId(exam.id)}
                            href="/EditExam"
                          >
                            {exam.id}
                          </a>
                        </td>
                        <td>{exam.title}</td>
                        <td>{exam.description}</td>
                        <td>{exam.school_group}</td>
                        <td>{exam.school_career}</td>
                        <td>{exam.autor || "N/A"}</td>
                        <td>{exam.is_active ? "Activo" : "Inactivo"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8">No hay exámenes disponibles</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exams;
