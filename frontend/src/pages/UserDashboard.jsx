import { useState, useEffect } from "react";
import api from "../api/client";
import { useNavigate } from "react-router";
import { useLogout } from "../hooks/useLogout";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import ProjectCreate from "../components/ProjectCreate";
import ProjectEdit from "../components/ProjectEdit";

function UserDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects/");
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        if (err.response?.status === 401) {
          navigate("/login", { replace: true });
        }
      }
    };

    fetchProjects();
  }, [navigate]);

  const [projects, setProjects] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const handleAdd = async (title, description) => {
    try {
      const res = await api.post("/projects/", {
        name: title,
        description: description,
      });

      setProjects(prev => [...prev, res.data]);
      setShowCreate(false);
    } catch (err) {
      console.error("Failed to create project:", err);
    }
  }
  
    


  const handleRemove = async (id) => {
    try {
      await api.delete(`/projects/${id}/`);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Failed to remove project:", err);
    }
  }

  const handleEdit = async (id, updatedFields) => {
    try {
      const res = await api.put(`/projects/${id}/`,
        {
          name: updatedFields.title,
          description: updatedFields.description,
        });
      setProjects(prev => prev.map(p => p.id === id ? res.data : p));
    } catch (err) {
      console.error("Failed to edit project:", err);
    }
  }

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
        <div style={{ paddingBottom: "15px", display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "1375px" }}>
          <h1 style={{ margin: 0 }}>My Dashboard</h1>
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
  border: "0px",
  color: "white",
  background: "#862424",
  margin: "0 20px",
  width: "auto",
  cursor: "pointer",
  fontSize: "16px"
}

export default UserDashboard; 
