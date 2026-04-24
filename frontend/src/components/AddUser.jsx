import { useState } from "react";
import axios from "axios";

function AddUser({ projectId, onClose }) {
  const [userId, setUserId] = useState("");

  const handleAddUser = async () => {
    try {
      const token = localStorage.getItem("access_token");

      await axios.post(
        `http://localhost:8000/api/projects/${projectId}/users/`,
        { user_id: Number(userId) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onClose(); // close modal after success
    } catch (err) {
      console.error("Failed to add user:", err);
      alert("Failed to add user");
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2>Add User to Project</h2>

        <input
          type="text"
          placeholder="Enter user ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={inputStyle}
        />

        <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
          <button style={primaryBtn} onClick={handleAddUser}>
            Add
          </button>

          <button style={secondaryBtn} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)", // dark overlay
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "12px",
  width: "400px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  marginTop: "10px",
};

const primaryBtn = {
  flex: 1,
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  background: "#862424",
  color: "white",
  cursor: "pointer",
};

const secondaryBtn = {
  flex: 1,
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  background: "#777",
  color: "white",
  cursor: "pointer",
};

export default AddUser;