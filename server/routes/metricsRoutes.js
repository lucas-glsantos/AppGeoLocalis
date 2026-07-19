import express from "express";
import { optionalAuth, protect } from "../middleware/auth.js";
import { apiLimiter } from "../middleware/rateLimiter.js";
import { getDashboardMetrics, trackClick, trackContact, trackView } from "../controllers/metricsController.js";

const metricsRouter = express.Router();

metricsRouter.post("/view", optionalAuth, apiLimiter, trackView);
metricsRouter.post("/click", optionalAuth, apiLimiter, trackClick);
metricsRouter.post("/contact", optionalAuth, apiLimiter, trackContact);
metricsRouter.get("/dashboard", protect, apiLimiter, getDashboardMetrics);

export default metricsRouter;
