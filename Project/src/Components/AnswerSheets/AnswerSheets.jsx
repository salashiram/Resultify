import SideBar from "../SideBar/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import useAuthCheck from "../../hooks/useAuthCheck";
import "./AnswerSheets.css";

const AnswerSheets = () => {
  useAuthCheck([1, 2]);
  const [answerSheets, setAnswerSheets] = useState([]);

  useEffect(() => {
    const fetchAnswerSheets = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/v1/exams/list-answer-sheets`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setAnswerSheets(response.data);
        } else {
          //
        }
      } catch (err) {
        alert("Error al cargar hojas de respuestas");
      }
    };

    fetchAnswerSheets();
  }, []);

  const handleClearAnswerSheets = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/v1/exams/clear-sheets-folder`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert(response.data.message);
        window.location.reload();
      } else {
        //
      }
    } catch (error) {
      alert("Hubo un error al intentar limpiar las carpetas.");
    }
  };

  const handlePrint = (fileName) => {
    const url = `${process.env.REACT_APP_API_URL}/api/v1/exams/download-answer-sheet-file/${fileName}`;
    const printWindow = window.open(url, "_blank");
    printWindow.onload = () => printWindow.print();
  };

  return (
    <div>
      <SideBar />

      <div className="header">
        <h1>Hojas de respuestas</h1>
      </div>
      <div className="option-content-buttons">
        <button onClick={handleClearAnswerSheets}>Borrar datos</button>
      </div>

      <div className="sheet-container">
        <div className="sheet-content">
          <h2>Hojas de Respuestas Generadas</h2>
          {answerSheets.length === 0 ? (
            <p>No hay hojas generadas.</p>
          ) : (
            <ul>
              {answerSheets.map((file, index) => (
                <li key={index}>
                  {file}
                  <button
                    onClick={() => handlePrint(file)}
                    style={{ marginLeft: "1rem" }}
                  >
                    Imprimir
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnswerSheets;
