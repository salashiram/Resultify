import React from "react";
import SideBar from "../SideBar/Sidebar";
import "./UserProfile.css";

const UserProfile = () => {
  const user = {
    fullName: "Juan Pérez",
    username: "@juanperez",
    profilePic: "",
    bannerPic: "https://via.placeholder.com/800x200",
    email: "juanperez@example.com",
    phone: "+52 123 456 7890",
    location: "Ciudad de México, México",
    bio: "Desarrollador web apasionado por React y Node.js 🚀",
  };

  return (
    <div>
      <SideBar />
      <div className="profile-container">
        <div className="banner">
          <img src={user.bannerPic} alt="Banner" className="banner-img" />
          <div className="profile-picture">
            <img src={user.profilePic} alt="Perfil" />
          </div>
        </div>

        <div className="user-info">
          <h2>{user.fullName}</h2>
          <p className="username">{user.username}</p>

          <div className="details">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Teléfono:</strong> {user.phone}
            </p>
            <p>
              <strong>Ubicación:</strong> {user.location}
            </p>
            <p>
              <strong>Biografía:</strong> {user.bio}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
