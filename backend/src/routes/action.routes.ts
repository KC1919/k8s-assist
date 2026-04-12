import { Router } from "express";
import { injectServices } from "../middlewares/k8s.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { executeAction } from "../controllers/action.controller";

const router = Router();

/**
 * Action routes expose endpoints to execute predefined actions based on insights.
 */
router
    .post('/execute', injectServices, asyncHandler(executeAction))

export default router;