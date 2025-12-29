import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Courses from "./pages/Courses";
import Projects from "./pages/Projects";
import Logout from "./pages/Logout.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import "./App.css";

const App = () => {
  const location = useLocation();

  // Routes où la sidebar doit être cachée
  const hideSidebarRoutes = ["/", "/signup"];
  const hideSidebar = hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="app-container">
      {!hideSidebar && <Sidebar />}

      <div className="main-content">
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/logOut" element={<Logout />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
