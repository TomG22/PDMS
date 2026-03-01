import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProjectDashboard from "./pages/ProjectDashboard";
import RoutesTest from "./components/RoutesTest";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/test" element={<RoutesTest />} />
        <Route path="/project-dash-test" element={<ProjectDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
