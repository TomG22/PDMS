import React from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TaskList from "../components/TaskList";
import { authLogout } from "../auth/auth";

const UserTasksView = () => {
    const navigate = useNavigate();

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
                ctaPath="/login" 
                ctaAction={handleLogout} 
                links={[
                    {label: "My Tasks", to: "/user-tasks-view"},
                    {label: "My Projects", to:"/projects-view"}, 
                    {label:"My Profile", to:"/profile"}
                ]}
            />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#fff" }}>
                <div style={{ padding: "60px 5%", maxWidth: "900px", margin: "0 auto", width: "100%" }}>
                    <div style={{ marginBottom: "10px" }}>
                        <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, margin: 0 }}>
                            My Tasks
                        </h1>
                    </div>

                    <p style={{ color: "#666", marginBottom: "40px" }}>
                        All tasks currently assigned to you.
                    </p>

                    <TaskList />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default UserTasksView;
