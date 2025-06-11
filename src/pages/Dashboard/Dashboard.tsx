
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useWorkStore } from '../../store/workStore';
import { usePaymentStore } from '../../store/paymentStore';
import Button from '../../components/ui/Button/Button';
import { dateFormatter } from '../../utils/dateFormatter';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { works, fetchWorks, isLoading: worksLoading } = useWorkStore();
  const { payments, fetchPayments, isLoading: paymentsLoading } = usePaymentStore();

  useEffect(() => {
    fetchWorks({ page: 1, limit: 5 });
    fetchPayments({ page: 1, limit: 5 });
  }, [fetchWorks, fetchPayments]);

  const recentWorks = works.slice(0, 3);
  const recentPayments = payments.slice(0, 3);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8 bg-white">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your music works, track payments, and protect your creative rights.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Works */}
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
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Works
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {works.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Authorized Works */}
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
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Authorized
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {works.filter(w => w.status === 'authorized' || w.status === 'exclusive').length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Works */}
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
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Pending
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {works.filter(w => w.status === 'pending').length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Payments */}
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
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Payments
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {payments.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Link to="/register-work">
                  <Button className="w-full" size="lg">
                    Register New Work
                  </Button>
                </Link>
                <Link to="/search">
                  <Button variant="outline" className="w-full" size="lg">
                    Search Works
                  </Button>
                </Link>
                <Link to="/payments">
                  <Button variant="outline" className="w-full" size="lg">
                    View Payments
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Recent Works */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Recent Works
                  </h3>
                  <Link to="/my-works" className="text-blue-600 hover:text-blue-500 text-sm">
                    View all
                  </Link>
                </div>
                {worksLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : recentWorks.length > 0 ? (
                  <div className="space-y-4">
                    {recentWorks.map((work) => (
                      <div key={work.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {work.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {dateFormatter.formatRelativeTime(work.createdAt)}
                          </p>
                        </div>
                        {getStatusBadge(work.status)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No works registered yet.</p>
                )}
              </div>
            </div>

            {/* Recent Payments */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Recent Payments
                  </h3>
                  <Link to="/payments" className="text-blue-600 hover:text-blue-500 text-sm">
                    View all
                  </Link>
                </div>
                {paymentsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : recentPayments.length > 0 ? (
                  <div className="space-y-4">
                    {recentPayments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            ${payment.amount / 100} {payment.currency.toUpperCase()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {dateFormatter.formatRelativeTime(payment.createdAt)}
                          </p>
                        </div>
                        {getStatusBadge(payment.status)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No payments yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
