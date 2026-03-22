import React, { useState } from "react";
import { authLogin } from "../auth/auth";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authLogin(username, password);
      console.log("Form clicked");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    }
  };

  return (
    <>
      <Navbar ctaText="Register" ctaPath="/register" />
      <div style={{ padding: "120px 5%", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: "600px" }}>
          <div
            style={{
              textAlign: "center",
              fontSize: "clamp(40px, 5vw, 72px)",
              fontWeight: 700,
              marginBottom: "40px",
            }}
          >
            Login
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "24px" }}>
              <label>Username</label>
              <input
                type="username"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                style={inputStyle}
                required
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label>Password</label>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                style={inputStyle}
                required
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="submit" style={buttonStyle}>
                Login
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

const inputStyle = {
  width: "100%",
  height: "48px",
  marginTop: "8px",
  padding: "12px 16px",
  background: "#F2F4F8",
  border: "none",
  borderBottom: "1px solid #C1C7CD",
  fontSize: "16px",
};

const buttonStyle = {
  padding: "12px 32px",
  background: "#121619",
  color: "white",
  borderRadius: "8px",
  border: "none",
  fontSize: "16px",
};

export default Login;
