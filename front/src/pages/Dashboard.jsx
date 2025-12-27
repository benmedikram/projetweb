import React, { useState } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [username, setUsername] = useState("chayma");
  const [message, setMessage] = useState("Here's your day at a glance!");

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
          <div>
            <input
              className="title-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <textarea
              className="subtitle-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
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
              {["M","T","W","T","F","S","S"].map(day => (
                <span key={day} className="day-name">{day}</span>
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
