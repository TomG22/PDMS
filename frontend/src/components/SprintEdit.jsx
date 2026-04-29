import { useState, useEffect } from "react";

function SprintEdit({ sprint, onEdit, onClose }) {
    const [name, setName] = useState(sprint.name);
    const [startDate, setStartDate] = useState(sprint.start_date || "");
    const [endDate, setEndDate] = useState(sprint.end_date || "");
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if (
            name !== sprint.name || 
            startDate !== (sprint.start_date || "") || 
            endDate !== (sprint.end_date || "")
        ) {
            setIsDirty(true);
        } else {
            setIsDirty(false);
        }
    }, [name, startDate, endDate, sprint]);

    const handleClose = () => {
        if (isDirty) {
            if (window.confirm("You have unsaved changes. Are you sure you want to exit?")) {
                onClose();
            }
        } else {
            onClose();
        }
    };

    const handleSubmit = () => {
        onEdit(sprint.id, { 
            name, 
            start_date: startDate, 
            end_date: endDate
        });
        onClose();
    };

    return (
        <div style={overlay} onClick={handleClose}>
            <div style={cardStyle} onClick={(e) => e.stopPropagation()}>
                <h1 style={{ padding: "20px 20px 0px 20px" }}>Edit Sprint</h1>
                <button style={exitButton} onClick={handleClose}>✖</button>

                <div style={{ display: "flex", padding: "20px" }}>
                    <div style={{ width: "100%", maxWidth: "840px" }}>
                        
                        <div style={{ marginBottom: "20px" }}>
                            <label style={labelStyle}>Sprint Name</label>
                            <input 
                                type="text" 
                                value={name} 
                                style={inputStyle} 
                                onChange={e => setName(e.target.value)} 
                            />
                        </div>

                        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>Start Date</label>
                                <input type="date" value={startDate} style={inputStyle} onChange={e => setStartDate(e.target.value)} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>End Date</label>
                                <input type="date" value={endDate} style={inputStyle} onChange={e => setEndDate(e.target.value)} />
                            </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <button style={buttonStyle} onClick={handleSubmit}>Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const labelStyle = { fontWeight: "bold", display: "block", marginBottom: "4px" };
const inputStyle = { width: "100%", height: "20px", marginTop: "8px", padding: "12px 16px", background: "#F2F4F8", border: "none", borderBottom: "1px solid #C1C7CD", fontSize: "16px", borderRadius: "7px" };
const buttonStyle = { padding: "12px 32px", background: "#121619", color: "white", borderRadius: "8px", border: "none", fontSize: "16px", cursor: "pointer" };
const cardStyle = { width: "550px", background: "white", borderRadius: "10px", position: "relative", padding: "20px" };
const exitButton = { position: "absolute", top: "20px", right: "20px", fontSize: "20px", border: "0", background: "transparent", color: "red", cursor: "pointer" };
const overlay = { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0, 0, 0, 0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 };

export default SprintEdit;