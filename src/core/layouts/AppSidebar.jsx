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
      'flex w-full items-center rounded-xl py-3 text-sm font-medium transition-all duration-150',
      open ? 'gap-3 px-4' : 'justify-center gap-0 px-2',
      'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
      isActive &&
        'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm hover:bg-sidebar-primary/90',
      !open && isActive && 'mx-auto aspect-square max-w-[2.75rem] min-w-[2.75rem] justify-center px-0'
    );

  const toggleBtnClass =
    'shrink-0 cursor-pointer rounded-xl border border-sidebar-border bg-sidebar-accent/50 p-2 text-sidebar-foreground transition hover:bg-sidebar-accent';

  // Separar los items normales de los de sección "seguridad" y el logout
  const mainItems = items.filter((i) => i.action !== 'logout' && i.section !== 'seguridad');
  const securityItems = items.filter((i) => i.section === 'seguridad');
  const logoutItem = items.find((i) => i.action === 'logout');

  const renderNavItem = (item) => (
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

  return (
    <Sidebar>
      {/* ── Header ── */}
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

      {/* ── Content ── */}
      <SidebarContent>
        {/* Navegación principal */}
        <SidebarGroup>
          <SidebarGroupLabel className={cn(!open && 'sr-only')}>Menú</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className={cn('gap-1.5', !open && 'items-center')}>
              {mainItems.map(renderNavItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Sección Seguridad (Cambiar contraseña, etc.) */}
        {securityItems.length > 0 && (
          <SidebarGroup className="mt-2">
            {open && (
              <div className="mx-4 mb-2 border-t border-sidebar-border/60" aria-hidden />
            )}
            <SidebarGroupLabel className={cn('text-xs', !open && 'sr-only')}>
              Seguridad
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className={cn('gap-1.5', !open && 'items-center')}>
                {securityItems.map(renderNavItem)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Cerrar sesión */}
        {logoutItem && (
          <SidebarGroup className="mt-auto">
            {open && (
              <div className="mx-4 mb-2 border-t border-sidebar-border/60" aria-hidden />
            )}
            <SidebarGroupContent>
              <SidebarMenu className={cn(!open && 'items-center')}>
                <SidebarMenuItem className={cn(!open && 'flex w-full justify-center')}>
                  <SidebarMenuButton
                    type="button"
                    onClick={handleLogout}
                    title={logoutItem.title}
                    className={cn(
                      'cursor-pointer rounded-xl py-3 text-white/85 hover:bg-sidebar-accent hover:text-white',
                      '[&_svg]:text-white/85 [&_svg]:transition-colors hover:[&_svg]:text-white',
                      'active:bg-sidebar-accent/90 active:text-white transition-all duration-150',
                      !open && 'max-w-[2.75rem] min-w-[2.75rem] justify-center px-0'
                    )}
                  >
                    <logoutItem.icon className="size-4 shrink-0" />
                    {open ? <span className="truncate transition-colors">{logoutItem.title}</span> : null}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* ── Footer ── */}
      <SidebarFooter>
        <p className={cn('text-center text-[10px] text-sidebar-foreground/50 pb-1', !open && 'hidden')}>
          Sesión activa · {role}
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
