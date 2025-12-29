import React, { useState, useEffect } from "react";
import "./Tasks.css";
import { getTasks, createTask, updateTask, deleteTask } from "../services/api"; // Import API

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        name: "",
        subject: "",
        deadline: "",
        status: "À faire"
    });

    // Charger les tâches au chargement
    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const data = await getTasks();
            setTasks(data);
        } catch (error) {
            console.error("Error loading tasks:", error);
        }
    };

    // Ajouter une nouvelle tâche
    const handleAddTask = async () => {
        if (!newTask.name || !newTask.subject || !newTask.deadline) {
            alert("Veuillez remplir tous les champs !");
            return;
        }

        try {
            const created = await createTask(newTask);
            setTasks([...tasks, created]);
            setNewTask({ name: "", subject: "", deadline: "", status: "À faire" });
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    // Modifier le statut
    const handleUpdateStatus = async (id, status) => {
        try {
            const updated = await updateTask(id, { status });
            setTasks(tasks.map(task => task._id === id ? updated : task)); // MongoDB uses _id
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    // Supprimer tâche (seulement si terminée)
    const handleDeleteTask = async (id) => {
        try {
            await deleteTask(id);
            setTasks(tasks.filter(task => task._id !== id));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    return (
        <div className="tasks-container">
            <h1>My Tasks</h1>
            <p>Organise tes devoirs et projets! ✨</p>

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

                <button onClick={handleAddTask} className="btn-add">+ Ajouter</button>
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
                            <tr key={task._id}>
                                <td>{task.name}</td>
                                <td>{task.subject}</td>
                                <td>{task.deadline}</td>

                                {/* SELECT statut */}
                                <td>
                                    <select
                                        value={task.status}
                                        onChange={(e) => handleUpdateStatus(task._id, e.target.value)}
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
                                            onClick={() => handleDeleteTask(task._id)}
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



