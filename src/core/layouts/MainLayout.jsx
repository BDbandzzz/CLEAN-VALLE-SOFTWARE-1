import { SidebarProvider } from '@/core/components/ui/sidebar';
import { useAuth } from '@/core/context/AuthContext';
import { AppSidebar } from './AppSidebar';

function MainLayout({ children }) {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full items-start bg-muted/30">
        <AppSidebar role={user?.role || 'estudiante'} />
        <main className="min-h-screen min-w-0 flex-1 overflow-x-auto p-5 lg:p-8">{children}</main>
      </div>
    </SidebarProvider>
  );
}

export default MainLayout;
