import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TaskCreate from "../components/TaskCreate";
import { authLogout } from "../auth/auth";

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [project, setProject] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    
    const navigate = useNavigate();
    const { projectId } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = localStorage.getItem("access_token");

                if (!accessToken) {
                    navigate("/login");
                    return;
                }

                const headers = { Authorization: `Bearer ${accessToken}` };

                try {
                    const projectRes = await axios.get(`http://localhost:8000/api/projects/${projectId}/`, { headers });
                    setProject(projectRes.data);
                } catch (e) {
                    console.log("Project details not linked yet or ID invalid.");
                }

                const response = await axios.get("http://localhost:8000/api/tasks/", { headers });
                setTasks(response.data);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [navigate, projectId]);

    const handleAddTask = async (name, description) => {
    try {
        let token = localStorage.getItem("access_token");

        const taskPayload = { 
            name, 
            description, 
            completed: false, 
            project: projectId
        };

        console.log("Payload being sent:", taskPayload);

        let res = await axios.post("http://localhost:8000/api/tasks/", 
            taskPayload,
            { headers: { Authorization: `Bearer ${token}` } }
        ).catch(async (err) => {
            if (err.response?.status === 401) {
                const refresh = localStorage.getItem("refresh_token");
                const refreshRes = await axios.post("http://localhost:8000/api/token/refresh/", {
                    refresh: refresh
                });

                token = refreshRes.data.access;
                localStorage.setItem("access_token", token);

                return axios.post("http://localhost:8000/api/tasks/",
                    taskPayload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
            throw err;
        });

        setTasks(prev => [...prev, res.data]);
        setShowCreate(false);

    } catch (err) {
        console.error("Failed to create task:", err.response?.status, err.response?.data);
        if (err.response?.status === 401) {
            alert("Session expired. Please log in again.");
            navigate("/login");
        }
    }
};

    const handleRemoveTask = async (taskId) => {
        try {
            const token = localStorage.getItem("access_token");
            await axios.delete(`http://localhost:8000/api/tasks/${taskId}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(prev => prev.filter(t => t.id !== taskId));
        } catch (err) {
            console.error("Failed to delete task:", err);
        }
    };

    const handleLogout = async () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        try {
            await authLogout();
        } catch (error) {
            console.error("Logout failed:", error.message);
        }
        navigate("/login");
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            
            <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#fff" }}>
                {<Navbar ctaText="Logout" ctaPath="/login" ctaAction={handleLogout} />}

                <div style={{ padding: "60px 5%", maxWidth: "900px", margin: "0 auto", width: "100%" }}>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                        <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, margin: 0 }}>
                            {project ? `Tasks for ${project.name}` : "Your Tasks"}
                        </h1>
                        <button 
                            style={addTaskButtonStyle} 
                            onClick={() => setShowCreate(true)}
                        >
                            + New Task
                        </button>
                    </div>

                    <p style={{ color: "#666", marginBottom: "40px" }}>
                        Manage and track progress for this project.
                    </p>

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
                            <div style={{ textAlign: "center", padding: "40px", color: "#888", border: "2px dashed #ccc", borderRadius: "8px" }}>
                                No tasks found. Click "+ New Task" to get started.
                            </div>
                        )}
                    </ul>
                </div>
                {<Footer />}
            </div>

            {showCreate && (
                <TaskCreate
                    onCreate={handleAddTask}
                    onClose={() => setShowCreate(false)}
                />
            )}
        </div>
    );
};

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
    fontWeight: "600",
    transition: "opacity 0.2s"
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

export default Tasks;