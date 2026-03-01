import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import ProjectDashboard from "./pages/ProjectDashboard";
import ProjectCreate from "./components/ProjectCreate";
import RoutesTest from "./components/RoutesTest";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/project-dash-test" element={<ProjectDashboard />} />
        <Route path="/project-create-window" element={<ProjectCreate/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
