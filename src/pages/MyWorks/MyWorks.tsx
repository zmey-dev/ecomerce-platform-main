
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWorkStore } from '../../store/workStore';
import Button from '../../components/ui/Button/Button';
import Table from '../../components/ui/Table/Table';
import Pagination from '../../components/ui/Pagination/Pagination';
import { Work } from '../../types';
import { dateFormatter } from '../../utils/dateFormatter';

const MyWorks: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { works, fetchWorks, pagination, isLoading } = useWorkStore();

  useEffect(() => {
    fetchWorks({
      page: currentPage,
      limit: 10,
      sortBy,
      sortOrder,
    });
  }, [currentPage, sortBy, sortOrder, fetchWorks]);

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortBy(key);
    setSortOrder(direction);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-blue-100 text-blue-800',
      authorized: 'bg-green-100 text-green-800',
      exclusive: 'bg-purple-100 text-purple-800',
      rejected: 'bg-red-100 text-red-800',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusStyles[status as keyof typeof statusStyles] || statusStyles.pending
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const columns = [
    {
      key: 'title',
      header: 'Title',
      sortable: true,
      render: (value: string, work: Work) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          {work.upcCode && (
            <p className="text-sm text-gray-500">UPC: {work.upcCode}</p>
          )}
        </div>
      ),
    },
    {
      key: 'authors',
      header: 'Authors',
      render: (value: string[]) => (
        <div>
          <p className="text-sm text-gray-900">{value.join(', ')}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value: string) => getStatusBadge(value),
    },
    {
      key: 'files',
      header: 'Files',
      render: (value: any[]) => (
        <span className="text-sm text-gray-600">{value.length} files</span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Registered',
      sortable: true,
      render: (value: string) => (
        <div>
          <p className="text-sm text-gray-900">
            {dateFormatter.formatDate(value)}
          </p>
          <p className="text-xs text-gray-500">
            {dateFormatter.formatRelativeTime(value)}
          </p>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (value: any, work: Work) => (
        <div className="flex space-x-2">
          <Button size="sm" variant="outline">
            View
          </Button>
          {work.status === 'pending' && (
            <Button size="sm" variant="outline">
              Edit
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Works</h1>
                <p className="mt-1 text-gray-600">
                  Manage your registered musical works and track their status.
                </p>
              </div>
              <Link to="/register-work">
                <Button>Register New Work</Button>
              </Link>
            </div>
          </div>

          <div className="px-6 py-6">
            {works.length > 0 || isLoading ? (
              <>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    {pagination.total} works registered
                  </p>
                </div>

                <Table
                  data={works}
                  columns={columns}
                  onSort={handleSort}
                  sortBy={sortBy}
                  sortDirection={sortOrder}
                  isLoading={isLoading}
                  emptyMessage="You haven't registered any works yet."
                />

                {pagination.totalPages > 1 && (
                  <div className="mt-6 flex justify-center">
                    <Pagination
                      currentPage={pagination.page}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 48 48"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No works yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by registering your first musical work.
                </p>
                <div className="mt-6">
                  <Link to="/register-work">
                    <Button>Register Your First Work</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyWorks;
