import { MapPin, Mail, Phone, GraduationCap } from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import { StaggerContainer, StaggerItem } from "../components/animations.jsx";
import { profile } from "../data/portfolioData.js";

const facts = [
  { Icon: MapPin, label: "Location", value: profile.location, small: false, accent: false },
  { Icon: Mail, label: "Email", value: <a href={`mailto:${profile.email}`}>{profile.email}</a>, small: true, accent: false },
  { Icon: Phone, label: "Phone", value: profile.phone, small: false, accent: false },
  { Icon: GraduationCap, label: "Status", value: "Open to opportunities", small: false, accent: true },
];

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <Reveal>
          <span className="eyebrow">About</span>
          <h2 className="section-title">
            A bit <span className="gradient-text">about me</span>
          </h2>
          <p className="section-subtitle">
            Curious student, competitive programmer, full-stack tinkerer.
          </p>
        </Reveal>

        <div className="about-grid">
          <Reveal>
            <p className="about-text">{profile.about}</p>
          </Reveal>

          <StaggerContainer stagger={0.1} delayChildren={0.15}>
            <div className="quick-facts">
              {facts.map((f) => (
                <StaggerItem key={f.label}>
                  <div className="fact">
                    <div className="fact-label">
                      <f.Icon size={11} /> {f.label}
                    </div>
                    <div
                      className="fact-value"
                      style={{
                        fontSize: f.small ? "0.88rem" : undefined,
                        color: f.accent ? "var(--accent)" : undefined,
                      }}
                    >
                      {f.value}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
