
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Layout from '../components/Layout';

// Public pages
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';

// Protected pages
import Dashboard from '../pages/Dashboard/Dashboard';
import RegisterWork from '../pages/RegisterWork/RegisterWork';
import Search from '../pages/Search/Search';
import Payments from '../pages/Payments/Payments';
import PaymentConfirmation from '../pages/PaymentConfirmation/PaymentConfirmation';
import MyWorks from '../pages/MyWorks/MyWorks';

// Admin pages
import AdminDashboard from '../pages/Admin/AdminDashboard';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="register-work" element={<RegisterWork />} />
        <Route path="search" element={<Search />} />
        <Route path="my-works" element={<MyWorks />} />
        <Route path="payments" element={<Payments />} />
        <Route path="payment-confirmation" element={<PaymentConfirmation />} />
      </Route>

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
