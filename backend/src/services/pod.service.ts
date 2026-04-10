import logger from "../utils/logger";
import { K8sService } from "./k8s.service";
import { NamespaceService } from "./namespace.service";

export class PodService extends K8sService {

  namespaceService = new NamespaceService();

  constructor() {
    super();
  }

  async getPods(namespace?: string) {

    if (namespace) {
      
      await this.namespaceService.checkNamespaceExists(namespace);

      const res = await this.coreApi.listNamespacedPod({ namespace });
      logger.info(`Fetched ${res.items.length} pods from namespace ${namespace}`);
      return res.items;
    }

    const res = await this.coreApi.listPodForAllNamespaces();
    logger.info(`Fetched ${res.items.length} pods from all namespaces`);
    return res.items;
  }

  async getPodLogs({ podName, namespace, container }: { podName: string; namespace: string; container?: string }) {

    await this.namespaceService.checkNamespaceExists(namespace);

    const res = await this.coreApi.readNamespacedPodLog({
      name: podName,
      namespace,
      container
    });

    return res;
  }

  async getPodDetails(podName: string, namespace: string) {

    await this.namespaceService.checkNamespaceExists(namespace);

    const res = await this.coreApi.readNamespacedPod({
      name: podName,
      namespace
    });
    return res;
  }

  async deletePod(podName: string, namespace: string) {
    
    await this.namespaceService.checkNamespaceExists(namespace);
    
    const res = await this.coreApi.deleteNamespacedPod({
      name: podName,
      namespace
    });

    return { message: "Pod deleted successfully" };
  }
}