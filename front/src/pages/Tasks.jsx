import React, { useState } from "react";
import "./Tasks.css";

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        name: "",
        subject: "",
        deadline: "",
        status: "À faire"
    });

    // Ajouter une nouvelle tâche
    const addTask = () => {
        if (!newTask.name || !newTask.subject || !newTask.deadline) {
            alert("Veuillez remplir tous les champs !");
            return;
        }

        setTasks([
            ...tasks,
            { id: Date.now(), ...newTask }
        ]);

        setNewTask({ name: "", subject: "", deadline: "", status: "À faire" });
    };

  // Modifier le statut
    const updateTaskStatus = (id, status) => {
        setTasks(tasks.map(task =>
        task.id === id ? { ...task, status } : task
        ));
    };

  // Supprimer tâche (seulement si terminée)
    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    return (
        <div className="tasks-container">
        <h1>My Tasks</h1>
        <p>Organise tes devoirs et projets ✨</p>

        {/* Formulaire ajout */}
        <div className="add-task-box">
            <input
            type="text"
            placeholder="Nom de la tâche"
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            />

            <input
            type="text"
            placeholder="Matière"
            value={newTask.subject}
            onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
            />

            <input
            type="date"
            value={newTask.deadline}
            onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
            />

            <button onClick={addTask} className="btn-add">+ Ajouter</button>
        </div>

        {/* Tableau des tâches */}
        <table className="task-table">
            <thead>
            <tr>
                <th>Tâche</th>
                <th>Matière</th>
                <th>Date limite</th>
                <th>Statut</th>
                <th>Action</th>
            </tr>
            </thead>

            <tbody>
            {tasks.length === 0 ? (
                <tr>
                <td colSpan="5" className="empty">Aucune tâche pour le moment 😄</td>
                </tr>
            ) : (
                tasks.map(task => (
                <tr key={task.id}>
                    <td>{task.name}</td>
                    <td>{task.subject}</td>
                    <td>{task.deadline}</td>

                    {/* SELECT statut */}
                    <td>
                    <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                        className={`status-select ${task.status}`}
                    >
                        <option value="À faire">À faire</option>
                        <option value="En cours">En cours</option>
                        <option value="Terminé">Terminé</option>
                    </select>
                    </td>

                    {/* Bouton supprimer */}
                    <td>
                    {task.status === "Terminé" && (
                        <button
                        className="delete-btn"
                        onClick={() => deleteTask(task.id)}
                        >
                        Supprimer
                        </button>
                    )}
                    </td>
                </tr>
                ))
            )}
            </tbody>
        </table>
        </div>
    );
}



