import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import Reveal from "../components/Reveal.jsx";
import { StaggerContainer, StaggerItem } from "../components/animations.jsx";
import { api } from "../utils/api.js";
import { profile } from "../data/portfolioData.js";

const initialForm = { name: "", email: "", subject: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "idle", message: "" });

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({ type: "error", message: "Please fill in all required fields." });
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.sendContact(form);
      setStatus({ type: "success", message: res.message || "Message sent!" });
      setForm(initialForm);
    } catch (err) {
      setStatus({
        type: "error",
        message: err.message || "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section" style={{ background: "var(--bg-elev)" }}>
      <div className="container">
        <Reveal>
          <span className="eyebrow">Contact</span>
          <h2 className="section-title">Let's work <span className="gradient-text">together</span></h2>
          <p className="section-subtitle">
            Have a role in mind, a project to discuss, or just want to say hi? My inbox is open.
          </p>
        </Reveal>

        <div className="contact-grid">
          <Reveal>
            <div className="contact-info">
              <h3>Get in touch</h3>
              <p>
                I'm currently looking for SDE / SWE / Web Developer fresher roles
                and interesting internships. The fastest way to reach me is the
                form or email — I usually reply within 24 hours.
              </p>

              <StaggerContainer stagger={0.12} delayChildren={0.1}>
                <div className="contact-methods">
                  {[
                    { href: `mailto:${profile.email}`, Icon: Mail, text: profile.email },
                    { href: `tel:${profile.phone.replace(/\s/g, "")}`, Icon: Phone, text: profile.phone },
                    { Icon: MapPin, text: profile.location, plain: true },
                  ].map((m, idx) => (
                    <StaggerItem key={idx}>
                      {m.plain ? (
                        <div className="contact-method" style={{ cursor: "default" }}>
                          <span className="icon-wrap"><m.Icon size={16} /></span>
                          <span className="contact-method-text">{m.text}</span>
                        </div>
                      ) : (
                        <a href={m.href} className="contact-method">
                          <span className="icon-wrap"><m.Icon size={16} /></span>
                          <span className="contact-method-text">{m.text}</span>
                        </a>
                      )}
                    </StaggerItem>
                  ))}
                </div>
              </StaggerContainer>
            </div>
          </Reveal>

          {/* Plain <div> wrapper, NOT <Reveal>.
              Same reason as Achievements right column: IntersectionObserver
              on this form's Reveal wrapper was firing very late on initial
              load, making the form invisible for several seconds. The left
              column still uses Reveal for the staggered entry effect. */}
          <div>
            <form className="contact-form" onSubmit={onSubmit} noValidate>
              {status.type !== "idle" && (
                <div className={`form-status ${status.type}`}>
                  {status.type === "success"
                    ? <CheckCircle2 size={16} />
                    : <AlertCircle size={16} />}
                  {status.message}
                </div>
              )}

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="name">Name *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={onChange}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="email">Email *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={onChange}
                  placeholder="e.g. Interview opportunity at Acme"
                />
              </div>

              <div className="form-field">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={onChange}
                  placeholder="Tell me about the role, project, or question..."
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
                style={{ width: "100%", justifyContent: "center" }}
              >
                {submitting ? "Sending..." : <>Send message <Send size={16} /></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
