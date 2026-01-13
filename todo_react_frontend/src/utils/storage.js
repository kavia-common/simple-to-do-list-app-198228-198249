/**
 * LocalStorage helpers for the To-Do app.
 * These helpers are intentionally defensive to avoid crashing the app when storage is unavailable.
 */

const STORAGE_KEY = "kavia.todo.tasks.v1";

// PUBLIC_INTERFACE
export function loadTasks() {
  /** Loads tasks array from LocalStorage. Returns { tasks, error }. */
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { tasks: [], error: null };

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return { tasks: [], error: "Saved data was invalid and was reset." };

    return { tasks: parsed, error: null };
  } catch (e) {
    return {
      tasks: [],
      error:
        "Could not access LocalStorage. Your changes may not persist (privacy mode or blocked storage).",
    };
  }
}

// PUBLIC_INTERFACE
export function saveTasks(tasks) {
  /** Saves tasks array to LocalStorage. Returns { ok, error }. */
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return { ok: true, error: null };
  } catch (e) {
    return {
      ok: false,
      error:
        "Could not save to LocalStorage. Your changes may not persist (privacy mode or blocked storage).",
    };
  }
}
