'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Deployment } from '../../types/k8s';
import Table from '../shared/Table';

interface DeploymentsTableProps {
  deployments: Deployment[];
}

export default function DeploymentsTable({ deployments }: DeploymentsTableProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(deployments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDeployments = deployments.slice(startIndex, endIndex);

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (deployment: Deployment) => (
        <div>
          <div className="font-medium text-gray-900">{deployment.name}</div>
          <div className="text-sm text-gray-500">{deployment.namespace}</div>
        </div>
      ),
    },
    {
      key: 'replicas',
      header: 'Replicas',
      render: (deployment: Deployment) => (
        <div className="text-sm text-gray-900">
          {deployment.readyReplicas || 0}/{deployment.replicas}
        </div>
      ),
    },
    {
      key: 'available',
      header: 'Available',
      render: (deployment: Deployment) => (
        <div className="text-sm text-gray-900">{deployment.availableReplicas || 0}</div>
      ),
    },
    {
      key: 'updated',
      header: 'Updated',
      render: (deployment: Deployment) => (
        <div className="text-sm text-gray-900">{deployment.updatedReplicas || 0}</div>
      ),
    },
    {
      key: 'details',
      header: 'Details',
      render: (deployment: Deployment) => (
        <button
          type="button"
          onClick={() => router.push(`/deployments/${encodeURIComponent(deployment.namespace)}/${encodeURIComponent(deployment.name)}`)}
          className="rounded-md bg-slate-200 px-3 py-1 text-sm font-medium text-slate-900 transition hover:bg-slate-300"
        >
          View details
        </button>
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
      <Table data={currentDeployments} columns={columns} />
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
                Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(endIndex, deployments.length)}</span> of{' '}
                <span className="font-medium">{deployments.length}</span> results
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