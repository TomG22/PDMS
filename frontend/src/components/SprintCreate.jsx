import React, { useState } from "react";
import axios from "axios";

const SprintCreate = ({ projectId, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: "",
        start_date: "",
        end_date: "",
        goal: ""
    });
    const [isDirty, setIsDirty] = useState(false);

    const handleChange = (e) => {
        setIsDirty(true);
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleClose = () => {
        if (isDirty) {
            if (window.confirm("You have unsaved changes. Are you sure you want to exit?")) {
                onClose();
            }
        } else {
            onClose();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("access_token");
            await axios.post(
                `http://localhost:8000/api/projects/${projectId}/sprints/`, 
                formData, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onSave();
        } catch (err) {
            console.error("Failed to create sprint:", err);
            alert("Error creating sprint. Please check your data.");
        }
    };

    return (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <h3 style={{ marginTop: 0 }}>Create New Sprint</h3>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <div>
                        <label style={labelStyle}>Sprint Title</label>
                        <input 
                            name="name" 
                            style={inputStyle} 
                            placeholder="e.g. Q2 Core Features" 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    
                    <div style={{ display: "flex", gap: "10px" }}>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Start Date</label>
                            <input 
                                name="start_date" 
                                type="date" 
                                style={inputStyle} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>End Date</label>
                            <input 
                                name="end_date" 
                                type="date" 
                                style={inputStyle} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>Sprint Goal</label>
                        <textarea 
                            name="goal" 
                            style={{ ...inputStyle, height: "80px", resize: "none" }} 
                            placeholder="What are we accomplishing?" 
                            onChange={handleChange} 
                        />
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                        <button type="button" onClick={handleClose} style={cancelBtnStyle}>
                            Cancel
                        </button>
                        <button type="submit" style={saveBtnStyle}>
                            Save Sprint
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const modalOverlayStyle = {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
};
const modalContentStyle = {
    background: "white", padding: "25px", borderRadius: "12px", width: "450px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
};
const inputStyle = {
    width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box"
};
const labelStyle = {
    display: "block", fontSize: "12px", fontWeight: "bold", marginBottom: "5px", color: "#555"
};
const saveBtnStyle = {
    background: "#862424", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "600"
};
const cancelBtnStyle = {
    background: "#eee", color: "#333", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer"
};

export default SprintCreate;