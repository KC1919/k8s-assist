import { Router } from "express";
import { injectServices } from "../middlewares/k8s.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { getInsights } from "../controllers/insight.controller";

const router = Router();

router
    .get('/', injectServices, asyncHandler(getInsights))

export default router;