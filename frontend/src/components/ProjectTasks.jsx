import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import TaskCreate from "../components/TaskCreate";

function ProjectTasks({ projectId }) {
    const [tasks, setTasks] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const navigate = useNavigate();

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
        fetchTasks();   
    }, [projectId]);

    const handleAddTask = async (name, description) => {
        try {
            let token = localStorage.getItem("access_token");

            const payload = {
                name,
                description,
                completed: false,
                project: Number(projectId)
            };

            let res = await axios.post(
                `http://localhost:8000/api/projects/${projectId}/tasks/`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            ).catch(async (err) => {
                if (err.response?.status === 401) {
                    const refresh = localStorage.getItem("refresh_token");

                    const refreshRes = await axios.post(
                        "http://localhost:8000/api/token/refresh/",
                        { refresh }
                    );

                    token = refreshRes.data.access;
                    localStorage.setItem("access_token", token);

                    return axios.post(
                        `http://localhost:8000/api/projects/${projectId}/tasks/`,
                        payload,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                }
                throw err;
            });

            // setTasks(prev => [...prev, res.data]);
            await fetchTasks()
            setShowCreate(false);

        } catch (err) {
            console.error("Failed to create task", err);
            console.log("STATUS:", err.response?.status);
            console.log("ERROR DATA:", err.response?.data);
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

            {/* Header (same feel as Tasks page) */}
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
                            <div>
                                <div style={{ fontWeight: 600, fontSize: "18px" }}>{task.name}</div>
                                <div style={{ fontSize: "14px", color: "#555", marginTop: "4px" }}>
                                    {task.description}
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
                />
            )}
        </div>
    );
}

/* 🔥 Reused styles */
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