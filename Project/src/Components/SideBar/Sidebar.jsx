import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Sidebar.css";
import "../../App.css";
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.id;
        const response = await fetch(
          `http://localhost:3001/api/v1/users/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const result = await response.json();
        if (result.ok) {
          setUserData(result.data[0]);
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    };

    fetchUserData();
  }, []);
  const userProfile = () => navigate("/UserProfile");
  const homeRedirect = () => navigate("/Home");
  const dashboardRedirect = () => navigate("/Dashboard");
  const toggleSidebar = () => setIsOpen(!isOpen);
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
            {userData && (userData.userRol === 1 || userData.userRol === 2) && (
              <>
                <li className="admin">
                  <a onClick={dashboardRedirect} href="#">
                    Dashboard
                  </a>
                </li>
                <hr />
              </>
            )}
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
            {userData ? (
              <>
                <p>
                  {userData.first_name} {userData.last_name}
                </p>
                <small onClick={userProfile}>Ver perfil</small>
              </>
            ) : (
              <p>Cargando...</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
