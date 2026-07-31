import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import contactRoutes from "./routes/contactRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import hireRoutes from "./routes/hireRoutes.js";
import viewRoutes from "./routes/viewRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import engagementRoutes from "./routes/engagementRoutes.js";

/* Always look for .env in the server folder, regardless of where node was started from */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

/* Trust the first proxy (Vercel / Render / Railway) so req.ip is the
   real client IP instead of 127.0.0.1 */
app.set("trust proxy", 1);

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/contact", contactRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/hire", hireRoutes);
app.use("/api/views", viewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", engagementRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Centralised error handler
app.use((err, _req, res, _next) => {
  console.error("Server error:", err);
  res
    .status(err.status || 500)
    .json({ success: false, message: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
