/* eslint-disable react-refresh/only-export-components -- compound sidebar primitives */
import { createContext, useContext, useState } from 'react';

import { cn } from '@/core/lib/utils';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [open, setOpen] = useState(true);

  const showHeaderLogo = open;

  return (
    <SidebarContext.Provider value={{ open, setOpen, showHeaderLogo }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar debe ser usado dentro de SidebarProvider');
  }
  return {
    open: context.open,
    setOpen: context.setOpen,
    showHeaderLogo: context.showHeaderLogo ?? context.open,
  };
};

export const Sidebar = ({ children, className }) => {
  const { open } = useSidebar();

  return (
    <aside
      className={cn(
        'sticky top-0 z-30 flex h-screen max-h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm transition-[width] duration-300 ease-out',
        open ? 'w-64' : 'w-[4.5rem]',
        className
      )}
    >
      {children}
    </aside>
  );
};

export const SidebarHeader = ({ children, className }) => (
  <div className={cn('border-b border-sidebar-border px-3 py-4', className)}>{children}</div>
);

export const SidebarContent = ({ children, className }) => (
  <div className={cn('flex flex-1 flex-col gap-2 overflow-y-auto py-3', className)}>{children}</div>
);

export const SidebarFooter = ({ children, className }) => (
  <div className={cn('mt-auto border-t border-sidebar-border px-3 py-3', className)}>{children}</div>
);

export const SidebarGroup = ({ children, className }) => (
  <div className={cn('px-2', className)}>{children}</div>
);

export const SidebarGroupContent = ({ children, className }) => <div className={className}>{children}</div>;

export const SidebarGroupLabel = ({ children, className }) => (
  <p
    className={cn(
      'mb-2 px-2 text-[0.65rem] font-semibold uppercase tracking-wider text-sidebar-foreground/60',
      className
    )}
  >
    {children}
  </p>
);

export const SidebarMenu = ({ children, className }) => (
  <ul className={cn('flex flex-col gap-0.5', className)}>{children}</ul>
);

export const SidebarMenuItem = ({ children, className }) => <li className={className}>{children}</li>;

export const SidebarMenuButton = ({ children, className, ...props }) => {
  const { open } = useSidebar();

  const classes = cn(
    'flex w-full items-center rounded-lg py-2.5 text-sm font-medium transition-colors',
    open ? 'gap-3 px-3' : 'justify-center gap-0 px-2',
    'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
    className
  );

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
};
