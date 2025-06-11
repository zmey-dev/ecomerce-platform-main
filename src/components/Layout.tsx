
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Header from './layout/Header/Header';
import Footer from './layout/Footer/Footer';

const Layout: React.FC = () => {
  const { loadUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      loadUser();
    }
  }, [isAuthenticated, loadUser]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
