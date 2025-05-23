import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Sidebar.css";
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const sideBarRef = useRef(null);

  const handleClickOutside = (event) => {
    if (sideBarRef.current && !sideBarRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.id;
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/v1/users/${userId}`,
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
        // alert("Error al obtener datos del usuario");
      }
    };

    fetchUserData();
  }, []);
  const userProfile = () => navigate("/UserProfile");
  const dashboardRedirect = () => navigate("/Dashboard");
  const toggleSidebar = () => setIsOpen(!isOpen);
  const logOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <>
      <div
        className={`burger-icon ${isOpen ? "inside" : ""}`}
        onClick={toggleSidebar}
      >
        ☰
      </div>
      <div className={`sidebar ${isOpen ? "open" : ""}`} ref={sideBarRef}>
        <nav className="sidebar-content">
          <ul>
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
          <img className="profile-pic" />
          <div className="profile-info">
            {userData ? (
              <>
                <p onClick={userProfile}>
                  {userData.first_name} {userData.last_name}
                </p>
                <small onClick={logOut}>Cerrar sesión</small>
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
