import { useState } from "react";
import { ArrowRight, Download, Sparkles, MapPin, Briefcase, ExternalLink } from "lucide-react";
import { SiGithub, SiGmail } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import { profile, stats } from "../data/portfolioData.js";
import HireModal from "../components/HireModal.jsx";
import FloatingHireButton from "../components/FloatingHireButton.jsx";
import { recordViewOnce } from "../utils/tracker.js";
import { CountUp } from "../components/animations.jsx";

const socialOrder = [
  { key: "github", Icon: SiGithub, color: "var(--gh-color)", label: "GitHub" },
  { key: "linkedin", Icon: FaLinkedin, color: "#0A66C2", label: "LinkedIn" },
];

/* 5-line compact code snippet */
// const codeLines = [
//   { text: "const developer = {", cls: "kw" },
//   { text: "  name: \"Rudra Patel\", role: \" SDE, Web Developer\",", cls: "var" },
//   { text: "  leetcode: 1687, coding ninjas: 1920, problems: 1200+,", cls: "num" },
//   { text: "  cgpa: 8.91, hireable: true,", cls: "var" },
//   { text: "}; // Open to SDE / SWE roles →", cls: "com" },
// ];

/* Tiny helper to render a code line with simple highlighting */
/* Renders a stat value with count-up animation if it's purely numeric;
   falls back to plain text for things like "1200+" or "8.91" */
function StatValue({ value }) {
  // Extract trailing non-numeric chars (e.g. "+" or "%")
  const match = value.match(/^([\d,.]+)(.*)$/);
  if (!match) return value;

  const numericPart = match[1].replace(/,/g, "");
  const suffix = match[2];

  // If contains a decimal, just display as text (count-up of 8.91 looks weird)
  if (numericPart.includes(".")) return value;

  // Use CountUp only for pure integers
  const target = parseInt(numericPart, 10);
  if (isNaN(target)) return value;

  return (
    <CountUp
      end={target}
      suffix={suffix}
      duration={1.6}
    />
  );
}

function CodeLine({ text }) {
  if (!text) return "\n";
  if (text.trim().startsWith("//")) return <span className="com">{text}</span>;
  if (text.trim().startsWith("▸")) return <span className="accent">{text}</span>;

  const tokens = [];
  const regex = /(\/\/.*$|"[^"]*"|\b(const|let|var|function|return|if|else|await|async|true|false|null|new)\b|\b\d+\.?\d*\+?\b|[{}()\[\],;])/g;
  let lastIndex = 0;
  let m;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > lastIndex) tokens.push({ t: text.slice(lastIndex, m.index), c: "punc" });
    const v = m[0];
    if (v.startsWith("//")) tokens.push({ t: v, c: "com" });
    else if (v.startsWith('"')) tokens.push({ t: v, c: "str" });
    else if (/^(const|let|var|function|return|if|else|await|async|new)$/.test(v)) tokens.push({ t: v, c: "kw" });
    else if (/^(true|false|null)$/.test(v)) tokens.push({ t: v, c: "fn" });
    else if (/^\d/.test(v)) tokens.push({ t: v, c: "num" });
    else if (/^[{}()\[\],;]$/.test(v)) tokens.push({ t: v, c: "punc" });
    lastIndex = m.index + v.length;
  }
  if (lastIndex < text.length) tokens.push({ t: text.slice(lastIndex), c: "punc" });

  return (
    <>
      {tokens.map((tok, idx) => {
        const klass = tok.c === "punc" && /[a-zA-Z_]/.test(tok.t) ? "var" : tok.c;
        return <span key={idx} className={klass}>{tok.t}</span>;
      })}
    </>
  );
}

