import React, { useEffect, useState } from "react";
import SideBar from "../SideBar/Sidebar";
import { Link } from "react-router-dom";
import axios from "axios";
import useAuthCheck from "../../hooks/useAuthCheck";
import "./Users.css";

const Users = () => {
  useAuthCheck([1, 2]);
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState("");

  const getIdUser = async (id) => {
    localStorage.setItem("idUser", id);
  };

  const searchUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        const response = await axios.get(
          `http://localhost:3001/api/v1/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response.data);
        const user = response.data;
        setUserData(response.data.data);
      } else {
        // error
      }
    } catch (err) {
      console.error("Error al buscar el usuario", err);
      setUserData([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const url = "http://localhost:3001/api/v1/users/";

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Ocurrió un error inesperado");
        return;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al cargar los usuarios");
      }

      const data = await response.json();
      const usersArray = Array.isArray(data)
        ? data.flat()
        : data.data
        ? Array.isArray(data.data)
          ? data.data.flat()
          : [data.data]
        : [];

      setUserData(usersArray);
      console.log("Datos recibidos");
    } catch (err) {
      console.log("Error", err);
    } finally {
    }
  };

  useEffect(() => {
    // fetchUsers();
  }, []);

  return (
    <div>
      <SideBar />
      <div className="option-content">
        <Link to="/NewUser">
          <button>Nuevo usuario</button>
        </Link>
      </div>

      <div className="search-content">
        <input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          type="text"
          placeholder="Buscar por id"
        />
        <button onClick={searchUser}>Buscar</button>
      </div>

      <div className="dashboard-container">
        <div className="users-table-content">
          <div className="users-table">
            {userData && (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Matrícula</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Teléfono</th>
                    <th>Rol</th>
                    <th>Estatus</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.length > 0 ? (
                    userData.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <a onClick={getIdUser(user.id)} href="/UserConfig">
                            {user.id}
                          </a>
                        </td>
                        <td>{user.email}</td>
                        <td>{user.student_id}</td>
                        <td>{user.first_name}</td>
                        <td>{user.last_name}</td>
                        <td>{user.phone_number || "N/A"}</td>
                        <td>{user.user_rol || user.userRol}</td>
                        <td>{user.is_active ? "Activo" : "Inactivo"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8">No hay usuarios disponibles</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
