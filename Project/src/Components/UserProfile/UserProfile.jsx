import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import SideBar from "../SideBar/Sidebar";
import { jwtDecode } from "jwt-decode";
import "./UserProfile.css";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
      }
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
      } catch (error) {}
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <SideBar />
      <div className="profile-container">
        <div className="banner">
          <div className="profile-picture"></div>

          <Link to={"/EditUser"}>
            <button>Editar perfil</button>
          </Link>
        </div>

        <div className="user-info">
          <h2>{`${userData.first_name} ${userData.last_name}`}</h2>
          <p className="username">@{userData.email}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
