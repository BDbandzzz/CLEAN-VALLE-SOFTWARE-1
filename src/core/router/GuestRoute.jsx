import { Navigate } from 'react-router-dom';

import { useAuth } from '@/core/context/AuthContext';

export default function GuestRoute({ element }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Verificando sesión...
      </div>
    );
  }

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return element;
}
