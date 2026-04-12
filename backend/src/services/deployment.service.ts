import { K8sService } from "./k8s.service";
import { NamespaceService } from "./namespace.service";
import { AppError } from "../utils/AppError";

/**
 * DeploymentService wraps Kubernetes Deployment API calls and validation logic.
 */
export class DeploymentService extends K8sService {

    namespaceService = new NamespaceService();

    constructor() {
        super();
    }

    /**
     * List deployments for a single namespace or across all namespaces.
     */
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

    /**
     * Validate that a deployment exists in the requested namespace.
     */
    async checkDeploymentExists(deploymentName: string, namespace: string) {

        const namespaceExists = await this.namespaceService.checkNamespaceExists(namespace);
        if (!namespaceExists) {
            throw new AppError(`Namespace ${namespace} does not exist`, 404);
        }

        const deployments = await this.listDeployments(namespace);
        const deploymentExists = deployments.filter(d => d.metadata?.name === deploymentName).length > 0;

        return !deploymentExists ? false : true;
    }
    
    /**
     * Read detailed deployment information from Kubernetes.
     */
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

    /**
     * Delete a deployment from the cluster.
     */
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

    /**
     * Patch a deployment to scale the replica count.
     */
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

    /**
     * Restart a deployment by updating the pod template annotation.
     */
    async restartDeployment(deploymentName: string, namespace: string) {
        
        const namespaceExists = await this.namespaceService.checkNamespaceExists(namespace);
        if (!namespaceExists) {
            throw new AppError(`Namespace ${namespace} does not exist`, 404);
        }
        
        const deploymentExists = await this.checkDeploymentExists(deploymentName, namespace);
        if (!deploymentExists) {
            throw new AppError(`Deployment ${deploymentName} does not exist in namespace ${namespace}`, 404);
        }

        const deployment = await this.getDeploymentDetails(deploymentName, namespace);

        if (deployment.spec?.template?.metadata) {
            deployment.spec.template.metadata.annotations = { ...(deployment.spec.template.metadata.annotations || {}), 'kubectl.kubernetes.io/restartedAt': new Date().toISOString() };
        }

        const patch = [
            {
                op: 'add',
                path: '/spec/template/metadata/annotations/kubectl.kubernetes.io~1restartedAt',
                value: new Date().toISOString()
            }
        ];

        const res = await this.appsApi.replaceNamespacedDeployment({
            name: deploymentName,
            namespace,
            body: deployment,
        });

        return res; 
    }
}