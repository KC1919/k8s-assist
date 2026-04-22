import { create } from 'zustand';
import { apiClient } from '../lib/api';

interface NamespaceState {
  creating: boolean;
  createNamespace: (name: string) => Promise<void>;
  reset: () => void;
}

export const useNamespaceStore = create<NamespaceState>((set) => ({
  creating: false,

  createNamespace: async (name: string) => {
    set({ creating: true });
    try {
      await apiClient.createNamespace(name);
      // Refresh namespaces in cluster store
      // This will be handled by the component using both stores
    } catch (error) {
      console.error('Failed to create namespace:', error);
      throw error;
    } finally {
      set({ creating: false });
    }
  },

  reset: () => set({ creating: false }),
}));