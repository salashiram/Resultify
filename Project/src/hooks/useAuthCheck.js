import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const useAuthCheck = (allowedRoles = []) => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
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

        if (!response.ok) throw new Error("Error al obtener datos del usuario");

        const result = await response.json();

        if (result.ok) {
          const userRole = result.data[0].userRol;
          if (!allowedRoles.includes(userRole)) {
            navigate("/UserProfile"); // Si no tiene permiso, redirige
          }
        }
      } catch (error) {
        throw new Error("Error inesperado al obtener datos del usuario");
      }
    };

    fetchUserData();
  }, [navigate, allowedRoles]);
};

export default useAuthCheck;
