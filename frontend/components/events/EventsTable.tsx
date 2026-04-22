'use client';

import { Event } from '../../types/k8s';
import Table from '../shared/Table';

interface EventsTableProps {
  events: Event[];
}

export default function EventsTable({ events }: EventsTableProps) {
  const getEventTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'normal':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    {
      key: 'type',
      header: 'Type',
      render: (event: Event) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
          {event.type}
        </span>
      ),
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (event: Event) => (
        <div className="font-medium text-gray-900">{event.reason}</div>
      ),
    },
    {
      key: 'message',
      header: 'Message',
      render: (event: Event) => (
        <div className="text-sm text-gray-900 max-w-md truncate">{event.message}</div>
      ),
    },
    {
      key: 'object',
      header: 'Object',
      render: (event: Event) => (
        <div>
          <div className="font-medium text-gray-900">{event.name}</div>
          <div className="text-sm text-gray-500">{event.kind} • {event.namespace}</div>
        </div>
      ),
    },
    {
      key: 'count',
      header: 'Count',
      render: (event: Event) => (
        <div className="text-sm text-gray-900">{event.count}</div>
      ),
    },
    {
      key: 'timestamp',
      header: 'Last Seen',
      render: (event: Event) => (
        <div className="text-sm text-gray-900">
          {new Date(event.lastTimestamp).toLocaleString()}
        </div>
      ),
    },
  ];

  return <Table data={events} columns={columns} />;
}