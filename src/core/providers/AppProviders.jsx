import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from '@/core/context/AuthContext';
import { ReportsProvider } from '@/modules/reports/context/ReportsContext';

export function AppProviders({ children }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ReportsProvider>{children}</ReportsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
