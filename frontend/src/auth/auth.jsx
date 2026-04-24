import axios from "axios";
import api from "../api/client";
import { getRefreshToken, setTokens, clearTokens } from "./tokens";

const authLogin = async (username, password) => {
  const { data } = await axios.post(
    "http://127.0.0.1:8000/api/token/",
    { username, password },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  clearTokens();
  setTokens({ access: data.access, refresh: data.refresh });
  return data;
};

const authRegister = async (firstName, lastName, email, password) => {
  const { data } = await axios.post(
    "http://127.0.0.1:8000/api/register/",
    { firstName, lastName, email, password },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  console.log("Registration successful", data);
  return data;
};

const authLogout = async () => {
  const refresh = getRefreshToken();
  const {data } = await api.post("/logout/", { refresh_token: refresh });
  clearTokens();
  return data;
};

const authDeleteUser = async (password) => {
  try {
    const { data } = await api.delete("/user/", { data: { password } });
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export { authLogin, authRegister, authLogout, authDeleteUser };
