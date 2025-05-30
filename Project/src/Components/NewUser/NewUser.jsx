import { useState, useRef } from "react";
import SideBar from "../SideBar/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuthCheck from "../../hooks/useAuthCheck";
import "./NewUser.css";

const NewUser = () => {
  useAuthCheck([1, 2]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    student_id: "",
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

  const cleanFields = () => {
    setFormData({
      email: "",
      student_id: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      userRol: "",
      password: "",
      confirmPassword: "",
    });
  };

  const formRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (token) {
      try {
        if (!(formData.password == formData.confirmPassword)) {
          alert("Las contraseñas no coinciden.");
          return;
        }

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/v1/users/register`,
          {
            email: formData.email,
            student_id: formData.student_id,
            password_hash: formData.password,
            rol_id: formData.userRol,
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone_number: formData.phoneNumber,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status == 201) {
          alert("Usuario creado exitosamente.");
          navigate("/Users");
        }
      } catch (error) {
        if (error.response && error.response.data.message) {
          const errorMessage = error.response.data.message;

          if (errorMessage === "Email already exists") {
            alert("El correo electrónico ya está registrado.");
          } else if (errorMessage === "Student id already exists") {
            alert("La matricula ya está registrada");
          } else {
            alert("Ocurrió un error al registrar el usuario.");
          }
        } else {
          alert("Ocurrió un error al registrar el usuario.");
        }
      }
    } else {
      //
    }
  };

  return (
    <div>
      <SideBar />
      <div className="header">
        <h1>Crear usuario</h1>
      </div>
      <div className="option-content">
        <button
          onClick={() => {
            formRef.current.requestSubmit();
          }}
        >
          Guardar
        </button>
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
            <label>Matricula</label>
            <input
              type="number"
              name="student_id"
              value={formData.student_id}
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
