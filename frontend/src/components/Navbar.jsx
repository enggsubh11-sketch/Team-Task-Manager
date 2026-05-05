import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="nav">
      <h2>Team Task Manager</h2>
      <div className="nav-links">
        <Link to="/">Dashboard</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/tasks">Tasks</Link>
      </div>
      <div className="nav-user">
        <span>
          {user?.name} ({user?.role})
        </span>
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
