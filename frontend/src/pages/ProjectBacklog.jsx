import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../api/client";
import TaskList from "../components/TaskList";
import TaskCreate from "../components/TaskCreate";
import SprintCreate from "../components/SprintCreate";
import DeleteSprint from "../components/DeleteSprint";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};


const SprintSection = ({
  sprint,
  project,
  globalRefreshKey,
  fetchSprints,
  projectUsers,
  sprints,
  onEdit,
  onDelete,
  isEditing,
  editData,
  setEditData,
  onSave,
  onCancel
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div key={sprint.id} style={sprintContainerStyle}>
      <div style={sprintHeaderStyle}>
        <div
          style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, cursor: "pointer" }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span style={{
            transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
            display: "inline-block"
          }}>
            ▶
          </span>
          <h3 style={{ margin: 0 }}>{sprint.name}</h3>

          <span style={dateRangeStyle}>
            {formatDate(sprint.start_date)} — {formatDate(sprint.end_date)}
          </span>
        </div>

        <DeleteSprint
          sprintId={sprint.id}
          sprintName={sprint.name}
          onRemove={onDelete}
          deleteBtnStyle={deleteBtnStyle}
        />
      </div>

      {isEditing ? (
        <div style={editFormContainer}>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ fontSize: "12px", color: "#666" }}>Sprint Name</label>
            <input
              style={inlineInputStyle}
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "12px", color: "#666" }}>Start Date</label>
              <input
                type="date"
                style={smallInputStyle}
                value={editData.start_date}
                onChange={(e) => setEditData({ ...editData, start_date: e.target.value })}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "12px", color: "#666" }}>End Date</label>
              <input
                type="date"
                style={smallInputStyle}
                value={editData.end_date}
                onChange={(e) => setEditData({ ...editData, end_date: e.target.value })}
              />
            </div>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label style={{ fontSize: "12px", color: "#666" }}>Sprint Goal</label>
            <textarea
              style={inlineTextAreaStyle}
              value={editData.goal}
              onChange={(e) => setEditData({ ...editData, goal: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button style={saveBtnStyle} onClick={() => onSave(sprint.id)}>Save Changes</button>
            <button style={cancelBtnStyle} onClick={onCancel}>Cancel</button>
          </div>
        </div>
      ) : (

        isOpen && (
          <div style={{ marginTop: "15px" }}>
            {sprint.goal && <p style={goalTextStyle}>Goal: {sprint.goal}</p>}
            <TaskList
              project={project}
              type="sprint"
              sprintId={sprint.id}
              sprints={sprints}
              refreshKey={globalRefreshKey}
              projectUsers={projectUsers}
              onTaskAction={fetchSprints}
            />
          </div>
        )
      )}
    </div>
  );
};

