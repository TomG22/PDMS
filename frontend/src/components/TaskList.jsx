import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import TaskCard from "./TaskCard";

const PRIORITY_OPTIONS = [
    { value: 0, label: "None" },
    { value: 1, label: "Low" },
    { value: 2, label: "Medium" },
    { value: 3, label: "High" },
];

const STATUS_OPTIONS = [
    { value: "ready_to_begin", label: "Ready to Begin" },
    { value: "in_progress", label: "In Progress" },
    { value: "under_review", label: "Under Review" },
    { value: "testing", label: "Testing" },
    { value: "done", label: "Done" },
];

const STATUS_INDEX = Object.fromEntries(
    STATUS_OPTIONS.map((opt, i) => [opt.value, i])
);

const PAGE_SIZE = 5;

const COLUMNS = [
    { key: "name", label: "Name" },
    { key: "priority", label: "Priority" },
    { key: "status", label: "Status" },
    { key: "assigned_to_username", label: "Assignee" },
];

const FILTER_OPTIONS = {
    priority: PRIORITY_OPTIONS.map(o => ({ value: o.value, label: o.label })),
    status: STATUS_OPTIONS.map(o => ({ value: o.value, label: o.label })),
};

const TaskList = ({ project = null, refreshKey = 0 }) => {
    const [tasks, setTasks] = useState([]);
    const [projectUsers, setProjectUsers] = useState([]);
    // ID -> name map, only used in my tasks view
    const [projectNameMap, setProjectNameMap] = useState({});
    const [sort, setSort] = useState({ key: "priority", dir: "desc" });
    const [filters, setFilters] = useState({});
    const [openFilter, setOpenFilter] = useState(null);
    const [page, setPage] = useState(1);

    const getToken = () => localStorage.getItem("access_token");

    useEffect(() => {
        const fetchTasks = async () => {
            const headers = { Authorization: `Bearer ${getToken()}` };
            try {
                // Project view: fetch all tasks for this project
                if (project) {
                    const res = await axios.get(
                        `http://localhost:8000/api/projects/${project.id}/tasks/`,
                        { headers }
                    );
                    setTasks(res.data);
                    setProjectUsers(project.users ?? []);
                } else {
                    // My tasks view: fetch user's tasks and all projects for name lookup
                    const [tasksRes, projectsRes] = await Promise.all([
                        axios.get(`http://localhost:8000/api/tasks/my/`, { headers }),
                        axios.get(`http://localhost:8000/api/projects/`, { headers }),
                    ]);
                    setTasks(tasksRes.data);
                    const nameMap = {};
                    projectsRes.data.forEach(p => { nameMap[p.id] = p.name; });
                    setProjectNameMap(nameMap);
                }
            } catch (err) {
                console.error("Failed to fetch tasks:", err.response?.status, err.response?.data);
            }
        };

        fetchTasks();
    }, [project, refreshKey]);

    const handleUpdateTask = async (taskId, fields) => {
        try {
            let token = localStorage.getItem("access_token");

            const res = await axios.patch(
                `http://localhost:8000/api/tasks/${taskId}/`,
                fields,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            ).catch(async (err) => {
                if (err.response?.status === 401) {
                    const refresh = localStorage.getItem("refresh_token");

                    const refreshRes = await axios.post(
                        "http://localhost:8000/api/token/refresh/",
                        { refresh }
                    );

                    token = refreshRes.data.access;
                    localStorage.setItem("access_token", token);

                    return axios.patch(
                        `http://localhost:8000/api/tasks/${taskId}/`,
                        fields,
                        {
                            headers: { Authorization: `Bearer ${token}` }
                        }
                    );
                }
                throw err;
            });

            setTasks(prev => prev.map(t => t.id === taskId ? res.data : t));

        } catch (err) {
            console.error("Failed to update task:", err.response?.status, err.response?.data);
        }
    };

    const handleRemoveTask = async (taskId) => {
        try {
            await axios.delete(`http://localhost:8000/api/tasks/${taskId}/`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setTasks(prev => prev.filter(t => t.id !== taskId));
        } catch (err) {
            console.error("Failed to delete task:", err.response?.status, err.response?.data);
        }
    };

    const handleSortClick = (key) => {
        setSort(prev =>
            prev.key === key
                ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
                : { key, dir: "asc" }
        );
        setPage(1);
    };

    const handleReset = () => {
        setSort({ key: "priority", dir: "desc" });
        setFilters({});
        setOpenFilter(null);
        setPage(1);
    };

    const toggleFilterValue = (colKey, value) => {
        setFilters(prev => {
            const current = new Set(prev[colKey] ?? []);
            current.has(value) ? current.delete(value) : current.add(value);
            return { ...prev, [colKey]: current };
        });
        setPage(1);
    };

    const clearFilter = (colKey) => {
        setFilters(prev => {
            const next = { ...prev };
            delete next[colKey];
            return next;
        });
        setPage(1);
    };

    const getFilterOptions = (colKey) => {
        if (FILTER_OPTIONS[colKey]) return FILTER_OPTIONS[colKey];
        const unique = [...new Set(tasks.map(t => t[colKey]).filter(Boolean))];
        return unique.map(v => ({ value: v, label: v }));
    };

    const processed = useMemo(() => {
        let result = [...tasks];

        Object.entries(filters).forEach(([colKey, selected]) => {
            if (!selected || selected.size === 0) return;
            result = result.filter(task => {
                const val = task[colKey];
                return [...selected].some(s => String(s) === String(val));
            });
        });

        result.sort((a, b) => {
            let av = a[sort.key] ?? "";
            let bv = b[sort.key] ?? "";

            if (sort.key === "status") {
                av = STATUS_INDEX[av] ?? 0;
                bv = STATUS_INDEX[bv] ?? 0;
            }

            if (av < bv) return sort.dir === "asc" ? -1 : 1;
            if (av > bv) return sort.dir === "asc" ? 1 : -1;
            return 0;
        });

        return result;
    }, [tasks, filters, sort]);

    const totalPages = Math.max(1, Math.ceil(processed.length / PAGE_SIZE));
    const paginated = processed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const sortIcon = (key) => {
        if (sort.key !== key) return " ↕";
        return sort.dir === "asc" ? " ↑" : " ↓";
    };

    const activeFilterCount = (colKey) => {
        const s = filters[colKey];
        return s ? s.size : 0;
    };

    return (
        <div>
            <div style={headerRowStyle}>
                {COLUMNS.map(col => (
                    <div key={col.key} style={headerCellStyle}>
                        <button
                            onClick={() => handleSortClick(col.key)}
                            style={headerButtonStyle}
                        >
                            {col.label}{sortIcon(col.key)}
                        </button>

                        <div style={{ position: "relative" }}>
                            <button
                                onClick={() => setOpenFilter(openFilter === col.key ? null : col.key)}
                                style={{
                                    ...filterIconButtonStyle,
                                    color: activeFilterCount(col.key) > 0 ? "#862424" : "#999",
                                }}
                                title="Filter"
                            >
                                ▾ {activeFilterCount(col.key) > 0 && `(${activeFilterCount(col.key)})`}
                            </button>

                            {openFilter === col.key && (
                                <div style={filterDropdownStyle}>
                                    {getFilterOptions(col.key).map(opt => (
                                        <label key={opt.value} style={filterOptionStyle}>
                                            <input
                                                type="checkbox"
                                                checked={filters[col.key]?.has(opt.value) ?? false}
                                                onChange={() => toggleFilterValue(col.key, opt.value)}
                                            />
                                            {opt.label}
                                        </label>
                                    ))}
                                    <button
                                        onClick={() => { clearFilter(col.key); setOpenFilter(null); }}
                                        style={clearFilterButtonStyle}
                                    >
                                        Clear
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                <button onClick={handleReset} style={resetButtonStyle}>Reset</button>
            </div>

            <ul style={{ listStyle: "none", padding: 0 }}>
                {paginated.length > 0 ? (
                    paginated.map((task) => (
                        <li key={task.id}>
                            <TaskCard
                                task={task}
                                projectUsers={projectUsers}
                                projectName={project ? null : projectNameMap[task.project]}
                                onRemove={handleRemoveTask}
                                onUpdate={handleUpdateTask}
                            />
                        </li>
                    ))
                ) : (
                    <div style={{ textAlign: "center", padding: "40px", color: "#888", border: "2px dashed #ccc", borderRadius: "8px" }}>
                        {Object.values(filters).some(s => s.size > 0)
                            ? "No tasks match the current filters."
                            : "No tasks found."}
                    </div>
                )}
            </ul>

            {totalPages > 1 && (
                <div style={paginationStyle}>
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        style={pageButtonStyle(page === 1)}
                    >
                        Prev
                    </button>
                    <span style={{ fontSize: "14px", color: "#555" }}>
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        style={pageButtonStyle(page === totalPages)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

const headerRowStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "16px",
    flexWrap: "wrap",
};

const headerCellStyle = {
    display: "flex",
    alignItems: "center",
    gap: "2px",
};

const headerButtonStyle = {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "13px",
    color: "#333",
    padding: "4px 6px",
};

const filterIconButtonStyle = {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "13px",
    padding: "4px 2px",
};

const filterDropdownStyle = {
    position: "absolute",
    top: "100%",
    left: 0,
    background: "white",
    border: "1px solid #ccc",
    borderRadius: "6px",
    padding: "8px",
    zIndex: 100,
    minWidth: "160px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
};

const filterOptionStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    cursor: "pointer",
};

const clearFilterButtonStyle = {
    marginTop: "4px",
    background: "none",
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    padding: "3px 8px",
    color: "#555",
};

const resetButtonStyle = {
    marginLeft: "auto",
    background: "none",
    border: "1px solid #ccc",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    padding: "4px 12px",
    color: "#555",
};

const paginationStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    marginTop: "24px",
};

const pageButtonStyle = (disabled) => ({
    background: disabled ? "#eee" : "#2C2C2C",
    color: disabled ? "#aaa" : "white",
    border: "none",
    borderRadius: "6px",
    padding: "6px 14px",
    cursor: disabled ? "default" : "pointer",
    fontSize: "13px",
    fontWeight: 600,
});

export default TaskList;
