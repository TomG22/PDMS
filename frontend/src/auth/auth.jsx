import axios from "axios";

const authLogin = async (username, password) => {
  try {
    const { data } = await axios.post(
      "http://127.0.0.1:8000/api/token/",
      { username, password },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    localStorage.clear();
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    window.location.href = "/tasks";
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    alert("Login failed. Please check your credentials.");
    return null;
  }
};

const authRegister = async (username, password, email) => {
  try {
    const { data } = await axios.post(
      "http://127.0.0.1:8000/api/register/",
      { username, password, email },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log("Registration successful", data);
    window.location.href = "/login";
    return data;
  } catch (error) {
    console.error(
      "Registration failed:",
      error.response?.data || error.message
    );
    return null;
  }
};

const authLogout = async () => {
  try {
    const accessToken = localStorage.getItem('access_token');
    const response= await axios.post(
      "http://127.0.0.1:8000/api/logout/",
      { refresh_token: localStorage.getItem("refresh_token") },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );
    
    console.log("Logout successful", response);

    // Clear tokens and redirect to login
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
  } catch (error) {
    console.error("Logout failed:", error.response?.data || error.message);
    return null;
  }
};

const authDeleteUser = async (password) => {
  const accessToken = localStorage.getItem('access_token');
  try {
    const { data } = await axios.post(
      "http://127.0.0.1:8000/api/delete/",
      { password },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export { authLogin, authRegister, authLogout, authDeleteUser };
