'use client';

import { useEffect } from 'react';
import { useClusterStore } from '../../store/useClusterStore';
import EventsTable from '../../components/events/EventsTable';
import Loader from '../../components/shared/Loader';

export default function EventsPage() {
  const { events, loadingEvents, fetchEvents, selectedNamespace } = useClusterStore();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents, selectedNamespace]);

  if (loadingEvents) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Events</h1>
        <p className="text-gray-600">
          View Kubernetes events {selectedNamespace && `in namespace ${selectedNamespace}`}
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <EventsTable events={events} />
        </div>
      </div>
    </div>
  );
}