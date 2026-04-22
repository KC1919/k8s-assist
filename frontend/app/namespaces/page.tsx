'use client';

import { useState } from 'react';
import { useClusterStore } from '../../store/useClusterStore';
import { useNamespaceStore } from '../../store/useNamespaceStore';
import Table from '../../components/shared/Table';
import Loader from '../../components/shared/Loader';

export default function NamespacesPage() {
  const { namespaces, loadingNamespaces, fetchNamespaces } = useClusterStore();
  const { creating, createNamespace } = useNamespaceStore();
  const [newNamespaceName, setNewNamespaceName] = useState('');

  const handleCreateNamespace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNamespaceName.trim()) return;

    try {
      await createNamespace(newNamespaceName.trim());
      setNewNamespaceName('');
      fetchNamespaces(); // Refresh the list
    } catch (error) {
      console.error('Failed to create namespace:', error);
      alert('Failed to create namespace');
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (namespace: { name: string }) => (
        <div className="font-medium text-gray-900">{namespace.name}</div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Namespaces</h1>
        <p className="text-gray-600">Manage your Kubernetes namespaces</p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Namespace</h3>
            <form onSubmit={handleCreateNamespace} className="flex space-x-2">
              <input
                type="text"
                value={newNamespaceName}
                onChange={(e) => setNewNamespaceName(e.target.value)}
                placeholder="Enter namespace name"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                disabled={creating}
              />
              <button
                type="submit"
                disabled={creating || !newNamespaceName.trim()}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
            </form>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Existing Namespaces</h3>
            {loadingNamespaces ? (
              <Loader />
            ) : (
              <Table data={namespaces} columns={columns} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}