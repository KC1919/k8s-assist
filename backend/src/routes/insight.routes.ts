import { Router } from "express";
import { injectServices } from "../middlewares/k8s.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { getInsights } from "../controllers/insight.controller";

const router = Router();

/**
 * Insight routes return rule-based insights derived from cluster events.
 */
router
    .get('/', injectServices, asyncHandler(getInsights))

export default router;