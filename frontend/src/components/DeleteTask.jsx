import React, { useState } from "react";

const DeleteTask = ({ taskId, taskName, onRemove }) => {
  const [showModal, setShowModal] = useState(false);

  const handleConfirm = async (e) => {
    e.preventDefault();
    try {
      await onRemove(taskId);
      setShowModal(false);
    } catch (error) {
      console.error("Delete task:", error);
      alert("Failed to delete task.");
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setShowModal(true)}
        style={{
          background: "#2C2C2C",
          color: "white",
          border: "none",
          padding: "6px 12px",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "12px",
          fontWeight: "600",
          flexShrink: 0,
          boxShadow: "0 0 20px rgba(255, 0, 0, 0.5)",
        }}
      >
        Delete
      </button>

      {/* Overlay */}
      {showModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3>Confirm Task Deletion</h3>
            <p>Are you sure you want to delete <strong>"{taskName}"</strong>?</p>
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

export default DeleteTask;
