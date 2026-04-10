import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import DeleteUser from "../components/DeleteUser";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { authLogout } from "../auth/auth";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  // Fetch tasks when the component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");

        if (!accessToken) {
          navigate("/login"); // Redirect to login if no token
          console.error("Access token is missing or expired");
          return;
        }

        const response = await axios.get("http://localhost:8000/api/tasks/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [navigate]);

  // Logout function
  const handleLogout = async () => {
    // Remove tokens locally
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    try {
      await authLogout();
      console.log("Logged out from backend");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }

    // Something went wrong with authentication. Log out on the client anyways
    navigate("/login");
  };

  return (
  <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
    <Navbar 
      ctaText="Logout" 
      ctaPath="/login" 
      ctaAction={handleLogout} 
      links={[
        {label: "My Projects", to:"/projects-view"}, 
        {label:"My Profile", to:"/profile"}
      ]}
    />

    <div style={{ flex: 1 }}>
      <div style={{ padding: "120px 5%", maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, marginBottom: "40px", textAlign: "center" }}>
          Your Tasks
        </h1>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <li
                key={task.id}
                style={{
                  padding: "16px",
                  marginBottom: "12px",
                  background: "#F2F4F8",
                  borderRadius: "8px",
                  fontWeight: task.completed ? "500" : "400",
                }}
              >
                {task.name} {task.completed ? "(Completed)" : "(Pending)"}
              </li>
            ))
          ) : (
            <li style={{ textAlign: "center", fontStyle: "italic" }}>
              No tasks to display.
            </li>
          )}
        </ul>
      </div>
    </div>

    <Footer />
  </div>)
};

export default Tasks;
