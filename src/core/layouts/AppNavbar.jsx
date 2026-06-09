import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { ConfirmationMessage } from '@/core/components/ui/confirmation-message';
import { CONFIRMATION_MESSAGES } from '@/core/constants/confirmationMessages';
import { USER_ROLE_IDS } from '@/core/constants/domainConstants';
import { APP_NAME, INSTITUTION_NAME, UNIVALLE_LOGO_SRC } from '@/core/constants/branding';
import { sidebarConfig } from '@/core/constants/sidebarConfig';
import { useAuth } from '@/core/context/AuthContext';
import { cn } from '@/core/lib/utils';
import { NavDropdown } from '@/core/layouts/NavDropdown';

export function AppNavbar({ roleId }) {
  const items = sidebarConfig[roleId] || sidebarConfig[USER_ROLE_IDS.STUDENT];
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navItems = items.filter((item) => item.url || item.children);
  const logoutItem = items.find((item) => item.action === 'logout');

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center gap-2 px-3 sm:gap-4 sm:px-6 lg:gap-4 lg:px-8">
        <nav className="flex min-w-0 flex-1 items-center justify-evenly gap-3 overflow-x-auto py-3 sm:gap-4 md:gap-6 lg:justify-start lg:gap-3">
          {navItems.map((item) =>
            item.children ? (
              <NavDropdown key={item.title} item={item} />
            ) : (
              <NavLink
                key={item.url}
                to={item.url}
                end={item.end ?? item.url === '/profile'}
                title={item.title}
                className={({ isActive }) =>
                  cn(
                    'inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold transition md:size-12 lg:h-10 lg:w-auto lg:gap-2 lg:px-3',
                    'text-muted-foreground hover:bg-emerald-100 hover:text-emerald-800',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    isActive && 'bg-primary text-primary-foreground shadow-sm hover:bg-emerald-500 hover:text-primary-foreground'
                  )
                }
              >
                <item.icon className="size-4 shrink-0" />
                <span className="hidden lg:inline">{item.title}</span>
              </NavLink>
            )
          )}

          {logoutItem && (
            <button
              type="button"
              onClick={() => setConfirmLogout(true)}
              title={logoutItem.title}
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-muted-foreground transition hover:bg-emerald-100 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:size-12 lg:h-10 lg:w-auto lg:gap-2 lg:px-3"
            >
              <logoutItem.icon className="size-4 shrink-0" />
              <span className="hidden lg:inline">{logoutItem.title}</span>
            </button>
          )}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-3 border-l border-border pl-3 sm:pl-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-bold leading-tight text-foreground">{APP_NAME}</p>
            <p className="text-xs leading-tight text-muted-foreground">{INSTITUTION_NAME}</p>
          </div>
          <img
            src={UNIVALLE_LOGO_SRC}
            alt={APP_NAME}
            className="h-8 w-auto max-w-[92px] object-contain sm:h-9 sm:max-w-[150px]"
          />
        </div>
      </div>

      <ConfirmationMessage
        open={confirmLogout}
        {...CONFIRMATION_MESSAGES.session.logout}
        isLoading={isLoggingOut}
        onAccept={handleLogout}
        onReject={() => setConfirmLogout(false)}
      />
    </header>
  );
}
