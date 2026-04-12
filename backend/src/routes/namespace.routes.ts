import { Router } from "express";
import { injectServices } from "../middlewares/k8s.middleware";
import { createNamespace, listNamespaces } from "../controllers/namespace.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

/**
 * Namespace routes handle namespace listing and creation.
 */
router
    .get('/', injectServices, asyncHandler(listNamespaces))
    .post('/create', injectServices, asyncHandler(createNamespace))


export default router;