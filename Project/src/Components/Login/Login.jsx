import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [loginData, setLoginData] = useState({
    logEmail: "",
    logPassword: "",
  });

  const navigate = useNavigate();

  const loginValidate = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3001/api/v1/users/login",
        {
          email: loginData.logEmail,
          password: loginData.logPassword,
        }
      );

      if (response.status == 200) {
        localStorage.setItem("token", response.data.token);
        navigate("/Home");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Las credenciales no son válidas");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h2>Iniciar Sesión</h2>
        <form className="login-form" id="loginForm" onSubmit={loginValidate}>
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="logEmail"
            placeholder="Ingresa tu correo"
            value={loginData.logEmail}
            onChange={(e) =>
              setLoginData({ ...loginData, logEmail: e.target.value })
            }
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="logPassword"
            placeholder="Ingresa tu contraseña"
            value={loginData.logPassword}
            onChange={(e) =>
              setLoginData({ ...loginData, logPassword: e.target.value })
            }
            required
          />

          <button type="submit">Ingresar</button>
        </form>
      </div>
      <div className="login-image-container">
        <img
          src="https://source.unsplash.com/600x800/?education,technology"
          alt="Ilustración de inicio de sesión"
        />
      </div>
    </div>
  );
};

export default Login;
