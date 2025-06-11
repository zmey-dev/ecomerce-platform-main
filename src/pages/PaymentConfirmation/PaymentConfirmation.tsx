
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { usePaymentStore } from '../../store/paymentStore';
import { useToast } from '../../components/ui/Toast/Toast';
import Button from '../../components/ui/Button/Button';

const PaymentConfirmation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | 'pending'>('pending');

  const { confirmPayment } = usePaymentStore();
  const { showToast } = useToast();

  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');

  useEffect(() => {
    const processPayment = async () => {
      if (!paymentId) {
        setPaymentStatus('failed');
        setIsProcessing(false);
        return;
      }

      try {
        if (status === 'approved') {
          await confirmPayment(paymentId);
          setPaymentStatus('success');
          showToast({
            type: 'success',
            title: 'Payment Successful',
            message: 'Your payment has been processed successfully.',
          });
        } else if (status === 'failure') {
          setPaymentStatus('failed');
          showToast({
            type: 'error',
            title: 'Payment Failed',
            message: 'Your payment could not be processed. Please try again.',
          });
        } else {
          setPaymentStatus('pending');
        }
      } catch (error: any) {
        setPaymentStatus('failed');
        showToast({
          type: 'error',
          title: 'Payment Error',
          message: error.response?.data?.message || 'An error occurred while processing your payment.',
        });
      } finally {
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [paymentId, status, confirmPayment, showToast]);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow rounded-lg p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Processing Payment
            </h2>
            <p className="mt-2 text-gray-600">
              Please wait while we confirm your payment...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white shadow rounded-lg p-6">
        <div className="text-center">
          {paymentStatus === 'success' && (
            <>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                Payment Successful!
              </h2>
              <p className="mt-2 text-gray-600">
                Your payment has been processed successfully. You can now access all premium features.
              </p>
              <div className="mt-6 space-y-3">
                <Link to="/dashboard" className="block">
                  <Button className="w-full">
                    Go to Dashboard
                  </Button>
                </Link>
                <Link to="/register-work" className="block">
                  <Button variant="outline" className="w-full">
                    Register New Work
                  </Button>
                </Link>
              </div>
            </>
          )}

          {paymentStatus === 'failed' && (
            <>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                Payment Failed
              </h2>
              <p className="mt-2 text-gray-600">
                We couldn't process your payment. Please check your payment method and try again.
              </p>
              <div className="mt-6 space-y-3">
                <Link to="/payments" className="block">
                  <Button className="w-full">
                    Try Again
                  </Button>
                </Link>
                <Link to="/dashboard" className="block">
                  <Button variant="outline" className="w-full">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            </>
          )}

          {paymentStatus === 'pending' && (
            <>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                <svg
                  className="h-6 w-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                Payment Pending
              </h2>
              <p className="mt-2 text-gray-600">
                Your payment is still being processed. We'll notify you once it's complete.
              </p>
              <div className="mt-6 space-y-3">
                <Link to="/payments" className="block">
                  <Button className="w-full">
                    Check Payment Status
                  </Button>
                </Link>
                <Link to="/dashboard" className="block">
                  <Button variant="outline" className="w-full">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
