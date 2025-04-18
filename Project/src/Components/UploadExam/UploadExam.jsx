import React, { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../SideBar/Sidebar";
import { useNavigate } from "react-router-dom";
import "./UploadExam.css";

const UploadExam = () => {
  const navigate = useNavigate();
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

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Selecciona al menos un archivo");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file); // 🔥 OJO, debe coincidir con el nombre en el backend
    });

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3001/api/v1/uploads/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Archivo subido con éxito!");
      navigate("/ExamCheck");
      console.log(response.data);
    } catch (error) {
      console.error("Error al subir archivo", error);
      alert("Error al subir archivo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SideBar />
      <div className="file-container">
        <label for="file" class="custum-file-upload">
          <div class="icon">
            <svg viewBox="0 0 24 24" fill="" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                  fill=""
                ></path>{" "}
              </g>
            </svg>
          </div>
          <div class="text">
            <span>Selecciona los archivos</span>
          </div>
          <input
            id="file"
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleFileChange}
          ></input>
        </label>
        <button onClick={handleUpload}>Subir</button>
      </div>
    </div>
  );
};

export default UploadExam;
