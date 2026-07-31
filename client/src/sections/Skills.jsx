import {
  Code2, Globe, Server, Database, Brain, Wrench,
} from "lucide-react";
import { motion } from "framer-motion";
import Reveal from "../components/Reveal.jsx";
import { StaggerContainer, StaggerItem } from "../components/animations.jsx";
import { skills } from "../data/portfolioData.js";

const iconMap = {
  Languages: Code2,
  Frontend: Globe,
  Backend: Server,
  Databases: Database,
  "Core CS": Brain,
  Tools: Wrench,
};

export default function Skills() {
  return (
    <section id="skills" className="section" style={{ background: "var(--bg-elev)" }}>
      <div className="container">
        <Reveal>
          <span className="eyebrow">Skills</span>
          <h2 className="section-title">My <span className="gradient-text">toolbox</span></h2>
          <p className="section-subtitle">
            Technologies I use to design, build, and ship products that users love.
          </p>
        </Reveal>

        <StaggerContainer stagger={0.12}>
          <div className="skills-grid">
            {skills.map((s) => {
              const Icon = iconMap[s.category] || Code2;
              return (
                <StaggerItem key={s.category}>
                  <div className="skill-card">
                    <div className="skill-cat">
                      <span className="icon-wrap"><Icon size={18} /></span>
                      {s.category}
                    </div>
                    <div className="skill-items">
                      {s.items.map((item) => (
                        <motion.span
                          className="skill-pill"
                          key={item}
                          whileHover={{ scale: 1.06, y: -2 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        >
                          {item}
                        </motion.span>
                      ))}
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
