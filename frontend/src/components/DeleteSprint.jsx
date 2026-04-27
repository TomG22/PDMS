import React, { useState } from "react";

const DeleteSprint = ({ sprintId, sprintName, onRemove, deleteBtnStyle }) => {
  const [showModal, setShowModal] = useState(false);

  const handleConfirm = async (taskAction) => {
    try {
      await onRemove(sprintId, taskAction);
      setShowModal(false);
    } catch (error) {
      console.error("Delete sprint error:", error);
      alert("Failed to delete sprint.");
    }
  };

  return (
    <>
      <button onClick={() => setShowModal(true)} style={deleteBtnStyle}>
        Delete
      </button>

      {showModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3 style={{ marginTop: 0 }}>Delete Sprint</h3>
            <p>
              Are you sure you want to delete <strong>"{sprintName}"</strong>?
            </p>
            <p style={{ fontSize: "13px", color: "#666", marginBottom: "20px" }}>
              How would you like to handle the tasks associated with this sprint?
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                onClick={() => handleConfirm("backlog")}
                style={confirmBtn}
              >
                Move tasks to Product Backlog
              </button>

              <button
                onClick={() => handleConfirm("delete")}
                style={{ ...confirmBtn, backgroundColor: "#d9534f" }}
              >
                Delete all associated tasks
              </button>

              <button
                onClick={() => setShowModal(false)}
                style={cancelBtn}
              >
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
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  background: "white",
  padding: "24px",
  borderRadius: "12px",
  width: "350px",
  color: "#333",
  textAlign: "left",
  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
};

const confirmBtn = {
  padding: "10px 16px",
  color: "white",
  background: "#444",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
};

const cancelBtn = {
  padding: "10px 16px",
  background: "transparent",
  border: "1px solid #ccc",
  borderRadius: "6px",
  cursor: "pointer",
  marginTop: "5px",
  color: "#666",
};

export default DeleteSprint;