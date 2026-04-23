import { useEffect } from "react";
import { useNavigate } from "react-router";

export const useAuth = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      navigate("/login");
    }
  }, [navigate]);
};
