import { api } from "./api.js";

/* Send a single page-view ping per browser session.
   Uses sessionStorage so navigating around doesn't spam the backend.
   Defers until backend is reachable. */
export const recordViewOnce = () => {
  try {
    if (typeof window === "undefined") return;
    const SESSION_KEY = "rp_view_recorded";
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const sendPing = () => {
      sessionStorage.setItem(SESSION_KEY, "1");
      api.recordView({
        referrer: document.referrer || "",
        path: window.location.pathname,
      }).catch(() => { /* silent */ });
    };

    /* Try once, then wait for the engagement tracker to confirm backend
       is up (it pings /api/health every 5s). If tracker is also offline,
       fall back to a 3s delay. */
    if (window.__rpBackendReady) {
      sendPing();
    } else {
      // Wait for the backendReady event from engagementTracker
      const tryWhenReady = () => {
        if (window.__rpBackendReady) return sendPing();
        setTimeout(tryWhenReady, 1000);
      };
      setTimeout(tryWhenReady, 1500);
    }
  } catch { /* no-op */ }
};
