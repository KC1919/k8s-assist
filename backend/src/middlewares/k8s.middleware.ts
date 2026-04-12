import { Request, Response, NextFunction } from "express";
import { PodService } from "../services/pod.service";
import { NamespaceService } from "../services/namespace.service";
import { DeploymentService } from "../services/deployment.service";
import { EventService } from "../services/event.service";
import { InsightService } from "../services/insight.service";
import { RuleEngine } from "../rules/rule.engine";
import { ActionExecutor } from "../actions/action.executor";

/**
 * Middleware that injects shared service instances into the request object.
 */
export function injectServices(req: Request, res: Response, next: NextFunction) {
  const context = req.query.context as string | undefined;

  // Attach service instances to the request so controllers can access them.
  (req as any).services = {
    podService: new PodService(),
    namespaceService: new NamespaceService(),
    deploymentService: new DeploymentService(),
    eventService: new EventService(),
    insightService: new InsightService(),
    actionService: new ActionExecutor(),
  };

  next();
}