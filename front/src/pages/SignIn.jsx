import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { mockSignIn } from "../services/api";
import AuthLayout from "../components/AuthLayout";
import "./auth.css";

export default function SignIn() {
  const [data, setData] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const valid = data.email && data.password.length >= 6;

  const onChange = (e) =>
    setData((d) => ({ ...d, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!valid) return;
    setErr("");
    setLoading(true);
    try {
      const res = await mockSignIn(data);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      navigate("/dashboard");
    } catch (e2) {
      setErr(e2.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Access your dashboard and keep building."
    >
      {err && <p className="auth-error">{err}</p>}

      <form className="form" onSubmit={onSubmit}>
        <label>Email</label>
        <div className="input icon-left">
          <span className="icon" aria-hidden>✉️</span>
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
            placeholder="••••••••"
            value={data.password}
            onChange={onChange}
            required
            minLength={6}
          />
          <button
            type="button"
            className="icon btn-ghost"
            onClick={() => setShowPwd((s) => !s)}
            aria-label="Toggle password visibility"
          >
            {showPwd ? "🙈" : "👁️"}
          </button>
        </div>

        <div className="row-between">
          <label className="check">
            <input type="checkbox" /> Remember me
          </label>
          <Link className="link" to="#">Forgot password?</Link>
        </div>

        <button className="btn" type="submit" disabled={!valid || loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <p className="auth-alt">
          No account? <Link to="/signup">Create one</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
