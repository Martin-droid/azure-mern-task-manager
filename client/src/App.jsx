import { useCallback, useEffect, useState } from "react";

const api = "/api/tasks";

async function requestJson(url, options) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Request failed");
  }
  return response.status === 204 ? null : response.json();
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    try {
      setError("");
      setTasks(await requestJson(api));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  async function addTask(event) {
    event.preventDefault();
    try {
      const task = await requestJson(api, {
        method: "POST",
        body: JSON.stringify({ title, description }),
      });
      setTasks((current) => [task, ...current]);
      setTitle("");
      setDescription("");
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function toggleTask(task) {
    try {
      const updated = await requestJson(`${api}/${task.id}`, {
        method: "PATCH",
        body: JSON.stringify({ completed: !task.completed }),
      });
      setTasks((current) => current.map((item) => (item.id === task.id ? updated : item)));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function deleteTask(id) {
    try {
      await requestJson(`${api}/${id}`, { method: "DELETE" });
      setTasks((current) => current.filter((task) => task.id !== id));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  const completed = tasks.filter((task) => task.completed).length;

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Plan clearly. Ship confidently.</p>
        <h1>Task Manager</h1>
        <p className="summary">Keep deployment work visible from the first commit to production.</p>
        <div className="progress" aria-label={`${completed} of ${tasks.length} tasks complete`}>
          <strong>{completed}</strong> completed <span>/ {tasks.length} total</span>
        </div>
      </section>

      <section className="panel">
        <form onSubmit={addTask} className="task-form">
          <label>
            Task
            <input
              required
              maxLength="120"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Configure Azure environment variables"
            />
          </label>
          <label>
            Notes
            <textarea
              maxLength="500"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Add the acceptance criteria or next step"
            />
          </label>
          <button type="submit">Add task</button>
        </form>

        {error && <p className="error" role="alert">{error}</p>}

        <div className="task-list" aria-live="polite">
          {loading && <p className="empty">Loading tasks…</p>}
          {!loading && tasks.length === 0 && (
            <p className="empty">No tasks yet. Add the first deployment step above.</p>
          )}
          {tasks.map((task) => (
            <article key={task.id} className={task.completed ? "task complete" : "task"}>
              <button className="check" onClick={() => toggleTask(task)} aria-label={`Mark ${task.title} ${task.completed ? "incomplete" : "complete"}`}>
                {task.completed ? "✓" : ""}
              </button>
              <div>
                <h2>{task.title}</h2>
                {task.description && <p>{task.description}</p>}
              </div>
              <button className="delete" onClick={() => deleteTask(task.id)} aria-label={`Delete ${task.title}`}>Delete</button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
