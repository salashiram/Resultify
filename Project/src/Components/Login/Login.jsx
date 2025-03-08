import React from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate(); // Crear el hook de navegación

  const loginValidate = (e) => {
    navigate("/Home");
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
            placeholder="Ingresa tu correo"
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            placeholder="Ingresa tu contraseña"
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
