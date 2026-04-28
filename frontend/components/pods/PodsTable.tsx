'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Pod } from '../../types/k8s';
import { apiClient } from '../../lib/api';
import Table from '../shared/Table';
import PodsStatusBadge from './PodsStatusBadge';

interface PodsTableProps {
  pods: Pod[];
  onPodDeleted?: () => void;
}

export default function PodsTable({ pods, onPodDeleted }: PodsTableProps) {
  const router = useRouter();
  const [deletingPod, setDeletingPod] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(pods.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPods = pods.slice(startIndex, endIndex);

  const handleDeletePod = async (pod: Pod) => {
    if (!confirm(`Are you sure you want to delete pod ${pod.name}?`)) return;

    setDeletingPod(pod.name);
    try {
      await apiClient.deletePod(pod.name, pod.namespace);
      onPodDeleted?.();
    } catch (error) {
      console.error('Failed to delete pod:', error);
      alert('Failed to delete pod');
    } finally {
      setDeletingPod(null);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (pod: Pod) => (
        <div>
          <div className="font-medium text-gray-900">{pod.name}</div>
          <div className="text-sm text-gray-500">{pod.namespace}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (pod: Pod) => <PodsStatusBadge status={pod.status} />,
    },
    {
      key: 'containers',
      header: 'Containers',
      render: (pod: Pod) => (
        <div className="text-sm text-gray-900">
          {pod.containers.length} container{pod.containers.length !== 1 ? 's' : ''}
        </div>
      ),
    },
    {
      key: 'node',
      header: 'Node',
      render: (pod: Pod) => (
        <div className="text-sm text-gray-900">{pod.nodeName}</div>
      ),
    },
    {
      key: 'restarts',
      header: 'Restarts',
      render: (pod: Pod) => (
        <div className="text-sm text-gray-900">{pod.restartCount || 0}</div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (pod: Pod) => (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => router.push(`/pods/${encodeURIComponent(pod.namespace)}/${encodeURIComponent(pod.name)}`)}
            className="rounded-md bg-slate-100 px-2 py-1 text-sm font-medium text-slate-900 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 cursor-pointer"
          >
            View
          </button>
          <button
            type="button"
            onClick={() => handleDeletePod(pod)}
            disabled={deletingPod === pod.name}
            className="rounded-md bg-slate-100 px-2 py-1 text-sm font-medium text-rose-700 transition hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            {deletingPod === pod.name ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      ),
    },
  ];

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div>
      <Table data={currentPods} columns={columns} />
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="flex justify-between flex-1 sm:hidden">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(endIndex, pods.length)}</span> of{' '}
                <span className="font-medium">{pods.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}