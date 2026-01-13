import { useEffect, useMemo, useState } from "react";
import { loadTasks, saveTasks } from "../utils/storage";

/**
 * Task shape used by the app:
 * {
 *   id: string,
 *   title: string,
 *   completed: boolean,
 *   createdAt: number (ms timestamp),
 *   priority: "Low" | "Medium" | "High"
 * }
 */

function makeId() {
  // Good enough for a local-only app; avoids adding dependencies.
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// PUBLIC_INTERFACE
export function useTasks() {
  /** Provides task CRUD actions with LocalStorage persistence and storage error reporting. */
  const [{ tasks, storageError }, setState] = useState(() => {
    const { tasks: loaded, error } = loadTasks();
    return { tasks: normalizeTasks(loaded), storageError: error };
  });

  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    const { ok, error } = saveTasks(tasks);
    setSaveError(ok ? null : error);
  }, [tasks]);

  const meta = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const active = total - completed;
    return { total, active, completed };
  }, [tasks]);

  function setTasks(updater) {
    setState((prev) => {
      const nextTasks = typeof updater === "function" ? updater(prev.tasks) : updater;
      return { ...prev, tasks: normalizeTasks(nextTasks) };
    });
  }

  // PUBLIC_INTERFACE
  function addTask({ title, priority }) {
    /** Adds a new task. Returns { ok, error }. */
    const trimmed = (title ?? "").trim();
    if (!trimmed) return { ok: false, error: "Task title is required." };

    const newTask = {
      id: makeId(),
      title: trimmed,
      completed: false,
      createdAt: Date.now(),
      priority: normalizePriority(priority),
    };

    setTasks((prev) => [newTask, ...prev]);
    return { ok: true, error: null };
  }

  // PUBLIC_INTERFACE
  function toggleTask(id) {
    /** Toggles completion. */
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }

  // PUBLIC_INTERFACE
  function updateTask(id, updates) {
    /** Updates task fields. Returns { ok, error }. */
    const nextTitle = updates?.title;
    if (typeof nextTitle === "string" && !nextTitle.trim()) {
      return { ok: false, error: "Task title cannot be empty." };
    }

    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              ...updates,
              title: typeof nextTitle === "string" ? nextTitle.trim() : t.title,
              priority:
                typeof updates?.priority === "string"
                  ? normalizePriority(updates.priority)
                  : t.priority,
            }
          : t
      )
    );

    return { ok: true, error: null };
  }

  // PUBLIC_INTERFACE
  function deleteTask(id) {
    /** Deletes by id. */
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return {
    tasks,
    meta,
    storageError,
    saveError,
    addTask,
    toggleTask,
    updateTask,
    deleteTask,
    setTasks,
  };
}

function normalizePriority(priority) {
  const p = (priority ?? "Medium").toString().toLowerCase();
  if (p === "low") return "Low";
  if (p === "high") return "High";
  return "Medium";
}

function normalizeTasks(tasks) {
  if (!Array.isArray(tasks)) return [];
  return tasks
    .filter((t) => t && typeof t === "object")
    .map((t) => ({
      id: typeof t.id === "string" ? t.id : makeId(),
      title: typeof t.title === "string" ? t.title : "Untitled",
      completed: Boolean(t.completed),
      createdAt: typeof t.createdAt === "number" ? t.createdAt : Date.now(),
      priority: normalizePriority(t.priority),
    }));
}
