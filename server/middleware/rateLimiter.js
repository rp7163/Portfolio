// Simple in-memory rate limiter for the contact endpoint.
// Prevents basic abuse without needing an external package.

const buckets = new Map();

export const contactRateLimiter = (windowMs = 60_000, max = 5) => {
  return (req, res, next) => {
    const key = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const now = Date.now();

    const bucket = buckets.get(key) || { count: 0, resetAt: now + windowMs };
    if (now > bucket.resetAt) {
      bucket.count = 0;
      bucket.resetAt = now + windowMs;
    }

    bucket.count += 1;
    buckets.set(key, bucket);

    if (bucket.count > max) {
      return res.status(429).json({
        success: false,
        message: "Too many requests, please try again in a minute.",
      });
    }

    // Cleanup old buckets periodically
    if (buckets.size > 500) {
      for (const [k, v] of buckets) {
        if (now > v.resetAt) buckets.delete(k);
      }
    }

    next();
  };
};
