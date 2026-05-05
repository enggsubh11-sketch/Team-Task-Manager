import { useEffect, useState } from "react";
import api from "../api/client";

const DashboardPage = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get("/dashboard");
      setStats(data);
    };
    load();
  }, []);

  if (!stats) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h3>Dashboard</h3>
      <div className="grid">
        <div className="card">Total Tasks: {stats.total}</div>
        <div className="card">Todo: {stats.todo}</div>
        <div className="card">In Progress: {stats.inProgress}</div>
        <div className="card">Done: {stats.done}</div>
        <div className="card overdue">Overdue: {stats.overdue}</div>
      </div>
    </div>
  );
};

export default DashboardPage;
