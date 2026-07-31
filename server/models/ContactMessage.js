import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    subject: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "New message from portfolio",
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      maxlength: 2000,
    },
    ip: { type: String },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);
export default ContactMessage;
