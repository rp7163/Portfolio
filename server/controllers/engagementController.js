import crypto from "crypto";
import Engagement from "../models/Engagement.js";

const IP_SALT = process.env.IP_SALT || "portfolio-viewer-salt-change-me";
const hashIp = (ip) =>
  crypto.createHash("sha256").update(String(ip) + IP_SALT).digest("hex").slice(0, 32);

/* POST /api/engagement — receive a tracking event */
export const recordEvent = async (req, res) => {
  try {
    const { type, section, link, label, duration } = req.body || {};
    if (!type || !["section_time", "link_click"].includes(type)) {
      return res.status(400).json({ success: false, message: "Invalid type" });
    }
    const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
    await Engagement.create({
      type,
      section:  section || "",
      link:     link    || "",
      label:    label   || "",
      duration: Number(duration) || 0,
      ipHash:   hashIp(ip),
      userAgent: req.headers["user-agent"]?.slice(0, 200) || "",
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* GET /api/admin/engagement — section time + link-click leaderboards */
export const getEngagement = async (req, res) => {
  try {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    /* Avg time per section, only for type=section_time */
    const sectionAgg = await Engagement.aggregate([
      { $match: { type: "section_time", createdAt: { $gte: since } } },
      {
        $group: {
          _id: "$section",
          totalMs:  { $sum: "$duration" },
          events:   { $sum: 1 },
          visitors: { $addToSet: "$ipHash" },
        },
      },
      {
        $project: {
          _id: 1,
          totalMs: 1,
          events: 1,
          uniqueVisitors: { $size: "$visitors" },
          avgMs: { $cond: [{ $gt: ["$events", 0] }, { $divide: ["$totalMs", "$events"] }, 0] },
        },
      },
      { $sort: { avgMs: -1 } },
    ]);

    /* Link clicks grouped by link URL, sorted by count desc */
    const linkAgg = await Engagement.aggregate([
      { $match: { type: "link_click", createdAt: { $gte: since } } },
      {
        $group: {
          _id: { link: "$link", label: "$label" },
          clicks:    { $sum: 1 },
          visitors:  { $addToSet: "$ipHash" },
        },
      },
      {
        $project: {
          _id: 1,
          clicks: 1,
          uniqueVisitors: { $size: "$visitors" },
        },
      },
      { $sort: { clicks: -1 } },
      { $limit: 50 },
    ]);

    /* Section → list of links that were clicked from it (for funnel view) */
    const sectionLinkAgg = await Engagement.aggregate([
      { $match: { type: "link_click", createdAt: { $gte: since } } },
      { $group: { _id: { section: "$section", link: "$link", label: "$label" }, count: { $sum: 1 } } },
      { $sort: { "section": 1, count: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        sections: sectionAgg.map((s) => ({
          section: s._id || "(unknown)",
          totalMs: s.totalMs,
          avgMs: s.avgMs,
          events: s.events,
          uniqueVisitors: s.uniqueVisitors,
          avgSeconds: Math.round(s.avgMs / 1000),
          totalSeconds: Math.round(s.totalMs / 1000),
        })),
        links: linkAgg.map((l) => ({
          link: l._id.link,
          label: l._id.label,
          clicks: l.clicks,
          uniqueVisitors: l.uniqueVisitors,
        })),
        sectionLinks: sectionLinkAgg.map((x) => ({
          section: x._id.section,
          link: x._id.link,
          label: x._id.label,
          count: x.count,
        })),
        periodDays: 30,
      },
    });
  } catch (err) {
    console.error("Engagement error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
