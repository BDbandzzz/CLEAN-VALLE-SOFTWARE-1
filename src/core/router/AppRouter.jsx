import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { AUTH_PATHS } from '@/core/constants/authRoutes';
import { USER_ROLE_IDS } from '@/core/constants/domainConstants';
import { HomeRedirect } from '@/core/router/HomeRedirect';
import PrivateRoute from '@/core/router/PrivateRoute';
import InvitationPasswordPage from '@/modules/auth/pages/InvitationPasswordPage';
import LoginPage from '@/modules/auth/pages/LoginPage';
import RecoverPassword from '@/modules/auth/pages/RecoverPassword';
import ResetPasswordPage from '@/modules/auth/pages/ResetPasswordPage';
import LandingPage from '@/modules/landing/pages/LandingPage';
import LocationManagementPage from '@/modules/locations-admin/pages/LocationManagementPage';
import { LocationManagementProvider } from '@/modules/locations-admin/context/LocationManagementContext';
import ManagerReportDetailPage from '@/modules/manager-reports/pages/ManagerReportDetailPage';
import ManagerReportsPage from '@/modules/manager-reports/pages/ManagerReportsPage';
import ManagerResolutionReviewPage from '@/modules/manager-reports/pages/ManagerResolutionReviewPage';
import NotificationsPage from '@/modules/notifications/pages/NotificationsPage';
import OperatorDashboardPage from '@/modules/operator/pages/OperatorDashboardPage';
import OperatorResolutionPage from '@/modules/operator/pages/OperatorResolutionPage';
import ProfilePage from '@/modules/profile/pages/ProfilePage';
import CreateReportPage from '@/modules/reports/pages/CreateReportPage';
import ResolvedReportsPage from '@/modules/reports/pages/ResolvedReportsPage';
import ViewReportsPage from '@/modules/reports/pages/ViewReportsPage';
import ReportTypeManagementPage from '@/modules/report-types-admin/pages/ReportTypeManagementPage';
import { ReportTypeManagementProvider } from '@/modules/report-types-admin/context/ReportTypeManagementContext';
import ChangePasswordPage from '@/modules/security/pages/ChangePasswordPage';
import SpecializationManagementPage from '@/modules/specializations-admin/pages/SpecializationManagementPage';
import UserManagementPage from '@/modules/users-admin/pages/UserManagementPage';
import { UserManagementProvider } from '@/modules/users-admin/context/UserManagementContext';

const REPORTER_ROLE_IDS = [USER_ROLE_IDS.STUDENT, USER_ROLE_IDS.TEACHER];
const AdminDashboardPage = lazy(
  () => import('@/modules/dashboard-admin/pages/AdminDashboardPage')
);
const ManagerDashboardPage = lazy(
  () => import('@/modules/dashboard-manager/pages/ManagerDashboardPage')
);

function DashboardLoader({ children }) {
  return (
    <Suspense
      fallback={
        <div className="py-16 text-center text-sm text-muted-foreground">
          Cargando panel...
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path={AUTH_PATHS.login} element={<LoginPage />} />
      <Route path={AUTH_PATHS.recoverPassword} element={<RecoverPassword />} />
      <Route path={AUTH_PATHS.resetPassword} element={<ResetPasswordPage />} />
      <Route path={AUTH_PATHS.createPassword} element={<InvitationPasswordPage />} />
      <Route path="/public/reports/resolved" element={<ResolvedReportsPage />} />

      <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
      <Route path="/change-password" element={<PrivateRoute element={<ChangePasswordPage />} />} />
      <Route path="/notifications" element={<PrivateRoute element={<NotificationsPage />} />} />
      <Route path="/reports/resolved" element={<PrivateRoute element={<ResolvedReportsPage />} />} />
      <Route
        path="/reports/create"
        element={
          <PrivateRoute
            allowedRoleIds={REPORTER_ROLE_IDS}
            element={<CreateReportPage />}
          />
        }
      />
      <Route
        path="/reports/view"
        element={
          <PrivateRoute
            allowedRoleIds={REPORTER_ROLE_IDS}
            element={<ViewReportsPage />}
          />
        }
      />

      <Route
        path="/operator"
        element={
          <PrivateRoute
            allowedRoleIds={[USER_ROLE_IDS.OPERATOR]}
            element={<OperatorDashboardPage />}
          />
        }
      />
      <Route
        path="/operator/reports/:reportId/resolution"
        element={
          <PrivateRoute
            allowedRoleIds={[USER_ROLE_IDS.OPERATOR]}
            element={<OperatorResolutionPage />}
          />
        }
      />

      <Route
        path="/manager"
        element={
          <PrivateRoute
            allowedRoleIds={[USER_ROLE_IDS.MANAGER]}
            element={
              <DashboardLoader>
                <ManagerDashboardPage />
              </DashboardLoader>
            }
          />
        }
      />
      <Route
        path="/manager/reports"
        element={
          <PrivateRoute
            allowedRoleIds={[USER_ROLE_IDS.MANAGER]}
            element={<ManagerReportsPage />}
          />
        }
      />
      <Route
        path="/manager/reports/:reportId"
        element={
          <PrivateRoute
            allowedRoleIds={[USER_ROLE_IDS.MANAGER]}
            element={<ManagerReportDetailPage />}
          />
        }
      />
      <Route
        path="/manager/resolutions"
        element={
          <PrivateRoute
            allowedRoleIds={[USER_ROLE_IDS.MANAGER]}
            element={<ManagerResolutionReviewPage />}
          />
        }
      />

      <Route
        path="/admin"
        element={
          <PrivateRoute
            allowedRoleIds={[USER_ROLE_IDS.ADMIN]}
            element={
              <DashboardLoader>
                <AdminDashboardPage />
              </DashboardLoader>
            }
          />
        }
      />
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

      <Route path="/home" element={<PrivateRoute element={<HomeRedirect />} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
