import { Router } from "express";
import { deletePod, getPodDetails, getPodLogs, listPods } from "../controllers/pod.controller";
import { injectServices } from "../middlewares/k8s.middleware";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

/**
 * Pod routes expose pod listing, detail, logs, and deletion endpoints.
 */
router
    .get('/', injectServices, asyncHandler(listPods))
    .get('/:name', injectServices, asyncHandler(getPodDetails))
    .get('/:name/logs', injectServices, asyncHandler(getPodLogs))
    .delete('/:name', injectServices, deletePod)


export default router;