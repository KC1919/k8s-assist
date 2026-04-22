'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Pod } from '../../../types/k8s';
import { apiClient } from '../../../lib/api';
import LogsViewer from '../../../components/logs/LogsViewer';
import Loader from '../../../components/shared/Loader';
import PodsStatusBadge from '../../../components/pods/PodsStatusBadge';

export default function PodDetailsPage() {
  const params = useParams();
  const podName = params.name as string;
  const namespace = params.namespace as string;
  const [pod, setPod] = useState<Pod | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPodDetails = async () => {
      try {
        const podData = await apiClient.getPodDetails(podName, namespace);
        setPod(podData);
      } catch (err) {
        console.error('Failed to fetch pod details:', err);
        setError('Failed to load pod details');
      } finally {
        setLoading(false);
      }
    };

    if (podName && namespace) {
      fetchPodDetails();
    }
  }, [podName, namespace]);

  if (loading) {
    return <Loader />;
  }

  if (error || !pod) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error || 'Pod not found'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{pod.name}</h1>
        <p className="text-gray-600">Pod details and logs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Pod Information</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="text-sm text-gray-900">{pod.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Namespace</dt>
                  <dd className="text-sm text-gray-900">{pod.namespace}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="text-sm text-gray-900">
                    <PodsStatusBadge status={pod.status} />
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Node</dt>
                  <dd className="text-sm text-gray-900">{pod.nodeName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Containers</dt>
                  <dd className="text-sm text-gray-900">{pod.containers.length}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Restarts</dt>
                  <dd className="text-sm text-gray-900">{pod.restartCount || 0}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Logs</h3>
              <LogsViewer pod={pod} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}