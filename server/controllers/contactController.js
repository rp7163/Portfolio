import ContactMessage from "../models/ContactMessage.js";
import { sendContactEmail } from "../middleware/sendEmail.js";

export const createContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const doc = await ContactMessage.create({
      name,
      email,
      subject,
      message,
      ip: req.ip,
    });

    // Try to email — don't fail the request if email fails
    try {
      await sendContactEmail({ name, email, subject, message });
    } catch (emailErr) {
      console.error("Email send failed:", emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: "Thanks! Your message has been sent.",
      id: doc._id,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getContactMessages = async (_req, res) => {
  // For your own use — protect with auth middleware before exposing publicly.
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, count: messages.length, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
