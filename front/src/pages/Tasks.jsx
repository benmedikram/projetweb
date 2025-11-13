import React, { useState } from "react";
import "./Tasks.css";

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [editIndex, setEditIndex] = useState(null);

    const handleAddTask = () => {
        if (newTask.trim() === "") return;
        if (editIndex !== null) {
            const updatedTasks = [...tasks];
            updatedTasks[editIndex] = newTask;
            setTasks(updatedTasks);
            setEditIndex(null);
        } else {
            setTasks([...tasks, newTask]);
        }
        setNewTask("");
    };

    const handleEditTask = (index) => {
        setNewTask(tasks[index]);
        setEditIndex(index);
    };

    const handleDeleteTask = (index) => {
        setTasks(tasks.filter((_, i) => i !== index));
    };

    return (
        <div className="tasks-container">
            <h2>My Tasks</h2>
            <div className="task-card">
                <div className="task-input">
                    <input
                    type="text"
                    value={newTask}
                    placeholder="Enter a task..."
                    onChange={(e) => setNewTask(e.target.value)}
                    />
                    <button onClick={handleAddTask}>{editIndex !== null ? "Update" : "Add"}</button>
                </div>
                <ul className="task-list">
                    {tasks.map((task, index) => (
                    <li key={index} className="task-item">
                        <span>{task}</span>
                        <div>
                            <button onClick={() => handleEditTask(index)}>Edit</button>
                            <button onClick={() => handleDeleteTask(index)}>Delete</button>
                        </div>
                    </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Tasks;
