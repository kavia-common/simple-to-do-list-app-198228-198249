import React, { useId, useMemo, useState } from "react";

/**
 * Add-task form.
 * Kept separate from edit UI to keep responsibilities small and predictable.
 */

// PUBLIC_INTERFACE
export default function TaskInput({ onAdd }) {
  /** Renders the add-task form. */
  const titleId = useId();
  const priorityId = useId();

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [error, setError] = useState(null);

  const canSubmit = useMemo(() => title.trim().length > 0, [title]);

  function handleSubmit(e) {
    e.preventDefault();
    const result = onAdd({ title, priority });

    if (!result?.ok) {
      setError(result?.error || "Unable to add task.");
      return;
    }

    setError(null);
    setTitle("");
    setPriority("Medium");
  }

  return (
    <form className="card taskInput" onSubmit={handleSubmit} aria-label="Add a new task">
      <div className="taskInputRow">
        <div className="field">
          <label className="label" htmlFor={titleId}>
            Task title <span aria-hidden="true" className="req">*</span>
          </label>
          <input
            id={titleId}
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Buy groceries"
            autoComplete="off"
            inputMode="text"
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
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div className="field fieldButton">
          <span className="label labelGhost" aria-hidden="true">
            Add
          </span>
          <button className="btn btnPrimary" type="submit" disabled={!canSubmit}>
            Add task
          </button>
        </div>
      </div>

      {error ? (
        <div className="formError" role="alert" id={`${titleId}-error`}>
          {error}
        </div>
      ) : null}
    </form>
  );
}
