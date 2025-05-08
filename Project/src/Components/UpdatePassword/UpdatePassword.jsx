import React, { useState, useRef, useEffect } from "react";
import SideBar from "../SideBar/Sidebar";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./UpdatePassword.css";
import { jwtDecode } from "jwt-decode";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    repeatPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [alertMessage, setAlertMessage] = useState("");

  const formRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = { ...formData };

    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      try {
        const response = await axios.put(
          `http://localhost:3001/api/v1/users//update/${userId}`,
          updatedData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Datos enviados al backend:", updatedData);
        console.log("Usuario actualizado:", response.data);
        alert("Se actualizó el usuario correctamente");
        navigate("/UserProfile");
      } catch (err) {
        console.error("Error al actualizar el usuario", err);
        alert("Ocurrió un error al actualizar el usuario");
      }
    } else {
      // enviar a login
    }
  };

  return (
    <div>
      <SideBar />
      <div className="option-content">
        <button
          onClick={() => {
            formRef.current.requestSubmit();
          }}
        >
          Guardar
        </button>

        <Link to={"/EditUser"}>
          <button>Actualizar contraseña</button>
        </Link>
      </div>

      <div className="frm-container">
        <form
          className="user-frm"
          id="userFrm"
          ref={formRef}
          onSubmit={handleSubmit}
        >
          <div className="input-bx">
            <label>
              Contraseña actual <span>*</span>
            </label>
            <input
              type="text"
              name="currentPassword"
              required
              value={formData.currentPassword}
              onChange={handleChange}
            />
          </div>

          <div className="input-bx">
            <label>
              Nueva contraseña <span>*</span>
            </label>
            <input
              type="text"
              name="password_hash"
              value={formData.newPassword}
              onChange={handleChange}
            />
          </div>

          <div className="input-bx">
            <label>
              Confirmar contraseña <span>*</span>
            </label>
            <input
              type="text"
              name="repeatPassword"
              required
              value={formData.repeatPassword}
              onChange={handleChange}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
