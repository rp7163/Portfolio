import {
  Trophy, Star, Award, Crown, Swords, Sparkles,
} from "lucide-react";
import { SiLeetcode, SiCodechef, SiCodeforces, SiCodingninjas } from "react-icons/si";
import Reveal from "../components/Reveal.jsx";
import { achievements, codingProfiles } from "../data/portfolioData.js";

/* Each achievement is matched with a meaningful icon + accent color */
const achievementMeta = [
  { icon: Trophy,   color: "#fbbf24", label: "Global Rank 10" },       // 1
  { icon: Crown,    color: "#a78bfa", label: "Specialist" },            // 2
  { icon: Star,     color: "#f59e0b", label: "CodeChef 1560 / 1897" },  // 3
  { icon: Swords,   color: "#60a5fa", label: "Pupil · Codeforces" },    // 4
  { icon: Sparkles, color: "#34d399", label: "1300+ DSA Problems" },    // 5
  { icon: Award,    color: "#f472b6", label: "NPTEL Top 1%" },           // 6
];

/* Platform-specific brand icons + per-card accent colors */
const platformIcon = {
  "LeetCode":        { Icon: SiLeetcode,    color: "#FFA116", glow: "rgba(255, 161, 22, 0.5)" },
  "Coding ninjas":  { Icon: SiCodingninjas, color: "#F38A00", glow: "rgba(243, 138, 0, 0.5)" },
  "CodeChef":        { Icon: SiCodechef,    color: "#A8763E", glow: "rgba(168, 118, 62, 0.5)" },
  "Codeforces":      { Icon: SiCodeforces,  color: "#1F8ACB", glow: "rgba(31, 138, 203, 0.5)" },
};

export default function Achievements() {
  return (
    <section id="achievements" className="section">
      <div className="container">
        <Reveal>
          <span className="eyebrow">Achievements</span>
          <h2 className="section-title">
            Milestones &amp; <span className="gradient-text">recognition</span>
          </h2>
          <p className="section-subtitle">
            Competitive programming, academics, and beyond.
          </p>
        </Reveal>

        <div
          className="two-col"
          style={
            codingProfiles.length === 0
              ? { gridTemplateColumns: "1fr" }
              : undefined
          }
        >
          {/* ---------- Highlights list with rich icons ---------- */}
          <Reveal>
            <h3 className="block-title">
              <span className="block-title-icon" style={{
                background: "rgba(251,191,36,0.12)", color: "#fbbf24"
              }}>
                <Trophy size={18} />
              </span>
              Highlights
            </h3>

            <ul className="ach-list-v2">
              {achievements.map((a, i) => {
                const meta = achievementMeta[i] || achievementMeta[0];
                const Icon = meta.icon;
                return (
                  <li key={i}>
                    <span
                      className="ach-icon"
                      style={{
                        background: `${meta.color}18`,
                        color: meta.color,
                        borderColor: `${meta.color}33`,
                      }}
                    >
                      <Icon size={16} />
                    </span>
                    <div className="ach-text">
                      <div className="ach-label" style={{ color: meta.color }}>
                        {meta.label}
                      </div>
                      <div className="ach-desc">{a}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          {/* ---------- Coding profiles with brand logos ----------
              NOTE: Plain <div> (NOT <Reveal>) here. Reveal's IntersectionObserver
              was firing late on this column when the page loaded with the section
              already partially in view, causing a "very long delay" before
              anything showed up. The left column still uses Reveal for the
              staggered entry effect. */}
          {codingProfiles.length > 0 && (
            <div>
              <h3 className="block-title">
                <span className="block-title-icon" style={{
                  background: "var(--accent-soft)", color: "var(--accent)"
                }}>
                  <Award size={18} />
                </span>
                Coding profiles
              </h3>

              <div className="coding-list-v2">
                {codingProfiles.map((c) => {
                  const meta = platformIcon[c.platform] || {};
                  const PIcon = meta.Icon;
                  const pColor = meta.color || "#9ca3af";
                  return (
                    <a
                      key={c.platform}
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="coding-card-v2"
                      style={{ "--brand": pColor }}
                      onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        e.currentTarget.style.setProperty(
                          "--mx",
                          `${e.clientX - rect.left}px`
                        );
                        e.currentTarget.style.setProperty(
                          "--my",
                          `${e.clientY - rect.top}px`
                        );
                      }}
                    >
                      <div
                        className="coding-platform-icon"
                        style={{ background: `${pColor}1a`, color: pColor }}
                      >
                        {PIcon ? <PIcon size={22} /> : <Award size={22} />}
                      </div>
                      <div className="coding-info">
                        <h4>{c.platform}</h4>
                        <p>@{c.handle} · {c.rank}</p>
                      </div>
                      {c.subRatings ? (
                        <div className="coding-sub-ratings">
                          {c.subRatings.map((sub, idx) => (
                            <div key={idx} className="sub-rating-item">
                              <span className="sub-rating-val">{sub.value}</span>
                              <span
                                className="sub-rating-badge"
                                style={{
                                  color: sub.accent,
                                  borderColor: `${sub.accent}33`,
                                  background: `${sub.accent}14`,
                                }}
                              >
                                {sub.label} {sub.badge}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="coding-rating-v2">
                          <span className="rating-num">{c.rating}</span>
                          <span className="rating-lbl">
                            <Star size={10} style={{ display: "inline", marginRight: 3 }} />
                            Rating
                          </span>
                        </div>
                      )}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
