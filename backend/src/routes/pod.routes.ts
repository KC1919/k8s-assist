import { Router } from "express";
import { getPodLogs, listPods } from "../controllers/pod.controller";
import { injectServices } from "../middlewares/k8s.middleware";

const router = Router();

router
    .get('/', injectServices, listPods)
    .get('/:name/logs', injectServices, getPodLogs)


export default router;