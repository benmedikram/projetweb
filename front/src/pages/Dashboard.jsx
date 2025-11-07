import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Welcome {user.name || user.email || "👋"}</h2>
      <p>This is a protected page.</p>
      <button onClick={logout}>Log out</button>
    </div>
  );
}
