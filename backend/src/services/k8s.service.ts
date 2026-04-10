import * as k8s from '@kubernetes/client-node';

export class K8sService {
  protected coreApi;
  protected appsApi;

  constructor(context?: string) {
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();

    if (context) kc.setCurrentContext(context);

    this.coreApi = kc.makeApiClient(k8s.CoreV1Api);
    this.appsApi = kc.makeApiClient(k8s.AppsV1Api);
  }
}