import React from "react";
import { useNavigate } from "react-router-dom";
import "./Logout.css";

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");
        navigate("/");
    };

    const handleCancel = () => {
        navigate("/dashboard");
    };

    return (
        <div className="logout-page">
        <div className="logout-card">
            <h2>Log Out</h2>
            <p>Are you sure you want to log out of EduSpace?</p>
            <div className="logout-buttons">
            <button className="logout-btn" onClick={handleLogout}>
                Yes, Log Out
            </button>
            <button className="cancel-btn" onClick={handleCancel}>
                Cancel
            </button>
            </div>
        </div>
        </div>
    );
};

export default Logout;

