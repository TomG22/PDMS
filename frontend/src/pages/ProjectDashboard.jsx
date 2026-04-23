import { useState, useEffect } from "react";
import api from "../api/client";
import { useNavigate, useParams } from "react-router";
import { useLogout } from "../hooks/useLogout";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import ProjectEdit from "../components/ProjectEdit";
import ProjectBacklog from "./ProjectBacklog";
import AddUser from "../components/AddUser";


function ProjectDashboard() {
  useAuth();

  const navigate = useNavigate();
  const { projectId } = useParams();
  const [view, setView] = useState("backlog");
  const [project, setProject] = useState(null);
  const [editingProject, setEditingProject] = useState(null)
  const [showAddUser, setShowAddUser] = useState(false); 
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${projectId}/`);

        setProject(res.data);
      } catch (err) {
        console.error("Failed to fetch project:", err);
      }
    };

    fetchProject();
  }, [projectId, navigate]);

  const handleEdit = async (id, updatedFields) => {
    try {
      const res = await api.put(
        `/projects/${id}/`,
        {
          name: updatedFields.title,
          description: updatedFields.description,
        }
      );

      setProject(res.data);
      setEditingProject(null);
    } catch (err) {
      console.error("Failed to update project:", err);
    }
  };

    const handleRemove = async () => {
    try {

      await api.delete(`/projects/${projectId}/`);

      // redirect after delete
      navigate("/projects-view");
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };


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
      <div style={mainStyle}>
        <h1>{project ? `${project.name}'s Dashboard` : "Loading Project..."}</h1>

        <nav style={{ marginTop: "20px", display: "flex", gap: "20px" }}>
          <button
            style={view === "backlog" ? activeTabStyle : tabStyle}
            onClick={() => setView("backlog")}
            refreshKey={refreshKey}
            onTaskCreated={triggerRefresh}
          >
            Backlog
          </button>

          <button
            style={view === "settings" ? activeTabStyle : tabStyle}
            onClick={() => setView("settings")}
          >
            Settings
          </button>

        </nav>

        <div style={{ marginTop: "20px" }}>
          {view === "backlog" && (
            <ProjectBacklog
              project={project}
              onTaskCreated={() => {
                setRefreshKey(prev => prev + 1);
              }}
            />
          )}
          {view === "settings" && project && (
            <div style={{ maxWidth: "1325px", marginTop: "30px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ margin: 0 }}>Project Settings</h2>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button style={primaryBtn} onClick={() => setEditingProject(project)}>
                    Edit Project
                  </button>

                  <button style={dangerBtn} onClick={handleRemove}>
                    Delete Project
                  </button>
                </div>
              </div>

              {/* Card-style container */}
              <div style={cardStyle}>
                <div style={fieldStyle}>
                  <span style={labelStyle}>Name</span>
                  <p style={valueStyle}>{project.name}</p>
                </div>

                <div style={fieldStyle}>
                  <span style={labelStyle}>Description</span>
                  <p style={valueStyle}>
                    {project.description || "No description provided."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

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

const mainStyle = {
  flex: 1,
  padding: "30px",
  backgroundColor: "#f5f5f5",
};

const cardStyle = {
  marginTop: "20px",
  background: "white",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
};

const fieldStyle = {
  marginBottom: "15px",
};

const labelStyle = {
  fontSize: "12px",
  fontWeight: "600",
  color: "#888",
  textTransform: "uppercase",
};

const valueStyle = {
  margin: "5px 0 0 0",
  fontSize: "16px",
  color: "#333",
};

const primaryBtn = {
  borderRadius: "8px",
  padding: "8px 16px",
  border: "none",
  color: "white",
  background: "#862424",
  cursor: "pointer",
  fontSize: "14px",
};

const dangerBtn = {
  borderRadius: "8px",
  padding: "8px 16px",
  border: "none",
  color: "white",
  background: "#c0392b",
  cursor: "pointer",
  fontSize: "14px",
};

const tabStyle = {
  background: "none",
  border: "none",
  padding: "10px 0",
  marginRight: "20px",
  fontSize: "16px",
  color: "#555",
  cursor: "pointer",
  borderBottom: "2px solid transparent",
};

const activeTabStyle = {
  ...tabStyle,
  color: "#862424",
  borderBottom: "2px solid #862424",
  fontWeight: "600",
};
export default ProjectDashboard;
