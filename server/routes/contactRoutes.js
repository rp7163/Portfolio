import { Router } from "express";
import { body, validationResult } from "express-validator";
import {
  createContactMessage,
  getContactMessages,
} from "../controllers/contactController.js";
import { contactRateLimiter } from "../middleware/rateLimiter.js";

const router = Router();

const validateContact = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 100 }),
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("subject").optional().trim().isLength({ max: 200 }),
  body("message").trim().notEmpty().withMessage("Message is required").isLength({ max: 2000 }),
];

router.post(
  "/",
  contactRateLimiter(60_000, 5),
  validateContact,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }
    next();
  },
  createContactMessage
);

router.get("/", getContactMessages);

export default router;
