import React from "react";
import { useLogout } from "../hooks/useLogout";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import TaskList from "../components/TaskList";

const UserTasksView = () => {
  useAuth();  
  const logout = useLogout();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar
        links={[
          { label: "My Tasks", to: "/user-tasks-view" },
          { label: "My Projects", to: "/projects-view" },
          { label: "My Profile", to: "/profile" },
          {
            label: "Logout",
            onClick: logout
          }
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

          <TaskList noAssigneeFilter={true}/>
        </div>
      </div>
    </div>
  );
};

export default UserTasksView;
