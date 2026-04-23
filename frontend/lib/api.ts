import { Namespace, Pod, Deployment, Event, Insight, Action } from '../types/k8s';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      let errorBody: string | undefined;

      try {
        const payload = await response.json();
        if (payload && typeof payload === 'object') {
          errorBody = payload.message || payload.error || JSON.stringify(payload);
        } else {
          errorBody = String(payload);
        }
      } catch {
        const text = await response.text();
        errorBody = text || `${response.statusText}`;
      }

      throw new Error(`API Error: ${response.status} ${response.statusText}${errorBody ? ` - ${errorBody}` : ''}`);
    }

    return response.json();
  }

  private normalizeDeployment(payload: any): Deployment {
    const metadata = payload?.metadata ?? {};
    const status = payload?.status ?? {};
    const spec = payload?.spec ?? {};

    return {
      name: payload.name ?? metadata.name ?? '',
      namespace: payload.namespace ?? metadata.namespace ?? '',
      replicas: Number(payload.replicas ?? spec.replicas ?? 0),
      availableReplicas: Number(payload.availableReplicas ?? status.availableReplicas ?? 0),
      readyReplicas: Number(payload.readyReplicas ?? status.readyReplicas ?? 0),
      updatedReplicas: Number(payload.updatedReplicas ?? status.updatedReplicas ?? 0),
    };
  }

  // Namespace APIs
  async getNamespaces(): Promise<Namespace[]> {
    const response = await this.request<{ success: boolean; message: string; data: Namespace[] }>('/api/namespaces');
    return response.data;
  }

  async createNamespace(name: string): Promise<Namespace> {
    const response = await this.request<{ success: boolean; message: string; data: Namespace }>(`/api/namespaces/create?namespace=${encodeURIComponent(name)}`, {
      method: 'POST',
    });
    return response.data;
  }

  // Pod APIs
  async getPods(namespace?: string): Promise<Pod[]> {
    const query = namespace ? `?namespace=${namespace}` : '';
    const response = await this.request<{ success: boolean; message: string; data: Pod[] }>(`/api/pods${query}`);
    return response.data;
  }

  async getPodDetails(name: string, namespace?: string): Promise<Pod> {
    const query = namespace ? `?namespace=${namespace}` : '';
    const response = await this.request<{ success: boolean; message: string; data: Pod }>(`/api/pods/${name}${query}`);
    return response.data;
  }

  async getPodLogs(name: string, namespace?: string): Promise<string> {
    const query = namespace ? `?namespace=${namespace}` : '';
    const response = await fetch(`${this.baseURL}/api/pods/${name}/logs${query}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.text();
  }

  async deletePod(name: string, namespace?: string): Promise<void> {
    const query = namespace ? `?namespace=${namespace}` : '';
    return this.request<void>(`/api/pods/${name}${query}`, {
      method: 'DELETE',
    });
  }

  // Deployment APIs
  async getDeployments(namespace?: string): Promise<Deployment[]> {
    const query = namespace ? `?namespace=${namespace}` : '';
    const response = await this.request<{ success: boolean; message: string; data: Deployment[] | any[] }>(`/api/deployments${query}`);
    const items = response.data ?? [];
    return items.map((item) => this.normalizeDeployment(item));
  }

  async getDeploymentDetails(name: string, namespace?: string): Promise<Deployment> {
    const query = namespace ? `?namespace=${namespace}` : '';
    const response = await this.request<{ success: boolean; message: string; data: Deployment | any }>(`/api/deployments/${name}${query}`);
    return this.normalizeDeployment(response.data ?? response);
  }

  async scaleDeployment(name: string, replicas: number, namespace?: string): Promise<Deployment> {
    const query = namespace ? `?namespace=${namespace}&replicas=${replicas}` : '';
    const response = await this.request<{ success: boolean; message: string; data: Deployment }>(`/api/deployments/${name}/scale${query}`, {
      method: 'PATCH',
      body: JSON.stringify({ replicas }),
    });
    return response.data;
  }

  async restartDeployment(name: string, namespace?: string): Promise<void> {
    const query = namespace ? `?namespace=${namespace}` : '';
    return this.request<void>(`/api/deployments/${name}/restart${query}`, {
      method: 'PATCH',
    });
  }

  async deleteDeployment(name: string, namespace?: string): Promise<void> {
    const query = namespace ? `?namespace=${namespace}` : '';
    return this.request<void>(`/api/deployments/${name}${query}`, {
      method: 'DELETE',
    });
  }

  // Event APIs
  async getEvents(namespace?: string): Promise<Event[]> {
    const query = namespace ? `?namespace=${namespace}` : '';
    const response = await this.request<{ success: boolean; message: string; data: Event[] }>(`/api/events${query}`);
    return response.data;
  }

  // Insight APIs
  async getInsights(namespace?: string): Promise<Insight[]> {
    const query = namespace ? `?namespace=${namespace}` : '';
    const response = await this.request<{ success: boolean; message: string; data: Insight[] }>(`/api/insights${query}`);
    return response.data;
  }

  // Action APIs
  async executeAction(action: Action): Promise<any> {
    return this.request<any>('/api/actions/execute', {
      method: 'POST',
      body: JSON.stringify(action),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);