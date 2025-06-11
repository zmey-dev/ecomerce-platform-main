
import React, { useEffect, useState } from 'react';
import { usePaymentStore } from '../../store/paymentStore';
import { useToast } from '../../components/ui/Toast/Toast';
import Button from '../../components/ui/Button/Button';
import Table from '../../components/ui/Table/Table';
import Pagination from '../../components/ui/Pagination/Pagination';
import { Payment } from '../../types';
import { dateFormatter } from '../../utils/dateFormatter';

const Payments: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { payments, fetchPayments, createPayment, pagination, isLoading } = usePaymentStore();
  const { showToast } = useToast();

  useEffect(() => {
    fetchPayments({
      page: currentPage,
      limit: 10,
      sortBy,
      sortOrder,
    });
  }, [currentPage, sortBy, sortOrder, fetchPayments]);

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortBy(key);
    setSortOrder(direction);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreatePayment = async (type: 'subscription' | 'single') => {
    try {
      const paymentData = {
        amount: type === 'subscription' ? 2999 : 999, // $29.99 or $9.99
        currency: 'usd',
        paymentMethod: 'mercado_pago' as const,
        description: type === 'subscription' ? 'Monthly Subscription' : 'Single Work Registration',
      };

      const checkoutUrl = await createPayment(paymentData);
      
      // Open Mercado Pago checkout in new tab
      window.open(checkoutUrl, '_blank');
      
      showToast({
        type: 'info',
        title: 'Payment Processing',
        message: 'You will be redirected to Mercado Pago to complete your payment.',
      });
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Payment Failed',
        message: error.response?.data?.message || 'Failed to create payment. Please try again.',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
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

  const columns = [
    {
      key: 'id',
      header: 'Payment ID',
      render: (value: string) => (
        <span className="font-mono text-sm text-gray-900">
          {value.substring(0, 8)}...
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      render: (value: number, payment: Payment) => (
        <span className="font-medium text-gray-900">
          ${(value / 100).toFixed(2)} {payment.currency.toUpperCase()}
        </span>
      ),
    },
    {
      key: 'paymentMethod',
      header: 'Method',
      render: (value: string) => (
        <span className="text-sm text-gray-600 capitalize">
          {value.replace('_', ' ')}
        </span>
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
      header: 'Created',
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Payment Options */}
        <div className="mb-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Payment Plans</h2>
              <p className="mt-1 text-gray-600">
                Choose a payment plan that works for you.
              </p>
            </div>

            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Single Payment */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900">Single Work Registration</h3>
                  <p className="mt-2 text-gray-600">
                    Perfect for registering individual works.
                  </p>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-gray-900">$9.99</span>
                    <span className="text-gray-600">/work</span>
                  </div>
                  <div className="mt-6">
                    <Button
                      onClick={() => handleCreatePayment('single')}
                      isLoading={isLoading}
                      className="w-full"
                    >
                      Pay for Single Work
                    </Button>
                  </div>
                </div>

                {/* Subscription */}
                <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">Monthly Subscription</h3>
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Popular
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600">
                    Unlimited work registrations and premium features.
                  </p>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-gray-900">$29.99</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <div className="mt-6">
                    <Button
                      onClick={() => handleCreatePayment('subscription')}
                      isLoading={isLoading}
                      className="w-full"
                    >
                      Start Subscription
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
            <p className="mt-1 text-gray-600">
              View and manage your payment history and subscriptions.
            </p>
          </div>

          <div className="px-6 py-6">
            {payments.length > 0 || isLoading ? (
              <>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    {pagination.total} payments found
                  </p>
                </div>

                <Table
                  data={payments}
                  columns={columns}
                  onSort={handleSort}
                  sortBy={sortBy}
                  sortDirection={sortOrder}
                  isLoading={isLoading}
                  emptyMessage="No payments found."
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No payments yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Your payment history will appear here once you make your first payment.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
