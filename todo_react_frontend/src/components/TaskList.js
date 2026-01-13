import React from "react";
import TaskListItem from "./TaskListItem";

// PUBLIC_INTERFACE
export default function TaskList({ tasks, onToggle, onUpdate, onDelete, filter, search }) {
  /** Renders the list of tasks and an empty state. */
  if (tasks.length === 0) {
    return (
      <div className="card emptyState" role="status" aria-live="polite">
        <h2 className="h2">No tasks found</h2>
        <p className="muted">
          {filter !== "all" || search.trim()
            ? "Try changing your filter or search."
            : "Add your first task above to get started."}
        </p>
      </div>
    );
  }

  return (
    <ul className="list" aria-label="Task list">
      {tasks.map((task) => (
        <TaskListItem
          key={task.id}
          task={task}
          onToggle={() => onToggle(task.id)}
          onUpdate={(updates) => onUpdate(task.id, updates)}
          onDelete={() => onDelete(task.id)}
        />
      ))}
    </ul>
  );
}
