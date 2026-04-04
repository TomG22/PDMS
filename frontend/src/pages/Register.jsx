import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { authRegister } from "../auth/auth";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await authRegister(firstName, lastName, username, password, username);
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <>
      <Navbar ctaText="Login" ctaPath="/login" />

      <form onSubmit={handleSubmit}>
        <div style={{ padding: "120px 5%", display: "flex", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth: "600px" }}>
            
            <div
              style={{
                textAlign: "center",
                fontSize: "clamp(40px, 5vw, 56px)",
                fontWeight: 700,
                marginBottom: "40px",
              }}
            >
              Register
            </div>

            <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>

              {/* First Name */}
              <div style={{ flex: 1 }}>
                <label>First Name</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
            </div>

            {/* Last Name */}
            <div style={{ marginBottom: "24px" }}>
              <label>Last Name</label>
              <input
                type="text"
                style={inputStyle}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            

            {/* Email */}
            <div style={{ marginBottom: "24px" }}>
              <label>Email Address</label>
              <input
                type="email"
                style={inputStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Username */}
            <div style={{ marginBottom: "24px" }}>
              <label>Username</label>
              <input
                type="username"
                style={inputStyle}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "24px" }}>
              <label>Password</label>
              <input
                type="password"
                style={inputStyle}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Register Button */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="submit" style={buttonStyle}>
                Register
              </button>
            </div>

          </div>
        </div>
      </form>

      <Footer />
    </>
  );
};

const inputStyle = {
  width: "100%",
  height: "20px",
  marginTop: "8px",
  padding: "12px 16px",
  background: "#F2F4F8",
  border: "none",
  borderBottom: "1px solid #C1C7CD",
  fontSize: "16px",
  borderRadius: "7px"
};

const buttonStyle = {
  padding: "12px 32px",
  background: "#121619",
  color: "white",
  borderRadius: "8px",
  border: "none",
  fontSize: "16px",
  cursor: "pointer",
};

export default Register;
