import HireInquiry from "../models/HireInquiry.js";
import { sendHireEmail } from "../middleware/sendEmail.js";

export const createHireInquiry = async (req, res) => {
  try {
    const { name, email, company, role, openPositions, salary, notes } = req.body;

    const doc = await HireInquiry.create({
      name, email, company, role, openPositions, salary, notes,
      ip: req.ip,
    });

    // Email the owner a nicely-formatted hiring opportunity notification
    try {
      await sendHireEmail({ name, email, company, role, openPositions, salary, notes });
    } catch (emailErr) {
      console.error("Hire email send failed:", emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: "Thanks! Your hiring inquiry has been sent. Rudra will reach out shortly.",
      id: doc._id,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getHireInquiries = async (_req, res) => {
  try {
    const items = await HireInquiry.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
