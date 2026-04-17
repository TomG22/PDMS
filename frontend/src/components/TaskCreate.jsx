import React, { useState } from "react";

const PRIORITY_OPTIONS = [
    { value: 0, label: "None" },
    { value: 1, label: "Low" },
    { value: 2, label: "Medium" },
    { value: 3, label: "High" },
];

const TaskCreate = ({ onCreate, onClose, projectUsers = [] }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState(0);
    const [assignedTo, setAssignedTo] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name) return alert("Task name is required");
        onCreate(
            name,
            description,
            parseInt(priority),
            assignedTo === "" ? null : parseInt(assignedTo)
        );
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h3>Create New Task</h3>
                <form onSubmit={handleSubmit}>
                    <div style={inputGroup}>
                        <label>Task Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Fix Navigation Bug"
                            style={inputStyle}
                        />
                    </div>
                    <div style={inputGroup}>
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What needs to be done?"
                            style={{ ...inputStyle, height: "80px" }}
                        />
                    </div>
                    <div style={inputGroup}>
                        <label>Priority</label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            style={inputStyle}
                        >
                            {PRIORITY_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={inputGroup}>
                        <label>Assignee</label>
                        <select
                            value={assignedTo}
                            onChange={(e) => setAssignedTo(e.target.value)}
                            style={inputStyle}
                        >
                            <option value="">Unassigned</option>
                            {projectUsers.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.username}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={buttonGroup}>
                        <button type="button" onClick={onClose} style={cancelBtn}>Cancel</button>
                        <button type="submit" style={submitBtn}>Create Task</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const overlayStyle = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
const modalStyle = { background: "white", padding: "30px", borderRadius: "12px", width: "400px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" };
const inputGroup = { marginBottom: "15px" };
const inputStyle = { width: "100%", padding: "10px", marginTop: "5px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box" };
const buttonGroup = { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" };
const cancelBtn = { background: "none", border: "none", cursor: "pointer", color: "#666" };
const submitBtn = { background: "#24864e", color: "white", border: "none", padding: "10px 20px", borderRadius: "4px", cursor: "pointer" };

export default TaskCreate;
