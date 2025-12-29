import React, { useState, useEffect } from "react";
import "./Projects.css";
import { getProjects, createProject, updateProject, deleteProject } from "../services/api";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    title: "",
    desc: "",
    status: "Not Started",
    deadline: "",
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  };

  const handleAddProject = async () => {
    if (!newProject.title || !newProject.deadline) return;
    try {
      const created = await createProject(newProject);
      setProjects([...projects, created]);
      setNewProject({ title: "", desc: "", status: "Not Started", deadline: "" });
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await deleteProject(id);
      setProjects(projects.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleChangeStatus = async (id, status) => {
    try {
      const updated = await updateProject(id, { status });
      setProjects(projects.map((p) => (p._id === id ? updated : p)));
    } catch (error) {
      console.error("Error updating project:", error);
    }
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
        <button onClick={handleAddProject}>+ New Project</button>
      </div>

      <div className="projects-list">
        {projects.map((project) => (
          <div key={project._id} className="project-card">
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
                onChange={(e) => handleChangeStatus(project._id, e.target.value)}
              >
                <option>Not Started</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
              {project.status === "Completed" && (
                <button onClick={() => handleDeleteProject(project._id)}>Delete</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;

