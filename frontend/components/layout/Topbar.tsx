'use client';

import { useEffect } from 'react';
import { useClusterStore } from '../../store/useClusterStore';

export default function Topbar() {
  const { namespaces, selectedNamespace, setSelectedNamespace, loadingNamespaces, fetchNamespaces } = useClusterStore();

  useEffect(() => {
    fetchNamespaces();
  }, [fetchNamespaces]);

  return (
    <div className="flex h-16 items-center justify-between bg-white px-4 shadow">
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold text-gray-900">Kubernetes Dashboard</h2>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="namespace-select" className="text-sm font-medium text-gray-700">
            Namespace:
          </label>
          <select
            id="namespace-select"
            value={selectedNamespace || ''}
            onChange={(e) => setSelectedNamespace(e.target.value || null)}
            className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-blue-500 focus:outline-none"
            disabled={loadingNamespaces}
          >
            <option value="">All Namespaces</option>
            {namespaces.map((ns) => (
              <option key={ns.name} value={ns.name}>
                {ns.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}