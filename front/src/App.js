import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Courses from "./pages/Courses";
import Projects from "./pages/Projects";
import "./App.css";
import Logout from "./pages/Logout.jsx";
import SignIn from "./pages/SignIn.jsx";

const App = () => {
  const location = useLocation(); // Get current route

  // Check if current route is SignIn
  const isSignInPage = location.pathname === "/";

  return (
    <div className="app-container">
      {!isSignInPage && <Sidebar />} {/* Only show sidebar if not SignIn */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/logOut" element={<Logout/>} />
          <Route path="/dashbord" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;


