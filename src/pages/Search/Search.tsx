
import React, { useState, useEffect } from 'react';
import { useWorkStore } from '../../store/workStore';
import Button from '../../components/ui/Button/Button';
import Input from '../../components/ui/Input/Input';
import Select from '../../components/ui/Select/Select';
import Table from '../../components/ui/Table/Table';
import Pagination from '../../components/ui/Pagination/Pagination';
import { Work, SearchFilters } from '../../types';
import { dateFormatter } from '../../utils/dateFormatter';
import { WORK_STATUS } from '../../utils/constants';

const Search: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    author: '',
    upcCode: '',
    status: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { searchResults, searchWorks, pagination, isLoading } = useWorkStore();

  useEffect(() => {
    handleSearch();
  }, [currentPage, sortBy, sortOrder]);

  const handleSearch = () => {
    searchWorks(filters, {
      page: currentPage,
      limit: 10,
      sortBy,
      sortOrder,
    });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: WORK_STATUS.PENDING, label: 'Pending' },
    { value: WORK_STATUS.PAID, label: 'Paid' },
    { value: WORK_STATUS.AUTHORIZED, label: 'Authorized' },
    { value: WORK_STATUS.EXCLUSIVE, label: 'Exclusive' },
    { value: WORK_STATUS.REJECTED, label: 'Rejected' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Search Works</h1>
            <p className="mt-1 text-gray-600">
              Search through registered musical works in our database.
            </p>
          </div>

          {/* Search Filters */}
          <div className="px-6 py-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label="Search"
                name="query"
                value={filters.query || ''}
                onChange={handleFilterChange}
                placeholder="Title, description..."
              />

              <Input
                label="Author"
                name="author"
                value={filters.author || ''}
                onChange={handleFilterChange}
                placeholder="Author name"
              />

              <Input
                label="UPC Code"
                name="upcCode"
                value={filters.upcCode || ''}
                onChange={handleFilterChange}
                placeholder="UPC code"
              />

              <Select
                label="Status"
                name="status"
                value={filters.status || ''}
                onChange={handleFilterChange}
                options={statusOptions}
              />
            </div>

            <div className="mt-4 flex justify-end">
              <Button onClick={handleSearch} isLoading={isLoading}>
                Search
              </Button>
            </div>
          </div>

          {/* Results */}
          <div className="px-6 py-6">
            {searchResults.length > 0 || isLoading ? (
              <>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    {pagination.total} results found
                  </p>
                </div>

                <Table
                  data={searchResults}
                  columns={columns}
                  onSort={handleSort}
                  sortBy={sortBy}
                  sortDirection={sortOrder}
                  isLoading={isLoading}
                  emptyMessage="No works found matching your search criteria."
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
                    d="M21 21l-6-6m2-5a7 7 0 11-7 7 7 7 0 017-7z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No results</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search criteria to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
