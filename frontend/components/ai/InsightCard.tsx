'use client';

import { useState } from 'react';
import { Insight, Action } from '../../types/k8s';
import { apiClient } from '../../lib/api';

interface InsightCardProps {
  insight: Insight;
  onActionExecuted?: () => void;
}

export default function InsightCard({ insight, onActionExecuted }: InsightCardProps) {
  const [executingAction, setExecutingAction] = useState<string | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'border-red-500 bg-red-50';
      case 'Medium':
        return 'border-yellow-500 bg-yellow-50';
      case 'Low':
        return 'border-green-500 bg-green-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const handleExecuteAction = async (action: Action) => {
    setExecutingAction(action.label);
    try {
      await apiClient.executeAction(action);
      onActionExecuted?.();
    } catch (error) {
      console.error('Failed to execute action:', error);
      alert('Failed to execute action');
    } finally {
      setExecutingAction(null);
    }
  };

  return (
    <div className={`rounded-lg border-l-4 p-4 ${getSeverityColor(insight.severity)}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-medium text-gray-900">{insight.issue}</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              insight.severity === 'High' ? 'bg-red-100 text-red-800' :
              insight.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {insight.severity}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600">{insight.reason}</p>
          <p className="mt-2 text-sm font-medium text-gray-900">{insight.suggestion}</p>
          {(insight.pod || insight.namespace) && (
            <div className="mt-2 text-xs text-gray-500">
              {insight.pod && `Pod: ${insight.pod}`}
              {insight.pod && insight.namespace && ' • '}
              {insight.namespace && `Namespace: ${insight.namespace}`}
            </div>
          )}
          {insight.timestamp && (
            <div className="mt-1 text-xs text-gray-500">
              {new Date(insight.timestamp).toLocaleString()}
            </div>
          )}
        </div>
      </div>

      {insight.actions && insight.actions.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Available Actions:</h4>
          <div className="flex flex-wrap gap-2">
            {insight.actions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleExecuteAction(action)}
                disabled={executingAction === action.label}
                className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {executingAction === action.label ? 'Executing...' : action.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}