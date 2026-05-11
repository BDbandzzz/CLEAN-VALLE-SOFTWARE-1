import { Link, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/core/components/ui/sidebar";
import { useAuth } from "@/core/context/AuthContext";
import { sidebarConfig } from "../config/sidebarConfig";
import { ChevronLeft, ChevronRight } from "lucide-react";
import UnivalleLogo from "@/core/imgs/univallelogo.jpg";

export function AppSidebar({ role }) {
  const items = sidebarConfig[role] || [];
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { open, setOpen } = useSidebar();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Sidebar>
      <SidebarContent>
        <div className="flex items-center justify-between gap-3 px-4 py-4 border-b border-emerald-300/20">
          <div className="flex items-center gap-3">
            <img
              src={UnivalleLogo}
              alt="Universidad del Valle"
              className={`h-10 w-10 rounded-full border border-white/20 object-cover ${
                open ? 'block' : 'hidden'
              }`}
            />
            <div className={`transition-all duration-200 ${open ? 'opacity-100' : 'opacity-0 translate-x-[-10px]'} ${open ? '' : 'pointer-events-none'}`}>
              <p className="text-base font-bold text-white">CleanValle</p>
              <p className="text-xs text-emerald-100">Universidad del Valle</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="rounded-full border border-white/20 bg-white/10 p-2 text-white transition hover:bg-white/20"
          >
            {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                if (item.title === "Cerrar sesión") {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left"
                        >
                          <item.icon />
                          <span>{item.title}</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}