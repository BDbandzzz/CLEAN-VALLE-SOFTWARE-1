import { SidebarProvider } from "@/core/components/ui/sidebar";
import { useAuth } from "@/core/context/AuthContext";
import { AppSidebar } from "./AppSidebar";

function MainLayout({ children }) {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar role={user?.role || "estudiante"} />
        <main className="flex-1 p-6 bg-slate-100">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}

export default MainLayout;