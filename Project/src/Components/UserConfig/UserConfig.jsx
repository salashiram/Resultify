import { useState, useRef, useEffect } from "react";
import SideBar from "../SideBar/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuthCheck from "../../hooks/useAuthCheck";
import "./UserConfig.css";

const UserConfig = () => {
  useAuthCheck([1, 2]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_id: "",
    email: "",
    student_id: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    is_active: 1,
    passwordHash: "",
    repeatPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formRef = useRef();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      const idUser = localStorage.getItem("idUser");

      if (token) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/v1/users/${idUser}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.ok) {
            const user = response.data.data[0];
            setFormData({
              user_id: user.id,
              email: user.email,
              student_id: user.student_id,
              firstName: user.first_name,
              lastName: user.last_name,
              phoneNumber: user.phone_number,
              is_active: user.is_active,
            });
          } else {
            alert("Error al consultar la información del usuario"); // response.data.message
          }
        } catch (err) {
          alert("Error al consultar la información del usuario"); // response.data.message
        }
      } else {
        //
      }
    };
    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.passwordHash !== formData.repeatPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const updatedData = {
      password_hash: formData.passwordHash,
    };

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("idUser");
    if (token) {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/v1/users/update/pass/${userId}`,
          updatedData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Se actualizó el usuario correctamente");
        navigate("/UserProfile");
      } catch (err) {
        alert("Ocurrió un error al actualizar el usuario");
      }
    } else {
      //
    }
  };

  const deactivateUser = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("idUser");

    if (token) {
      try {
        const newStatus = formData.is_active === 1 ? 2 : 1;
        const numericParam = Number(newStatus);
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/v1/users/deactivate/${userId}`,
          { param: numericParam },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        alert("El usuario se actualizó correctamente");
        setFormData({ ...formData, is_active: newStatus });
        navigate("/Users");
      } catch (error) {
        alert("Error al actualizar el usuario");
      }
    } else {
      //
    }
  };

  return (
    <div>
      <SideBar />
      <div className="header">
        <h1>Modificar contraseña de usuario</h1>
      </div>
      <div className="option-content">
        <button
          onClick={() => {
            formRef.current.requestSubmit();
          }}
        >
          Guardar
        </button>
        <button onClick={deactivateUser}>
          {formData.is_active === 1 ? "Desactivar" : "Activar"}
        </button>
      </div>

      <div className="frm-container">
        <form
          className="user-frm"
          id="userFrm"
          ref={formRef}
          onSubmit={handleSubmit}
        >
          <input
            hidden
            type="text"
            name="id"
            value={formData.id || ""}
            onChange={handleChange}
          />
          <div className="input-bx">
            <input
              hidden
              type="text"
              name="isActive"
              readOnly
              value={formData.is_active || ""}
            />
            <label>Correo electrónico</label>
            <input
              type="email"
              name="email"
              readOnly
              value={formData.email || ""}
              onChange={handleChange}
            />
          </div>
          <div className="input-bx">
            <label>Matricula</label>
            <input
              type="number"
              name="student_id"
              readOnly
              value={formData.student_id || ""}
              onChange={handleChange}
            />
          </div>
          <div className="input-bx">
            <label>Nombre(s)</label>
            <input
              type="text"
              name="firstName"
              readOnly
              value={formData.firstName || ""}
              onChange={handleChange}
            />
          </div>
          <div className="input-bx">
            <label>Apellidos</label>
            <input
              type="text"
              name="lastName"
              readOnly
              value={formData.lastName || ""}
              onChange={handleChange}
            />
          </div>

          <div className="input-bx">
            <label htmlFor="">
              Nueva contraseña <span>*</span>
            </label>
            <input
              type="password"
              name="passwordHash"
              required
              value={formData.passwordHash || ""}
              onChange={handleChange}
            />
          </div>
          <div className="input-bx">
            <label htmlFor="">
              Confirmar contraseña <span>*</span>
            </label>
            <input
              type="password"
              name="repeatPassword"
              required
              value={formData.repeatPassword || ""}
              onChange={handleChange}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserConfig;
