import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import ProjectsView from "./pages/ProjectsView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/projects-view" element={<ProjectsView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
