import React, { useState, useRef, useEffect } from "react";
import SideBar from "../SideBar/Sidebar";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./EditUser.css";
import { jwtDecode } from "jwt-decode";

const EditUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    student_id: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [alertMessage, setAlertMessage] = useState("");

  const formRef = useRef();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        try {
          const response = await axios.get(
            `http://localhost:3001/api/v1/users/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.ok) {
            const user = response.data.data[0];
            setFormData({
              email: user.email,
              student_id: user.student_id,
              firstName: user.first_name,
              lastName: user.last_name,
              phoneNumber: user.phone_number,
            });
          } else {
            console.error("Error fetching user data", response.data.message);
          }
        } catch (err) {
          console.error("Error fetching user data", err);
        }
      } else {
        // enviar a login
      }
    };
    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = { ...formData };

    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      try {
        // const response = await axios.put({});

        const response = await axios.put(
          `http://localhost:3001/api/v1/users/update/${userId}`,
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
        </form>
      </div>
    </div>
  );
};

export default EditUser;
