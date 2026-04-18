import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

import UserTasksView from "./pages/UserTasksView";
// import ProjectTasksView from "./pages/ProjectTasksView";
import UserDashboard from "./pages/UserDashboard";
import Profile from "./pages/Profile";
import ProjectDashboard from "./pages/ProjectDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-tasks-view" element={<UserTasksView />} />
        {/* <Route path="/projects/:projectId/tasks" element={<ProjectTasksView />} /> */}
        <Route path="/projects-view" element={<UserDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/projects/:projectId/" element={<ProjectDashboard/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
