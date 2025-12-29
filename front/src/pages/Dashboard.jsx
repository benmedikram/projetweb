import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { useTheme } from "../components/ThemeContext";
import { updateProfile } from "../services/api";

const Dashboard = () => {
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("Here's your day at a glance!");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setUsername(parsed.username || parsed.name || "");
    }
  }, []);

  const handleUpdateUsername = async (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
  };

  const saveUsername = async () => {
    if (user && username !== user.username) {
      if (!user._id) {
        alert("Session update required. Please logout and login again.");
        return;
      }
      try {
        const updated = await updateProfile(user._id, { username });
        setUser(updated);
        localStorage.setItem("user", JSON.stringify(updated));
        alert("Username updated!");
      } catch (err) {
        console.error(err);
        alert("Failed to update username");
      }
    }
  };

  const [deadlines, setDeadlines] = useState([
    { title: "Math analysis", date: "Today" },
    { title: "Web development project", date: "Tomorrow" },
  ]);

  const [tasks, setTasks] = useState([
    { text: "Read Chapter 4", done: false },
    { text: "Issue tracker update", done: false },
  ]);

  const addDeadline = () => {
    setDeadlines([...deadlines, { title: "", date: "" }]);
  };

  const addTask = () => {
    setTasks([...tasks, { text: "", done: false }]);
  };

  return (
    <div className="dashboard-container">


      {/* Main */}
      <main className="main-content">
        {/* Header editable */}
        <div className="header">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                className="title-input"
                value={username}
                onChange={handleUpdateUsername}
                onBlur={saveUsername} // Save on blur
                placeholder="Username"
              />
              <span style={{ fontSize: '0.8rem', opacity: 0.7 }}></span>
            </div>
            <textarea
              className="subtitle-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <button onClick={toggleTheme} className="btn-ghost icon" title="Toggle Theme" style={{ fontSize: '1.5rem' }}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Cards */}
        <div className="cards">
          {/* Deadlines */}
          <div className="card">
            <h3>Upcoming Deadlines</h3>

            {deadlines.map((item, index) => (
              <div key={index} className="editable-row">
                <input
                  placeholder="Title"
                  value={item.title}
                  onChange={(e) => {
                    const newDeadlines = [...deadlines];
                    newDeadlines[index].title = e.target.value;
                    setDeadlines(newDeadlines);
                  }}
                />
                <input
                  placeholder="Date"
                  value={item.date}
                  onChange={(e) => {
                    const newDeadlines = [...deadlines];
                    newDeadlines[index].date = e.target.value;
                    setDeadlines(newDeadlines);
                  }}
                />
              </div>
            ))}

            <button onClick={addDeadline}>➕ Add deadline</button>
          </div>

          {/* Calendar (simple placeholder modifiable plus tard) */}
          {/* Calendar */}
          <div className="card calendar">
            <h3>April</h3>
            <div className="calendar-grid">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                <span key={i} className="day-name">{day}</span>
              ))}
              {[...Array(30)].map((_, i) => (
                <span
                  key={i}
                  className={i + 1 === 25 ? "day active-day" : "day"}
                >
                  {i + 1}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tasks */}
        <div className="card tasks">
          <h3>Today's Tasks</h3>

          {tasks.map((task, index) => (
            <div key={index} className="task-row">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => {
                  const newTasks = [...tasks];
                  newTasks[index].done = !newTasks[index].done;
                  setTasks(newTasks);
                }}
              />
              <input
                placeholder="Task..."
                value={task.text}
                onChange={(e) => {
                  const newTasks = [...tasks];
                  newTasks[index].text = e.target.value;
                  setTasks(newTasks);
                }}
              />
            </div>
          ))}

          <button onClick={addTask}>➕ Add task</button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
