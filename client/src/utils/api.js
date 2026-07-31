// Thin wrapper around fetch for the backend API.
// Vite dev server proxies /api → http://localhost:5000 (see vite.config.js).

const API_BASE = import.meta.env.VITE_API_URL || "/api";

/* Admin token persistence */
const TOKEN_KEY = "rp_admin_token";

const getToken = () => {
  try { return sessionStorage.getItem(TOKEN_KEY); } catch { return null; }
};
const setToken = (t) => {
  try { if (t) sessionStorage.setItem(TOKEN_KEY, t); } catch { /* noop */ }
};
const clearToken = () => {
  try { sessionStorage.removeItem(TOKEN_KEY); } catch { /* noop */ }
};

async function request(path, options = {}, useAuth = false) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (useAuth) {
    const t = getToken();
    if (t) headers.Authorization = `Bearer ${t}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (res.status === 401 && useAuth) {
    clearToken();
  }

  if (!res.ok) {
    const message = data.message || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  /* Public */
  sendContact: (payload) =>
    request("/contact", { method: "POST", body: JSON.stringify(payload) }),

  sendHire: (payload) =>
    request("/hire", { method: "POST", body: JSON.stringify(payload) }),

  recordView: (payload = {}) =>
    request("/views", { method: "POST", body: JSON.stringify(payload) }),

  getViewStats: () => request("/views/stats"),

  getProfile: () => request("/profile"),

  health: () => request("/health"),

  /* Admin */
  adminLogin: async (secret) => {
    const res = await request("/admin/login", {
      method: "POST",
      body: JSON.stringify({ secret }),
    });
    if (res.success && res.token) setToken(res.token);
    return res;
  },

  adminLogout: async () => {
    try {
      await request("/admin/logout", { method: "POST" }, true);
    } catch { /* ignore */ }
    clearToken();
  },

  adminOverview: () => request("/admin/overview", {}, true),
  adminMessages: () => request("/admin/messages", {}, true),
  adminMarkRead: (id) => request(`/admin/messages/${id}/read`, { method: "PATCH" }, true),
  adminDeleteMessage: (id) => request(`/admin/messages/${id}`, { method: "DELETE" }, true),

  adminHires: () => request("/admin/hires", {}, true),
  adminDeleteHire: (id) => request(`/admin/hires/${id}`, { method: "DELETE" }, true),

  adminViews: (page = 1, limit = 50) =>
    request(`/admin/views?page=${page}&limit=${limit}`, {}, true),
  adminClearViews: () => request("/admin/views", { method: "DELETE" }, true),

  hasAdminToken: () => !!getToken(),

  /* Engagement tracking (section time + link clicks) */
  recordEvent: (payload) =>
    request("/engagement", { method: "POST", body: JSON.stringify(payload) }),

  adminEngagement: () => request("/admin/engagement", {}, true),
};
