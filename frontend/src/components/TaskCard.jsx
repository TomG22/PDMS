import React from "react";

const TaskCard = ({ task, onRemove }) => {
    return (
        <div style={cardStyle(task.completed)}>
            <div style={{ flex: 1 }}>
                <h4 style={{ margin: "0 0 5px 0", color: "#333" }}>{task.name}</h4>
                <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>{task.description}</p>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <span style={statusBadge(task.completed)}>
                    {task.completed ? "Done" : "Pending"}
                </span>
                <button 
                    onClick={() => onRemove(task.id)} 
                    style={deleteButtonStyle}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

const cardStyle = (completed) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 20px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    borderLeft: completed ? "5px solid #4CAF50" : "5px solid #FFC107",
    marginBottom: "10px"
});

const statusBadge = (completed) => ({
    fontSize: "12px",
    padding: "4px 8px",
    borderRadius: "12px",
    backgroundColor: completed ? "#E8F5E9" : "#FFF8E1",
    color: completed ? "#2E7D32" : "#F57F17",
    fontWeight: "600"
});

const deleteButtonStyle = {
    background: "none",
    border: "1px solid #ff4d4d",
    color: "#ff4d4d",
    padding: "5px 10px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    transition: "0.2s"
};

export default TaskCard;