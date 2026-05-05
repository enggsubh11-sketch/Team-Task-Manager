import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/useAuth";

const ProjectsPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUsers, setSelectedUsers] = useState({});
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    const { data } = await api.get("/projects");
    setProjects(data);
  };

  useEffect(() => {
    api.get("/projects").then(({ data }) => setProjects(data));
    if (user?.role === "Admin") {
      api.get("/users").then(({ data }) => setUsers(data));
    }
  }, [user?.role]);

  const handleAddMember = async (projectId) => {
    const userId = selectedUsers[projectId];
    if (!userId) return;
    await api.post(`/projects/${projectId}/members`, { userId });
    setSelectedUsers((prev) => ({ ...prev, [projectId]: "" }));
    fetchProjects();
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/projects", { name, description });
      setName("");
      setDescription("");
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create project.");
    }
  };

  return (
    <div>
      <h3>Projects</h3>
      {user?.role === "Admin" && (
        <form className="form-inline" onSubmit={handleCreate}>
          <input
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit">Create</button>
        </form>
      )}
      {error && <p className="error">{error}</p>}
      <div className="list">
        {projects.map((p) => (
          <div key={p._id} className="card">
            <strong>{p.name}</strong>
            <p>{p.description || "No description"}</p>
            <small>Members: {p.members?.length || 0}</small>
            {user?.role === "Admin" && (
              <div className="form-inline">
                <select
                  value={selectedUsers[p._id] || ""}
                  onChange={(e) =>
                    setSelectedUsers((prev) => ({ ...prev, [p._id]: e.target.value }))
                  }
                >
                  <option value="">Select user</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
                <button type="button" onClick={() => handleAddMember(p._id)}>
                  Add member
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
