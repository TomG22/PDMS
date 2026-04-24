import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import api from "../api/client";
import TaskCreate from "./TaskCreate";
import TaskList from "./TaskList";

const ProjectTasksView = () => {
    const [project, setProject] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const navigate = useNavigate();
    const { projectId } = useParams();

    useEffect(() => {
        const fetchProject = async () => {
            try {

                const res = await api.get(`/projects/${projectId}/`);
                setProject(res.data);

            } catch (error) {
                console.error("Error fetching project:", error);
                if (error.response?.status === 401) {
                    navigate("/login", { replace: true });
                }
            }
        };

        fetchProject();
    }, [navigate, projectId]);

    const handleAddTask = async (name, description, priority = 0, assignedTo = null) => {
        try {

            const taskPayload = {
                name,
                description,
                completed: false,
                project: project.id,
                priority,
                assigned_to: assignedTo,
            };

            await api.post(`/tasks/`, taskPayload);
            setShowCreate(false);
            setRefreshKey((prev) => prev + 1);
        } catch (err) {
            console.error("Failed to create task:", err.response?.status, err.response?.data);

            if (err.response?.status === 401) {
                alert("Session expired. Please log in again.");
                navigate("/login", { replace: true });
            }
        }  
    };

    const projectUsers = project?.users ?? [];

    return (
        <div style={{ display: "flex", minHeight: "100vh"}}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#fff", borderRadius:"7px"  }}>
                

                <div style={{ padding: "60px 5%", maxWidth: "900px", margin: "0 auto", width: "100%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                        <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, margin: 0 }}>
                            {project ? `Tasks for ${project.name}` : "Loading..."}
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

                    <TaskList project={project} refreshKey={refreshKey} />
                </div>
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

export default ProjectTasksView;
