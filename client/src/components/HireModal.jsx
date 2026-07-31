import { useState, useEffect } from "react";
import { X, Briefcase, Building2, Mail, User, Users, IndianRupee, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { api } from "../utils/api.js";

const initial = {
  name: "",
  email: "",
  company: "",
  role: "",
  openPositions: "1",
  salary: "",
  notes: "",
};

export default function HireModal({ open, onClose }) {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [submitting, setSubmitting] = useState(false);

  /* Lock body scroll while modal is open */
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  /* Reset on open */
  useEffect(() => {
    if (open) {
      setForm(initial);
      setStatus({ type: "idle", message: "" });
    }
  }, [open]);

  if (!open) return null;

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "idle", message: "" });
    if (!form.name.trim() || !form.email.trim() || !form.role.trim()) {
      setStatus({ type: "error", message: "Please fill in name, email, and role." });
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.sendHire(form);
      setStatus({ type: "success", message: res.message || "Sent! Rudra will reach out shortly." });
      setTimeout(() => onClose(), 2500);
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Failed to send. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className="modal-head">
          <div className="modal-icon">
            <Briefcase size={20} />
          </div>
          <div>
            <h3 className="modal-title">Got a role for me?</h3>
            <p className="modal-sub">Share a few details and I'll get back within 24 hours.</p>
          </div>
        </div>

        {status.type !== "idle" && (
          <div className={`form-status ${status.type}`}>
            {status.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {status.message}
          </div>
        )}

        <form className="hire-form" onSubmit={onSubmit}>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="hire-name"><User size={13} /> Your name *</label>
              <input
                id="hire-name"
                name="name"
                type="text"
                value={form.name}
                onChange={onChange}
                placeholder="Jane Smith"
                required
                autoFocus
              />
            </div>
            <div className="form-field">
              <label htmlFor="hire-email"><Mail size={13} /> Your email *</label>
              <input
                id="hire-email"
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="jane@company.com"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="hire-company"><Building2 size={13} /> Company</label>
              <input
                id="hire-company"
                name="company"
                type="text"
                value={form.company}
                onChange={onChange}
                placeholder="Acme Corp"
              />
            </div>
            <div className="form-field">
              <label htmlFor="hire-role"><Briefcase size={13} /> Role / designation *</label>
              <input
                id="hire-role"
                name="role"
                type="text"
                value={form.role}
                onChange={onChange}
                placeholder="SDE / Frontend Engineer"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="hire-positions"><Users size={13} /> Open positions</label>
              <input
                id="hire-positions"
                name="openPositions"
                type="text"
                value={form.openPositions}
                onChange={onChange}
                placeholder="1"
              />
            </div>
            <div className="form-field">
              <label htmlFor="hire-salary"><IndianRupee size={13} /> Salary / CTC</label>
              <input
                id="hire-salary"
                name="salary"
                type="text"
                value={form.salary}
                onChange={onChange}
                placeholder="e.g. 8–12 LPA"
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="hire-notes"><FileText size={13} /> Other notes</label>
            <textarea
              id="hire-notes"
              name="notes"
              value={form.notes}
              onChange={onChange}
              placeholder="Tech stack, interview process, location, etc. (optional)"
              rows={3}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting
                ? <><Loader2 size={16} className="spin" /> Sending…</>
                : <>Send to Rudra <Mail size={16} /></>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
