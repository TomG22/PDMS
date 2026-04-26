import { useState, useEffect, useCallback } from "react";
import api from "../api/client";
import { useParams } from "react-router";
import { useLogout } from "../hooks/useLogout";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import ProjectBacklog from "./ProjectBacklog";
import SprintHistory from "./SprintHistory";
import ProjectSettings from "./ProjectSettings";

function ProjectDashboard() {
  useAuth();
<<<<<<< HEAD

  const navigate = useNavigate();
=======
>>>>>>> 001c2d4 (Removed unused vars)
  const { projectId } = useParams();
  const [view, setView] = useState("backlog");
  const [project, setProject] = useState(null);
<<<<<<< HEAD
  const [editingProject, setEditingProject] = useState(null)
  const [showAddUser, setShowAddUser] = useState(false); 
=======
>>>>>>> 699a8a1 (Added sprint completion on frontend and fixed autorefresh for add user)
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

<<<<<<< HEAD
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

=======
>>>>>>> 699a8a1 (Added sprint completion on frontend and fixed autorefresh for add user)
  const logout = useLogout();

  const fetchProject = useCallback(async () => {
    try {
      const res = await api.get(`/projects/${projectId}/`);
      setProject(res.data);
    } catch (err) {
      console.error("Failed to fetch project:", err);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar
        links={[
          { label: "My Tasks", to: "/user-tasks-view" },
          { label: "My Projects", to: "/projects-view" },
          { label: "My Profile", to: "/profile" },
          { label: "Logout", onClick: logout }
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
            style={view === "sprint-history" ? activeTabStyle : tabStyle}
            onClick={() => setView("sprint-history")}
          >
            Sprint History
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

<<<<<<< HEAD
                <div style={{ display: "flex", gap: "10px" }}>
                  <button style={primaryBtn} onClick={() => setEditingProject(project)}>
                    Edit Project
                  </button>

                  <button style={dangerBtn} onClick={handleRemove}>
                    Delete Project
                  </button>

                  {showAddUser && (
                    <AddUser
                      projectId={projectId}
                      onClose={() => setShowAddUser(false)}
                      project={project}
                    />
                  )}
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
              
              <h2 style={{ margin: 0 }}>Project Users</h2>

              <div style={cardStyle}>
                {
                  project?.users.map((user) => (
                    <div key={user.id} style={userRowStyle}>
                      {user.username}
                    </div>
                  ))
                }
              </div>
            </div>
=======
          {view === "sprint-history" && (
            <SprintHistory
              project={project}
              refreshKey={refreshKey}
            />
          )}

          {view === "settings" && (
            <ProjectSettings
              project={project}
              projectId={projectId}
              onProjectUpdated={fetchProject}
            />
>>>>>>> 699a8a1 (Added sprint completion on frontend and fixed autorefresh for add user)
          )}
        </div>
      </div>
    </div>
  );
}

const mainStyle = {
  flex: 1,
  padding: "30px",
  backgroundColor: "#f5f5f5",
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
