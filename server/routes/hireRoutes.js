import { Router } from "express";
import { body, validationResult } from "express-validator";
import { createHireInquiry, getHireInquiries } from "../controllers/hireController.js";
import { contactRateLimiter } from "../middleware/rateLimiter.js";

const router = Router();

const validateHire = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 100 }),
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("role").trim().notEmpty().withMessage("Role / designation is required").isLength({ max: 200 }),
  body("company").optional().trim().isLength({ max: 200 }),
  body("openPositions").optional().trim().isLength({ max: 50 }),
  body("salary").optional().trim().isLength({ max: 100 }),
  body("notes").optional().trim().isLength({ max: 1000 }),
];

router.post(
  "/",
  contactRateLimiter(60_000, 5),
  validateHire,
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
  createHireInquiry
);

router.get("/", getHireInquiries);

export default router;
