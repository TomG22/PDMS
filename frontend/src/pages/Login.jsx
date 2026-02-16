import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Login = () => {
  return (
    <>
      <Navbar ctaText="Register" />

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

          <div style={{ marginBottom: "24px" }}>
            <label>Email Address</label>
            <input type="email" style={inputStyle} />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label>Password</label>
            <input type="password" style={inputStyle} />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button style={buttonStyle}>Login</button>
          </div>
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
