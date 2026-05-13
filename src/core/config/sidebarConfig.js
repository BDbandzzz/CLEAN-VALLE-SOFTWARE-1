import { User, LogOut, Shield, ClipboardList, GraduationCap } from 'lucide-react';

export const sidebarConfig = {
  estudiante: [
    {
      title: 'Perfil',
      url: '/profile',
      icon: User,
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
      title: 'Cerrar sesión',
      action: 'logout',
      icon: LogOut,
    },
  ],
};
