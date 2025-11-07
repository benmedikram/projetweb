// Un layout 2 colonnes pour SignIn/SignUp
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth-wrap">
      <div className="auth-grid">
        {/* Bandeau visuel */}
        <aside className="auth-hero">
          <div className="auth-hero-content">
            <h1>Welcome 👋</h1>
            <p>Build your project faster with a clean auth flow.</p>
          </div>
        </aside>

        {/* Carte formulaire */}
        <main className="auth-card glass fade-in">
          <div className="auth-header">
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {children}
          <footer className="auth-footer">
            <small>© {new Date().getFullYear()} eduspace</small>
          </footer>
        </main>
      </div>
    </div>
  );
}
