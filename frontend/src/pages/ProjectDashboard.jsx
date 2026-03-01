import { useState } from "react";

import Sidebar from "../components/Sidebar";
import ProjectCard from "../components/ProjectCard";

function ProjectDashboard() {
    const sidebarLinks = [
        {label: "Task View", to:"/test"},
        {label: "Profile View", to:"/test"},
        {label: "What Else?", to:"/test"}
    ]

    const [projects, setProjects] = useState([]); 

    const handleAdd = () => {
        const newProject = {
            id : Date.now(),
            title: "New Project", 
            description: "Project Description"
        }

        setProjects(prev => [...prev, newProject])
    }

    const handleRemove = (id) => {
        setProjects(prev => prev.filter(project => project.id !== id));
    }

    const handleEdit = (id, updatedFields) => {
        setProjects(prev => prev.map(project => project.id === id ? {...project, ...updatedFields} : project));
    }

    return (
        <div style={containerStyle}>
            <Sidebar
                title="Project View"
                links={sidebarLinks}
            />
            <div style={mainStyle}>
                <h2>Project Dashboard</h2>
                <button style={addProjectStyle} onClick={handleAdd}>
                    + Add Project
                </button>
                <div style={gridStyle}>
                    {projects.map(project => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onRemove={handleRemove}
                            onEdit={handleEdit}
                        />
                    ))}
                </div>
                
            </div>
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
    padding: "40px", 
    backgroundColor: "#f5f5f5", 
}; 

const addProjectStyle = {
    borderRadius: "3px", 
    padding: "5px",
    border : "0px",
    color: "white", 
    background : "green",
    marginLeft: "90%", 
    width:"100px",
    cursor: "pointer"
}

export default ProjectDashboard; 
