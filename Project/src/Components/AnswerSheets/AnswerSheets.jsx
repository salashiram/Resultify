import { Link } from "react-router-dom";
import SideBar from "../SideBar/Sidebar";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Upload, FileText, Check, Sheet } from "lucide-react";
import useAuthCheck from "../../hooks/useAuthCheck";
import "./AnswerSheets.css";

const AnswerSheets = () => {
  useAuthCheck([1, 2]);
  const [answerSheets, setAnswerSheets] = useState([]);

  useEffect(() => {
    const fetchAnswerSheets = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/v1/exams/list-answer-sheets"
        );
        setAnswerSheets(response.data);
      } catch (err) {
        console.error("Error al obtener hojas de respuestas", err);
      }
    };

    fetchAnswerSheets();
  }, []);

  const handlePrint = (fileName) => {
    const url = `http://localhost:3001/api/v1/exams/download-answer-sheet-file/${fileName}`;
    const printWindow = window.open(url, "_blank");
    printWindow.onload = () => printWindow.print();
  };

  return (
    <div>
      <SideBar />

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
