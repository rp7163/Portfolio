import crypto from "crypto";
import PageView from "../models/PageView.js";
import ContactMessage from "../models/ContactMessage.js";
import HireInquiry from "../models/HireInquiry.js";
import Profile from "../models/Profile.js";

/* Admin secret — read from env. If not set, admin features are disabled. */
const ADMIN_SECRET = process.env.ADMIN_SECRET || "";

/* Generate a session token valid for this session.
   Tokens are stored in-memory and expire after 24h. */
const sessions = new Map();

const createToken = () => crypto.randomBytes(32).toString("hex");
const SESSION_TTL = 24 * 60 * 60 * 1000; // 24h

const isValidToken = (token) => {
  if (!token) return false;
  const expiry = sessions.get(token);
  if (!expiry) return false;
  if (Date.now() > expiry) {
    sessions.delete(token);
    return false;
  }
  return true;
};

/* POST /api/admin/login — verify the secret, return a token */
export const adminLogin = (req, res) => {
  const { secret } = req.body;
  if (!ADMIN_SECRET) {
    return res.status(503).json({
      success: false,
      message: "Admin not configured. Set ADMIN_SECRET in server/.env",
    });
  }
  if (typeof secret !== "string" || secret !== ADMIN_SECRET) {
    /* Constant-time compare to avoid timing attacks */
    const a = Buffer.from(secret || "");
    const b = Buffer.from(ADMIN_SECRET);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return res.status(401).json({ success: false, message: "Invalid secret" });
    }
  }

  const token = createToken();
  sessions.set(token, Date.now() + SESSION_TTL);
  res.json({ success: true, token, expiresIn: SESSION_TTL });
};

/* Middleware: gate all /api/admin/* routes (except login) */
export const requireAdmin = (req, res, next) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!isValidToken(token)) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  req.adminToken = token;
  next();
};

