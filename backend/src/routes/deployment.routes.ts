import { Router } from "express";
import { injectServices } from "../middlewares/k8s.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { deleteDeployment, getDeploymentDetails, listDeployments, scaleDeployment } from "../controllers/deployment.controller";

const router = Router();

router  
    .get('/', injectServices, asyncHandler(listDeployments))
    .get('/:name', injectServices, asyncHandler(getDeploymentDetails))
    .patch('/:name/scale', injectServices, asyncHandler(scaleDeployment))
    .delete('/:name', injectServices, asyncHandler(deleteDeployment))


export default router;