
import React, { useEffect } from 'react';
import { useWorkStore } from '../../store/workStore';
import { usePaymentStore } from '../../store/paymentStore';
import Table from '../../components/ui/Table/Table';
import { Work, Payment } from '../../types';
import { dateFormatter } from '../../utils/dateFormatter';

const AdminDashboard: React.FC = () => {
  const { works, fetchWorks, isLoading: worksLoading } = useWorkStore();
  const { payments, fetchPayments, isLoading: paymentsLoading } = usePaymentStore();

  useEffect(() => {
    fetchWorks({ page: 1, limit: 10 });
    fetchPayments({ page: 1, limit: 10 });
  }, [fetchWorks, fetchPayments]);

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-blue-100 text-blue-800',
      authorized: 'bg-green-100 text-green-800',
      exclusive: 'bg-purple-100 text-purple-800',
      rejected: 'bg-red-100 text-red-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
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

  const workColumns = [
    {
      key: 'title',
      header: 'Title',
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
      render: (value: string[]) => value.join(', '),
    },
    {
      key: 'status',
      header: 'Status',
      render: (value: string) => getStatusBadge(value),
    },
    {
      key: 'createdAt',
      header: 'Registered',
      render: (value: string) => dateFormatter.formatDate(value),
    },
  ];

  const paymentColumns = [
    {
      key: 'id',
      header: 'Payment ID',
      render: (value: string) => (
        <span className="font-mono text-sm">{value.substring(0, 8)}...</span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (value: number, payment: Payment) => (
        <span>${(value / 100).toFixed(2)} {payment.currency.toUpperCase()}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (value: string) => getStatusBadge(value),
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (value: string) => dateFormatter.formatDate(value),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage users, works, and payments across the platform.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Works</dt>
                    <dd className="text-lg font-medium text-gray-900">{works.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-green-500 rounded-md flex items-center justify-center">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Authorized Works</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {works.filter(w => w.status === 'authorized' || w.status === 'exclusive').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending Works</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {works.filter(w => w.status === 'pending').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Payments</dt>
                    <dd className="text-lg font-medium text-gray-900">{payments.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Works */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Works</h2>
          </div>
          <div className="px-6 py-6">
            <Table
              data={works.slice(0, 5)}
              columns={workColumns}
              isLoading={worksLoading}
              emptyMessage="No works found."
            />
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Payments</h2>
          </div>
          <div className="px-6 py-6">
            <Table
              data={payments.slice(0, 5)}
              columns={paymentColumns}
              isLoading={paymentsLoading}
              emptyMessage="No payments found."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
