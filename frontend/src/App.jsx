import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/useAuth";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import ProjectsPage from "./pages/ProjectsPage";
import SignupPage from "./pages/SignupPage";
import TasksPage from "./pages/TasksPage";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/" replace /> : <SignupPage />}
      />

      <Route element={<ProtectedRoute />}>
        <Route
          path="/"
          element={
            <div className="app-shell">
              <Navbar />
              <main className="container">
                <DashboardPage />
              </main>
            </div>
          }
        />
        <Route
          path="/projects"
          element={
            <div className="app-shell">
              <Navbar />
              <main className="container">
                <ProjectsPage />
              </main>
            </div>
          }
        />
        <Route
          path="/tasks"
          element={
            <div className="app-shell">
              <Navbar />
              <main className="container">
                <TasksPage />
              </main>
            </div>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
    </Routes>
  );
}

export default App;
