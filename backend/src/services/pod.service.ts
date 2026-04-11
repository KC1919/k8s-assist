import { AppError } from "../utils/AppError";
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
      
      const namespaceExists = await this.namespaceService.checkNamespaceExists(namespace);

      if (!namespaceExists) {
        throw new AppError(`Namespace ${namespace} does not exist`, 404);
      }

      const res = await this.coreApi.listNamespacedPod({ namespace });
      logger.info(`Fetched ${res.items.length} pods from namespace ${namespace}`);
      return res.items;
    }

    const res = await this.coreApi.listPodForAllNamespaces();
    logger.info(`Fetched ${res.items.length} pods from all namespaces`);
    return res.items;
  }

  async checkPodExists(podName: string, namespace: string) {

    const namespaceExists = await this.namespaceService.checkNamespaceExists(namespace);

    if (!namespaceExists) {
      throw new AppError(`Namespace ${namespace} does not exist`, 404);
    }

    const pods = await this.getPods(namespace);
    const podExists = pods.filter(p => p.metadata?.name === podName).length > 0;

    return !podExists ? false : true;
  }

  async getPodLogs({ podName, namespace, container }: { podName: string; namespace: string; container?: string }) {

    const namespaceExists = await this.namespaceService.checkNamespaceExists(namespace);
    if (!namespaceExists) {
      throw new AppError(`Namespace ${namespace} does not exist`, 404);
    }

    const podExists = await this.checkPodExists(podName, namespace);
    if (!podExists) {
      throw new AppError(`Pod ${podName} does not exist in namespace ${namespace}`, 404);
    }

    const res = await this.coreApi.readNamespacedPodLog({
      name: podName,
      namespace,
      container
    });

    return res;
  }

  async getPodDetails(podName: string, namespace: string) {
    
    const namespaceExists = await this.namespaceService.checkNamespaceExists(namespace);
    if (!namespaceExists) {
      throw new AppError(`Namespace ${namespace} does not exist`, 404);
    } 

    const podExists = await this.checkPodExists(podName, namespace);
    if (!podExists) {
      throw new AppError(`Pod ${podName} does not exist in namespace ${namespace}`, 404);
    }

    const res = await this.coreApi.readNamespacedPod({
      name: podName,
      namespace
    });
    return res;
  }

  async deletePod(podName: string, namespace: string) {
    
    const namespaceExists = await this.namespaceService.checkNamespaceExists(namespace);
    if (!namespaceExists) {
      throw new AppError(`Namespace ${namespace} does not exist`, 404);
    }

    const podExists = await this.checkPodExists(podName, namespace);
    if (!podExists) {
      throw new AppError(`Pod ${podName} does not exist in namespace ${namespace}`, 404);
    }

    const res = await this.coreApi.deleteNamespacedPod({
      name: podName,
      namespace
    });

    return { message: "Pod deleted successfully" };
  }
}