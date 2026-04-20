import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import TaskList from "../components/TaskList";
import TaskCreate from "../components/TaskCreate";
import SprintCreate from "../components/SprintCreate";

const ProjectBacklog = ({ project, refreshKey, onTaskCreated }) => {
    const [sprints, setSprints] = useState([]);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showSprintModal, setShowSprintModal] = useState(false);
    const [editingSprintId, setEditingSprintId] = useState(null);
    const [editData, setEditData] = useState({
        name: "",
        start_date: "",
        end_date: "",
        goal: ""
    });

    const fetchSprints = useCallback(async () => {
        if (!project?.id) return;
        const token = localStorage.getItem("access_token");
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const res = await axios.get(`http://localhost:8000/api/projects/${project.id}/sprints/`, { headers });
            setSprints(res.data);
        } catch (err) {
            console.error("Failed to fetch sprints", err);
        }
    }, [project?.id]);

    useEffect(() => {
        if (project?.id) fetchSprints();
    }, [project?.id, refreshKey, fetchSprints]);

    if (!project || !project.id) return <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>;

    const handleEditClick = (sprint) => {
        setEditingSprintId(sprint.id);
        setEditData({
            name: sprint.name,
            start_date: sprint.start_date || "",
            end_date: sprint.end_date || "",
            goal: sprint.goal || ""
        });
    };

    const handleUpdateSprint = async (sprintId) => {
        const token = localStorage.getItem("access_token");
        const headers = { Authorization: `Bearer ${token}` };
        const currentSprint = sprints.find(s => s.id === sprintId);

        try {
            await axios.patch(
                `http://localhost:8000/api/projects/${project.id}/sprints/${sprintId}/`,
                { 
                    ...editData,
                    completed: currentSprint?.completed,
                    on_incomplete_tasks: "backlog"
                },
                { headers }
            );
            setEditingSprintId(null);
            fetchSprints();
        } catch (err) {
            console.error("Update failed", err.response?.data);
        }
    };

    const handleDeleteSprint = async (sprintId) => {
        const token = localStorage.getItem("access_token");
        const headers = { Authorization: `Bearer ${token}` };
        try {
            await axios.delete(
                `http://localhost:8000/api/projects/${project.id}/sprints/${sprintId}/?on_incomplete_tasks=backlog`, 
                { headers }
            );
            fetchSprints();
            onTaskCreated();
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    const handleCreateTask = async (name, description, priority, assignedTo, sprintId) => {
        const token = localStorage.getItem("access_token");
        const headers = { Authorization: `Bearer ${token}` };
        try {
            await axios.post(`http://localhost:8000/api/projects/${project.id}/tasks/`, {
                name, description, priority, assigned_to: assignedTo, sprint: sprintId, project: project.id
            }, { headers });
            onTaskCreated();
            setShowTaskModal(false);
        } catch (err) {
            console.error("Failed to create task", err);
        }
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h2 style={{ margin: 0 }}>Project Backlog</h2>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button style={{ ...createBtnStyle, backgroundColor: "#444" }} onClick={() => setShowSprintModal(true)}>+ Create Sprint</button>
                    <button style={createBtnStyle} onClick={() => setShowTaskModal(true)}>+ Create Task</button>
                </div>
            </div>

            {sprints.map((sprint) => (
                <div key={sprint.id} style={sprintSectionStyle}>
                    {editingSprintId === sprint.id ? (
                        <div style={editFormContainer}>
                            <input 
                                style={inlineInputStyle} 
                                value={editData.name} 
                                onChange={(e) => setEditData({...editData, name: e.target.value})} 
                                placeholder="Sprint Name"
                            />
                            <div style={{ display: "flex", gap: "10px", margin: "10px 0" }}>
                                <input 
                                    type="date" 
                                    style={smallInputStyle} 
                                    value={editData.start_date} 
                                    onChange={(e) => setEditData({...editData, start_date: e.target.value})} 
                                />
                                <input 
                                    type="date" 
                                    style={smallInputStyle} 
                                    value={editData.end_date} 
                                    onChange={(e) => setEditData({...editData, end_date: e.target.value})} 
                                />
                            </div>
                            <textarea 
                                style={inlineTextAreaStyle} 
                                value={editData.goal} 
                                onChange={(e) => setEditData({...editData, goal: e.target.value})} 
                                placeholder="Sprint Goal..."
                            />
                            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                <button onClick={() => handleUpdateSprint(sprint.id)} style={saveBtnStyle}>Save Changes</button>
                                <button onClick={() => setEditingSprintId(null)} style={cancelBtnStyle}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div style={sprintHeaderStyle}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                    <h3 style={{ margin: 0 }}>{sprint.name}</h3>
                                    <span style={dateRangeStyle}>
                                        {sprint.start_date} — {sprint.end_date}
                                    </span>
                                </div>
                                {sprint.goal && <p style={goalTextStyle}><strong>Goal:</strong> {sprint.goal}</p>}
                            </div>
                            <div style={{ display: "flex", gap: "12px" }}>
                                <button onClick={() => handleEditClick(sprint)} style={actionBtnStyle}>Edit</button>
                                <button onClick={() => handleDeleteSprint(sprint.id)} style={deleteBtnStyle}>Delete</button>
                            </div>
                        </div>
                    )}
                    <TaskList project={project} type="sprint" sprintId={sprint.id} sprints={sprints} refreshKey={refreshKey} />
                </div>
            ))}

            <div style={backlogSectionStyle}>
                <h3 style={{ margin: 0, marginBottom: "15px" }}>Product Backlog</h3>
                <TaskList project={project} type="backlog" sprints={sprints} refreshKey={refreshKey} />
            </div>

            {showTaskModal && <TaskCreate onCreate={handleCreateTask} onClose={() => setShowTaskModal(false)} projectUsers={project.users || []} sprints={sprints} />}
            {showSprintModal && <SprintCreate projectId={project.id} onClose={() => setShowSprintModal(false)} onSave={() => { setShowSprintModal(false); fetchSprints(); }} />}
        </div>
    );
};

const containerStyle = { padding: "20px 0" };
const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" };
const sprintSectionStyle = { marginBottom: "40px", backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "12px", border: "1px solid #eee" };
const editFormContainer = { backgroundColor: "#fff", padding: "15px", borderRadius: "8px", border: "2px solid #862424", marginBottom: "15px" };
const sprintHeaderStyle = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" };
const dateRangeStyle = { fontSize: "13px", color: "#666", backgroundColor: "#eee", padding: "2px 8px", borderRadius: "4px" };
const goalTextStyle = { fontSize: "14px", color: "#444", margin: "8px 0 0 0", fontStyle: "italic" };
const inlineInputStyle = { width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "16px", fontWeight: "bold" };
const smallInputStyle = { flex: 1, padding: "6px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "13px" };
const inlineTextAreaStyle = { width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "14px", height: "60px", resize: "none" };
const backlogSectionStyle = { marginTop: "40px", padding: "20px", borderTop: "2px dashed #ccc" };
const createBtnStyle = { backgroundColor: "#862424", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" };
const actionBtnStyle = { background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "13px", textDecoration: "underline" };
const deleteBtnStyle = { ...actionBtnStyle, color: "#862424" };
const saveBtnStyle = { background: "#24864e", color: "white", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" };
const cancelBtnStyle = { background: "#eee", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer" };

export default ProjectBacklog;