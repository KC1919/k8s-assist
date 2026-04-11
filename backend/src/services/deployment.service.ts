import { K8sService } from "./k8s.service";
import { NamespaceService } from "./namespace.service";
import { AppError } from "../utils/AppError";

export class DeploymentService extends K8sService {

    namespaceService = new NamespaceService();

    constructor() {
        super();
    }

    async listDeployments(namespace?: string) {

        if (namespace) {
            const namespaceExists = await this.namespaceService.checkNamespaceExists(namespace!);
            if (!namespaceExists) {
                throw new AppError(`Namespace ${namespace} does not exist`, 404);
            }
            const res = await this.appsApi.listNamespacedDeployment({ namespace });
            return res.items;
        }

        const res = await this.appsApi.listDeploymentForAllNamespaces();
        return res.items;
    }

    async checkDeploymentExists(deploymentName: string, namespace: string) {

        const namespaceExists = await this.namespaceService.checkNamespaceExists(namespace);
        if (!namespaceExists) {
            throw new AppError(`Namespace ${namespace} does not exist`, 404);
        }

        const deployments = await this.listDeployments(namespace);
        const deploymentExists = deployments.filter(d => d.metadata?.name === deploymentName).length > 0;

        return !deploymentExists ? false : true;
    }
    
    async getDeploymentDetails(deploymentName: string, namespace: string) {

        const namespaceExists = await this.namespaceService.checkNamespaceExists(namespace);
        if (!namespaceExists) {
            throw new AppError(`Namespace ${namespace} does not exist`, 404);
        }
        const deploymentExists = await this.checkDeploymentExists(deploymentName, namespace);
        if (!deploymentExists) {
            throw new AppError(`Deployment ${deploymentName} does not exist in namespace ${namespace}`, 404);
        }

        const res = await this.appsApi.readNamespacedDeployment({
            name: deploymentName,
            namespace
        });

        return res;
    }

    async deleteDeployment(deploymentName: string, namespace: string) {
        
        const namespaceExists = await this.namespaceService.checkNamespaceExists(namespace);
        if (!namespaceExists) {
            throw new AppError(`Namespace ${namespace} does not exist`, 404);
        }
        
        const deploymentExists = await this.checkDeploymentExists(deploymentName, namespace);
        if (!deploymentExists) {
            throw new AppError(`Deployment ${deploymentName} does not exist in namespace ${namespace}`, 404);
        }

        const res = await this.appsApi.deleteNamespacedDeployment({
            name: deploymentName,
            namespace
        });

        return res;
    }

    async scaleDeployment(deploymentName: string, namespace: string, replicas: number) {
        
        const namespaceExists = await this.namespaceService.checkNamespaceExists(namespace);
        if (!namespaceExists) {
            throw new AppError(`Namespace ${namespace} does not exist`, 404);
        }
        
        const deploymentExists = await this.checkDeploymentExists(deploymentName, namespace);
        if (!deploymentExists) {
            throw new AppError(`Deployment ${deploymentName} does not exist in namespace ${namespace}`, 404);
        }

        const patch = [
            {
                op: 'replace',
                path: '/spec/replicas',
                value: replicas
            }
        ];  

        const res = await this.appsApi.patchNamespacedDeployment({
            name: deploymentName,
            namespace,
            body: patch
        });

        return res;
    }
}