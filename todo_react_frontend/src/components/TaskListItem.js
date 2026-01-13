import React, { useEffect, useId, useMemo, useRef, useState } from "react";

function formatDate(ts) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(ts));
  } catch {
    return "";
  }
}

// PUBLIC_INTERFACE
export default function TaskListItem({ task, onToggle, onUpdate, onDelete }) {
  /** Renders one task row including inline edit mode. */
  const checkboxId = useId();
  const titleId = useId();
  const priorityId = useId();

  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);
  const [draftPriority, setDraftPriority] = useState(task.priority);
  const [error, setError] = useState(null);

  const inputRef = useRef(null);

  const createdLabel = useMemo(() => formatDate(task.createdAt), [task.createdAt]);

  useEffect(() => {
    // Keep drafts in sync if external updates happen while not editing.
    if (!isEditing) {
      setDraftTitle(task.title);
      setDraftPriority(task.priority);
      setError(null);
    }
  }, [task.title, task.priority, isEditing]);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  function beginEdit() {
    setIsEditing(true);
    setError(null);
  }

  function cancelEdit() {
    setIsEditing(false);
    setDraftTitle(task.title);
    setDraftPriority(task.priority);
    setError(null);
  }

  function saveEdit() {
    const result = onUpdate({ title: draftTitle, priority: draftPriority });
    if (!result?.ok) {
      setError(result?.error || "Unable to save changes.");
      return;
    }
    setIsEditing(false);
    setError(null);
  }

  function confirmDelete() {
    // Confirmation step required by spec.
    const ok = window.confirm(`Delete task "${task.title}"? This cannot be undone.`);
    if (ok) onDelete();
  }

  return (
    <li className={`card taskItem ${task.completed ? "isCompleted" : ""}`}>
      <div className="taskMain">
        <div className="taskCheck">
          <input
            id={checkboxId}
            type="checkbox"
            className="checkbox"
            checked={task.completed}
            onChange={onToggle}
            aria-label={task.completed ? "Mark as incomplete" : "Mark as completed"}
          />
        </div>

        <div className="taskBody">
          {!isEditing ? (
            <>
              <div className="taskTitleRow">
                <label htmlFor={checkboxId} className="taskTitle">
                  {task.title}
                </label>
                <span className={`pill priority${task.priority}`}>{task.priority}</span>
              </div>
              <div className="taskMeta muted">
                <span>Created {createdLabel}</span>
              </div>
            </>
          ) : (
            <div className="editGrid" aria-label="Edit task">
              <div className="field">
                <label className="label" htmlFor={titleId}>
                  Title
                </label>
                <input
                  id={titleId}
                  ref={inputRef}
                  className="input"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  aria-invalid={error ? "true" : "false"}
                  aria-describedby={error ? `${titleId}-error` : undefined}
                />
              </div>

              <div className="field fieldNarrow">
                <label className="label" htmlFor={priorityId}>
                  Priority
                </label>
                <select
                  id={priorityId}
                  className="select"
                  value={draftPriority}
                  onChange={(e) => setDraftPriority(e.target.value)}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div className="editActions">
                <button type="button" className="btn btnPrimary" onClick={saveEdit}>
                  Save
                </button>
                <button type="button" className="btn btnGhost" onClick={cancelEdit}>
                  Cancel
                </button>
              </div>

              {error ? (
                <div className="formError" role="alert" id={`${titleId}-error`}>
                  {error}
                </div>
              ) : null}
            </div>
          )}
        </div>

        {!isEditing ? (
          <div className="taskActions" aria-label="Task actions">
            <button type="button" className="btn btnGhost" onClick={beginEdit}>
              Edit
            </button>
            <button type="button" className="btn btnDanger" onClick={confirmDelete}>
              Delete
            </button>
          </div>
        ) : null}
      </div>
    </li>
  );
}