export default function Hero() {
  const [hireOpen, setHireOpen] = useState(false);

  /* Fire-and-forget view tracker (records a single page-view per session) */
  recordViewOnce();

  const onPhotoMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    e.currentTarget.querySelector(".hero-photo").style.transform =
      `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.03)`;
  };
  const onPhotoLeave = (e) => {
    e.currentTarget.querySelector(".hero-photo").style.transform = "";
  };

  return (
    <section id="home" className="hero">
      <div className="hero-bg">
        <div className="grid" />
        <div className="glow-1" />
        <div className="glow-2" />
      </div>

      <motion.div
        className="container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="hero-split">
          {/* Left column — photo */}
          <motion.div
            className="hero-photo-col"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="hero-photo-wrap"
              onMouseMove={onPhotoMove}
              onMouseLeave={onPhotoLeave}
            >
              <div className="hero-photo-bg" />
              <img
                src="/profile.png"
                alt={`${profile.name} — ${profile.title}`}
                className="hero-photo"
                loading="eager"
                decoding="async"
              />
              <div className="hero-photo-status">
                <span className="status-dot" />
                <span>Let's build together</span>
              </div>
            </div>
          </motion.div>

          {/* Right column — content */}
          <motion.div
            className="hero-content-col"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="hero-status">
              <Sparkles size={12} />
              <span>Open to SDE / SWE / Web Developer roles</span>
            </div>

            <h1 className="hero-title">
              Hi, I'm{" "}
              <span className="gradient">
                <TypeAnimation
                  sequence={[
                    profile.name,
                    2000,
                    "Computer Engineering Student",
                    2000,
                    "Aspiring SDE",
                    2000,
                    "Aspiring Web Developer",
                    2000,
                    "Problem Solver",
                    2000,
                    profile.name,
                    1000,
                  ]}
                  wrapper="span"
                  cursor={true}
                  repeat={Infinity}
                  speed={50}
                  deletionSpeed={45}
                  style={{ display: "inline" }}
                />
              </span>
            </h1>

            <h2 className="hero-subtitle">
              I build <span className="gradient-text">full-stack web apps</span> and solve{" "}
              <span className="gradient-text">DSA problems</span> across multiple platforms.
            </h2>

            <p className="hero-tagline">{profile.tagline}</p>

            <div className="hero-meta">
              <span className="meta-item">
                <Briefcase size={14} /> B.Tech Computer Engineering · PDEU
              </span>
              <span className="meta-dot" />
              <span className="meta-item">
                <MapPin size={14} /> {profile.location}
              </span>
              <span className="meta-dot" />
              <span className="meta-item">CGPA 8.91</span>
            </div>

            <div className="hero-cta">
              <a href="#projects" className="btn btn-primary">
                View my work <ArrowRight size={18} />
              </a>
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                View Resume<ExternalLink size={18} />
              </a>
            </div>

            <div className="hero-socials">
              {socialOrder.map(({ key, Icon, color, label }) => (
                <a
                  key={key}
                  href={profile.socials[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  style={{ "--brand-color": color }}
                >
                  <Icon size={20} />
                </a>
              ))}
              <a
                href={`mailto:${profile.email}`}
                aria-label="Email"
                title="Email"
                style={{ "--brand-color": "#EA4335" }}
              >
                <SiGmail size={20} />
              </a>
            </div>

            <div className="hero-stats">
              {stats.map((s, idx) => (
                <motion.div
                  className="hero-stat"
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="hero-stat-value">
                    <StatValue value={s.value} />
                  </div>
                  <div className="hero-stat-label">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Compact 5-line code card */}
        {/* <motion.div
          className="hero-card"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        > */}
          {/* <div className="hero-card-header">
            <span /><span /><span />
            <span className="file">~/rudra.js</span>
          </div> */}
          {/* <pre className="hero-card-body">
            {codeLines.map((line, idx) => (
              <span key={idx} className="code-line">
                {line.text === "" ? "\u00A0" : <CodeLine text={line.text} />}
                {"\n"}
              </span>
            ))}
          </pre> */}
        {/* </motion.div> */}
      </motion.div>

      <HireModal open={hireOpen} onClose={() => setHireOpen(false)} />
      <FloatingHireButton onClick={() => setHireOpen(true)} />
    </section>
  );
}
