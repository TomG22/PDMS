import React from "react";
import DeleteTask from "./DeleteTask";

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

const TaskCard = ({ task, projectUsers = [], projectName = null, onRemove, onUpdate }) => {
    const isDone = task.status === "done";

    return (
        <div style={cardStyle(isDone)}>
            <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
                    <h4 style={{ margin: 0, color: "#333" }}>{task.name}</h4>
                    {projectName && (
                        <span style={projectBadgeStyle}>{projectName}</span>
                    )}
                </div>
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

                    {projectUsers.length > 0 ? (
                        <label style={inlineLabelStyle}>
                            Assignee:
                            <select
                                value={task.assigned_to != null ? String(task.assigned_to) : ""}
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
                    ) : (
                        <span style={inlineLabelStyle}>
                            Assignee: {task.assigned_to_username || "Unassigned"}
                        </span>
                    )}

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
                <DeleteTask taskId={task.id} taskName={task.name} onRemove={onRemove} />
            </div>
        </div>
    );
};

const cardStyle = (isDone) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 20px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    borderLeft: isDone ? "5px solid #4CAF50" : "5px solid #FFC107",
    marginBottom: "10px",
});

const projectBadgeStyle = {
    fontSize: "11px",
    padding: "2px 8px",
    borderRadius: "12px",
    backgroundColor: "#E8EAF6",
    color: "#3949AB",
    fontWeight: "600",
};

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

export default TaskCard;
