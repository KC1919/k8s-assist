import { Request, Response, NextFunction } from "express";
import { PodService } from "../services/pod.service";
import { NamespaceService } from "../services/namespace.service";

export function injectServices(req: Request, res: Response, next: NextFunction) {
  const context = req.query.context as string | undefined;

  // attach to request
  (req as any).services = {
    podService: new PodService(),
    namespaceService: new NamespaceService()
  };

  next();
}