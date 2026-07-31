import mongoose from "mongoose";

/* When a recruiter clicks "I'm Hiring" and submits the popup form.
   These messages are formatted nicely and emailed to the portfolio owner. */
const hireInquirySchema = new mongoose.Schema(
  {
    name:       { type: String, required: [true, "Name is required"],         trim: true, maxlength: 100 },
    email:      { type: String, required: [true, "Email is required"],        trim: true, lowercase: true,
                  match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"] },
    company:    { type: String, trim: true, maxlength: 200, default: "" },
    role:       { type: String, required: [true, "Role is required"],         trim: true, maxlength: 200 },
    openPositions: { type: String, trim: true, maxlength: 50, default: "1" },
    salary:     { type: String, trim: true, maxlength: 100, default: "" },
    notes:      { type: String, trim: true, maxlength: 1000, default: "" },
    ip:         { type: String },
  },
  { timestamps: true }
);

const HireInquiry = mongoose.model("HireInquiry", hireInquirySchema);
export default HireInquiry;
