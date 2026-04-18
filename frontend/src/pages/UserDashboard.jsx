import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import ProjectCreate from "../components/ProjectCreate";
import ProjectEdit from "../components/ProjectEdit";
import { authLogout } from "../auth/auth";
import Footer from "../components/Footer";
function UserDashboard() {
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

      const handleLogout = async () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        try {
        await authLogout();
        console.log("Logged out from backend");
        } catch (error) {
        console.error("Logout failed:", error.response?.data || error.message);
        }

        navigate("/login");
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Navbar 
                ctaText="Logout" 
                ctaPath="/login" 
                ctaAction={handleLogout} 
                links={[
                    {label: "My Tasks", to: "/tasks"},
                    {label: "My Projects", to:"/projects-view"}, 
                    {label:"My Profile", to:"/profile"}
                ]}
            />

            <div style={mainStyle}>
                <div style={{display: "flex", alignItems:"center", justifyContent:"space-between"}}>
                    <h1 style={{margin: 0, padding: "5px"}}>My Dashboard</h1>
                    <button style={addProjectStyle} onClick={() => setShowCreate(true)}>
                        + Add Project
                    </button>
                </div>
                
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

            <Footer/>
        </div>
    );
}

const gridStyle = {
    display: "flex", 
    flexWrap: "wrap", 
    gap: "20px"
}


const mainStyle = {
    flex: 1, 
    padding: "30px", 
    backgroundColor: "#f5f5f5", 
}; 

const addProjectStyle = {
    borderRadius: "8px", 
    padding: "8px 16px",
    border : "0px",
    color: "white", 
    background : "#862424",
     
    width:"auto",
    cursor: "pointer",
    fontSize: "16px"
}

export default UserDashboard; 
