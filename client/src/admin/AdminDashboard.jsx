import { useState, useEffect, useCallback } from "react";
import {
  Eye, Users, Mail, Briefcase, ArrowLeft, LogOut, RefreshCw, Trash2,
  CheckCircle2, Circle, Globe, Monitor, Clock,
  BarChart3, MousePointerClick, Crown, ShieldCheck,
} from "lucide-react";
import { api } from "../utils/api.js";
import { useAdmin } from "../context/AdminContext.jsx";

const TABS = [
  { key: "overview",    label: "Overview",    icon: Eye },
  { key: "engagement",  label: "Engagement",  icon: BarChart3 },
  { key: "views",       label: "Viewers",     icon: Users },
  { key: "messages",    label: "Messages",    icon: Mail },
  { key: "hires",       label: "Hire forms",  icon: Briefcase },
];

export default function AdminDashboard({ onExit }) {
  const { logout } = useAdmin();
  const [tab, setTab] = useState("overview");
  const [overview, setOverview] = useState(null);
  const [views, setViews] = useState(null);
  const [messages, setMessages] = useState([]);
  const [hires, setHires] = useState([]);
  const [engagement, setEngagement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [confirmClear, setConfirmClear] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [ov, vw, msg, hr, eng] = await Promise.all([
        api.adminOverview(),
        api.adminViews(1, 100),
        api.adminMessages(),
        api.adminHires(),
        api.adminEngagement(),
      ]);
      setOverview(ov.data);
      setViews(vw);
      setMessages(msg.data || []);
      setHires(hr.data || []);
      setEngagement(eng.data || null);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Auto-refresh every 30s while on overview tab
  useEffect(() => {
    if (tab !== "overview") return;
    const id = setInterval(() => fetchAll(), 30000);
    return () => clearInterval(id);
  }, [tab, fetchAll]);

  const onLogout = async () => {
    await logout();
    onExit?.();
  };

  const markRead = async (id) => {
    try {
      await api.adminMarkRead(id);
      setMessages((m) => m.map((x) => x._id === id ? { ...x, read: true } : x));
    } catch (e) { console.error(e); }
  };

  const deleteMsg = async (id) => {
    if (!confirm("Delete this message?")) return;
    try {
      await api.adminDeleteMessage(id);
      setMessages((m) => m.filter((x) => x._id !== id));
    } catch (e) { console.error(e); }
  };

  const deleteHire = async (id) => {
    if (!confirm("Delete this hire inquiry?")) return;
    try {
      await api.adminDeleteHire(id);
      setHires((h) => h.filter((x) => x._id !== id));
    } catch (e) { console.error(e); }
  };

  const clearViews = async () => {
    try {
      await api.adminClearViews();
      setConfirmClear(false);
      fetchAll();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <ShieldCheck size={20} />
          <span>Admin</span>
        </div>

        <nav className="admin-nav">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                className={`admin-nav-item ${tab === t.key ? "active" : ""}`}
                onClick={() => setTab(t.key)}
              >
                <Icon size={16} /> {t.label}
                {t.key === "messages" && overview && (
                  <span className="admin-nav-badge">
                    {overview.messages.unread > 0 ? overview.messages.unread : ""}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="admin-sidebar-foot">
          <button className="admin-nav-item" onClick={fetchAll}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="admin-nav-item" onClick={onExit}>
            <ArrowLeft size={16} /> Back to site
          </button>
          <button className="admin-nav-item danger" onClick={onLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <h1>{TABS.find((t) => t.key === tab)?.label}</h1>
          <div className="admin-topbar-right">
            <span className="admin-topbar-time">
              <Clock size={12} /> {lastRefresh.toLocaleTimeString()}
            </span>
            <button className="btn btn-outline admin-refresh-btn" onClick={fetchAll}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
        </header>

        {error && <div className="form-status error">{error}</div>}
        {loading && !overview && <div className="admin-loader">Loading dashboard…</div>}

        {tab === "overview" && overview && <OverviewPanel data={overview} />}
        {tab === "engagement" && engagement && <EngagementPanel data={engagement} />}
        {tab === "views"    && views    && <ViewsPanel views={views.data} pagination={views} onClear={() => setConfirmClear(true)} />}
        {tab === "messages" && <MessagesPanel messages={messages} onMarkRead={markRead} onDelete={deleteMsg} />}
        {tab === "hires"    && <HiresPanel hires={hires} onDelete={deleteHire} />}
      </main>

      {confirmClear && (
        <div className="modal-backdrop" onClick={() => setConfirmClear(false)}>
          <div className="modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Clear all view records?</h3>
            <p className="modal-sub" style={{ marginBottom: "1.5rem" }}>
              This permanently deletes every page view from the database. This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setConfirmClear(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }} onClick={clearViews}>
                <Trash2 size={16} /> Yes, clear all
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===================== Sub-panels ===================== */

function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rs = s % 60;
  if (m < 60) return rs > 0 ? `${m}m ${rs}s` : `${m}m`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return rm > 0 ? `${h}h ${rm}m` : `${h}h`;
}

function shortHost(url) {
  if (!url) return "(empty)";
  if (url.startsWith("mailto:")) return url.replace("mailto:", "");
  if (url.startsWith("button:")) return url;
  try { return new URL(url).hostname.replace(/^www\./, ""); }
  catch { return url.slice(0, 40); }
}

function EngagementPanel({ data }) {
  const { sections = [], links = [], sectionLinks = [], periodDays = 30 } = data;
  const maxAvg = Math.max(1, ...sections.map((s) => s.avgMs));
  const maxClicks = Math.max(1, ...links.map((l) => l.clicks));

  // For each section, find which links were clicked from it
  const linksBySection = new Map();
  for (const sl of sectionLinks) {
    if (!linksBySection.has(sl.section)) linksBySection.set(sl.section, []);
    linksBySection.get(sl.section).push(sl);
  }

  return (
    <div className="admin-grid">
      <div className="admin-card">
        <h3 className="admin-card-title">
          <BarChart3 size={14} /> Time spent per section
          <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-dim)", fontWeight: 500 }}>
            last {periodDays} days
          </span>
        </h3>
        {sections.length === 0 ? (
          <div className="admin-empty">
            No data yet. Visitors need to scroll through your portfolio and spend time on sections.<br/>
            <small>Tip: data appears once a visitor spends 0.5s+ on a section.</small>
          </div>
        ) : (
          <div className="eng-section-list">
            {sections.map((s, idx) => {
              const isTop = idx === 0;
              return (
                <div key={s.section} className="eng-section-row">
                  <div className="eng-section-info">
                    {isTop && <Crown size={14} className="eng-crown" />}
                    <span className="eng-section-name">{s.section || "(unknown)"}</span>
                    {isTop && <span className="eng-top-badge">Most time</span>}
                  </div>
                  <div className="eng-section-bar-wrap">
                    <div
                      className="eng-section-bar"
                      style={{ width: `${(s.avgMs / maxAvg) * 100}%` }}
                    />
                    <span className="eng-section-stat">
                      <strong>{formatDuration(s.avgMs)}</strong>
                      <small>avg · {s.events} events · {s.uniqueVisitors} visitor{s.uniqueVisitors !== 1 ? "s" : ""}</small>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="admin-card">
        <h3 className="admin-card-title">
          <Crown size={14} style={{ color: "#fbbf24" }} /> Top clicked links
          <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-dim)", fontWeight: 500 }}>
            ranked by clicks
          </span>
        </h3>
        {links.length === 0 ? (
          <div className="admin-empty">
            No clicks yet. Once visitors click your GitHub / LinkedIn / Resume button etc., you'll see them ranked here.
          </div>
        ) : (
          <div className="eng-link-list">
            {links.map((l, idx) => {
              const isTop = idx === 0;
              return (
                <div key={l.link + l.label} className="eng-link-row">
                  <div className="eng-link-rank" data-top={isTop ? "1" : "0"}>
                    {isTop ? <Crown size={12} /> : idx + 1}
                  </div>
                  <div className="eng-link-info">
                    <div className="eng-link-label">
                      {l.label || shortHost(l.link)}
                    </div>
                    <a
                      href={l.link.startsWith("button:") ? "#" : l.link}
                      target={l.link.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="eng-link-host"
                      title={l.link}
                    >
                      {shortHost(l.link)}
                    </a>
                  </div>
                  <div className="eng-link-bar-wrap">
                    <div
                      className="eng-link-bar"
                      style={{ width: `${(l.clicks / maxClicks) * 100}%` }}
                    />
                    <span className="eng-link-count">
                      <strong>{l.clicks}</strong>
                      <small>click{l.clicks !== 1 ? "s" : ""} · {l.uniqueVisitors} visitor{l.uniqueVisitors !== 1 ? "s" : ""}</small>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="admin-card">
        <h3 className="admin-card-title">
          <MousePointerClick size={14} /> Clicks by section — which section drives engagement
        </h3>
        {sectionLinks.length === 0 ? (
          <div className="admin-empty">No click data yet</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Section</th><th>Link / Button</th><th>Clicks</th></tr>
              </thead>
              <tbody>
                {sectionLinks.map((sl, i) => (
                  <tr key={`${sl.section}-${sl.link}-${i}`}>
                    <td><strong>{sl.section}</strong></td>
                    <td>
                      <div className="eng-link-label" style={{ marginBottom: 2 }}>
                        {sl.label || shortHost(sl.link)}
                      </div>
                      <a
                        href={sl.link.startsWith("button:") ? "#" : sl.link}
                        target={sl.link.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="admin-list-truncate"
                        title={sl.link}
                        style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem" }}
                      >
                        {shortHost(sl.link)}
                      </a>
                    </td>
                    <td><span className="admin-list-num">{sl.count}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color = "var(--accent)" }) {
  return (
    <div className="admin-stat" style={{ "--stat-color": color }}>
      <div className="admin-stat-icon"><Icon size={18} /></div>
      <div className="admin-stat-value">{value}</div>
      <div className="admin-stat-label">{label}</div>
      {sub && <div className="admin-stat-sub">{sub}</div>}
    </div>
  );
}

function OverviewPanel({ data }) {
  const { views, messages, hires, charts, recentViews } = data;
  const max = Math.max(1, ...charts.byDay.map((d) => d.count));

  return (
    <div className="admin-grid">
      <div className="admin-stat-row">
        <StatCard icon={Eye}      label="Total views"      value={views.total}    sub={`${views.last7d} in last 7d`}  color="#10b981" />
        <StatCard icon={Users}    label="Unique 24h"       value={views.unique24h} sub={`${views.unique7d} in last 7d`} color="#3b82f6" />
        <StatCard icon={Mail}     label="Contact messages" value={messages.total}  sub={`${messages.unread} unread`}   color="#a855f7" />
        <StatCard icon={Briefcase} label="Hire inquiries"  value={hires.total}    sub="Recruiters who reached out"   color="#f59e0b" />
      </div>

      <div className="admin-card">
        <h3 className="admin-card-title">Views — last 30 days</h3>
        {charts.byDay.length === 0 ? (
          <div className="admin-empty">No views yet. Share your portfolio!</div>
        ) : (
          <div className="admin-chart">
            {charts.byDay.map((d) => (
              <div key={d._id} className="admin-chart-bar-wrap" title={`${d._id}: ${d.count} views`}>
                <div
                  className="admin-chart-bar"
                  style={{ height: `${(d.count / max) * 100}%` }}
                />
                <span className="admin-chart-label">
                  {d._id.slice(5)}  {/* MM-DD */}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="admin-row-2col">
        <div className="admin-card">
          <h3 className="admin-card-title"><Globe size={14} /> Top countries</h3>
          {charts.byCountry.length === 0 ? (
            <div className="admin-empty">No country data yet</div>
          ) : (
            <ul className="admin-list">
              {charts.byCountry.map((c) => (
                <li key={c._id}>
                  <span>{c._id || "Unknown"}</span>
                  <span className="admin-list-num">{c.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="admin-card">
          <h3 className="admin-card-title"><Monitor size={14} /> Browsers</h3>
          {charts.byBrowser.length === 0 ? (
            <div className="admin-empty">No browser data</div>
          ) : (
            <ul className="admin-list">
              {charts.byBrowser.map((b) => (
                <li key={b._id}>
                  <span>{b._id}</span>
                  <span className="admin-list-num">{b.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="admin-card">
        <h3 className="admin-card-title">Top referrers</h3>
        {charts.byReferrer.length === 0 ? (
          <div className="admin-empty">No referrers (all direct)</div>
        ) : (
          <ul className="admin-list">
            {charts.byReferrer.map((r) => {
              let display = r._id;
              try {
                const u = new URL(r._id);
                display = u.hostname.replace(/^www\./, "");
              } catch { /* not a URL, keep raw */ }
              return (
                <li key={r._id}>
                  <span className="admin-list-truncate" title={r._id}>
                    {display === "Direct" ? "🔗 Direct" : display}
                  </span>
                  <span className="admin-list-num">{r.count}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="admin-card">
        <h3 className="admin-card-title">Recent visitors ({recentViews.length})</h3>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>When</th><th>Path</th><th>Referrer</th><th>Browser</th><th>IP hash</th></tr>
            </thead>
            <tbody>
              {recentViews.length === 0 ? (
                <tr><td colSpan={5} className="admin-empty">No visitors yet</td></tr>
              ) : recentViews.map((v) => {
                const browser = parseBrowser(v.userAgent);
                return (
                  <tr key={v._id}>
                    <td className="admin-time">{new Date(v.createdAt).toLocaleString()}</td>
                    <td><code>{v.path}</code></td>
                    <td className="admin-list-truncate" title={v.referrer}>{shortReferrer(v.referrer)}</td>
                    <td>{browser}</td>
                    <td><code>{v.ipHash}</code></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ViewsPanel({ views, pagination, onClear }) {
  return (
    <div className="admin-card">
      <div className="admin-card-head">
        <h3 className="admin-card-title">All page views · {pagination.total} total</h3>
        <button className="btn btn-outline" onClick={onClear} style={{ borderColor: "#ef4444", color: "#ef4444" }}>
          <Trash2 size={14} /> Clear all
        </button>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>When</th><th>Path</th><th>Referrer</th><th>Browser</th><th>IP hash</th></tr>
          </thead>
          <tbody>
            {views.length === 0 ? (
              <tr><td colSpan={5} className="admin-empty">No views yet</td></tr>
            ) : views.map((v) => (
              <tr key={v._id}>
                <td className="admin-time">{new Date(v.createdAt).toLocaleString()}</td>
                <td><code>{v.path}</code></td>
                <td className="admin-list-truncate" title={v.referrer}>{shortReferrer(v.referrer)}</td>
                <td>{parseBrowser(v.userAgent)}</td>
                <td><code>{v.ipHash}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MessagesPanel({ messages, onMarkRead, onDelete }) {
  return (
    <div className="admin-card">
      <h3 className="admin-card-title">Contact form messages · {messages.length} total</h3>
      {messages.length === 0 ? (
        <div className="admin-empty">No messages yet</div>
      ) : (
        <div className="admin-msg-list">
          {messages.map((m) => (
            <div key={m._id} className={`admin-msg ${m.read ? "read" : "unread"}`}>
              <div className="admin-msg-head">
                <button
                  className="admin-msg-status"
                  onClick={() => !m.read && onMarkRead(m._id)}
                  title={m.read ? "Marked as read" : "Mark as read"}
                >
                  {m.read ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                </button>
                <div className="admin-msg-meta">
                  <strong>{m.name}</strong>
                  <a href={`mailto:${m.email}`}>{m.email}</a>
                </div>
                <span className="admin-msg-time">{new Date(m.createdAt).toLocaleString()}</span>
                <div className="admin-msg-actions">
                  <a
                    href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || "Your message")}`}
                    className="btn btn-outline"
                    style={{ padding: "0.45rem 0.85rem", fontSize: "0.8rem" }}
                  >
                    Reply
                  </a>
                  <button
                    className="admin-icon-btn danger"
                    onClick={() => onDelete(m._id)}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="admin-msg-subject">Subject: {m.subject || "(no subject)"}</div>
              <div className="admin-msg-body">{m.message}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function HiresPanel({ hires, onDelete }) {
  return (
    <div className="admin-card">
      <h3 className="admin-card-title">"I'm Hiring" inquiries · {hires.length} total</h3>
      {hires.length === 0 ? (
        <div className="admin-empty">No hiring inquiries yet</div>
      ) : (
        <div className="admin-msg-list">
          {hires.map((h) => (
            <div key={h._id} className="admin-msg unread hire">
              <div className="admin-msg-head">
                <span className="hire-badge"><Briefcase size={12} /> Hire</span>
                <div className="admin-msg-meta">
                  <strong>{h.name}</strong>
                  <a href={`mailto:${h.email}`}>{h.email}</a>
                </div>
                <span className="admin-msg-time">{new Date(h.createdAt).toLocaleString()}</span>
                <div className="admin-msg-actions">
                  <a
                    href={`mailto:${h.email}?subject=Re: ${encodeURIComponent(h.role + (h.company ? ` @ ${h.company}` : ""))} opportunity`}
                    className="btn btn-primary"
                    style={{ padding: "0.45rem 0.85rem", fontSize: "0.8rem" }}
                  >
                    Reply
                  </a>
                  <button
                    className="admin-icon-btn danger"
                    onClick={() => onDelete(h._id)}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="admin-hire-grid">
                <div><span className="lbl">Role</span><span className="val">{h.role}</span></div>
                <div><span className="lbl">Company</span><span className="val">{h.company || "—"}</span></div>
                <div><span className="lbl">Positions</span><span className="val">{h.openPositions || "—"}</span></div>
                <div><span className="lbl">Salary</span><span className="val">{h.salary || "Not specified"}</span></div>
              </div>
              {h.notes && (
                <div className="admin-msg-body" style={{ marginTop: "0.75rem" }}>
                  <strong>Notes:</strong><br/>{h.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ===================== helpers ===================== */

function parseBrowser(ua = "") {
  if (/Edg\//.test(ua))     return "Edge";
  if (/Chrome\//.test(ua))   return "Chrome";
  if (/Firefox\//.test(ua))  return "Firefox";
  if (/Safari\//.test(ua))   return "Safari";
  if (/curl|wget|bot|spider/i.test(ua)) return "Bot";
  return "Other";
}

function shortReferrer(ref) {
  if (!ref || ref === "Direct") return "🔗 Direct";
  try {
    return new URL(ref).hostname.replace(/^www\./, "");
  } catch {
    return ref.slice(0, 40);
  }
}
