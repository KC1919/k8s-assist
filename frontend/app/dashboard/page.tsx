'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useClusterStore } from '../../store/useClusterStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/shared/Card';
import Loader from '../../components/shared/Loader';

export default function Dashboard() {
  const router = useRouter();
  const {
    namespaces,
    pods,
    deployments,
    events,
    insights,
    selectedNamespace,
    loadingNamespaces,
    loadingPods,
    loadingDeployments,
    loadingEvents,
    loadingInsights,
    refreshAll,
  } = useClusterStore();

  // const fetchPods = useClusterStore().fetchPods(selectedNamespace!)

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const isLoading = loadingNamespaces || loadingPods || loadingDeployments || loadingEvents || loadingInsights;

  if (isLoading) {
    return <Loader />;
  }

  const criticalInsights = insights.filter(i => i.severity === 'High');
  const warningEvents = events.filter(e => e.type === 'Warning');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your Kubernetes cluster</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Namespaces</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{namespaces.length}</div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => router.push('/namespaces')}
                className="rounded-md bg-slate-200 px-3 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-300"
              >
                View namespaces
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pods.length}</div>
            <p className="text-xs text-muted-foreground">
              {pods.filter(p => p.status === 'Running').length} running
            </p>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => router.push('/pods')}
                className="rounded-md bg-slate-200 px-3 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-300"
              >
                View pods
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deployments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deployments.length}</div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => router.push('/deployments')}
                className="rounded-md bg-slate-200 px-3 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-300"
              >
                View deployments
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalInsights.length}</div>
            <p className="text-xs text-muted-foreground">Critical issues</p>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => router.push('/ai-insights')}
                className="rounded-md bg-slate-200 px-3 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-300"
              >
                View insights
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
          </CardHeader>
          <CardContent>
            {warningEvents.length === 0 ? (
              <p className="text-sm text-gray-500">No warning events</p>
            ) : (
              <div className="space-y-2">
                {warningEvents.slice(0, 5).map((event) => (
                  <div key={`${event.name}-${event.namespace}`} className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{event.reason}</p>
                      <p className="text-xs text-gray-500">{event.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <button
                type="button"
                onClick={() => router.push('/events')}
                className="rounded-md bg-slate-200 px-3 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-300"
              >
                View all events
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            {insights.length === 0 ? (
              <p className="text-sm text-gray-500">No insights available</p>
            ) : (
              <div className="space-y-2">
                {insights.slice(0, 5).map((insight, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className={`h-2 w-2 rounded-full mt-2 ${
                      insight.severity === 'High' ? 'bg-red-500' :
                      insight.severity === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{insight.issue}</p>
                      <p className="text-xs text-gray-500">{insight.suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <button
                type="button"
                onClick={() => router.push('/ai-insights')}
                className="rounded-md bg-slate-200 px-3 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-300"
              >
                View all insights
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}