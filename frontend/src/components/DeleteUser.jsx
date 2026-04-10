import React, { useState } from "react";
import { authDeleteUser } from "../auth/auth";

const DeleteUser = () => {
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");

  const handleConfirm = async (e) => {
    e.preventDefault();
    try {
      await authDeleteUser(password);

      setShowModal(false);
      window.location.href = "/login";

    } catch (error) {
      console.error("Delete user:", error);
      alert("Password confirmation failed.");
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setShowModal(true)}
        style={{
          padding: "8px 16px",
          background: "#2C2C2C",
          color: "white",
          borderRadius: "8px",
          fontSize: "15px",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 0 20px rgba(255, 0, 0, 0.5)",
        }}
      >
        Delete My Account
      </button>

      {/* Overlay */}
      {showModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3>Confirm Account Deletion</h3>
            <p>Please enter your password to continue:</p>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                padding: "8px",
                width: "100%",
                marginBottom: "12px",
                boxSizing: "border-box",
              }}
            />

            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={handleConfirm} style={confirmBtn}>
                Confirm
              </button>
              <button onClick={() => setShowModal(false)} style={cancelBtn}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  background: "white",
  padding: "24px",
  borderRadius: "8px",
  width: "300px",
};

const confirmBtn = {
  padding: "8px 16px",
  color: "white",
  background: "rgb(134, 36, 36)",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const cancelBtn = {
  padding: "8px 16px",
  background: "#ccc",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

export default DeleteUser;
