import React, { useEffect, useState } from "react";
import SideBar from "../SideBar/Sidebar";
import "./Users.css";
import { Link } from "react-router-dom";

const Users = () => {
  const [searchParam, setSearchParam] = useState("user_id");
  const [searchValue, setSearchValue] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState([]);

  const fetchUsers = async () => {
    try {
      const url = "http://localhost:3001/api/v1/users/";

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Ocurrió u error inesperado");
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!searchValue) {
      alert("Ingrese un valor para buscar");
      return;
    }

    setLoading(true);

    try {
      const url = `http://localhost:3001/api/v1/users/find?${searchParam}=${encodeURIComponent(
        searchValue
      )}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Usuario no encontrado");
      }

      const data = await response.json();

      console.log("Datos recibidos:", data);
      if (data && data.ok && data.data) {
        setUserData(data.data);
        console.log("Estado de userData:", data.data);
      } else {
        setUserData(null);
        alert("Usuario no encontrado.");
      }
    } catch (err) {
      alert("No se pudo obtener la información");
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SideBar />
      <div className="option-content">
        <Link to="/NewUser">
          <button>Nuevo usuario</button>
        </Link>
        <button>Cargar</button>
      </div>
      <div className="dashboard-container">
        <div className="search-content">
          {/* <div className="search">
            <select
              value={searchParam}
              onChange={(e) => setSearchParam(e.target.value)}
              name=""
              id=""
            >
              <option value="id">ID</option>
              <option value="email">Correo electrónico</option>
              <option value="student_id">Matrícula</option>
              <option value="phone_number">Teléfono de contacto</option>
            </select>
          </div> */}

          <div className="content-bx">
            <input
              type="text"
              placeholder="Ingresa un valor"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button onClick={handleSearch} disabled={loading}>
              {loading ? "Buscando..." : "Buscar"}
            </button>
          </div>
        </div>

        <div className="users-table">
          {userData && (
            <table
              border="1"
              // cellPadding="10"
              // cellSpacing="0"
              // style={{ width: "100%" }}
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Estatus</th>
                  <th>Rol</th>
                  <th>Matrícula</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Teléfono</th>
                </tr>
              </thead>
              <tbody>
                {userData.length > 0 ? (
                  userData.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <a href="#">{user.id}</a>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.userRol}</td>
                      <td>{user.student_id}</td>
                      <td>{user.first_name}</td>
                      <td>{user.last_name}</td>
                      <td>{user.phone_number || "N/A"}</td>
                      <td>{user.is_active ? "Activo" : "Inactivo"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">No hay usuarios disponibles</td>
                  </tr>
                )}
                {/* <tr>
                <td>{userData.id}</td>
                <td>{userData.email}</td>
                <td>{userData.is_active ? "Activo" : "Inactivo"}</td>
                <td>{userData.userRol}</td>
                <td>{userData.student_id}</td>
                <td>{userData.first_name}</td>
                <td>{userData.last_name}</td>
                <td>{userData.phone_number || "N/A"}</td>
              </tr> */}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
