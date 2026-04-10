import { K8sService } from "./k8s.service";
import { NamespaceService } from "./namespace.service";

export class DeploymentService extends K8sService {

    namespaceService = new NamespaceService();

    constructor() {
        super();
    }

    async listDeployments(namespace?: string) {

        if (namespace) {
            await this.namespaceService.checkNamespaceExists(namespace!);
            const res = await this.appsApi.listNamespacedDeployment({ namespace });
            return res.items;
        }

        const res = await this.appsApi.listDeploymentForAllNamespaces();
        return res.items;
    }   
}