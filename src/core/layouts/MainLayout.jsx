import { useAuth } from '@/core/context/AuthContext';
import { AppNavbar } from './AppNavbar';

function MainLayout({ children }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen w-full bg-muted/30">
      <AppNavbar role={user?.role || 'estudiante'} />
      <main className="min-h-[calc(100vh-4rem)] min-w-0 overflow-x-auto p-5 lg:p-8">{children}</main>
    </div>
  );
}

export default MainLayout;
