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
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
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
    const response = await this.request<{ success: boolean; message: string; data: Deployment[] }>(`/api/deployments${query}`);
    return response.data;
  }

  async getDeploymentDetails(name: string, namespace?: string): Promise<Deployment> {
    const query = namespace ? `?namespace=${namespace}` : '';
    const response = await this.request<{ success: boolean; message: string; data: Deployment }>(`/api/deployments/${name}${query}`);
    return response.data;
  }

  async scaleDeployment(name: string, replicas: number, namespace?: string): Promise<Deployment> {
    const query = namespace ? `?namespace=${namespace}` : '';
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