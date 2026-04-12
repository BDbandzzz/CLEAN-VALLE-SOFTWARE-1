import { Routes, Route } from 'react-router-dom';

import LoginPage from '../../modules/auth/pages/LoginPage';
import HomePage from '../../modules/home/pages/HomePage';
import ProfilePage from '../../modules/profile/pages/ProfilePage';
import AdminPage from '../../modules/admin/pages/AdminPage';
import OperativePage from '../../modules/operative/pages/OperativePage';
import MyReportsPage from '../../modules/reports/pages/MyReportsPage';
import CreateReportPage from '../../modules/reports/pages/CreateReportPage';
import AllReportsPage from '../../modules/reports/pages/AllReportsPage';

const AppRouter = () => {
  return (
    <Routes>
      
      {/* Autenticación */}
      <Route path="/" element={<LoginPage />} />

      {/* Página principal */}
      <Route path="/home" element={<HomePage />} />

    

      {/* Perfil del usuario autenticado */}
      <Route path="/profile" element={<ProfilePage />} />

      {/* Panel de administración */}
      <Route path="/admin" element={<AdminPage />} />

      {/* Panel operativo */}
      <Route path="/operative" element={<OperativePage />} />

      {/* Reportes */}
      <Route path="/my-reports" element={<MyReportsPage />} />
      <Route path="/report/new" element={<CreateReportPage />} />
      <Route path="/public" element={<AllReportsPage />} />
    </Routes>
  );
};

export default AppRouter;
