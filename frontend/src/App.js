import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import UserTasksView from "./pages/UserTasksView";
import ProjectTasksView from "./pages/ProjectTasksView";
import ProjectsView from "./pages/ProjectsView";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-tasks-view" element={<UserTasksView />} />
        <Route path="/projects/:projectId/tasks" element={<ProjectTasksView />} />
        <Route path="/projects-view" element={<ProjectsView />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
