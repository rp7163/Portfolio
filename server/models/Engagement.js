import mongoose from "mongoose";

/* Each event = one action by one visitor.
   - type: "section_time" | "link_click"
   - section: which section they were viewing
   - link: which link they clicked (for type=link_click)
   - duration: milliseconds spent (for type=section_time)
   - ipHash: hashed IP for unique-visitor dedup
*/
const engagementSchema = new mongoose.Schema(
  {
    type:     { type: String, enum: ["section_time", "link_click"], required: true, index: true },
    section:  { type: String, default: "" },
    link:     { type: String, default: "" },
    label:    { type: String, default: "" },   // human-readable label (e.g. "LeetCode")
    duration: { type: Number, default: 0 },    // ms
    ipHash:   { type: String, index: true },
    userAgent:{ type: String, default: "" },
  },
  { timestamps: true }
);

const Engagement = mongoose.model("Engagement", engagementSchema);
export default Engagement;
