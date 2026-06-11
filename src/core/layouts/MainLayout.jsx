import { USER_ROLE_IDS } from '@/core/constants/domainConstants';
import { useAuth } from '@/core/context/AuthContext';
import { AppNavbar } from './AppNavbar';

function MainLayout({ children }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen w-full bg-muted/30">
      <AppNavbar roleId={user?.roleId ?? USER_ROLE_IDS.STUDENT} />
      <main className="min-h-[calc(100vh-4rem)] min-w-0 overflow-x-hidden p-3 sm:p-5 lg:p-8">
        {children}
      </main>
    </div>
  );
}

export default MainLayout;
