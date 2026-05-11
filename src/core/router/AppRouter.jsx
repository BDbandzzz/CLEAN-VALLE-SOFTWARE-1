import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from '../../modules/auth/pages/LoginPage';
import ProfilePage from '../../modules/profile/pages/ProfilePage';
import AdminPage from '../../modules/admin/pages/AdminPage';
import OperativePage from '../../modules/operative/pages/OperativePage';
import RecoverPassword from '@/modules/auth/pages/RecoverPassword';
import PrivateRoute from './PrivateRoute';

const AppRouter = () => {
  return (
    <Routes>
      
      {/* Autenticación */}
      <Route path="/" element={<LoginPage/>} />
      <Route path="/recover-pass" element={<RecoverPassword/>} />

      {/* Rutas Protegidas */}
      <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
      <Route path="/admin" element={<PrivateRoute element={<AdminPage />} />} />
      <Route path="/operative" element={<PrivateRoute element={<OperativePage />} />} />

      {/* Redirección de compatibilidad */}
      <Route path="/home" element={<Navigate to="/profile" replace />} />

      {/* Ruta por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
      
    </Routes>
  );
};

export default AppRouter;
