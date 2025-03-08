import React, { useState } from "react";
import "./Sidebar.css";
import "../../App.css";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate(); // hook de navegación

  const userProfile = () => {
    navigate("/UserProfile");
  };

  const homeRedirect = () => {
    navigate("/Home");
  };

  const dashboardRedirect = () => {
    navigate("/Dashboard");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div
        className={`burger-icon ${isOpen ? "inside" : ""}`}
        onClick={toggleSidebar}
      >
        ☰
      </div>

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <nav className="sidebar-content">
          <ul>
            <li>
              <a onClick={homeRedirect} href="#">
                Inicio
              </a>
            </li>
            <hr />
            <li>
              <a onClick={dashboardRedirect} href="#">
                Dashboard
              </a>
            </li>
            <hr />
            <li>
              <a href="#">Soporte</a>
            </li>
          </ul>
        </nav>
        <div className="profile-section">
          <img
            src="https://via.placeholder.com/50"
            alt="Avatar"
            className="profile-pic"
          />
          <div className="profile-info">
            <p>Hiram Salas</p>
            <small onClick={userProfile}>Ver perfil</small>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
