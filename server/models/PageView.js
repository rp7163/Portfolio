import mongoose from "mongoose";

/* Tracks every page view. The IP is stored hashed (not in cleartext) so
   we never store personally-identifying data. This is GDPR-friendly. */
const pageViewSchema = new mongoose.Schema(
  {
    ipHash:     { type: String, required: true, index: true },
    userAgent:  { type: String, default: "" },
    referrer:   { type: String, default: "" },
    path:       { type: String, default: "/" },
    country:    { type: String, default: "" },
    city:       { type: String, default: "" },
  },
  { timestamps: true }
);

const PageView = mongoose.model("PageView", pageViewSchema);
export default PageView;
