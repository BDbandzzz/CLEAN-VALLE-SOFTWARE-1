import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from '@/core/context/AuthContext';
import { ReportTypeManagementProvider } from '@/modules/admin/report-types/context/ReportTypeManagementContext';
import { UserManagementProvider } from '@/modules/admin/users/context/UserManagementContext';
import { ReportsProvider } from '@/modules/reports/context/ReportsContext';

export function AppProviders({ children }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserManagementProvider>
          <ReportTypeManagementProvider>
            <ReportsProvider>{children}</ReportsProvider>
          </ReportTypeManagementProvider>
        </UserManagementProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
