import { Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from '@/modules/auth/pages/LandingPage';
import LoginPage from '@/modules/auth/pages/LoginPage';
import ProfilePage from '@/modules/profile/pages/ProfilePage';
import AdminPage from '@/modules/admin/pages/AdminPage';
import OperativePage from '@/modules/operative/pages/OperativePage';
import ResolveReportPage from '@/modules/operative/pages/ResolveReportPage';
import RecoverPassword from '@/modules/auth/pages/RecoverPassword';
import CreateReportPage from '@/modules/reports/pages/CreateReportPage';
import ViewReportsPage from '@/modules/reports/pages/ViewReportsPage';
import ChangePasswordPage from '@/modules/security/pages/ChangePasswordPage';
import PrivateRoute from '@/core/router/PrivateRoute';

// Gestor Pages
import GestorReportsPage from '@/modules/gestor/pages/GestorReportsPage';
import GestorResolutionsPage from '@/modules/gestor/pages/GestorResolutionsPage';
import GestorAssignmentsPage from '@/modules/gestor/pages/GestorAssignmentsPage';

const AppRouter = () => {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/recover-pass" element={<RecoverPassword />} />

      {/* Privadas – perfil y admin */}
      <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
      <Route path="/admin" element={<PrivateRoute element={<AdminPage />} />} />
      {/* Privadas – operativa */}
      <Route path="/operative" element={<PrivateRoute element={<OperativePage />} />} />
      <Route path="/operative/resolve/:reportId" element={<PrivateRoute element={<ResolveReportPage />} />} />

      {/* Privadas – reportes (Estudiante / Docente) */}
      <Route path="/reports/create" element={<PrivateRoute element={<CreateReportPage />} />} />
      <Route path="/reports/view" element={<PrivateRoute element={<ViewReportsPage />} />} />

      {/* Privadas – seguridad (todos los roles) */}
      <Route path="/change-password" element={<PrivateRoute element={<ChangePasswordPage />} />} />

      {/* Privadas – gestor */}
      <Route path="/gestor/reports" element={<PrivateRoute element={<GestorReportsPage />} />} />
      <Route path="/gestor/resolutions" element={<PrivateRoute element={<GestorResolutionsPage />} />} />
      <Route path="/gestor/assignments" element={<PrivateRoute element={<GestorAssignmentsPage />} />} />

      {/* Redirecciones */}
      <Route path="/home" element={<Navigate to="/profile" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
