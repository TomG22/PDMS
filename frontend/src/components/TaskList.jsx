import React, { useState, useMemo } from "react";
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

const PAGE_SIZE = 5;

const COLUMNS = [
    { key: "name",                 label: "Name" },
    { key: "priority",             label: "Priority" },
    { key: "status",               label: "Status" },
    { key: "assigned_to_username", label: "Assignee" },
];

const FILTER_OPTIONS = {
    priority: PRIORITY_OPTIONS.map(o => ({ value: o.value, label: o.label })),
    status:   STATUS_OPTIONS.map(o => ({ value: o.value, label: o.label })),
};

const TaskList = ({ tasks, projectUsers, onRemove, onUpdate }) => {
    const [sort, setSort] = useState({ key: "priority", dir: "asc" });
    const [filters, setFilters] = useState({});
    const [openFilter, setOpenFilter] = useState(null);
    const [page, setPage] = useState(1);

    const handleSortClick = (key) => {
        setSort(prev =>
            prev.key === key
                ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
                : { key, dir: "asc" }
        );
        setPage(1);
    };

    const handleReset = () => {
        setSort({ key: "priority", dir: "asc" });
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
            const av = a[sort.key] ?? "";
            const bv = b[sort.key] ?? "";
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
                                onRemove={onRemove}
                                onUpdate={onUpdate}
                            />
                        </li>
                    ))
                ) : (
                    <div style={{ textAlign: "center", padding: "40px", color: "#888", border: "2px dashed #ccc", borderRadius: "8px" }}>
                        {Object.values(filters).some(s => s.size > 0)
                            ? "No tasks match the current filters."
                            : "No tasks found. Click \"+ New Task\" to get started."}
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
