import { Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from '../../modules/auth/pages/LandingPage';
import LoginPage from '../../modules/auth/pages/LoginPage';
import ProfilePage from '../../modules/profile/pages/ProfilePage';
import AdminPage from '../../modules/admin/pages/AdminPage';
import OperativePage from '../../modules/operative/pages/OperativePage';
import RecoverPassword from '@/modules/auth/pages/RecoverPassword';
import CreateReportPage from '@/modules/reports/pages/CreateReportPage';
import ViewReportsPage from '@/modules/reports/pages/ViewReportsPage';
import ChangePasswordPage from '@/modules/reports/pages/ChangePasswordPage';
import PrivateRoute from './PrivateRoute';

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
      <Route path="/operative" element={<PrivateRoute element={<OperativePage />} />} />

      {/* Privadas – reportes (Estudiante / Docente) */}
      <Route path="/reports/create" element={<PrivateRoute element={<CreateReportPage />} />} />
      <Route path="/reports/view" element={<PrivateRoute element={<ViewReportsPage />} />} />

      {/* Privadas – seguridad (todos los roles) */}
      <Route path="/change-password" element={<PrivateRoute element={<ChangePasswordPage />} />} />

      {/* Redirecciones */}
      <Route path="/home" element={<Navigate to="/profile" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
