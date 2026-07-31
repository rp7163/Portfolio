import { Router } from "express";
import { recordEvent, getEngagement } from "../controllers/engagementController.js";
import { requireAdmin } from "../controllers/adminController.js";

const router = Router();

/* Public — anyone can send an event (mounted at /api) */
router.post("/engagement", recordEvent);

/* Admin only (mounted at /api) */
router.get("/admin/engagement", requireAdmin, getEngagement);

export default router;
