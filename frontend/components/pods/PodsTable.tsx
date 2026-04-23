'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Pod } from '../../types/k8s';
import { apiClient } from '../../lib/api';
import Table from '../shared/Table';
import PodsStatusBadge from './PodsStatusBadge';

interface PodsTableProps {
  pods: Pod[];
  onPodDeleted?: () => void;
}

export default function PodsTable({ pods, onPodDeleted }: PodsTableProps) {
  const router = useRouter();
  const [deletingPod, setDeletingPod] = useState<string | null>(null);

  const handleDeletePod = async (pod: Pod) => {
    if (!confirm(`Are you sure you want to delete pod ${pod.name}?`)) return;

    setDeletingPod(pod.name);
    try {
      await apiClient.deletePod(pod.name, pod.namespace);
      onPodDeleted?.();
    } catch (error) {
      console.error('Failed to delete pod:', error);
      alert('Failed to delete pod');
    } finally {
      setDeletingPod(null);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (pod: Pod) => (
        <div>
          <div className="font-medium text-gray-900">{pod.name}</div>
          <div className="text-sm text-gray-500">{pod.namespace}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (pod: Pod) => <PodsStatusBadge status={pod.status} />,
    },
    {
      key: 'containers',
      header: 'Containers',
      render: (pod: Pod) => (
        <div className="text-sm text-gray-900">
          {pod.containers.length} container{pod.containers.length !== 1 ? 's' : ''}
        </div>
      ),
    },
    {
      key: 'node',
      header: 'Node',
      render: (pod: Pod) => (
        <div className="text-sm text-gray-900">{pod.nodeName}</div>
      ),
    },
    {
      key: 'restarts',
      header: 'Restarts',
      render: (pod: Pod) => (
        <div className="text-sm text-gray-900">{pod.restartCount || 0}</div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (pod: Pod) => (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => router.push(`/pods/${encodeURIComponent(pod.namespace)}/${encodeURIComponent(pod.name)}`)}
            className="rounded-md bg-slate-100 px-2 py-1 text-sm font-medium text-slate-900 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 cursor-pointer"
          >
            View
          </button>
          <button
            type="button"
            onClick={() => handleDeletePod(pod)}
            disabled={deletingPod === pod.name}
            className="rounded-md bg-slate-100 px-2 py-1 text-sm font-medium text-rose-700 transition hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            {deletingPod === pod.name ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      ),
    },
  ];

  return <Table data={pods} columns={columns} />;
}