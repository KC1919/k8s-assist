'use client';

import { useState } from 'react';
import { Deployment } from '../../types/k8s';
import { apiClient } from '../../lib/api';
import Table from '../shared/Table';

interface DeploymentsTableProps {
  deployments: Deployment[];
  onDeploymentUpdated?: () => void;
}

export default function DeploymentsTable({ deployments, onDeploymentUpdated }: DeploymentsTableProps) {
  const [scalingDeployment, setScalingDeployment] = useState<string | null>(null);
  const [restartingDeployment, setRestartingDeployment] = useState<string | null>(null);
  const [deletingDeployment, setDeletingDeployment] = useState<string | null>(null);

  const handleScaleDeployment = async (deployment: Deployment) => {
    const replicas = prompt(`Enter new replica count for ${deployment.name}:`, deployment.replicas.toString());
    if (!replicas || isNaN(Number(replicas))) return;

    setScalingDeployment(deployment.name);
    try {
      await apiClient.scaleDeployment(deployment.name, Number(replicas), deployment.namespace);
      onDeploymentUpdated?.();
    } catch (error) {
      console.error('Failed to scale deployment:', error);
      alert('Failed to scale deployment');
    } finally {
      setScalingDeployment(null);
    }
  };

  const handleRestartDeployment = async (deployment: Deployment) => {
    if (!confirm(`Are you sure you want to restart deployment ${deployment.name}?`)) return;

    setRestartingDeployment(deployment.name);
    try {
      await apiClient.restartDeployment(deployment.name, deployment.namespace);
      onDeploymentUpdated?.();
    } catch (error) {
      console.error('Failed to restart deployment:', error);
      alert('Failed to restart deployment');
    } finally {
      setRestartingDeployment(null);
    }
  };

  const handleDeleteDeployment = async (deployment: Deployment) => {
    if (!confirm(`Are you sure you want to delete deployment ${deployment.name}?`)) return;

    setDeletingDeployment(deployment.name);
    try {
      await apiClient.deleteDeployment(deployment.name, deployment.namespace);
      onDeploymentUpdated?.();
    } catch (error) {
      console.error('Failed to delete deployment:', error);
      alert('Failed to delete deployment');
    } finally {
      setDeletingDeployment(null);
    }
  };

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
      key: 'actions',
      header: 'Actions',
      render: (deployment: Deployment) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleScaleDeployment(deployment)}
            disabled={scalingDeployment === deployment.name}
            className="text-blue-600 hover:text-blue-900 disabled:opacity-50 text-sm"
          >
            {scalingDeployment === deployment.name ? 'Scaling...' : 'Scale'}
          </button>
          <button
            onClick={() => handleRestartDeployment(deployment)}
            disabled={restartingDeployment === deployment.name}
            className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50 text-sm"
          >
            {restartingDeployment === deployment.name ? 'Restarting...' : 'Restart'}
          </button>
          <button
            onClick={() => handleDeleteDeployment(deployment)}
            disabled={deletingDeployment === deployment.name}
            className="text-red-600 hover:text-red-900 disabled:opacity-50 text-sm"
          >
            {deletingDeployment === deployment.name ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      ),
    },
  ];

  return <Table data={deployments} columns={columns} />;
}