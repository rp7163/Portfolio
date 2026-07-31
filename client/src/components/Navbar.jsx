import { useEffect, useState } from "react";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";
import { profile } from "../data/portfolioData.js";

const links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#education", label: "Education" },
  { href: "#achievements", label: "Achievements" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      const offsets = links
        .map((l) => {
          const el = document.querySelector(l.href);
          if (!el) return null;
          return { href: l.href, top: el.getBoundingClientRect().top };
        })
        .filter(Boolean);

      const current = offsets.reduce(
        (acc, c) => (c.top < 150 ? c : acc),
        { href: "#home" }
      );
      setActive(current.href);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container nav-inner">
        <a href="#home" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">{profile.initials}</span>
          <span>{profile.name}</span>
        </a>

        <nav>
            <ul className={`nav-links ${open ? "open" : ""}`}>
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className={`nav-link ${active === l.href ? "active" : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setOpen(false);
                      const el = document.querySelector(l.href);
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                      // Update URL hash without jumping
                      window.history.pushState(null, "", l.href);
                    }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
        </nav>

        <div className="nav-actions">
          <button
            className="theme-toggle"
            onClick={toggle}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="nav-toggle"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}
