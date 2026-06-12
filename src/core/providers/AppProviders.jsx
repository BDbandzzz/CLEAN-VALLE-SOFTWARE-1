import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from '@/core/context/AuthContext';
import { AlertProvider } from '@/core/providers/AlertProvider';
import { NotificationProvider } from '@/modules/notifications/context/NotificationContext';
import { ReportsProvider } from '@/modules/reports/context/ReportsContext';

export function AppProviders({ children }) {
  return (
    <AlertProvider>
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <ReportsProvider>{children}</ReportsProvider>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </AlertProvider>
  );
}
