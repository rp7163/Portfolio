import { useState, useEffect } from "react";
import { Github, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import {
  SiNodedotjs, SiExpress, SiMongodb, SiMysql, SiPython,
} from "react-icons/si";
import Reveal from "../components/Reveal.jsx";
import { StaggerContainer, StaggerItem } from "../components/animations.jsx";
import { projects } from "../data/portfolioData.js";

/* Map each tech name to its brand icon + color */
const techMeta = {
  "Node.js":     { Icon: SiNodedotjs,  color: "#339933" },
  "Express.js":  { Icon: SiExpress,    color: "var(--express-icon-color, #111111)" }, // Dynamic color via CSS variable
  "MongoDB":     { Icon: SiMongodb,    color: "#47A248" },
  "MySQL":       { Icon: SiMysql,      color: "#4479A1" },
  "Python":      { Icon: SiPython,     color: "#3776AB" },
  // Generic libs — give them neutral treatment
  "os":            null,
  "hashlib":       null,
  "json":          null,
};

/* Hook to listen to theme changes on documentElement (data-theme="dark") */
function useTheme() {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || "light"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.dataset.theme || "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return theme;
}

/* Pick an icon/accent color for each project based on primary tech */
function getProjectAccent(techs = []) {
  if (techs.includes("MongoDB"))      return { color: "#10b981", emoji: "📚" };
  if (techs.includes("Python"))       return { color: "#3776AB", emoji: "🔧" };
  if (techs.includes("MySQL"))        return { color: "#4479A1", emoji: "🚚" };
  return { color: "#10b981", emoji: "🚀" };
}

export default function Projects() {
  const currentTheme = useTheme();

  return (
    <section id="projects" className="section">
      <div className="container">
        <Reveal>
          <span className="eyebrow">Projects</span>
          <h2 className="section-title">
            Things I've <span className="gradient-text">built</span>
          </h2>
          <p className="section-subtitle">
            A selection of projects that taught me the most about real-world engineering.
          </p>
        </Reveal>

        <StaggerContainer stagger={0.15}>
          <div className="projects-grid">
            {projects.map((p) => {
              const accent = getProjectAccent(p.tech);
              const isGitProject = p.title.toLowerCase().includes("git");

              return (
                <StaggerItem key={p.title}>
                  <article
                    className="project-card"
                    style={{ "--project-accent": accent.color }}
                  >
                    <div className="project-head">
                      {isGitProject ? (
                        <motion.div
                          className="project-image-wrapper"
                          whileHover={{ rotate: -10, scale: 1.15 }}
                          style={{ cursor: "pointer" }}
                          transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        >
                          <img
                            src = "/GitLightLogo.png"
                            alt={p.title}
                            className="project-logo-img"
                            style={{
                              width: "48px",
                              height: "48px",
                              objectFit: "cover",
                              borderRadius: "12px",
                              border: "1.6px solid #ffffff",
                              display: "block",
                            }}
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          className="project-emoji"
                          style={{
                            background: `${accent.color}1a`,
                            borderColor: `${accent.color}40`,
                            cursor: "pointer"
                          }}
                          whileHover={{ rotate: -10, scale: 1.15 }}
                          transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        >
                          <span>{accent.emoji}</span>
                        </motion.div>
                      )}

                      <div className="project-links">
                        {p.github && (
                          <a href={p.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub repo">
                            <Github size={16} />
                          </a>
                        )}
                        {p.demo && (
                          <a href={p.demo} target="_blank" rel="noopener noreferrer" aria-label="Live demo">
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                    </div>

                    <h3 className="project-title">{p.title}</h3>
                    <div className="project-period">{p.period}</div>
                    <p className="project-desc">{p.description}</p>

                    <div className="project-tech-v2">
                      {p.tech.map((t) => {
                        const meta = techMeta[t];
                        if (!meta) {
                          return (
                            <motion.span
                              key={t}
                              className="tech-chip"
                              whileHover={{ y: -3 }}
                              style={{ cursor: "pointer" }}
                              transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            >
                              {t}
                            </motion.span>
                          );
                        }
                        const { Icon, color } = meta;
                        return (
                          <motion.span
                            key={t}
                            className="tech-chip"
                            style={{ color, borderColor: `${color}40`, background: `${color}10`, cursor: "pointer"  }}
                            whileHover={{ y: -3, scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          >
                            <Icon size={13} style={{ marginRight: 5, verticalAlign: "-2px" }} />
                            {t}
                          </motion.span>
                        );
                      })}
                    </div>
                  </article>
                </StaggerItem>
              );
            })}
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}