/* GET /api/admin/overview — top-level stats for the dashboard */
export const getOverview = async (req, res) => {
  try {
    const now = Date.now();
    const last24h = new Date(now - 24 * 60 * 60 * 1000);
    const last7d  = new Date(now - 7  * 24 * 60 * 60 * 1000);
    const last30d = new Date(now - 30 * 24 * 60 * 60 * 1000);

    /* Compute browser/referrer/country summaries in JS instead of a deep
       MongoDB aggregation (which has nesting limits). */
    const allViews = await PageView.find().select("userAgent referrer country").lean();
    const byBrowser = summarizeBrowser(allViews);
    const byReferrer = summarizeReferrer(allViews);
    const byCountry  = summarizeCountry(allViews);

    const [
      totalViews,
      views24h,
      views7d,
      views30d,
      unique24h,
      unique7d,
      unique30d,
      totalMessages,
      messagesUnread,
      totalHires,
      recentViews,
      byDay,
    ] = await Promise.all([
      PageView.countDocuments(),
      PageView.countDocuments({ createdAt: { $gte: last24h } }),
      PageView.countDocuments({ createdAt: { $gte: last7d  } }),
      PageView.countDocuments({ createdAt: { $gte: last30d } }),
      PageView.aggregate([
        { $match: { createdAt: { $gte: last24h } } },
        { $group: { _id: "$ipHash" } },
        { $count: "unique" },
      ]),
      PageView.aggregate([
        { $match: { createdAt: { $gte: last7d } } },
        { $group: { _id: "$ipHash" } },
        { $count: "unique" },
      ]),
      PageView.aggregate([
        { $match: { createdAt: { $gte: last30d } } },
        { $group: { _id: "$ipHash" } },
        { $count: "unique" },
      ]),
      ContactMessage.countDocuments(),
      ContactMessage.countDocuments({ read: { $ne: true } }),
      HireInquiry.countDocuments(),
      PageView.find().sort({ createdAt: -1 }).limit(25).lean(),
      PageView.aggregate([
        { $match: { createdAt: { $gte: last30d } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        views: {
          total:   totalViews,
          last24h: views24h,
          last7d:  views7d,
          last30d: views30d,
          unique24h: unique24h[0]?.unique || 0,
          unique7d:  unique7d[0]?.unique  || 0,
          unique30d: unique30d[0]?.unique || 0,
        },
        messages: {
          total:  totalMessages,
          unread: messagesUnread,
        },
        hires: {
          total: totalHires,
        },
        charts: {
          byDay:     byDay,
          byCountry: byCountry,
          byReferrer: byReferrer,
          byBrowser: byBrowser,
        },
        recentViews: recentViews.map((v) => ({
          _id: v._id,
          createdAt: v.createdAt,
          userAgent: v.userAgent,
          referrer: v.referrer || "Direct",
          path: v.path,
          ipHash: v.ipHash ? v.ipHash.slice(0, 8) + "…" : "",
        })),
      },
    });
  } catch (err) {
    console.error("Overview error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* GET /api/admin/messages — list contact messages */
export const getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).limit(200).lean();
    res.json({ success: true, count: messages.length, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* PATCH /api/admin/messages/:id/read — mark a message read */
export const markMessageRead = async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!msg) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: msg });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/* DELETE /api/admin/messages/:id */
export const deleteMessage = async (req, res) => {
  try {
    const r = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!r) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/* GET /api/admin/hires — list hiring inquiries */
export const getHires = async (req, res) => {
  try {
    const hires = await HireInquiry.find().sort({ createdAt: -1 }).limit(200).lean();
    res.json({ success: true, count: hires.length, data: hires });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* DELETE /api/admin/hires/:id */
export const deleteHire = async (req, res) => {
  try {
    const r = await HireInquiry.findByIdAndDelete(req.params.id);
    if (!r) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/* GET /api/admin/views — paginated list of all page views */
export const getViews = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(200, Math.max(1, parseInt(req.query.limit, 10) || 50));
    const skip = (page - 1) * limit;

    const [views, total] = await Promise.all([
      PageView.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      PageView.countDocuments(),
    ]);

    res.json({
      success: true,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      data: views.map((v) => ({
        _id: v._id,
        createdAt: v.createdAt,
        userAgent: v.userAgent,
        referrer: v.referrer || "Direct",
        path: v.path,
        ipHash: v.ipHash ? v.ipHash.slice(0, 8) + "…" : "",
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* DELETE /api/admin/views — clear all view records */
export const clearViews = async (req, res) => {
  try {
    const r = await PageView.deleteMany({});
    res.json({ success: true, deleted: r.deletedCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* POST /api/admin/logout — invalidate current token */
export const adminLogout = (req, res) => {
  if (req.adminToken) sessions.delete(req.adminToken);
  res.json({ success: true });
};

/* ===================== Summary helpers (computed in JS to avoid
   MongoDB aggregation nesting limits) ===================== */

function detectBrowser(ua = "") {
  if (/Edg\//.test(ua))     return "Edge";
  if (/Chrome\//.test(ua))   return "Chrome";
  if (/Firefox\//.test(ua))  return "Firefox";
  if (/Safari\//.test(ua))   return "Safari";
  if (/curl|wget|bot|spider/i.test(ua)) return "Bot";
  return "Other";
}

function hostOf(ref) {
  if (!ref) return "Direct";
  try { return new URL(ref).hostname.replace(/^www\./, ""); }
  catch { return ref.slice(0, 60); }
}

function summarizeBrowser(views) {
  const m = new Map();
  for (const v of views) {
    const b = detectBrowser(v.userAgent);
    m.set(b, (m.get(b) || 0) + 1);
  }
  return [...m.entries()]
    .map(([k, v]) => ({ _id: k, count: v }))
    .sort((a, b) => b.count - a.count);
}

function summarizeReferrer(views) {
  const m = new Map();
  for (const v of views) {
    const r = hostOf(v.referrer);
    m.set(r, (m.get(r) || 0) + 1);
  }
  return [...m.entries()]
    .map(([k, v]) => ({ _id: k, count: v }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

function summarizeCountry(views) {
  const m = new Map();
  for (const v of views) {
    if (!v.country) continue;
    m.set(v.country, (m.get(v.country) || 0) + 1);
  }
  return [...m.entries()]
    .map(([k, v]) => ({ _id: k, count: v }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}
