import { K8sService } from "./k8s.service";

export class NamespaceService extends K8sService {
    constructor(){
        super();
    }

    async getNamespaces(){
        const res = await this.coreApi.listNamespace();
        return res.items;
    }

    async createNamespace(namespace?:string) {
        if (!namespace) {
            throw new Error("Namespace name is required");
        }

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