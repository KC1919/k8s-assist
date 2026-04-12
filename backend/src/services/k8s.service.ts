import * as k8s from '@kubernetes/client-node';

/**
 * Base K8sService configures Kubernetes API clients for reuse by subclasses.
 */
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