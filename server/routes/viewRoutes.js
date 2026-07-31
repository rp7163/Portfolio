import { Router } from "express";
import { recordView, getViewStats } from "../controllers/viewController.js";

const router = Router();

router.post("/", recordView);
router.get("/stats", getViewStats);

export default router;
