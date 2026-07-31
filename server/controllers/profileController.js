import Profile from "../models/Profile.js";

export const getProfile = async (_req, res) => {
  try {
    const profile = await Profile.findOne().sort({ createdAt: -1 });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "No profile set yet" });
    }
    res.json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const upsertProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate({}, req.body, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
    res.json({ success: true, data: profile });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
