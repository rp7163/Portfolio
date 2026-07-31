import { Router } from "express";
import {
  adminLogin,
  requireAdmin,
  getOverview,
  getMessages,
  markMessageRead,
  deleteMessage,
  getHires,
  deleteHire,
  getViews,
  clearViews,
  adminLogout,
} from "../controllers/adminController.js";

const router = Router();

/* Login is public; everything else requires a valid token */
router.post("/login", adminLogin);
router.post("/logout", requireAdmin, adminLogout);

router.get  ("/overview",     requireAdmin, getOverview);
router.get  ("/messages",     requireAdmin, getMessages);
router.patch ("/messages/:id/read", requireAdmin, markMessageRead);
router.delete("/messages/:id",       requireAdmin, deleteMessage);

router.get   ("/hires",     requireAdmin, getHires);
router.delete("/hires/:id", requireAdmin, deleteHire);

router.get   ("/views",     requireAdmin, getViews);
router.delete("/views",     requireAdmin, clearViews);

export default router;
