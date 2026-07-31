import { api } from "./api.js";
import { recordViewOnce } from "./tracker.js";

/* Tracks:
   - Time spent on each section (sent every 10s and on visibility change / unload)
   - Every link click (GitHub, LinkedIn, LeetCode, Resume, Hire button, etc.)
   - View ping (once per session)

   Uses sessionStorage to dedupe — no spam.
   Health-checks the backend before sending events.
*/

const SESSION_KEY = "rp_engagement_session";
const FLUSH_INTERVAL = 10_000; // 10 seconds
const HEALTH_CHECK_INTERVAL = 5_000; // retry every 5s if down
const HEALTH_CHECK_TIMEOUT = 2_000; // give up after 2s

let sessionId = null;
let sectionTimers = new Map();
let flushTimer = null;
let healthCheckTimer = null;
let backendReady = false;
let lastSection = null;

const pingBackend = async () => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), HEALTH_CHECK_TIMEOUT);
    const res = await fetch("/api/health", {
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeout);
    backendReady = res.ok;
  } catch {
    backendReady = false;
  }
  /* Expose globally so other modules (e.g. tracker.js) can wait */
  if (typeof window !== "undefined") {
    window.__rpBackendReady = backendReady;
  }
};

const flushEvents = () => {
  if (!backendReady) return; // skip if backend is down
  const now = Date.now();
  for (const [sectionId, t] of sectionTimers.entries()) {
    if (t.lastSentAt) {
      const delta = now - t.lastSentAt;
      if (delta > 0) t.totalMs += delta;
    }
    t.lastSentAt = now;
  }
  for (const [sectionId, t] of sectionTimers.entries()) {
    if (t.totalMs < 500) continue;
    api.recordEvent({
      type: "section_time",
      section: sectionId,
      duration: Math.round(t.totalMs),
    }).catch(() => { /* silent */ });
  }
};

const enterSection = (sectionId) => {
  if (lastSection === sectionId) return;
  if (lastSection && sectionTimers.has(lastSection)) {
    const t = sectionTimers.get(lastSection);
    if (t.lastSentAt) t.totalMs += Date.now() - t.lastSentAt;
  }
  if (!sectionTimers.has(sectionId)) {
    sectionTimers.set(sectionId, { totalMs: 0, lastSentAt: null });
  }
  sectionTimers.get(sectionId).lastSentAt = Date.now();
  lastSection = sectionId;
};

const trackClick = (e) => {
  if (!backendReady) return; // skip if backend is down
  let el = e.target;
  while (el && el !== document.body) {
    const tag = el.tagName;
    if (tag === "A" && el.href) {
      const href = el.href;
      if (href.startsWith("http") || href.startsWith("mailto:")) {
        const label =
          el.getAttribute("aria-label") ||
          el.getAttribute("title") ||
          el.textContent?.trim().slice(0, 50) ||
          href;
        api.recordEvent({
          type: "link_click",
          link: href,
          label,
          section: lastSection || "",
        }).catch(() => { /* silent */ });
        return;
      }
    }
    if (tag === "BUTTON" && el.dataset?.track) {
      api.recordEvent({
        type: "link_click",
        link: `button:${el.dataset.track}`,
        label: el.dataset.track,
        section: lastSection || "",
      }).catch(() => { /* silent */ });
      return;
    }
    el = el.parentElement;
  }
};

export const startEngagementTracking = () => {
  if (typeof window === "undefined") return;

  try {
    sessionId = sessionStorage.getItem(SESSION_KEY) || crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  } catch {
    sessionId = "anon";
  }

  // Initial view ping (waits for backend to be ready)
  pingBackend().then(() => {
    if (backendReady) recordViewOnce();
  });

  // Click tracking
  document.addEventListener("click", trackClick, { passive: true });

  // Section visibility
  const sectionEls = document.querySelectorAll("section[id], footer[id]");
  if (sectionEls.length > 0) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            enterSection(entry.target.id || "unknown");
          }
        }
      },
      { threshold: 0.25 }
    );
    sectionEls.forEach((el) => io.observe(el));
  }

  // Periodic health check (until backend is up)
  healthCheckTimer = setInterval(() => {
    if (!backendReady) {
      pingBackend();
    }
  }, HEALTH_CHECK_INTERVAL);

  // Periodic flush (only when backend is ready)
  flushTimer = setInterval(() => {
    if (backendReady) flushEvents();
  }, FLUSH_INTERVAL);

  // Flush on visibility change / unload
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && backendReady) flushEvents();
  });
  window.addEventListener("beforeunload", () => { if (backendReady) flushEvents(); });
  window.addEventListener("pagehide", () => { if (backendReady) flushEvents(); });
};

export const stopEngagementTracking = () => {
  if (flushTimer) clearInterval(flushTimer);
  if (healthCheckTimer) clearInterval(healthCheckTimer);
  if (backendReady) flushEvents();
};
