import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../api/client";
import TaskList from "../components/TaskList";
import TaskCreate from "../components/TaskCreate";
import SprintCreate from "../components/SprintCreate";
import DeleteSprint from "../components/DeleteSprint";
import SprintEdit from "../components/SprintEdit";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-US", {
    timeZone: "America/Phoenix",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const SprintSection = ({
  sprint,
  project,
  refreshKey,
  projectUsers,
  sprints,
  onEdit,
  onDelete,
  onComplete,
  isEditing,
  editData,
  setEditData,
  onSave,
  onCancel,
  isCompleted,
  onTaskCreated
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

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {!isCompleted && (
            <button style={completeBtnStyle} onClick={() => onComplete(sprint.id)}>
              Mark as Complete
            </button>
          )}
          <button 
            style={actionBtnStyle} 
            onClick={(e) => {
              e.stopPropagation();
              onEdit(sprint);
            }}
          >
            Edit
          </button>

          <DeleteSprint
            sprintId={sprint.id}
            sprintName={sprint.name}
            onRemove={onDelete}
            deleteBtnStyle={deleteBtnStyle}
          />
        </div>
      </div>

      {isOpen && (
        <div style={{ marginTop: "15px" }}>
          <TaskList
            project={project}
            type="sprint"
            sprintId={sprint.id}
            sprints={sprints}
            refreshKey={refreshKey}
            projectUsers={projectUsers}
            onTaskAction={onTaskCreated}
          />
        </div>
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

  const fetchSprints = useCallback(async () => {
    if (!project?.id) return;
    try {
      const res = await api.get(`/projects/${project.id}/sprints/`);
      setSprints(res.data);
    } catch (err) {
      console.error("Failed to fetch sprints", err);
    }
  }, [project?.id]);

  useEffect(() => {
    if (project?.id) fetchSprints();
  }, [project?.id, refreshKey, fetchSprints]);

  if (!project || !project.id) return <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>;

  const activeSprints = sprints.filter(s => !s.completed);

  const handleEditClick = (sprint) => {
    setEditingSprintId(sprint.id);
  };

  const handleUpdateSprint = async (sprintId, updatedFields) => {
      const currentSprint = sprints.find(s => s.id === sprintId);
      try {
        await api.patch(`/projects/${project.id}/sprints/${sprintId}/`, {
          ...updatedFields,
          completed: currentSprint?.completed,
          on_incomplete_tasks: "backlog"
        });
        setEditingSprintId(null);
        fetchSprints();
      } catch (err) {
        console.error("Update failed", err.response?.data);
      }
  };

  const handleCompleteSprint = async (sprintId) => {
    try {
      await api.patch(`/projects/${project.id}/sprints/${sprintId}/`, {
        completed: true,
        on_incomplete_tasks: "backlog"
      });
      fetchSprints();
      onTaskCreated();
    } catch (err) {
      console.error("Complete failed", err.response?.data);
    }
  };

  const handleDeleteSprint = async (sprintId, taskAction = "backlog") => {
    try {
      await api.delete(`/projects/${project.id}/sprints/${sprintId}/`, {
        params: { on_incomplete_tasks: taskAction }
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
        <h2 style={{ margin: 0 }}>Project Tasks</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button style={{ ...createBtnStyle, backgroundColor: "#444" }} onClick={() => setShowSprintModal(true)}>+ Create Sprint</button>
          <button style={createBtnStyle} onClick={() => setShowTaskModal(true)}>+ Create Task</button>
        </div>
      </div>

      {activeSprints.map((sprint) => (
        <SprintSection
          key={sprint.id}
          sprint={sprint}
          project={project}
          refreshKey={refreshKey}
          projectUsers={project.users || []}
          sprints={sprints}
          onEdit={handleEditClick}
          onDelete={handleDeleteSprint}
          onComplete={handleCompleteSprint}
          isEditing={editingSprintId === sprint.id}
          editData={editData}
          setEditData={setEditData}
          onSave={handleUpdateSprint}
          onCancel={() => setEditingSprintId(null)}
          onTaskCreated={onTaskCreated}
          isCompleted={false}
        />
      ))}

      {/* Product Backlog */}
      <div style={backlogSectionStyle}>
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
              refreshKey={refreshKey}
              onTaskAction={onTaskCreated}
            />
          </div>
        )}
      </div>

      {showTaskModal && <TaskCreate onCreate={handleCreateTask} onClose={() => setShowTaskModal(false)} projectUsers={project.users || []} sprints={sprints} />}
      {showSprintModal && <SprintCreate projectId={project.id} onClose={() => setShowSprintModal(false)} onSave={() => { setShowSprintModal(false); fetchSprints(); }} />}
      
      {editingSprintId && (
        <SprintEdit
          sprint={sprints.find(s => s.id === editingSprintId)}
          onEdit={handleUpdateSprint}
          onClose={() => setEditingSprintId(null)}
        />
      )}
    </div>
  );
};

const sprintHeaderStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 15px", backgroundColor: "#f8f9fa", borderRadius: "8px", cursor: "pointer", userSelect: "none", border: "1px solid #eee" };
const sprintContainerStyle = { marginBottom: "20px", border: "1px solid #eee", borderRadius: "8px", padding: "10px", backgroundColor: "#fff" };
const containerStyle = { padding: "20px 0" };
const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" };
const dateRangeStyle = { fontSize: "13px", color: "#666", backgroundColor: "#eee", padding: "2px 8px", borderRadius: "4px" };
const backlogSectionStyle = { marginTop: "40px", padding: "20px", borderTop: "2px dashed #ccc" };
const createBtnStyle = { backgroundColor: "#862424", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" };
const actionBtnStyle = { background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "13px", textDecoration: "underline" };
const deleteBtnStyle = { ...actionBtnStyle, color: "#862424" };
const completeBtnStyle = { background: "none", border: "none", color: "#24864e", cursor: "pointer", fontSize: "13px", textDecoration: "underline" };
const saveBtnStyle = { background: "#24864e", color: "white", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" };
const cancelBtnStyle = { background: "#eee", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer" };

export default ProjectBacklog;