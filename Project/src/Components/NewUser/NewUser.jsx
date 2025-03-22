import React, { useState, useRef } from "react";
import SideBar from "../SideBar/Sidebar";
import axios from "axios";
import "./NewUser.css";

const NewUser = () => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    userRol: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [alertMessage, setAlertMessage] = useState("");
  const [alertStyle, setAlertStyle] = useState({});

  const showAlert = (message) => {
    setAlertMessage(message);
  };

  const cleanFields = () => {
    setFormData({
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      userRol: "",
      password: "",
      confirmPassword: "",
    });
    showAlert("");
  };

  const formRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!(formData.password == formData.confirmPassword)) {
        showAlert("Las contraseñas no coinciden.");
        document.getElementById("alertMessage").style.color = "red";
        return;
      }

      const response = await axios.post(
        "http://localhost:3001/api/v1/users/register",
        {
          email: formData.email,
          password_hash: formData.password,
          rol_id: formData.userRol,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.phoneNumber,
        }
      );

      showAlert("Usuario creado exitosamente.");
      document.getElementById("alertMessage").style.color = "green";
      cleanFields();
    } catch (error) {
      if (error.response && error.response.data.message) {
        const errorMessage = error.response.data.message;

        if (errorMessage === "Email already exists") {
          showAlert("El correo electrónico ya está registrado.  ");
          document.getElementById("alertMessage").style.color = "red";
        } else {
          showAlert("Ocurrió un error al registrar el usuario.");
          document.getElementById("alertMessage").style.color = "red";
        }
      } else {
        showAlert("Ocurrió un error al registrar el usuario.");
        document.getElementById("alertMessage").style.color = "red";
      }
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
        <button>Cargar</button>
        <button onClick={cleanFields}>Limpiar</button>
        <br />
        <p id="alertMessage">{alertMessage}</p>
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
              Correo electrónico <span>*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="input-bx">
            <label>
              Nombre(s) <span>*</span>
            </label>
            <input
              type="text"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="input-bx">
            <label>
              Apellidos <span>*</span>
            </label>
            <input
              type="text"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="input-bx">
            <label>Teléfono de contacto</label>
            <input
              type="number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <div className="input-bx">
            <label>
              Rol de usuario <span>*</span>
            </label>
            <select
              name="userRol"
              value={formData.userRol}
              required
              onChange={handleChange}
            >
              <option value=""></option>
              <option value="2">Profesor</option>
              <option value="3">Estudiante</option>
            </select>
          </div>

          <div className="input-bx">
            <label>
              Nueva contraseña <span>*</span>
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="input-bx">
            <label>
              Confirmar contraseña <span>*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewUser;
