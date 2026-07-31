import { useEffect, useState } from "react";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AdminProvider } from "./context/AdminContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Hero from "./sections/Hero.jsx";
import About from "./sections/About.jsx";
import Skills from "./sections/Skills.jsx";
import Projects from "./sections/Projects.jsx";
import Education from "./sections/Education.jsx";
import Achievements from "./sections/Achievements.jsx";
import Contact from "./sections/Contact.jsx";
import Admin from "./admin/Admin.jsx";
import { startEngagementTracking, stopEngagementTracking } from "./utils/engagementTracker.js";

export default function App() {
  /* Hidden admin route — visit /#admin to access the dashboard.
     No link to it anywhere on the public site. */
  const [route, setRoute] = useState(() =>
    window.location.hash === "#admin" ? "admin" : "site"
  );

  useEffect(() => {
    const onHash = () => {
      setRoute(window.location.hash === "#admin" ? "admin" : "site");
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (route === "site") {
      startEngagementTracking();
      return () => stopEngagementTracking();
    }
  }, [route]);

  const exitAdmin = () => {
    window.location.hash = "";
    setRoute("site");
  };

  return (
    <ThemeProvider>
      <AdminProvider>
        {route === "admin" ? (
          <Admin onExit={exitAdmin} />
        ) : (
          <>
            <Navbar />
            <main>
              <Hero />
              <About />
              <Skills />
              <Projects />
              <Education />
              <Achievements />
              <Contact />
            </main>
            <Footer />
          </>
        )}
      </AdminProvider>
    </ThemeProvider>
  );
}
