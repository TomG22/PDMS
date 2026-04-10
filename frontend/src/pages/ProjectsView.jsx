import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

import Sidebar from "../components/Sidebar";
import ProjectCard from "../components/ProjectCard";
import ProjectCreate from "../components/ProjectCreate";
import ProjectEdit from "../components/ProjectEdit";
 
function ProjectDashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const accessToken = localStorage.getItem("access_token"); 
                if (!accessToken) {
                    navigate("/login");
                    console.error("Access token is missing or expired");
                    return;
                }

                const res = await axios.get("http://localhost:8000/api/projects/", {
                    headers : {
                        Authorization : `Bearer ${accessToken}`,
                    }, 
                }); 

                setProjects(res.data); 
            } catch (err) {
                console.error("Failed to fetch projects:", err); 
            }
        }; 

        fetchProjects(); 
    }, [navigate]);

    const sidebarLinks = [
        {label: "Task View", to:"/test"},
        {label: "Profile View", to:"/test"},
        {label: "What Else?", to:"/test"}
    ]

    const [projects, setProjects] = useState([]); 
    const [showCreate, setShowCreate] = useState(false);
    const [editingProject, setEditingProject] = useState(null);

    const handleAdd = async (title, description) => {
        try {
            const token = localStorage.getItem("access_token"); 

            const res = await axios.post("http://localhost:8000/api/projects/", 
                {
                    name: title, 
                    description: description,
                }, 
                {
                    headers : {
                        Authorization : `Bearer ${token}`,
                    },
                }
            ); 
            
            setProjects(prev => [...prev, res.data]); 
            setShowCreate(false); 
        } catch (err) {
            console.error("Failed to create project:", err); 
        }
    }


    const handleRemove = async (id) => {
        try {
            const token = localStorage.getItem("access_token"); 

            await axios.delete(`http://localhost:8000/api/projects/${id}/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    },
                } 
            );

            setProjects(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error("Failed to remove project:", err); 
        }
    }

    const handleEdit = async (id, updatedFields) => {
        try {
            const token = localStorage.getItem("access_token"); 

            const res = await axios.put(`http://localhost:8000/api/projects/${id}/`,
                {
                    name: updatedFields.title, 
                    description: updatedFields.description,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    },
                } 
            );

            setProjects(prev => prev.map(p => p.id === id ? res.data : p));
        } catch (err) {
            console.error("Failed to update/edit project:", err); 
        }
    }

    return (
        <div style={containerStyle}>
            <Sidebar
                title="Project View"
                links={sidebarLinks}
            />
            <div style={mainStyle}>
                <h2>Project Dashboard</h2>
                <button style={addProjectStyle} onClick={() => setShowCreate(true)}>
                    + Add Project
                </button>
                <div style={gridStyle}>
                    {projects.map(project => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onRemove={handleRemove}
                            onEditClick={setEditingProject}
                        />
                    ))}
                </div>
                
            </div>

            {showCreate && (
                <ProjectCreate
                    onCreate={handleAdd}
                    onClose={() => setShowCreate(false)}
                />
            )}

            {editingProject && (
                <ProjectEdit
                    project={editingProject}
                    onEdit={handleEdit}
                    onClose={() => setEditingProject(null)}
                />
            )}
        </div>
    );
}

const gridStyle = {
    display: "flex", 
    flexWrap: "wrap", 
    gap: "20px"
}

const containerStyle = {
    display: "flex", 
    height: "100vh", 
}
const mainStyle = {
    flex: 1, 
    padding: "30px", 
    backgroundColor: "#f5f5f5", 
}; 

const addProjectStyle = {
    borderRadius: "3px", 
    padding: "15px",
    border : "0px",
    color: "white", 
    background : "#862424",
    marginLeft: "80%", 
    width:"150px",
    cursor: "pointer",
    fontSize: "18px"
}

export default ProjectDashboard; 
