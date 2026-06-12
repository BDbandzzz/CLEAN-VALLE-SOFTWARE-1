import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from '@/core/context/AuthContext';
import { AlertProvider } from '@/core/providers/AlertProvider';
import { ReportsProvider } from '@/modules/reports/context/ReportsContext';

export function AppProviders({ children }) {
  return (
    <AlertProvider>
      <BrowserRouter>
        <AuthProvider>
          <ReportsProvider>{children}</ReportsProvider>
        </AuthProvider>
      </BrowserRouter>
    </AlertProvider>
  );
}
