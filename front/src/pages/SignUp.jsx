import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../services/api";
import AuthLayout from "../components/AuthLayout";
import "./auth.css";

export default function SignUp() {
  const [data, setData] = useState({ name: "", username: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const valid =
    data.name.trim().length >= 2 &&
    data.email &&
    data.password.length >= 6;

  const onChange = (e) =>
    setData((d) => ({ ...d, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!valid) return;
    setErr("");
    setLoading(true);
    try {
      const res = await signUp(data);
      localStorage.setItem("token", res.access_token);
      localStorage.setItem("user", JSON.stringify(res.user));
      navigate("/dashboard");
    } catch (e2) {
      setErr(e2.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join us and start your journey."
    >
      {err && <p className="auth-error">{err}</p>}

      <form className="form" onSubmit={onSubmit}>
        <label>Full name</label>
        <div className="input icon-left">
          <span className="icon">👤</span>
          <input
            type="text"
            name="name"
            placeholder="Jane Doe"
            value={data.name}
            onChange={onChange}
            required
          />
        </div>

        <label>Username</label>
        <div className="input icon-left">
          <span className="icon">👤</span>
          <input
            type="text"
            name="username"
            placeholder="jdoe123"
            value={data.username}
            onChange={onChange}
            required
          />
        </div>

        <label>Email</label>
        <div className="input icon-left">
          <span className="icon">✉️</span>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={data.email}
            onChange={onChange}
            required
          />
        </div>

        <label>Password</label>
        <div className="input icon-right">
          <input
            type={showPwd ? "text" : "password"}
            name="password"
            placeholder="At least 6 characters"
            value={data.password}
            onChange={onChange}
            required
            minLength={6}
          />
          <button
            type="button"
            className="icon btn-ghost"
            onClick={() => setShowPwd((s) => !s)}
          >
            {showPwd ? "🙈" : "👁️"}
          </button>
        </div>

        <button className="btn" type="submit" disabled={!valid || loading}>
          {loading ? "Creating…" : "Sign up"}
        </button>

        <p className="auth-alt">
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
