import React, { useMemo, useState } from "react";
import "./App.css";
import TaskControls from "./components/TaskControls";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import { useTasks } from "./hooks/useTasks";

function matchesFilter(task, filter) {
  if (filter === "active") return !task.completed;
  if (filter === "completed") return task.completed;
  return true;
}

function matchesSearch(task, search) {
  const q = search.trim().toLowerCase();
  if (!q) return true;
  return task.title.toLowerCase().includes(q);
}

// PUBLIC_INTERFACE
function App() {
  /** Main entry point for the frontend-only To-Do app with LocalStorage persistence. */
  const { tasks, meta, storageError, saveError, addTask, toggleTask, updateTask, deleteTask } =
    useTasks();

  const [filter, setFilter] = useState("all"); // "all" | "active" | "completed"
  const [search, setSearch] = useState("");

  const visibleTasks = useMemo(() => {
    return tasks.filter((t) => matchesFilter(t, filter)).filter((t) => matchesSearch(t, search));
  }, [tasks, filter, search]);

  return (
    <div className="appShell">
      <header className="header">
        <div className="headerInner">
          <div>
            <h1 className="h1">To‑Do</h1>
            <p className="subtitle">A simple, fast daily task list — stored locally in your browser.</p>
          </div>
        </div>
      </header>

      <main className="container">
        {storageError ? (
          <div className="banner bannerWarn" role="status" aria-live="polite">
            <strong>Storage notice:</strong> {storageError}
          </div>
        ) : null}

        {saveError ? (
          <div className="banner bannerWarn" role="status" aria-live="polite">
            <strong>Save failed:</strong> {saveError}
          </div>
        ) : null}

        <TaskInput onAdd={addTask} />

        <TaskControls
          filter={filter}
          onFilterChange={setFilter}
          search={search}
          onSearchChange={setSearch}
          meta={meta}
        />

        <section aria-label="Tasks">
          <TaskList
            tasks={visibleTasks}
            onToggle={toggleTask}
            onUpdate={updateTask}
            onDelete={deleteTask}
            filter={filter}
            search={search}
          />
        </section>

        <footer className="footer muted">
          <span>
            Tip: Use filter + search to focus. Deleting asks for confirmation to prevent mistakes.
          </span>
        </footer>
      </main>
    </div>
  );
}

export default App;
