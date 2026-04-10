import { Router } from "express";
import { injectServices } from "../middlewares/k8s.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { listDeployments } from "../controllers/deployment.controller";

const router = Router();

router  
    .get('/', injectServices, asyncHandler(listDeployments))


export default router;