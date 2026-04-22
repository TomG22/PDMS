import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import TaskCreate from "../components/TaskCreate";

function ProjectTasks({ projectId }) {
    const [tasks, setTasks] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const navigate = useNavigate();
    const [projectUsers, setProjectUsers] = useState([]);
    const [sprints, setSprints] = useState([])

    const fetchTasks = async () => {
        try {
            let token = localStorage.getItem("access_token");

            if (!token) {
                navigate("/login");
                return;
            }

            let res = await axios.get(
                `http://localhost:8000/api/projects/${projectId}/tasks/`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            ).catch(async (err) => {
                if (err.response?.status === 401) {
                    const refresh = localStorage.getItem("refresh_token");

                    const refreshRes = await axios.post(
                        "http://localhost:8000/api/token/refresh/",
                        { refresh }
                    );

                    token = refreshRes.data.access;
                    localStorage.setItem("access_token", token);

                    return axios.get(
                        `http://localhost:8000/api/projects/${projectId}/tasks/`,
                        {
                            headers: { Authorization: `Bearer ${token}` }
                        }
                    );
                }
                throw err;
            });

            setTasks(res.data);
            console.log("Fetched tasks:", res.data);
        } catch (err) {
            console.error("Failed to fetch tasks", err);
            navigate("/login");
        }
    };

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const headers = { Authorization: `Bearer ${token}` };
            
                const [projRes, sprintRes] = await Promise.all([
                    axios.get(`http://localhost:8000/api/projects/${projectId}/`, { headers }),
                    axios.get(`http://localhost:8000/api/projects/${projectId}/sprints/`, { headers })
                ]);
                
                setProjectUsers(projRes.data.users || []);
                setSprints(sprintRes.data || []);
            } catch (err) {
                console.error("Failed to fetch metadata", err);
            }
        };

        fetchTasks();   
        fetchMetadata();
    }, [projectId]);

    const handleAddTask = async (name, description, priority, assignedTo, sprintId) => {
        try {
            let token = localStorage.getItem("access_token");

            const payload = {
                name,
                description,
                priority: Number(priority),
                assigned_to: assignedTo || null, 
                sprint: sprintId || null,
                completed: false,
                project: Number(projectId)
            };

            const postTask = async (authToken) => {
                return await axios.post(
                    `http://localhost:8000/api/projects/${projectId}/tasks/`,
                    payload,
                    { headers: { Authorization: `Bearer ${authToken}` } }
                );
            };

            let res;
            try {
                res = await postTask(token);
            } catch (err) {
                if (err.response?.status === 401) {
                    const refresh = localStorage.getItem("refresh_token");
                    const refreshRes = await axios.post(
                        "http://localhost:8000/api/token/refresh/",
                        { refresh }
                    );

                    token = refreshRes.data.access;
                    localStorage.setItem("access_token", token);
                    
                    res = await postTask(token);
                } else {
                    throw err;
                }
            }
            await fetchTasks();
            setShowCreate(false);

        } catch (err) {
            console.error("Failed to create task:", err);
            console.log("ERROR DATA:", err.response?.data);
        }
    };

    const handleUpdateTask = async (taskId, fields) => {
        try {
            const token = localStorage.getItem("access_token");
            const res = await axios.patch(
                `http://localhost:8000/api/tasks/${taskId}/`,
                fields,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // This is the line causing the error if 'setTasks' isn't defined
            setTasks(prev => prev.map(t => t.id === taskId ? res.data : t));
        } catch (err) {
            console.error("Failed to update task:", err);
        }
    };

    const handleRemoveTask = async (taskId) => {
        try {
            const token = localStorage.getItem("access_token");

            await axios.delete(
                `http://localhost:8000/api/tasks/${taskId}/`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setTasks(prev => prev.filter(t => t.id !== taskId));

        } catch (err) {
            console.error("Failed to delete task", err);
        }
    };

    return (
    <div style={{ padding: "40px 5%", maxWidth: "900px", margin: "0 auto", width: "100%" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <h2 style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 700, margin: 0 }}>
                Tasks
            </h2>
            <button style={addTaskButtonStyle} onClick={() => setShowCreate(true)}>
                + New Task
            </button>
        </div>

        <p style={{ color: "#666", marginBottom: "30px" }}>
            Manage and track progress for this project.
        </p>

        {/* Task list */}
        <ul style={{ listStyle: "none", padding: 0 }}>
            {tasks.length > 0 ? (
                tasks.map((task) => (
                    <li key={task.id} style={taskItemStyle(task.completed)}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: "18px" }}>{task.name}</div>
                            <div style={{ fontSize: "14px", color: "#555", marginTop: "4px" }}>
                                {task.description}
                            </div>

                            {/* Metadata Row: This solves the "Backlog" display issue */}
                            <div style={{ display: "flex", gap: "15px", marginTop: "12px", flexWrap: "wrap" }}>
                                
                                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                    <label style={{ fontSize: "12px", color: "#888", fontWeight: "bold" }}>Sprint:</label>
                                    <select 
                                        value={task.sprint || ""} 
                                        onChange={(e) => handleUpdateTask(task.id, { sprint: e.target.value || null })}
                                        style={{ border: "1px solid #ddd", borderRadius: "4px", padding: "2px 5px", fontSize: "13px" }}
                                    >
                                        <option value="">Backlog</option>
                                        {sprints.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                    <label style={{ fontSize: "12px", color: "#888", fontWeight: "bold" }}>Assignee:</label>
                                    <select 
                                        value={task.assigned_to || ""} 
                                        onChange={(e) => handleUpdateTask(task.id, { assigned_to: e.target.value || null })}
                                        style={{ border: "1px solid #ddd", borderRadius: "4px", padding: "2px 5px", fontSize: "13px" }}
                                    >
                                        <option value="">Unassigned</option>
                                        {projectUsers.map(u => (
                                            <option key={u.id} value={u.id}>{u.username}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => handleRemoveTask(task.id)}
                            style={deleteButtonStyle}
                        >
                            Delete
                        </button>
                    </li>
                ))
            ) : (
                <div style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#888",
                    border: "2px dashed #ccc",
                    borderRadius: "8px"
                }}>
                    No tasks found. Click "+ New Task" to get started.
                </div>
            )}
        </ul>

        {showCreate && (
            <TaskCreate
                onCreate={handleAddTask}
                onClose={() => setShowCreate(false)}
                projectUsers={projectUsers}
                sprints={sprints}
            />
        )}
    </div>
);
}

const taskItemStyle = (completed) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    marginBottom: "16px",
    background: "#F2F4F8",
    borderRadius: "8px",
    borderLeft: completed ? "6px solid #4CAF50" : "6px solid #862424",
});

const addTaskButtonStyle = {
    borderRadius: "3px",
    padding: "12px 24px",
    border: "0px",
    color: "white",
    background: "#862424",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600"
};

const deleteButtonStyle = {
    background: "transparent",
    color: "#862424",
    border: "1px solid #862424",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600"
};

export default ProjectTasks;