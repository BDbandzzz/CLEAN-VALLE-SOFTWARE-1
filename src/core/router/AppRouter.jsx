import { Navigate, Route, Routes } from 'react-router-dom';

import LandingPage from '@/modules/landing/pages/LandingPage';
import LoginPage from '@/modules/auth/pages/LoginPage';
import RecoverPassword from '@/modules/auth/pages/RecoverPassword';
import ProfilePage from '@/modules/profile/pages/ProfilePage';
import ChangePasswordPage from '@/modules/security/pages/ChangePasswordPage';
import CreateReportPage from '@/modules/reports/pages/CreateReportPage';
import ViewReportsPage from '@/modules/reports/pages/ViewReportsPage';
import NotificationsPage from '@/modules/notifications/pages/NotificationsPage';
import OperatorDashboardPage from '@/modules/operator/pages/OperatorDashboardPage';
import OperatorResolutionPage from '@/modules/operator/pages/OperatorResolutionPage';
import AdminDashboardPage from '@/modules/admin/pages/AdminDashboardPage';
import UserManagementPage from '@/modules/admin/users/pages/UserManagementPage';
import ReportTypeManagementPage from '@/modules/admin/report-types/pages/ReportTypeManagementPage';
import PrivateRoute from '@/core/router/PrivateRoute';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/recover-pass" element={<RecoverPassword />} />

      <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
      <Route path="/change-password" element={<PrivateRoute element={<ChangePasswordPage />} />} />
      <Route path="/reports/create" element={<PrivateRoute element={<CreateReportPage />} />} />
      <Route path="/reports/view" element={<PrivateRoute element={<ViewReportsPage />} />} />
      <Route path="/notifications" element={<PrivateRoute element={<NotificationsPage />} />} />
      <Route path="/operator" element={<PrivateRoute element={<OperatorDashboardPage />} />} />
      <Route path="/operator/reports/:reportId/resolution" element={<PrivateRoute element={<OperatorResolutionPage />} />} />
      <Route path="/admin" element={<PrivateRoute allowedRoles={['admin']} element={<AdminDashboardPage />} />} />
      <Route
        path="/admin/users"
        element={<PrivateRoute allowedRoles={['admin']} element={<UserManagementPage />} />}
      />
      <Route
        path="/admin/report-types"
        element={<PrivateRoute allowedRoles={['admin']} element={<ReportTypeManagementPage />} />}
      />

      <Route path="/home" element={<Navigate to="/reports/view" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
