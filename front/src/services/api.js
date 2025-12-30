import axios from "axios";

const api = axios.create({
  baseURL: "https://warnings-swap-crest-relation.trycloudflare.com",
});

// AUTH
export async function signIn({ email, password }) {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
}

export async function signUp({ name, username, email, password }) {
  try {
    const response = await api.post('/auth/signup', { name, username, email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Sign up failed");
  }
}

export async function updateProfile(id, data) {
  try {
    const response = await api.patch(`/user/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Update profile failed");
  }
}

// TASKS
export async function getTasks() {
  const res = await api.get('/tasks');
  return res.data;
}

export async function createTask(task) {
  const res = await api.post('/tasks', task);
  return res.data;
}

export async function updateTask(id, updates) {
  const res = await api.patch(`/tasks/${id}`, updates);
  return res.data;
}

export async function deleteTask(id) {
  const res = await api.delete(`/tasks/${id}`);
  return res.data;
}

// PROJECTS
export async function getProjects() {
  const res = await api.get('/projects');
  return res.data;
}

export async function createProject(project) {
  const res = await api.post('/projects', project);
  return res.data;
}

export async function updateProject(id, updates) {
  const res = await api.patch(`/projects/${id}`, updates);
  return res.data;
}

export async function deleteProject(id) {
  const res = await api.delete(`/projects/${id}`);
  return res.data;
}

// COURSES
export async function getCourses() {
  const res = await api.get('/courses');
  return res.data;
}

export async function createCourse(course) {
  const res = await api.post('/courses', course);
  return res.data;
}

export async function updateCourse(id, updates) {
  const res = await api.patch(`/courses/${id}`, updates);
  return res.data;
}

export async function deleteCourse(id) {
  const res = await api.delete(`/courses/${id}`);
  return res.data;
}

export default api;
