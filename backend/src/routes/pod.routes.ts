import { Router } from "express";
import { listPods } from "../controllers/pod.controller";
import { injectServices } from "../middlewares/k8s.middleware";

const router = Router();

router
    .get('/', injectServices, listPods)


export default router;