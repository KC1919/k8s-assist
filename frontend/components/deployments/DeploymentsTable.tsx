'use client';

import { useRouter } from 'next/navigation';
import { Deployment } from '../../types/k8s';
import Table from '../shared/Table';

interface DeploymentsTableProps {
  deployments: Deployment[];
}

export default function DeploymentsTable({ deployments }: DeploymentsTableProps) {
  const router = useRouter();

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (deployment: Deployment) => (
        <div>
          <div className="font-medium text-gray-900">{deployment.name}</div>
          <div className="text-sm text-gray-500">{deployment.namespace}</div>
        </div>
      ),
    },
    {
      key: 'replicas',
      header: 'Replicas',
      render: (deployment: Deployment) => (
        <div className="text-sm text-gray-900">
          {deployment.readyReplicas || 0}/{deployment.replicas}
        </div>
      ),
    },
    {
      key: 'available',
      header: 'Available',
      render: (deployment: Deployment) => (
        <div className="text-sm text-gray-900">{deployment.availableReplicas || 0}</div>
      ),
    },
    {
      key: 'updated',
      header: 'Updated',
      render: (deployment: Deployment) => (
        <div className="text-sm text-gray-900">{deployment.updatedReplicas || 0}</div>
      ),
    },
    {
      key: 'details',
      header: 'Details',
      render: (deployment: Deployment) => (
        <button
          type="button"
          onClick={() => router.push(`/deployments/${encodeURIComponent(deployment.namespace)}/${encodeURIComponent(deployment.name)}`)}
          className="rounded-md bg-slate-200 px-3 py-1 text-sm font-medium text-slate-900 transition hover:bg-slate-300"
        >
          View details
        </button>
      ),
    },
  ];

  return <Table data={deployments} columns={columns} />;
}