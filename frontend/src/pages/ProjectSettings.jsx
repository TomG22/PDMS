import { useState } from "react";
import api from "../api/client";
import { useNavigate } from "react-router";
import ProjectEdit from "../components/ProjectEdit";
import AddUser from "../components/AddUser";

const ProjectSettings = ({ project, projectId, onProjectUpdated }) => {
  const navigate = useNavigate();
  const [editingProject, setEditingProject] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);

  const handleEdit = async (id, updatedFields) => {
    try {
      const res = await api.put(`/projects/${id}/`, {
        name: updatedFields.title,
        description: updatedFields.description,
      });
      onProjectUpdated(res.data);
      setEditingProject(null);
    } catch (err) {
      console.error("Failed to update project:", err);
    }
  };

  const handleRemove = async () => {
    try {
      await api.delete(`/projects/${projectId}/`);
      navigate("/projects-view");
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  if (!project) return null;

  return (
    <div style={{ maxWidth: "1325px", marginTop: "30px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ margin: 0 }}>Project Settings</h2>

        <div style={{ display: "flex", gap: "10px" }}>
          <button style={primaryBtn} onClick={() => setShowAddUser(true)}>
            Add User
          </button>

          <button style={primaryBtn} onClick={() => setEditingProject(project)}>
            Edit Project
          </button>

          <button style={dangerBtn} onClick={handleRemove}>
            Delete Project
          </button>

          {showAddUser && (
            <AddUser
              projectId={projectId}
              project={project}
              onClose={() => setShowAddUser(false)}
              onUserAdded={() => {
                setShowAddUser(false);
                onProjectUpdated();
              }}
            />
          )}
        </div>
      </div>

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

      <h2 style={{ margin: "20px 0 0 0" }}>Project Users</h2>

      <div style={cardStyle}>
        {project?.users.map((user) => (
          <div key={user.id} style={userRowStyle}>
            {user.username}
          </div>
        ))}
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
};

const cardStyle = {
  marginTop: "20px",
  background: "white",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
};

const fieldStyle = { marginBottom: "15px" };
const labelStyle = { fontSize: "12px", fontWeight: "600", color: "#888", textTransform: "uppercase" };
const valueStyle = { margin: "5px 0 0 0", fontSize: "16px", color: "#333" };

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

const userRowStyle = {
  padding: "10px",
  borderBottom: "1px solid #eee",
  fontSize: "14px",
};

export default ProjectSettings;
