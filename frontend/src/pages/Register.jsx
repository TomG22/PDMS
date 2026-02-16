import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Register = () => {
  return (
    <>
      <Navbar ctaText="Login" />

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
            Register
          </div>

          {/* First + Last Name */}
          <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
            <div style={{ flex: 1 }}>
              <label>First Name</label>
              <input type="text" style={inputStyle} />
            </div>

            <div style={{ flex: 1 }}>
              <label>Last Name</label>
              <input type="text" style={inputStyle} />
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: "24px" }}>
            <label>Email Address</label>
            <input type="email" style={inputStyle} />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "24px" }}>
            <label>Password</label>
            <input type="password" style={inputStyle} />
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: "24px" }}>
            <label>Confirm Password</label>
            <input type="password" style={inputStyle} />
          </div>

          {/* Newsletter */}
          <div style={{ marginBottom: "24px", fontSize: "14px" }}>
            <label>
              <input type="checkbox" /> Subscribe to Newsletter
            </label>
          </div>

          {/* Register Button */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button style={buttonStyle}>Register</button>
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
  cursor: "pointer",
};

export default Register;
