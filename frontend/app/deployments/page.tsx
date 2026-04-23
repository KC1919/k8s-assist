'use client';

import { useEffect } from 'react';
import { useClusterStore } from '../../store/useClusterStore';
import DeploymentsTable from '../../components/deployments/DeploymentsTable';
import Loader from '../../components/shared/Loader';

export default function DeploymentsPage() {
  const { deployments, loadingDeployments, fetchDeployments, selectedNamespace } = useClusterStore();

  useEffect(() => {
    if (selectedNamespace) {
      fetchDeployments();
    }
  }, [fetchDeployments, selectedNamespace]);


  if (loadingDeployments) {
    return <Loader />;
  }

  if (!selectedNamespace) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deployments</h1>
          <p className="text-gray-600">Manage your Kubernetes deployments</p>
        </div>
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center py-8">
              <p className="text-gray-500">Please select a namespace to view deployments.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Deployments</h1>
        <p className="text-gray-600">
          Manage your Kubernetes deployments {selectedNamespace && `in namespace ${selectedNamespace}`}
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <DeploymentsTable deployments={deployments} />
        </div>
      </div>
    </div>
  );
}