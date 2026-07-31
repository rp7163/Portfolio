import mongoose from "mongoose";

// Optional: store profile data in DB so it can be edited without redeploying frontend.
// The frontend is wired to call /api/profile on load as a fallback to local data.

const profileSchema = new mongoose.Schema(
  {
    name: String,
    title: String,
    tagline: String,
    about: String,
    location: String,
    email: String,
    phone: String,
    socials: {
      github: String,
      linkedin: String,
      twitter: String,
      leetcode: String,
      codeforces: String,
      codechef: String,
      codingninjas: String,
    },
    skills: [
      {
        category: String,
        items: [String],
      },
    ],
    projects: [
      {
        title: String,
        description: String,
        tech: [String],
        github: String,
        demo: String,
        image: String,
        featured: Boolean,
      },
    ],
    education: [
      {
        school: String,
        degree: String,
        start: String,
        end: String,
        grade: String,
      },
    ],
    achievements: [String],
    codingProfiles: [
      {
        platform: String,
        handle: String,
        rating: String,
        rank: String,
        url: String,
      },
    ],
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
