import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';

const PrivateRoute = ({ element, allowedRoleIds }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Cargando...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoleIds?.length && !allowedRoleIds.includes(user.roleId)) {
    return <Navigate to="/profile" replace />;
  }

  return <MainLayout>{element}</MainLayout>;
};

export default PrivateRoute;
