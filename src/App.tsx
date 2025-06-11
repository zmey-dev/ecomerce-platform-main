
import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';
import { ToastProvider } from './components/ui/Toast/Toast';
import AppRoutes from './router/routes';

const queryClient = new QueryClient();

const App: React.FC = () => {
  const { loadUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Load user on app initialization if token exists
    if (localStorage.getItem('authToken')) {
      loadUser();
    }
  }, [loadUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
