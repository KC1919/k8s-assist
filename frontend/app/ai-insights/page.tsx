'use client';

import { useEffect } from 'react';
import { useClusterStore } from '../../store/useClusterStore';
import InsightCard from '../../components/ai/InsightCard';
import Loader from '../../components/shared/Loader';

export default function AIInsightsPage() {
  const { insights, loadingInsights, fetchInsights, selectedNamespace } = useClusterStore();

  useEffect(() => {
    if (selectedNamespace) {
      fetchInsights();
    }
  }, [fetchInsights, selectedNamespace]);

  const handleActionExecuted = () => {
    if (selectedNamespace) {
      fetchInsights();
    }
  };

  if (!selectedNamespace) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Insights</h1>
          <p className="text-gray-600">
            Intelligent analysis and recommendations for your Kubernetes cluster
          </p>
        </div>
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center py-8">
              <p className="text-gray-500">Please select a namespace to view AI insights.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loadingInsights) {
    return <Loader />;
  }

  const sortedInsights = [...insights].sort((a, b) => {
    const severityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Insights</h1>
        <p className="text-gray-600">
          Intelligent analysis and recommendations for your Kubernetes cluster {selectedNamespace && `in namespace ${selectedNamespace}`}
        </p>
      </div>

      {sortedInsights.length === 0 ? (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center">
              <p className="text-gray-500">No insights available at this time.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedInsights.map((insight, index) => (
            <InsightCard
              key={index}
              insight={insight}
              onActionExecuted={handleActionExecuted}
            />
          ))}
        </div>
      )}
    </div>
  );
}