const ProjectBacklog = ({ project, refreshKey, onTaskCreated }) => {
  useAuth();
  const [sprints, setSprints] = useState([]);
  const [isBacklogOpen, setIsBacklogOpen] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showSprintModal, setShowSprintModal] = useState(false);
  const [editingSprintId, setEditingSprintId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    start_date: "",
    end_date: "",
    goal: ""
  });
  const [globalRefreshKey, setGlobalRefreshKey] = useState(0);
  const fetchSprints = useCallback(async () => {
      if (!project?.id) return;
      try {
          const res = await api.get(`/projects/${project.id}/sprints/`);
          setSprints(res.data);
          setGlobalRefreshKey(prev => prev + 1); 
      } catch (err) {
          console.error("Failed to fetch sprints", err);
      }
}, [project?.id]);

  useEffect(() => {
    if (project?.id) fetchSprints();
  }, [project?.id, refreshKey, fetchSprints]);

  if (!project || !project.id) return <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>;

  const handleEditClick = (sprint) => {
    setEditingSprintId(sprint.id);
    setEditData({
      name: sprint.name,
      start_date: sprint.start_date || "",
      end_date: sprint.end_date || "",
      goal: sprint.goal || ""
    });
  };

  const handleUpdateSprint = async (sprintId) => {
  
    const currentSprint = sprints.find(s => s.id === sprintId);

    try {
      await api.patch(`/projects/${project.id}/sprints/${sprintId}/`, {
        ...editData,
        completed: currentSprint?.completed,
        on_incomplete_tasks: "backlog"
        },
      );
      setEditingSprintId(null);
      fetchSprints();
    } catch (err) {
      console.error("Update failed", err.response?.data);
    }
  };

  const handleDeleteSprint = async (sprintId, taskAction) => {
    try {
      await api.delete(`/projects/${project.id}/sprints/${sprintId}/`, {
        params: { 
          on_incomplete_tasks: taskAction 
        }
      });
      
      fetchSprints();
      onTaskCreated();
    } catch (err) {
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      console.error("Delete failed:", errorMsg);
      alert("Backend says: " + errorMsg);
    }
  };

  const handleCreateTask = async (name, description, priority, assignedTo, sprintId) => {
    try {
      await api.post(`/projects/${project.id}/tasks/`, {
        name, description, priority, assigned_to: assignedTo, sprint: sprintId, project: project.id
      });
      onTaskCreated();
      setShowTaskModal(false);
    } catch (err) {
      console.error("Failed to create task", err);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={{ margin: 0 }}>Project Backlog</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button style={{ ...createBtnStyle, backgroundColor: "#444" }} onClick={() => setShowSprintModal(true)}>+ Create Sprint</button>
          <button style={createBtnStyle} onClick={() => setShowTaskModal(true)}>+ Create Task</button>
        </div>
      </div>

      {sprints.map((sprint) => (
        <SprintSection
          key={sprint.id}
          sprint={sprint}
          project={project}
          globalRefreshKey={globalRefreshKey}
          fetchSprints={fetchSprints}
          projectUsers={project.users || []}
          sprints={sprints}
          onEdit={handleEditClick}
          onDelete={handleDeleteSprint}
          isEditing={editingSprintId === sprint.id}
          editData={editData}
          setEditData={setEditData}
          onSave={handleUpdateSprint}
          onCancel={() => setEditingSprintId(null)}
        />
      ))}

      <div style={backlogSectionStyle}>
        {/* Clickable Header */}
        <div
          style={sprintHeaderStyle}
          onClick={() => setIsBacklogOpen(!isBacklogOpen)}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{
              transform: isBacklogOpen ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
              display: "inline-block"
            }}>
              ▶
            </span>
            <h3 style={{ margin: 0 }}>Product Backlog</h3>
          </div>
        </div>

        {isBacklogOpen && (
          <div style={{ marginTop: "15px" }}>
            <TaskList
              project={project}
              type="backlog"
              sprints={sprints}
              projectUsers={project.users || []}
              onTaskAction={fetchSprints}
              refreshKey={globalRefreshKey}
            />
          </div>
        )}
      </div>

      {showTaskModal && <TaskCreate onCreate={handleCreateTask} onClose={() => setShowTaskModal(false)} projectUsers={project.users || []} sprints={sprints} />}
      {showSprintModal && <SprintCreate projectId={project.id} onClose={() => setShowSprintModal(false)} onSave={() => { setShowSprintModal(false); fetchSprints(); }} />}
    </div>
  );
};

const sprintHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 15px",
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
  cursor: "pointer",
  userSelect: "none",
  border: "1px solid #eee",
};

const sprintContainerStyle = {
  marginBottom: "20px",
  border: "1px solid #eee",
  borderRadius: "8px",
  padding: "10px",
  backgroundColor: "#fff"
};

const containerStyle = { padding: "20px 0" };
const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" };
const editFormContainer = { backgroundColor: "#fff", padding: "15px", borderRadius: "8px", border: "2px solid #862424", marginBottom: "15px" };
const dateRangeStyle = { fontSize: "13px", color: "#666", backgroundColor: "#eee", padding: "2px 8px", borderRadius: "4px" };
const goalTextStyle = { fontSize: "14px", color: "#444", margin: "8px 0 0 0", fontStyle: "italic" };
const inlineInputStyle = { width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "16px", fontWeight: "bold" };
const smallInputStyle = { flex: 1, padding: "6px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "13px" };
const inlineTextAreaStyle = { width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "14px", height: "60px", resize: "none" };
const backlogSectionStyle = { marginTop: "40px", padding: "20px", borderTop: "2px dashed #ccc" };
const createBtnStyle = { backgroundColor: "#862424", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" };
const actionBtnStyle = { background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "13px", textDecoration: "underline" };
const deleteBtnStyle = { ...actionBtnStyle, color: "#862424" };
const saveBtnStyle = { background: "#24864e", color: "white", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" };
const cancelBtnStyle = { background: "#eee", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer" };

export default ProjectBacklog;
