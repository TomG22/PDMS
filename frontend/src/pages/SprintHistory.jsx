import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../api/client";
import TaskList from "../components/TaskList";
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

const CompletedSprintSection = ({
  sprint,
  project,
  refreshKey,
  fetchSprints,
  projectUsers,
  sprints,
  onDelete,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={sprintContainerStyle}>
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

      {isOpen && (
        <div style={{ marginTop: "15px" }}>
          {sprint.goal && <p style={goalTextStyle}>Goal: {sprint.goal}</p>}
          <TaskList
            project={project}
            type="sprint"
            sprintId={sprint.id}
            sprints={sprints}
            refreshKey={refreshKey}
            projectUsers={projectUsers}
            onTaskAction={fetchSprints}
          />
        </div>
      )}
    </div>
  );
};

const SprintHistory = ({ project, refreshKey }) => {
  useAuth();
  const [sprints, setSprints] = useState([]);

  const fetchSprints = useCallback(async () => {
    if (!project?.id) return;
    try {
      const res = await api.get(`/projects/${project.id}/sprints/`);
      setSprints(res.data.filter(s => s.completed));
    } catch (err) {
      console.error("Failed to fetch sprints", err);
    }
  }, [project?.id]);

  useEffect(() => {
    if (project?.id) fetchSprints();
  }, [project?.id, refreshKey, fetchSprints]);

  const handleDeleteSprint = async (sprintId) => {
    try {
      await api.delete(`/projects/${project.id}/sprints/${sprintId}/?on_incomplete_tasks=backlog`);
      fetchSprints();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  if (!project || !project.id) return <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>;

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={{ margin: 0 }}>Sprint History</h2>
      </div>

      {sprints.length === 0 ? (
        <div style={emptyStateStyle}>
          <p style={{ color: "#888", fontSize: "15px" }}>No completed sprints yet. Mark a sprint as complete from the Backlog to see it here.</p>
        </div>
      ) : (
        sprints.map((sprint) => (
          <CompletedSprintSection
            key={sprint.id}
            sprint={sprint}
            project={project}
            refreshKey={refreshKey}
            fetchSprints={fetchSprints}
            projectUsers={project.users || []}
            sprints={sprints}
            onDelete={handleDeleteSprint}
          />
        ))
      )}
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
  backgroundColor: "#fff",
};

const containerStyle = { padding: "20px 0" };
const headerStyle = { display: "flex", alignItems: "center", gap: "15px", marginBottom: "30px" };
const dateRangeStyle = { fontSize: "13px", color: "#666", backgroundColor: "#eee", padding: "2px 8px", borderRadius: "4px" };
const goalTextStyle = { fontSize: "14px", color: "#444", margin: "8px 0 0 0", fontStyle: "italic" };
const emptyStateStyle = { padding: "40px", textAlign: "center", backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #eee" };
const actionBtnStyle = { background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "13px", textDecoration: "underline" };
const deleteBtnStyle = { ...actionBtnStyle, color: "#862424" };

export default SprintHistory;
