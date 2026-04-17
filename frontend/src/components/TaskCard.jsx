import React from "react";

const PRIORITY_OPTIONS = [
    { value: 0, label: "None" },
    { value: 1, label: "Low" },
    { value: 2, label: "Medium" },
    { value: 3, label: "High" },
];

const STATUS_OPTIONS = [
    { value: "ready_to_begin", label: "Ready to Begin" },
    { value: "in_progress", label: "In Progress" },
    { value: "under_review", label: "Under Review" },
    { value: "testing", label: "Testing" },
    { value: "done", label: "Done" },
];

const TaskCard = ({ task, projectUsers = [], onRemove, onUpdate }) => {
    return (
        <div style={cardStyle(task.completed)}>
            <div style={{ flex: 1 }}>
                <h4 style={{ margin: "0 0 5px 0", color: "#333" }}>{task.name}</h4>
                <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>{task.description}</p>

                <div style={{ display: "flex", gap: "16px", marginTop: "12px", flexWrap: "wrap" }}>
                    <label style={inlineLabelStyle}>
                        Priority:
                        <select
                            value={task.priority}
                            onChange={(e) => onUpdate(task.id, { priority: parseInt(e.target.value) })}
                            style={inlineSelectStyle}
                        >
                            {PRIORITY_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </label>

                    <label style={inlineLabelStyle}>
                        Assignee:
                        <select
                            value={task.assigned_to ?? ""}
                            onChange={(e) => {
                                const val = e.target.value;
                                onUpdate(task.id, { assigned_to: val === "" ? null : parseInt(val) });
                            }}
                            style={inlineSelectStyle}
                        >
                            <option value="">Unassigned</option>
                            {projectUsers.map((user) => (
                                <option key={user.id} value={user.id}>{user.username}</option>
                            ))}
                        </select>
                    </label>

                    <label style={inlineLabelStyle}>
                        Status:
                        <select
                            value={task.status}
                            onChange={(e) => onUpdate(task.id, { status: e.target.value })}
                            style={inlineSelectStyle}
                        >
                            {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginLeft: "16px", flexShrink: 0 }}>
                <span style={statusBadge(task.completed)}>
                    {task.completed ? "Done" : "Pending"}
                </span>
                <button onClick={() => onRemove(task.id)} style={deleteButtonStyle}>
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
    marginBottom: "10px",
});

const statusBadge = (completed) => ({
    fontSize: "12px",
    padding: "4px 8px",
    borderRadius: "12px",
    backgroundColor: completed ? "#E8F5E9" : "#FFF8E1",
    color: completed ? "#2E7D32" : "#F57F17",
    fontWeight: "600",
});

const inlineLabelStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    color: "#555",
    fontWeight: 500,
};

const inlineSelectStyle = {
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "3px 6px",
    fontSize: "13px",
    background: "#fff",
    cursor: "pointer",
};

const deleteButtonStyle = {
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
};

export default TaskCard;
