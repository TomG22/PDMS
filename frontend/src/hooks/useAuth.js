import { useEffect } from "react";
import { useNavigate } from "react-router";
import { getRefreshToken, getAccessToken } from "../auth/tokens";

export const useAuth = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    if (!accessToken && !refreshToken) {
      navigate("/login");
    }
  }, [navigate]);
};
