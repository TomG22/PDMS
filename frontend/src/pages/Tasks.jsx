import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TaskCreate from "../components/TaskCreate";
import TaskList from "../components/TaskList";
import { authLogout } from "../auth/auth";

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [project, setProject] = useState(null);
    const [showCreate, setShowCreate] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = localStorage.getItem("access_token");

                if (!accessToken) {
                    navigate("/login");
                    return;
                }

                const headers = { Authorization: `Bearer ${accessToken}` };

                const projectsRes = await axios.get(`http://localhost:8000/api/projects/`, { headers });
                const firstProject = projectsRes.data[0];

                if (!firstProject) {
                    console.log("No projects found for this user.");
                    return;
                }

                setProject(firstProject);

                const tasksRes = await axios.get(`http://localhost:8000/api/projects/${firstProject.id}/tasks/`, { headers });
                setTasks(tasksRes.data);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [navigate]);

    const handleAddTask = async (name, description, priority = 0, assignedTo = null) => {
        try {
            let token = localStorage.getItem("access_token");

            const taskPayload = {
                name,
                description,
                completed: false,
                project: project.id,
                priority,
                assigned_to: assignedTo,
            };

            let res = await axios.post(`http://localhost:8000/api/tasks/`,
                taskPayload,
                { headers: { Authorization: `Bearer ${token}` } }
            ).catch(async (err) => {
                if (err.response?.status === 401) {
                    const refresh = localStorage.getItem("refresh_token");
                    const refreshRes = await axios.post(`http://localhost:8000/api/token/refresh/`, {
                        refresh: refresh
                    });

                    token = refreshRes.data.access;
                    localStorage.setItem("access_token", token);

                    return axios.post(`http://localhost:8000/api/tasks/`,
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

    const handleUpdateTask = async (taskId, fields) => {
        try {
            const token = localStorage.getItem("access_token");
            const res = await axios.patch(
                `http://localhost:8000/api/tasks/${taskId}/`,
                fields,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTasks(prev => prev.map(t => t.id === taskId ? res.data : t));
        } catch (err) {
            console.error("Failed to update task:", err.response?.status, err.response?.data);
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

    const projectUsers = project?.users ?? [];

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#fff" }}>
                <Navbar ctaText="Logout" ctaPath="/login" ctaAction={handleLogout} />

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

                    <TaskList
                        tasks={tasks}
                        projectUsers={projectUsers}
                        onRemove={handleRemoveTask}
                        onUpdate={handleUpdateTask}
                    />
                </div>
                <Footer />
            </div>

            {showCreate && (
                <TaskCreate
                    onCreate={handleAddTask}
                    onClose={() => setShowCreate(false)}
                    projectUsers={projectUsers}
                />
            )}
        </div>
    );
};

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

export default Tasks;
