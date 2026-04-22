import { create } from 'zustand';
import { Namespace, Pod, Deployment, Event, Insight } from '../types/k8s';
import { apiClient } from '../lib/api';

interface ClusterState {
  // Namespaces
  namespaces: Namespace[];
  selectedNamespace: string | null;
  loadingNamespaces: boolean;

  // Pods
  pods: Pod[];
  loadingPods: boolean;

  // Deployments
  deployments: Deployment[];
  loadingDeployments: boolean;

  // Events
  events: Event[];
  loadingEvents: boolean;

  // Insights
  insights: Insight[];
  loadingInsights: boolean;

  // Actions
  setSelectedNamespace: (namespace: string | null) => void;
  fetchNamespaces: () => Promise<void>;
  fetchPods: (namespace?: string) => Promise<void>;
  fetchDeployments: (namespace?: string) => Promise<void>;
  fetchEvents: (namespace?: string) => Promise<void>;
  fetchInsights: (namespace?: string) => Promise<void>;
  refreshAll: () => Promise<void>;
}

export const useClusterStore = create<ClusterState>((set, get) => ({
  // Initial state
  namespaces: [],
  selectedNamespace: "default", // Default to default namespace
  loadingNamespaces: false,
  pods: [],
  loadingPods: false,
  deployments: [],
  loadingDeployments: false,
  events: [],
  loadingEvents: false,
  insights: [],
  loadingInsights: false,

  // Actions
  setSelectedNamespace: (namespace) => set({ selectedNamespace: namespace }),

  fetchNamespaces: async () => {
    set({ loadingNamespaces: true });
    try {
      const namespaces = await apiClient.getNamespaces();
      set({ namespaces, loadingNamespaces: false });
    } catch (error) {
      console.error('Failed to fetch namespaces:', error);
      set({ loadingNamespaces: false });
    }
  },

  fetchPods: async (namespace) => {
    const ns = namespace || get().selectedNamespace;
    set({ loadingPods: true });
    try {
      const pods = await apiClient.getPods(ns || undefined);
      set({ pods, loadingPods: false });
    } catch (error) {
      console.error('Failed to fetch pods:', error);
      set({ loadingPods: false });
    }
  },

  fetchDeployments: async (namespace) => {
    const ns = namespace || get().selectedNamespace;
    set({ loadingDeployments: true });
    try {
      const deployments = await apiClient.getDeployments(ns || undefined);
      set({ deployments, loadingDeployments: false });
    } catch (error) {
      console.error('Failed to fetch deployments:', error);
      set({ loadingDeployments: false });
    }
  },

  fetchEvents: async (namespace) => {
    const ns = namespace || get().selectedNamespace;
    set({ loadingEvents: true });
    try {
      const events = await apiClient.getEvents(ns || undefined);
      set({ events, loadingEvents: false });
    } catch (error) {
      console.error('Failed to fetch events:', error);
      set({ loadingEvents: false });
    }
  },

  fetchInsights: async (namespace) => {
    const ns = namespace || get().selectedNamespace;
    set({ loadingInsights: true });
    try {
      const insights = await apiClient.getInsights(ns || undefined);
      set({ insights, loadingInsights: false });
    } catch (error) {
      console.error('Failed to fetch insights:', error);
      set({ loadingInsights: false });
    }
  },

  refreshAll: async () => {
    const { selectedNamespace } = get();
    await Promise.all([
      get().fetchNamespaces(),
      get().fetchPods(selectedNamespace || undefined),
      get().fetchDeployments(selectedNamespace || undefined),
      get().fetchEvents(selectedNamespace || undefined),
      get().fetchInsights(selectedNamespace || undefined),
    ]);
  },
}));