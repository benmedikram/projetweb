import React, { useState } from "react";
import "./Projects.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    title: "",
    desc: "",
    status: "Not Started",
    deadline: "",
  });

  const addProject = () => {
    if (!newProject.title || !newProject.deadline) return;
    setProjects([...projects, { ...newProject, id: Date.now() }]);
    setNewProject({ title: "", desc: "", status: "Not Started", deadline: "" });
  };

  const deleteProject = (id) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const changeStatus = (id, status) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  const statusColor = (status) => {
    if (status === "Not Started") return "red";
    if (status === "In Progress") return "yellow";
    if (status === "Completed") return "green";
  };

  return (
    <div className="projects-container">
      <h1>My Projects</h1>
      <div className="add-project">
        <input
          type="text"
          placeholder="Project Title"
          value={newProject.title}
          onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Project Description"
          value={newProject.desc}
          onChange={(e) => setNewProject({ ...newProject, desc: e.target.value })}
        />
        <input
          type="date"
          value={newProject.deadline}
          onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
        />
        <select
          value={newProject.status}
          onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
        >
          <option>Not Started</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
        <button onClick={addProject}>+ New Project</button>
      </div>

      <div className="projects-list">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <h3>{project.title}</h3>
            <p>{project.desc}</p>
            <p><strong>Deadline:</strong> {project.deadline}</p>
            <span
              className="status"
              style={{ backgroundColor: statusColor(project.status) }}
            >
              {project.status}
            </span>
            <div className="project-actions">
              <select
                value={project.status}
                onChange={(e) => changeStatus(project.id, e.target.value)}
              >
                <option>Not Started</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
              {project.status === "Completed" && (
                <button onClick={() => deleteProject(project.id)}>Delete</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;

