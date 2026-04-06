import { K8sService } from "./k8s.service";

export class PodService extends K8sService {
  async getPods(namespace?: string) {
    if (namespace) {
      const res = await this.coreApi.listNamespacedPod({ namespace });
      return res.items;
    }

    const res = await this.coreApi.listPodForAllNamespaces();
    return res.items;
  }
}