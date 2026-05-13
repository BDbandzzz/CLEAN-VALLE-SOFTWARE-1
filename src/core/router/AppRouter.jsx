import { Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from '../../modules/auth/pages/LandingPage';
import LoginPage from '../../modules/auth/pages/LoginPage';
import ProfilePage from '../../modules/profile/pages/ProfilePage';
import AdminPage from '../../modules/admin/pages/AdminPage';
import OperativePage from '../../modules/operative/pages/OperativePage';
import RecoverPassword from '@/modules/auth/pages/RecoverPassword';
import PrivateRoute from './PrivateRoute';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/recover-pass" element={<RecoverPassword />} />

      <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
      <Route path="/admin" element={<PrivateRoute element={<AdminPage />} />} />
      <Route path="/operative" element={<PrivateRoute element={<OperativePage />} />} />

      <Route path="/home" element={<Navigate to="/profile" replace />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
