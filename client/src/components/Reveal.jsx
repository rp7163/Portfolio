import { useEffect, useRef, useState } from "react";

/* Lightweight scroll-reveal component (no framer-motion dependency).
   Fades in + slides up when the element scrolls into view.

   Why this version is robust:
   - On mount, reveals immediately if the element is already in viewport.
   - Otherwise sets up an IntersectionObserver.
   - ALWAYS sets a safety-timeout fallback (1.2s) so that if the IO
     never fires (e.g. due to layout edge cases, 0-height cells,
     backdrop-filter repaint stalls, etc.) the content still shows
     up after at most ~1.2s. This prevents the "right column never
     appears" bug we hit on Achievements/Contact right columns.
   - Uses an "armed" flag so the safety timeout cannot fire after a
     real reveal has already happened. */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  threshold = 0.05,
  fallbackMs = 1200,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let armed = true;
    const reveal = () => {
      if (!armed) return;
      armed = false;
      setTimeout(() => setVisible(true), delay * 1000);
    };

    /* If element is already in viewport on mount, reveal immediately. */
    const rect = el.getBoundingClientRect();
    const inView =
      rect.top < window.innerHeight &&
      rect.bottom > 0 &&
      rect.width > 0 &&
      rect.height > 0;

    if (inView) {
      reveal();
      return () => { armed = false; };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal();
            observer.unobserve(el);
            observer.disconnect();
          }
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);

    /* Safety fallback: if neither viewport-check nor IO fires within
       fallbackMs, force-reveal. This prevents the "stuck invisible"
       bug. */
    const fallback = setTimeout(() => {
      if (armed) reveal();
    }, fallbackMs);

    return () => {
      armed = false;
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, [delay, threshold, fallbackMs]);

  return (
    <div
      ref={ref}
      className={`reveal-element ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay * 1000}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay * 1000}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
