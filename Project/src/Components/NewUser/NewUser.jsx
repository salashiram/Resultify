import React from "react";
import SideBar from "../SideBar/Sidebar";
import "./NewUser.css";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const createUser = async (e) => {
    e.preventDefault();
  };
  const uploadUsers = () => {
    alert("holap");
  };

  return (
    <div>
      <SideBar />
      <div className="option-content">
        <button onClick={createUser}>Guardar Usuario</button>
        <button onClick={uploadUsers}>Cargar usuarios</button>
        <button>Limpiar</button>
      </div>
      <div className="frm-container">
        <form className="user-frm" action="">
          <div className="input-bx">
            <label>Correo electronico</label>
            <input type="email" />
          </div>
          <div className="input-bx">
            <label>Nombre(s)</label>
            <input type="text" />
          </div>
          <div className="input-bx">
            <label>Apellidos</label>
            <input type="text" />
          </div>
          <div className="input-bx">
            <label>Teléfono de contacto</label>
            <input type="number" />
          </div>
          <div className="input-bx">
            <label>Nueva contraseña</label>
            <input type="password" />
          </div>
          <div className="input-bx">
            <label>Confirmar contraseña</label>
            <input type="password" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
