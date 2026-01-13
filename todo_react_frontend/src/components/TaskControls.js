import React, { useId } from "react";

// PUBLIC_INTERFACE
export default function TaskControls({ filter, onFilterChange, search, onSearchChange, meta }) {
  /** Renders filter buttons and search input. */
  const searchId = useId();

  return (
    <div className="card controls" role="region" aria-label="Task controls">
      <div className="controlsTop">
        <div className="segmented" role="tablist" aria-label="Filter tasks by status">
          <button
            type="button"
            className={`segmentedBtn ${filter === "all" ? "isActive" : ""}`}
            onClick={() => onFilterChange("all")}
            role="tab"
            aria-selected={filter === "all"}
          >
            All <span className="badge">{meta.total}</span>
          </button>
          <button
            type="button"
            className={`segmentedBtn ${filter === "active" ? "isActive" : ""}`}
            onClick={() => onFilterChange("active")}
            role="tab"
            aria-selected={filter === "active"}
          >
            Active <span className="badge">{meta.active}</span>
          </button>
          <button
            type="button"
            className={`segmentedBtn ${filter === "completed" ? "isActive" : ""}`}
            onClick={() => onFilterChange("completed")}
            role="tab"
            aria-selected={filter === "completed"}
          >
            Completed <span className="badge">{meta.completed}</span>
          </button>
        </div>

        <div className="hint" aria-label="Summary">
          <span className="muted">
            {meta.active} active • {meta.completed} completed
          </span>
        </div>
      </div>

      <div className="controlsBottom">
        <label className="label" htmlFor={searchId}>
          Search
        </label>
        <input
          id={searchId}
          className="input"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title..."
          autoComplete="off"
          inputMode="search"
        />
      </div>
    </div>
  );
}
