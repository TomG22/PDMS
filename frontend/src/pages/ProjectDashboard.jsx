import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { authLogout } from "../auth/auth";

import ProjectTasks from "../components/ProjectTasks";
// import ProductBacklog from "./ProductBacklog";
// import SprintBacklog from "./SprintBacklog";

function ProjectDashboard() {
    const navigate = useNavigate();
    const { projectId } = useParams();

    const [view, setView] = useState("tasks");

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
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Navbar 
                ctaText="Logout" 
                ctaAction={handleLogout} 
                links={[
                    { label: "My Tasks", to: "/user-tasks-view" },
                    { label: "My Projects", to: "/projects-view" }, 
                    { label: "My Profile", to: "/profile" }
                ]}
            />
            <div style={mainStyle}>
                <h1>Project Dashboard</h1>

                <nav style={{ marginTop: "20px" }}>
                    <button onClick={() => setView("tasks")}>Tasks</button>
                    {/* <button onClick={() => setView("product")}>Product Backlog</button>
                    <button onClick={() => setView("sprint")}>Sprint Backlog</button> */}
                </nav>

                <div style={{ marginTop: "20px" }}>
                    {view === "tasks" && <ProjectTasks key={projectId} projectId={projectId} />}
                    {/* {view === "product" && <ProductBacklog projectId={projectId} />} */}
                    {/* {view === "sprint" && <SprintBacklog projectId={projectId} />} */}
                </div>
            </div>
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

export default ProjectDashboard;