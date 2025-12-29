import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>EduSpace</h2>
            <nav>
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink>
                <NavLink to="/tasks" className={({ isActive }) => isActive ? "active" : ""}>Tasks</NavLink>
                <NavLink to="/courses" className={({ isActive }) => isActive ? "active" : ""}>Courses</NavLink>
                <NavLink to="/projects" className={({ isActive }) => isActive ? "active" : ""}>Projects</NavLink>
                <NavLink to="/logOut" className={({ isActive}) => isActive ? "active" : ""}>Log Out</NavLink>
            </nav>
        </div>
    );
};

export default Sidebar;
