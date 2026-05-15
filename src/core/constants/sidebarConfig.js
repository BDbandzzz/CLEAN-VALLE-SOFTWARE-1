import { User, LogOut, Shield, ClipboardList, GraduationCap, ClipboardPlus, Eye, Lock } from 'lucide-react';

export const sidebarConfig = {
  estudiante: [
    {
      title: 'Perfil',
      url: '/profile',
      icon: User,
    },
    {
      title: 'Crear Reporte',
      url: '/reports/create',
      icon: ClipboardPlus,
    },
    {
      title: 'Mis Reportes',
      url: '/reports/view',
      icon: Eye,
    },
    {
      // Separador visual (sección de seguridad)
      title: 'Cambiar Contraseña',
      url: '/change-password',
      icon: Lock,
      section: 'seguridad',
    },
    {
      title: 'Cerrar sesión',
      action: 'logout',
      icon: LogOut,
    },
  ],

  profesor: [
    {
      title: 'Perfil',
      url: '/profile',
      icon: GraduationCap,
    },
    {
      title: 'Crear Reporte',
      url: '/reports/create',
      icon: ClipboardPlus,
    },
    {
      title: 'Mis Reportes',
      url: '/reports/view',
      icon: Eye,
    },
    {
      title: 'Cambiar Contraseña',
      url: '/change-password',
      icon: Lock,
      section: 'seguridad',
    },
    {
      title: 'Cerrar sesión',
      action: 'logout',
      icon: LogOut,
    },
  ],

  operador: [
    {
      title: 'Perfil',
      url: '/profile',
      icon: User,
    },
    {
      title: 'Panel operativo',
      url: '/operative',
      icon: ClipboardList,
    },
    {
      title: 'Cambiar Contraseña',
      url: '/change-password',
      icon: Lock,
      section: 'seguridad',
    },
    {
      title: 'Cerrar sesión',
      action: 'logout',
      icon: LogOut,
    },
  ],

  admin: [
    {
      title: 'Perfil',
      url: '/profile',
      icon: User,
    },
    {
      title: 'Administración',
      url: '/admin',
      icon: Shield,
    },
    {
      title: 'Panel operativo',
      url: '/operative',
      icon: ClipboardList,
    },
    {
      title: 'Cambiar Contraseña',
      url: '/change-password',
      icon: Lock,
      section: 'seguridad',
    },
    {
      title: 'Cerrar sesión',
      action: 'logout',
      icon: LogOut,
    },
  ],
};
