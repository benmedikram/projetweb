import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Courses from "./pages/Courses";
import Projects from "./pages/Projects";
import "./App.css";
import SignIn from "./pages/SignIn.jsx";

const App = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<SignIn />} />
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

