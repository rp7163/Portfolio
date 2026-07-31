import { GraduationCap, BookOpen, School, Sparkles, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import Reveal from "../components/Reveal.jsx";
import { StaggerContainer, StaggerItem } from "../components/animations.jsx";
import { education } from "../data/portfolioData.js";

/* Custom metadata per school. Each has a unique color theme,
   icon, level tag, and a short tagline. */
const schoolMeta = {
  "Pandit Deendayal Energy University, Gandhinagar": {
    Icon: GraduationCap,
    level: "B.Tech · CSE",
    status: "current",
    /* Emerald accent — matches the site theme */
    theme: {
      color: "#10b981",
      gradient: "linear-gradient(135deg, #10b981, #2dd4bf)",
      softBg: "rgba(16, 185, 129, 0.12)",
      ringColor: "rgba(16, 185, 129, 0.35)",
    },
    badge: "B.Tech",
    emoji: "🎓",
  },
  "Devasya International School, Ahmedabad": {
    Icon: BookOpen,
    level: "HSC · Science",
    status: "completed",
    /* Blue accent — second in the visual hierarchy */
    theme: {
      color: "#3b82f6",
      gradient: "linear-gradient(135deg, #3b82f6, #60a5fa)",
      softBg: "rgba(59, 130, 246, 0.12)",
      ringColor: "rgba(59, 130, 246, 0.35)",
    },
    badge: "HSC",
    emoji: "📘",
  },
  "H. B. Mehta High School, Ahmedabad": {
    Icon: School,
    level: "SSC",
    status: "completed",
    /* Violet accent — third in the visual hierarchy */
    theme: {
      color: "#a855f7",
      gradient: "linear-gradient(135deg, #a855f7, #c084fc)",
      softBg: "rgba(168, 85, 247, 0.12)",
      ringColor: "rgba(168, 85, 247, 0.35)",
    },
    badge: "SSC",
    emoji: "🏫",
  },
};

export default function Education() {
  return (
    <section id="education" className="section" style={{ background: "var(--bg-elev)" }}>
      <div className="container">
        <Reveal>
          <span className="eyebrow">Education</span>
          <h2 className="section-title">
            Where I <span className="gradient-text">studied</span>
          </h2>
          <p className="section-subtitle">My academic journey so far.</p>
        </Reveal>

        <StaggerContainer stagger={0.15}>
          <div className="edu-timeline">
            <div className="edu-connector" />

            {education.map((e, i) => {
              const meta = schoolMeta[e.school] || {
                Icon: School, level: "", status: "completed",
                theme: { color: "var(--accent)", gradient: "var(--gradient)", softBg: "var(--accent-soft)", ringColor: "var(--accent-glow)" },
                badge: "", emoji: "📚",
              };
              const Icon = meta.Icon;
              const isCurrent = meta.status === "current";
              return (
                <StaggerItem key={`${e.school}-${i}`}>
                  <div className={`edu-item ${isCurrent ? "current" : "completed"}`}>
                    <div
                      className="edu-milestone"
                      style={{
                        background: isCurrent ? meta.theme.gradient : meta.theme.softBg,
                        borderColor: meta.theme.color,
                        boxShadow: isCurrent
                          ? `0 0 0 6px ${meta.theme.ringColor}, 0 12px 28px ${meta.theme.ringColor}`
                          : `0 0 0 4px ${meta.theme.softBg}`,
                      }}
                    >
                      <span className="edu-emoji" style={{
                        color: isCurrent ? "white" : meta.theme.color,
                      }}>
                        {meta.emoji}
                      </span>
                      {isCurrent && <span className="edu-pulse-ring" style={{ borderColor: meta.theme.color }} />}
                    </div>

                    <div
                      className="edu-card"
                      style={{ "--edu-color": meta.theme.color }}
                    >
                      <div className="edu-card-row">
                        <div className="edu-card-main">
                          <div className="edu-card-top">
                            <div className="edu-level-badge" style={{
                              background: meta.theme.softBg,
                              color: meta.theme.color,
                              borderColor: meta.theme.ringColor,
                            }}>
                              <Icon size={11} />
                              <span>{meta.badge}</span>
                            </div>
                            <div className="edu-period">
                              <Calendar size={11} />
                              {e.start} — {e.end}
                            </div>
                            {isCurrent && (
                              <span
                                className="edu-status-pill"
                                style={{ background: meta.theme.gradient }}
                              >
                                <Sparkles size={9} />
                                In progress
                              </span>
                            )}
                          </div>
                          <h3 className="edu-school">{e.school}</h3>
                          <div className="edu-degree">{e.degree}</div>
                        </div>

                        <div
                          className="edu-grade"
                          style={{
                            color: meta.theme.color,
                            background: meta.theme.softBg,
                            borderColor: meta.theme.ringColor,
                          }}
                        >
                          <span className="grade-label">Result</span>
                          <span className="grade-value">{e.grade}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}
