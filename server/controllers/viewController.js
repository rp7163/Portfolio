import crypto from "crypto";
import PageView from "../models/PageView.js";

/* Salt for hashing IPs — change this in production. */
const IP_SALT = process.env.IP_SALT || "portfolio-viewer-salt-change-me";

const hashIp = (ip) =>
  crypto.createHash("sha256").update(String(ip) + IP_SALT).digest("hex").slice(0, 32);

/* Record a page view (called silently by the frontend on mount).
   Hashes the IP so we never store it in cleartext. */
export const recordView = async (req, res) => {
  try {
    const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const ipHash = hashIp(ip);
    const { referrer, path } = req.body || {};

    await PageView.create({
      ipHash,
      userAgent: req.headers["user-agent"]?.slice(0, 200) || "",
      referrer: (referrer || req.headers["referer"] || "").slice(0, 500),
      path: (path || "/").slice(0, 200),
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* Owner-only endpoint to get view stats. */
export const getViewStats = async (_req, res) => {
  try {
    const total = await PageView.countDocuments();

    /* Unique viewers in the last 24h (uses ipHash to dedupe) */
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const last24h = await PageView.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: "$ipHash" } },
      { $count: "unique" },
    ]);
    const last7d = await PageView.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: "$ipHash" } },
      { $count: "unique" },
    ]);

    res.json({
      success: true,
      total,
      last24h: last24h[0]?.unique || 0,
      last7d:  last7d[0]?.unique  || 0,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
