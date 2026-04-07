import { Router } from "express";
import { injectServices } from "../middlewares/k8s.middleware";
import { createNamespace, listNamespaces } from "../controllers/namespace.controller";

const router = Router();

router
    .get('/', injectServices, listNamespaces)
    .post('/create', injectServices, createNamespace)


export default router;