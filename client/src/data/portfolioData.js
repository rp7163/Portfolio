// All portfolio content lives here — edit and the site updates.

export const profile = {
  name: "Rudra Patel",
  initials: "RP",
  title: "Software Engineer · Full-Stack Developer",
  tagline:
    "Final Year B.Tech Computer Engineering student at PDEU, Gandhinagar — building thoughtful web apps, solving 1300+ DSA problems, and chasing clean code.",
  location: "Ahmedabad, Gujarat, India",
  email: "23bcp401@sot.pdpu.ac.in",
  phone: "+91 7573092630",
  resumeUrl: "https://drive.google.com/file/d/1KAvg7iivVtgYOt_fiaojqVJLmoaQjgax/view?usp=drive_link",
  about: `I'm a final-year Computer Engineering student at Pandit Deendayal Energy University with a CGPA of 8.91. I love the intersection of competitive programming and product engineering — writing algorithms by day and building full-stack apps.

My toolkit spans C++ for DSA, and the MERN stack for web development. I've built a Git-like VCS in Python, a logistics database system, and a complete online education platform with Node.js, Express.js, and MongoDB.

Currently looking for SDE / SWE / Web Developer fresher roles where I can grow as an engineer and ship meaningful products.`,
  socials: {
    github: "https://github.com/rp7163",
    linkedin: "https://www.linkedin.com/in/rudra-patel-pdeu/",
    leetcode: "https://leetcode.com/u/rp_7163",
    codeforces: "https://codeforces.com/profile/rp_7163",
    codechef: "https://www.codechef.com/users/soft_pearl_26",
    codingninjas: "https://www.naukri.com/code360/profile/4a7855bd-4f0b-455b-b273-712bd9a9ceb2",
  },
};

export const skills = [
  {
    category: "Languages",
    items: ["C++", "C", "Python", "JavaScript", "SQL"],
  },
  {
    category: "Frontend",
    items: ["React", "HTML5", "CSS3", "Responsive Design"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express.js", "REST APIs"],
  },
  {
    category: "Databases",
    items: ["MongoDB", "MySQL"],
  },
  {
    category: "Core CS",
    items: ["Data Structures & Algorithms", "OOP", "Operating Systems", "DBMS"],
  },
  {
    category: "Tools",
    items: ["Git", "GitHub", "VS Code", "Postman"],
  },
];

export const projects = [
  {
    title: "Version Control System (Git-like)",
    period: "May 2024 – Jul 2024",
    description:
      "Built a Git-like VCS from scratch in Python. Implements repository initialization, content-addressable object storage using SHA-1, change tracking, commit history, and synchronization between local and remote-like stores — all without using Git.",
    tech: ["Python", "os", "hashlib", "json"],
    github: "https://github.com/rp7163/Version-Control-System",
    demo: "",
    featured: true,
  },
  
  
  {
    title: "Logistics Management System",
    period: "Mar 2025 – May 2025",
    description:
      "Relational database application to manage end-to-end logistics — shipments, warehouses, fleet vehicles, and inventory levels. Designed ER diagrams, normalized tables up to 3NF, and wrote complex SQL queries with joins, triggers, and stored procedures.",
    tech: ["MySQL"],
    github: "",
    demo: "",
    featured: false,
    private: true,
  },
  
  {
    title: "Study Notion — Online Education Platform",
    period: "Jun 2025 – Aug 2025",
    description:
      "Full-stack backend for an EdTech platform inspired by StudyNotion. Built REST APIs for course CRUD, student enrollment, progress tracking, ratings & reviews, and transactional email notifications. Designed a normalized MongoDB schema and implemented auth with JWT + bcrypt.",
    tech: ["Node.js", "Express.js", "MongoDB"],
    github: "https://github.com/rp7163/Study-Notion-BackEnd",
    demo: "",
    featured: true,
  },
];

export const education = [
  {
    school: "Pandit Deendayal Energy University, Gandhinagar",
    degree: "B.Tech in Computer Engineering",
    start: "2023",
    end: "Present",
    grade: "CGPA: 8.91",
  },
  {
    school: "Devasya International School, Ahmedabad",
    degree: "Class XII — Science",
    start: "2022",
    end: "2023",
    grade: "95.70 Percentile",
  },
  {
    school: "H. B. Mehta High School, Ahmedabad",
    degree: "Class X",
    start: "2020",
    end: "2021",
    grade: "98.55 Percentile",
  },
];

export const achievements = [
  "Secured global rank 10 in a weekly competitive coding contest on Coding Ninjas.",
  "Specialist on Coding Ninjas with a peak rating of 1920.",
  "2★ on CodeChef CP Contest 1560 (curr) & DSA Contest rating of 1897 (max).",
  "Pupil on Codeforces with a current rating of 1223.",
  "Solved 1300+ DSA problems across Codeforces, LeetCode, CodeChef, and Coding Ninjas.",
  "Gold + Elite certificate for scoring 100% in the NPTEL course 'Understanding Incubation and Entrepreneurship' — top 1%.",
];

export const codingProfiles = [
  { platform: "LeetCode",         handle: "rp_7163",            rating: "1682", rank: "Top 15%",    url: "https://leetcode.com/u/rp_7163" },
  { platform: "Coding ninjas",   handle: "rp7163",             rating: "1920", rank: "Specialist",  url: "https://www.naukri.com/code360/profile/4a7855bd-4f0b-455b-b273-712bd9a9ceb2" },
  { 
    platform: "CodeChef",         
    handle: "soft_pearl_26",      
    rating: "1560", 
    rank: "2★ CP · 1897 DSA",          
    url: "https://www.codechef.com/users/soft_pearl_26",
    subRatings: [
      { label: "CP",  value: "1560", badge: "2★",  accent: "#22c55e" },
      { label: "DSA", value: "1897", badge: "Max", accent: "#f59e0b" },
    ]
  },
  { platform: "Codeforces",       handle: "rp_7163",            rating: "1223", rank: "Pupil",       url: "https://codeforces.com/profile/rp_7163" },
];

export const stats = [
  { label: "DSA Problems", value: "1300+" },
  { label: "CGPA",         value: "8.91" },
  { label: "LeetCode",     value: "1682" },
  { label: "Coding ninjas",      value: "1920" },
];
