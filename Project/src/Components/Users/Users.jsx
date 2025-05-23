import { useState } from "react";
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
          `${process.env.REACT_APP_API_URL}/api/v1/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const user = response.data;
        setUserData(response.data.data);
      } else {
        //
      }
    } catch (err) {
      alert("Error al buscar el usuario");
      setUserData([]);
    }
  };

  return (
    <div>
      <SideBar />

      <div className="header">
        <h1>Usuarios</h1>
      </div>

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
          placeholder="Buscar usuario"
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
                    <th>#</th>
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
