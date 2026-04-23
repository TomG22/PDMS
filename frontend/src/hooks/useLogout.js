import { useNavigate } from "react-router";
import { authLogout } from "../auth/auth";

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await authLogout();
      console.log("Authorized logout from the frontend");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  return logout;
};
