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
          `http://localhost:3001/api/v1/users/${userId}`,
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
            navigate("/Home"); // Si no tiene permiso, redirige
          }
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        navigate("/");
      }
    };

    fetchUserData();
  }, [navigate, allowedRoles]);
};

export default useAuthCheck;
