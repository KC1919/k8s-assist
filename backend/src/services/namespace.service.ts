import { K8sService } from "./k8s.service";

/**
 * NamespaceService provides helpers for namespace lookup and creation.
 */
export class NamespaceService extends K8sService {
    constructor(){
        super();
    }

    /**
     * Fetch all namespaces from the cluster.
     */
    async getNamespaces(){
        const res = await this.coreApi.listNamespace();
        return res.items;
    }

    /**
     * Check whether a namespace exists in the cluster.
     */
    async checkNamespaceExists(namespace: string) {
        const namespaces = await this.getNamespaces();
        const namespaceExists = namespaces.filter(ns => ns.metadata?.name === namespace).length > 0;
        
        return !namespaceExists ? false : true;
    }

    /**
     * Create a new namespace in the Kubernetes cluster.
     */
    async createNamespace(namespace?:string) {
        if (!namespace) {
            throw new Error("Namespace name is required");
        }

        await this.checkNamespaceExists(namespace);

        const data = {
            metadata: {
                name: namespace
            }
        }
        const res = await this.coreApi.createNamespace({body: data});

        console.log(`${namespace} namespace created!`);

        const createdNamespace = await this.coreApi.readNamespace({name: data.metadata.name});
        return createdNamespace;
    }
}