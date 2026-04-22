'use client';

import { useEffect } from 'react';
import { useClusterStore } from '../../store/useClusterStore';
import PodsTable from '../../components/pods/PodsTable';
import Loader from '../../components/shared/Loader';

export default function PodsPage() {
  const { pods, loadingPods, fetchPods, selectedNamespace } = useClusterStore();

  useEffect(() => {
    if (selectedNamespace) {
      fetchPods();
    }
  }, [fetchPods, selectedNamespace]);

  const handlePodDeleted = () => {
    if (selectedNamespace) {
      fetchPods();
    }
  };

  if (!selectedNamespace) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pods</h1>
          <p className="text-gray-600">Manage your Kubernetes pods</p>
        </div>
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center py-8">
              <p className="text-gray-500">Please select a namespace to view pods.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loadingPods) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pods</h1>
        <p className="text-gray-600">
          Manage your Kubernetes pods {selectedNamespace && `in namespace ${selectedNamespace}`}
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <PodsTable pods={pods} onPodDeleted={handlePodDeleted} />
        </div>
      </div>
    </div>
  );
}