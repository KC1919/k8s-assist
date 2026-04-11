import { K8sService } from "./k8s.service";
import { NamespaceService } from "./namespace.service";
import { AppError } from "../utils/AppError";


export class EventService extends K8sService {
    constructor() {
        super();
    }

    namespaceService = new NamespaceService();

    async listEvents(namespace?: string, type?: string) {

        if (namespace) {
            const namespaceExists = await this.namespaceService.checkNamespaceExists(namespace);

            if (!namespaceExists) {
                throw new AppError(`Namespace ${namespace} does not exist`, 404);
            }
            const res = await this.coreApi.listNamespacedEvent({ namespace });

            const filteredEvents = type ? res.items.filter(event => event.type === type) : res.items;

            return filteredEvents;
        }

        const res = await this.coreApi.listEventForAllNamespaces();
        return res.items;
    }
}