import { PodService } from "../services/pod.service";
import { DeploymentService } from "../services/deployment.service";
import { EventService } from "../services/event.service";
import { AppError } from "../utils/AppError";

export class ActionExecutor {

    private podService;
    private deploymentService;
    private eventService;

    constructor() {
        this.podService = new PodService();
        this.deploymentService = new DeploymentService();
        this.eventService = new EventService();
    }

    async executeAction(actionType: string, payload: any) {

        switch (actionType) {

            case 'VIEW_LOGS':
                return await this.podService.getPodLogs({ podName: payload.name, namespace: payload.namespace });

            case 'VIEW_POD_DETAILS':
                return await this.podService.getPodDetails(payload.name, payload.namespace);

            case 'RESTART_DEPLOYMENT':
                return await this.deploymentService.restartDeployment(payload.deploymentName, payload.namespace);

            case 'VIEW_EVENTS':
                return await this.eventService.listEvents(payload.namespace);

            case 'DELETE_POD':
                return await this.podService.deletePod(payload.name, payload.namespace);

            case 'SCALE_DEPLOYMENT':
                return await this.deploymentService.scaleDeployment(payload.name, payload.namespace, payload.replicas);

            default:
                throw new AppError(`Unsupported action type: ${actionType}`, 400);
        }

    }
}