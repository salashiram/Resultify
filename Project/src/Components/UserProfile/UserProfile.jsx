import React, { useState, useEffect } from "react";
import SideBar from "../SideBar/Sidebar";
import { jwtDecode } from "jwt-decode";
import "./UserProfile.css";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);

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
          <img
            src="https://via.placeholder.com/800x200"
            alt="Banner"
            className="banner-img"
          />
          <div className="profile-picture">
            <img src="https://via.placeholder.com/150" alt="Perfil" />
          </div>
        </div>

        <div className="user-info">
          <h2>{`${userData.first_name} ${userData.last_name}`}</h2>
          <p className="username">@{userData.email}</p>

          <div className="details">
            <p>
              <strong>Teléfono de contacto:</strong>{" "}
              {userData.phone_number || "No disponible"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
