'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiClient } from '../../../../lib/api';
import { Deployment, Pod } from '../../../../types/k8s';
import Loader from '../../../../components/shared/Loader';

export default function DeploymentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const deploymentName = params.name as string;
  const namespace = params.namespace as string;
  const [deployment, setDeployment] = useState<Deployment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionState, setActionState] = useState<string | null>(null);
  const [pods, setPods] = useState<Pod[]>([]);
  const [podsLoading, setPodsLoading] = useState(true);
  const [podsError, setPodsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeployment = async () => {
      try {
        const deploymentData = await apiClient.getDeploymentDetails(deploymentName, namespace);
        setDeployment(deploymentData);
      } catch (err) {
        console.error('Failed to fetch deployment details:', err);
        setError('Failed to load deployment details');
      } finally {
        setLoading(false);
      }
    };

    if (deploymentName && namespace) {
      fetchDeployment();
    }
  }, [deploymentName, namespace]);

  useEffect(() => {
    const fetchPods = async () => {
      if (!namespace) return;

      setPodsLoading(true);
      setPodsError(null);

      try {
        const namespacePods = await apiClient.getPods(namespace);
        setPods(namespacePods);
      } catch (err) {
        console.error('Failed to fetch namespace pods:', err);
        setPodsError('Failed to load pods in this namespace');
      } finally {
        setPodsLoading(false);
      }
    };

    fetchPods();
  }, [namespace]);

  const handleScale = async () => {
    if (!deployment) return;

    const currentReplicas = deployment.replicas ?? 0;
    const replicas = prompt('Enter new replica count:', currentReplicas.toString());
    if (!replicas || isNaN(Number(replicas))) return;

    setActionState('scaling');
    try {
      await apiClient.scaleDeployment(deployment.name, Number(replicas), deployment.namespace);
      router.refresh();
    } catch (err) {
      console.error('Failed to scale deployment:', err);
      alert('Failed to scale deployment');
    } finally {
      setActionState(null);
    }
  };

  const handleRestart = async () => {
    if (!deployment) return;

    if (!confirm(`Restart deployment ${deployment.name}?`)) return;

    setActionState('restarting');
    try {
      await apiClient.restartDeployment(deployment.name, deployment.namespace);
      router.refresh();
    } catch (err) {
      console.error('Failed to restart deployment:', err);
      alert('Failed to restart deployment');
    } finally {
      setActionState(null);
    }
  };

  const handleDelete = async () => {
    if (!deployment) return;
    if (!confirm(`Delete deployment ${deployment.name}?`)) return;

    setActionState('deleting');
    try {
      await apiClient.deleteDeployment(deployment.name, deployment.namespace);
      router.push('/deployments');
    } catch (err) {
      console.error('Failed to delete deployment:', err);
      alert('Failed to delete deployment');
    } finally {
      setActionState(null);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error || !deployment) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error || 'Deployment not found'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{deployment.name}</h1>
        <p className="text-gray-600">Deployment details for namespace {deployment.namespace}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Deployment information</h2>
            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <span className="font-medium text-gray-900">Namespace: </span>
                {deployment.namespace}
              </div>
              <div>
                <span className="font-medium text-gray-900">Replicas: </span>
                {(deployment.readyReplicas || 0)}/{deployment.replicas ?? 0}
              </div>
              <div>
                <span className="font-medium text-gray-900">Available: </span>
                {deployment.availableReplicas || 0}
              </div>
              <div>
                <span className="font-medium text-gray-900">Updated: </span>
                {deployment.updatedReplicas || 0}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Actions</h2>
                <p className="text-sm text-gray-500">Manage this deployment</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleScale}
                  disabled={actionState !== null}
                  className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {actionState === 'scaling' ? 'Scaling...' : 'Scale'}
                </button>
                <button
                  onClick={handleRestart}
                  disabled={actionState !== null}
                  className="inline-flex items-center px-4 py-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-50"
                >
                  {actionState === 'restarting' ? 'Restarting...' : 'Restart'}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={actionState !== null}
                  className="inline-flex items-center px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {actionState === 'deleting' ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm text-gray-700">
                Use this page to inspect the deployment and manage its lifecycle. Scaling will update the replica count, restart will trigger a rollout, and delete will remove the deployment.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Namespace Pods</h2>
                <p className="text-sm text-gray-500">Pods in the same namespace</p>
              </div>
              <button
                type="button"
                onClick={() => router.push('/pods')}
                className="rounded-md bg-slate-200 px-3 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-300"
              >
                View all pods
              </button>
            </div>

            {podsLoading ? (
              <div className="mt-4 text-sm text-gray-500">Loading pods…</div>
            ) : podsError ? (
              <div className="mt-4 text-sm text-red-600">{podsError}</div>
            ) : pods.length === 0 ? (
              <div className="mt-4 text-sm text-gray-500">No pods found in this namespace.</div>
            ) : (
              <div className="mt-4 space-y-3">
                {pods.slice(0, 5).map((pod) => (
                  <button
                    key={pod.name}
                    type="button"
                    onClick={() => router.push(`/pods/${encodeURIComponent(pod.namespace)}/${encodeURIComponent(pod.name)}`)}
                    className="w-full text-left rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 transition hover:border-slate-300 hover:bg-slate-200"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{pod.name}</p>
                        <p className="text-xs text-slate-500">Status: {pod.status}</p>
                      </div>
                      <span className="text-xs text-slate-700">Details</span>
                    </div>
                  </button>
                ))}
                {pods.length > 5 && (
                  <div className="text-sm text-gray-500">And {pods.length - 5} more pods in namespace {namespace}.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
