import { createContext, useContext, useState } from "react";

// Context para el Sidebar
const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [open, setOpen] = useState(true);

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar debe ser usado dentro de SidebarProvider");
  }
  return context;
};

// Componente Sidebar
export const Sidebar = ({ children, className = "" }) => {
  const { open } = useSidebar();

  return (
    <aside
      className={`bg-emerald-700 text-white transition-all duration-300 ${
        open ? "w-64" : "w-20"
      } min-h-screen flex flex-col ${className}`}
    >
      {children}
    </aside>
  );
};

// Componente SidebarContent
export const SidebarContent = ({ children, className = "" }) => {
  return (
    <div className={`flex-1 overflow-y-auto py-4 ${className}`}>
      {children}
    </div>
  );
};

// Componente SidebarGroup
export const SidebarGroup = ({ children, className = "" }) => {
  return (
    <nav className={`px-4 space-y-2 ${className}`}>
      {children}
    </nav>
  );
};

// Componente SidebarGroupContent
export const SidebarGroupContent = ({ children, className = "" }) => {
  return <div className={className}>{children}</div>;
};

// Componente SidebarMenu
export const SidebarMenu = ({ children, className = "" }) => {
  return (
    <ul className={`space-y-1 ${className}`}>
      {children}
    </ul>
  );
};

// Componente SidebarMenuItem
export const SidebarMenuItem = ({ children, className = "" }) => {
  return (
    <li className={className}>
      {children}
    </li>
  );
};

// Componente SidebarMenuButton
export const SidebarMenuButton = ({ children, asChild = false, className = "" }) => {
  const { open } = useSidebar();
  
  if (asChild) {
    return (
      <div
        className={`flex items-center gap-3 px-4 py-2 rounded-md hover:bg-emerald-600 transition-colors text-sm ${
          open ? "" : "justify-center"
        } ${className}`}
      >
        {children}
      </div>
    );
  }

  return (
    <button
      className={`w-full flex items-center gap-3 px-4 py-2 rounded-md hover:bg-emerald-600 transition-colors text-sm text-left ${
        open ? "" : "justify-center"
      } ${className}`}
    >
      {children}
    </button>
  );
};
