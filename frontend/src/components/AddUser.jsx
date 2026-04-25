import { useState, useEffect } from "react";
import api from "../api/client";

function AddUser({ projectId, onClose, project }) {
  const [userEmail, setUserEmail] = useState("");
  const [availableUsers, setAvailableUsers] = useState([])

  useEffect(() => {
    const fetchAvailableUsers = async () => {
      try {
        const res = await api.get(`/projects/${projectId}/users/`);

        setAvailableUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch available users", err);
      }
      };
      fetchAvailableUsers();
    }, [projectId]);


  const handleAddUser = async () => {
    try {
      await api.post(`/projects/${projectId}/users/`, {
        user_email: userEmail,
      });
      
      setAvailableUsers(prev =>
        prev.filter(user => user.email !== userEmail)
      );
      alert(`Successfully added ${userEmail} to project!`);

      onClose();
    } catch (err) {
      console.error("Failed to add user:", err);
      alert("Failed to add user");
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2>Add User to Project</h2>

        <select
        value={userEmail}
        onChange={(event) => setUserEmail(event.target.value)}
        style={inputStyle}
        >
          <option value="">Select a user</option>

          {availableUsers.map((user) => (
            <option key={user.email} value={user.email}>
              {user.last_name}, {user.first_name} ({user.email})
            </option>
          ))}
        </select>

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