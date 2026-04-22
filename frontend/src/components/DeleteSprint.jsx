import React, { useState } from "react";

const DeleteSprint = ({ sprintId, sprintName, onRemove, deleteBtnStyle }) => {
  const [showModal, setShowModal] = useState(false);

  const handleConfirm = async (e) => {
    e.preventDefault();
    try {
      await onRemove(sprintId);
      setShowModal(false);
    } catch (error) {
      console.error("Delete sprint:", error);
      alert("Failed to delete sprint.");
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        style={deleteBtnStyle}
      >
        Delete
      </button>

      {showModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3>Confirm Sprint Deletion</h3>
            <p>Are you sure you want to delete <strong>"{sprintName}"</strong>?</p>
            <p style={{ fontSize: "12px", color: "#666" }}>Incomplete tasks will be moved to the backlog.</p>
            <div style={{ display: "flex", gap: "8px", marginTop: "15px" }}>
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
  color: "#333",
  textAlign: "left"
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

export default DeleteSprint;