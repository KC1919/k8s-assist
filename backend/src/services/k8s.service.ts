import * as k8s from '@kubernetes/client-node';

export class K8sService {
  protected coreApi;

  constructor(context?: string) {
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();

    if (context) kc.setCurrentContext(context);

    this.coreApi = kc.makeApiClient(k8s.CoreV1Api);
  }
}