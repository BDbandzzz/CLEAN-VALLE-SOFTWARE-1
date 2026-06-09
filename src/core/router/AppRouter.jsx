import { Navigate, Route, Routes } from 'react-router-dom';

import { AUTH_PATHS } from '@/core/constants/authRoutes';
import { USER_ROLE_IDS } from '@/core/constants/domainConstants';
import LandingPage from '@/modules/landing/pages/LandingPage';
import LoginPage from '@/modules/auth/pages/LoginPage';
import RecoverPassword from '@/modules/auth/pages/RecoverPassword';
import ResetPasswordPage from '@/modules/auth/pages/ResetPasswordPage';
import ProfilePage from '@/modules/profile/pages/ProfilePage';
import ChangePasswordPage from '@/modules/security/pages/ChangePasswordPage';
import CreateReportPage from '@/modules/reports/pages/CreateReportPage';
import ViewReportsPage from '@/modules/reports/pages/ViewReportsPage';
import NotificationsPage from '@/modules/notifications/pages/NotificationsPage';
import OperatorDashboardPage from '@/modules/operator/pages/OperatorDashboardPage';
import OperatorResolutionPage from '@/modules/operator/pages/OperatorResolutionPage';
import AdminDashboardPage from '@/modules/dashboard-admin/pages/AdminDashboardPage';
import UserManagementPage from '@/modules/users-admin/pages/UserManagementPage';
import { UserManagementProvider } from '@/modules/users-admin/context/UserManagementContext';
import ReportTypeManagementPage from '@/modules/report-types-admin/pages/ReportTypeManagementPage';
import { ReportTypeManagementProvider } from '@/modules/report-types-admin/context/ReportTypeManagementContext';
import LocationManagementPage from '@/modules/locations-admin/pages/LocationManagementPage';
import { LocationManagementProvider } from '@/modules/locations-admin/context/LocationManagementContext';
import SpecializationManagementPage from '@/modules/specializations-admin/pages/SpecializationManagementPage';
import PrivateRoute from '@/core/router/PrivateRoute';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path={AUTH_PATHS.login} element={<LoginPage />} />
      <Route path={AUTH_PATHS.recoverPassword} element={<RecoverPassword />} />
      <Route path={AUTH_PATHS.resetPassword} element={<ResetPasswordPage />} />

      <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
      <Route path="/change-password" element={<PrivateRoute element={<ChangePasswordPage />} />} />
      <Route path="/reports/create" element={<PrivateRoute element={<CreateReportPage />} />} />
      <Route path="/reports/view" element={<PrivateRoute element={<ViewReportsPage />} />} />
      <Route path="/notifications" element={<PrivateRoute element={<NotificationsPage />} />} />
      <Route path="/operator" element={<PrivateRoute element={<OperatorDashboardPage />} />} />
      <Route path="/operator/reports/:reportId/resolution" element={<PrivateRoute element={<OperatorResolutionPage />} />} />
      <Route path="/admin" element={<PrivateRoute allowedRoleIds={[USER_ROLE_IDS.ADMIN]} element={<AdminDashboardPage />} />} />
      <Route
        path="/admin/users"
        element={
          <PrivateRoute
            allowedRoleIds={[USER_ROLE_IDS.ADMIN]}
            element={
              <UserManagementProvider>
                <UserManagementPage />
              </UserManagementProvider>
            }
          />
        }
      />
      <Route
        path="/admin/report-types"
        element={
          <PrivateRoute
            allowedRoleIds={[USER_ROLE_IDS.ADMIN]}
            element={
              <ReportTypeManagementProvider>
                <ReportTypeManagementPage />
              </ReportTypeManagementProvider>
            }
          />
        }
      />
      <Route
        path="/admin/locations"
        element={
          <PrivateRoute
            allowedRoleIds={[USER_ROLE_IDS.ADMIN]}
            element={
              <LocationManagementProvider>
                <LocationManagementPage />
              </LocationManagementProvider>
            }
          />
        }
      />
      <Route
        path="/admin/specializations"
        element={
          <PrivateRoute
            allowedRoleIds={[USER_ROLE_IDS.ADMIN]}
            element={<SpecializationManagementPage />}
          />
        }
      />

      <Route path="/home" element={<Navigate to="/reports/view" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
