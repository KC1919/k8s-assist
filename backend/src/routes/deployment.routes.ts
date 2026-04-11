import { Router } from "express";
import { injectServices } from "../middlewares/k8s.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { deleteDeployment, getDeploymentDetails, listDeployments } from "../controllers/deployment.controller";

const router = Router();

router  
    .get('/', injectServices, asyncHandler(listDeployments))
    .get('/:name', injectServices, asyncHandler(getDeploymentDetails))
    .delete('/:name', injectServices, asyncHandler(deleteDeployment))


export default router;