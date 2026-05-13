import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/core/components/ui/sidebar';
import { useAuth } from '@/core/context/AuthContext';
import { sidebarConfig } from '@/core/config/sidebarConfig';
import { UNIVALLE_LOGO_SRC, APP_NAME, INSTITUTION_NAME } from '@/core/constants/branding';
import { cn } from '@/core/lib/utils';

export function AppSidebar({ role }) {
  const items = sidebarConfig[role] || sidebarConfig.estudiante;
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { open, setOpen, showHeaderLogo } = useSidebar();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    cn(
      'flex w-full items-center rounded-lg py-2.5 text-sm font-medium transition-colors',
      open ? 'gap-3 px-3' : 'justify-center gap-0 px-2',
      'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
      isActive &&
        'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm hover:bg-sidebar-primary/90',
      !open && isActive && 'mx-auto aspect-square max-w-[2.75rem] min-w-[2.75rem] justify-center px-0'
    );

  const toggleBtnClass =
    'shrink-0 cursor-pointer rounded-lg border border-sidebar-border bg-sidebar-accent/50 p-2 text-sidebar-foreground transition hover:bg-sidebar-accent';

  return (
    <Sidebar>
      <SidebarHeader className={cn(!open && 'px-2 py-3')}>
        {open ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div
                className={cn(
                  'shrink-0 overflow-hidden transition-[max-width,opacity] duration-300 ease-out',
                  showHeaderLogo ? 'max-w-[220px] opacity-100' : 'max-w-0 opacity-0'
                )}
                aria-hidden={!showHeaderLogo}
              >
                <img
                  src={UNIVALLE_LOGO_SRC}
                  alt={INSTITUTION_NAME}
                  className="block h-9 w-auto max-w-[200px] object-contain"
                />
              </div>
              <div className="min-w-0 transition-opacity duration-300 ease-out">
                <p className="truncate text-sm font-bold text-sidebar-foreground">{APP_NAME}</p>
                <p className="truncate text-xs text-sidebar-foreground/70">{INSTITUTION_NAME}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className={toggleBtnClass}
              aria-label="Colapsar menú"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-1">
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className={cn(toggleBtnClass, 'mx-auto')}
              aria-label="Expandir menú"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={cn(!open && 'sr-only')}>Menú</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className={cn(!open && 'items-center')}>
              {items.map((item) => {
                if (item.action === 'logout') {
                  return (
                    <SidebarMenuItem key={item.title} className={cn(!open && 'flex w-full justify-center')}>
                      <SidebarMenuButton
                        type="button"
                        onClick={handleLogout}
                        title={item.title}
                        className={cn(
                          'cursor-pointer text-white/85 hover:bg-sidebar-accent hover:text-white',
                          '[&_svg]:text-white/85 [&_svg]:transition-colors hover:[&_svg]:text-white',
                          'active:bg-sidebar-accent/90 active:text-white',
                          !open && 'max-w-[2.75rem] min-w-[2.75rem] justify-center px-0'
                        )}
                      >
                        <item.icon className="size-4 shrink-0" />
                        {open ? <span className="truncate transition-colors">{item.title}</span> : null}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMenuItem key={item.url} className={cn(!open && 'flex w-full justify-center')}>
                    <NavLink
                      to={item.url}
                      end={item.url === '/profile'}
                      className={navLinkClass}
                      title={!open ? item.title : undefined}
                    >
                      <item.icon className="size-4 shrink-0" />
                      {open ? <span className="truncate">{item.title}</span> : null}
                    </NavLink>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <p className={cn('text-center text-[10px] text-sidebar-foreground/50', !open && 'hidden')}>
          Sesión activa · {role}
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
