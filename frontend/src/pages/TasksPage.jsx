import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/useAuth";

const TasksPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    projectId: "",
    assignedTo: "",
    status: "Todo",
    dueDate: "",
  });
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    const { data } = await api.get("/tasks");
    setTasks(data);
  };

  useEffect(() => {
    Promise.all([api.get("/tasks"), api.get("/projects")]).then(([tasksRes, projectsRes]) => {
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
    });
  }, []);

  const currentProject = projects.find((p) => p._id === form.projectId);
  const members = currentProject?.members || [];

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/tasks", form);
      setForm({
        title: "",
        description: "",
        projectId: "",
        assignedTo: "",
        status: "Todo",
        dueDate: "",
      });
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create task.");
    }
  };

  const handleStatus = async (taskId, status) => {
    await api.patch(`/tasks/${taskId}`, { status });
    fetchTasks();
  };

  return (
    <div>
      <h3>Tasks</h3>
      {(user?.role === "Admin" || user?.role === "Member") && (
        <form className="form" onSubmit={handleCreate}>
          <input
            placeholder="Task title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            placeholder="Task description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <select
            value={form.projectId}
            onChange={(e) => setForm({ ...form, projectId: e.target.value, assignedTo: "" })}
            required
          >
            <option value="">Select project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
          <select
            value={form.assignedTo}
            onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
            required
          >
            <option value="">Assign to</option>
            {members.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name} ({member.role})
              </option>
            ))}
          </select>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            required
          />
          <button type="submit">Create Task</button>
        </form>
      )}
      {error && <p className="error">{error}</p>}

      <div className="list">
        {tasks.map((task) => (
          <div className="card" key={task._id}>
            <strong>{task.title}</strong>
            <p>{task.description || "No description"}</p>
            <small>
              Project: {task.project?.name} | Assigned: {task.assignedTo?.name}
            </small>
            <small>Due: {new Date(task.dueDate).toLocaleDateString()}</small>
            <select
              value={task.status}
              onChange={(e) => handleStatus(task._id, e.target.value)}
              disabled={user?.role === "Member" && task.assignedTo?._id !== user?._id}
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksPage;
