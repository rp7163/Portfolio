import { useState } from "react";
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowLeft } from "lucide-react";
import { useAdmin } from "../context/AdminContext.jsx";

export default function AdminLogin({ onCancel }) {
  const { login } = useAdmin();
  const [secret, setSecret] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const r = await login(secret);
    setBusy(false);
    if (!r.success) setError(r.message || "Invalid secret");
  };

  return (
    <div className="admin-login-page">
      <form className="admin-login-card" onSubmit={onSubmit}>
        <div className="admin-login-icon">
          <ShieldCheck size={28} />
        </div>
        <h1 className="admin-login-title">Admin Access</h1>
        <p className="admin-login-sub">Enter your admin secret to view analytics</p>

        {error && (
          <div className="form-status error" style={{ marginTop: "1rem" }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <div className="form-field" style={{ marginTop: "1.5rem" }}>
          <label htmlFor="admin-secret">Admin secret</label>
          <div className="admin-secret-wrap">
            <Lock size={14} />
            <input
              id="admin-secret"
              type={show ? "text" : "password"}
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Enter your ADMIN_SECRET"
              autoFocus
              required
            />
            <button
              type="button"
              className="admin-secret-toggle"
              onClick={() => setShow((s) => !s)}
              tabIndex={-1}
              aria-label="Toggle visibility"
            >
              {show ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <div className="admin-login-actions">
          {onCancel && (
            <button type="button" className="btn btn-outline" onClick={onCancel}>
              <ArrowLeft size={16} /> Back to site
            </button>
          )}
          <button type="submit" className="btn btn-primary" disabled={busy || !secret}>
            {busy ? "Checking…" : "Unlock"}
          </button>
        </div>

        <p className="admin-login-hint">
          Tip: Your secret is set in <code>server/.env</code> as <code>ADMIN_SECRET</code>.
        </p>
      </form>
    </div>
  );
}
