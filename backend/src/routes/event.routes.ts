import { Router } from "express";
import { listEvents } from "../controllers/event.controller";
import { injectServices } from "../middlewares/k8s.middleware";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

/**
 * Event routes expose Kubernetes event listing functionality.
 */
router
    .get('/', injectServices, asyncHandler(listEvents));

export default router;