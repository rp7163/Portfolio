import {
  SiGithub, SiLeetcode, SiCodechef, SiCodeforces, SiCodingninjas, SiGmail,
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { profile } from "../data/portfolioData.js";

const iconMap = {
  github:        { Icon: SiGithub,        color: "var(--gh-color)" },
  linkedin:      { Icon: FaLinkedin,      color: "#0A66C2" },
  leetcode:      { Icon: SiLeetcode,      color: "#FFA116" },
  codechef:      { Icon: SiCodechef,      color: "#9b6a3f" },
  codeforces:    { Icon: SiCodeforces,    color: "#1F8ACB" },
  codingninjas:  { Icon: SiCodingninjas,  color: "#F38A00" },
  email:         { Icon: SiGmail,         color: "#EA4335" },
};

const order = ["github", "linkedin", "leetcode", "codechef", "codeforces", "codingninjas", "email"];

export default function Footer() {
  const year = new Date().getFullYear();

  // Build the social entries in a fixed order, only including those with a URL
  const socialEntries = order
    .filter((key) => {
      if (key === "email") return !!profile.email;
      return profile.socials && profile.socials[key] && profile.socials[key].trim();
    })
    .map((key) => {
      if (key === "email") {
        return { key, url: `mailto:${profile.email}`, ...iconMap[key] };
      }
      return { key, url: profile.socials[key], ...iconMap[key] };
    });

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-socials">
          {socialEntries.map(({ key, url, Icon, color }) => (
            <a
              key={key}
              href={url}
              target={key === "email" ? undefined : "_blank"}
              rel={key === "email" ? undefined : "noopener noreferrer"}
              aria-label={key}
              style={{
                "--brand-color": color,
              }}
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
        <div className="footer-divider" />
        <p>
          © {year} {profile.name}. Built with the MERN stack
        </p>
        <p style={{ marginTop: "0.4rem", color: "var(--text-dim)" }}>
          Made with <span className="heart">♥</span> in Ahmedabad
        </p>
      </div>
    </footer>
  );
}
