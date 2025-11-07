/* // import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // adapte si tu as un backend
});

// Faux endpoints pour démarrer :
export async function mockSignIn({ email, password }) {
  if (email && password) {
    return { token: "demo-token-123", user: { email } };
  }
  throw new Error("Invalid credentials");
}

export async function mockSignUp({ name, email, password }) {
  if (name && email && password) {
    return { token: "demo-token-456", user: { name, email } };
  }
  throw new Error("Missing fields");
}

export default api; */
// src/services/api.js

// ❌ Pas d'import axios ici

// Faux "sign in" pour tester sans backend
export async function mockSignIn({ email, password }) {
  if (email && password) {
    return { token: "demo-token-123", user: { email } };
  }
  throw new Error("Invalid credentials");
}

// Faux "sign up" pour tester sans backend
export async function mockSignUp({ name, email, password }) {
  if (name && email && password) {
    return { token: "demo-token-456", user: { name, email } };
  }
  throw new Error("Missing fields");
}

