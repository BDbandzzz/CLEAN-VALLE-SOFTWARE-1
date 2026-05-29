import { Bell, Eye, GraduationCap, Lock, LogOut, ClipboardPlus, User, UserCog, Wrench } from 'lucide-react';

const reportItems = [
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
];

const securityItems = [
  {
    title: 'Notificaciones',
    url: '/notifications',
    icon: Bell,
    section: 'seguridad',
  },
  {
    title: 'Cambiar Contrasena',
    url: '/change-password',
    icon: Lock,
    section: 'seguridad',
  },
  {
    title: 'Cerrar sesion',
    action: 'logout',
    icon: LogOut,
  },
];

export const sidebarConfig = {
  estudiante: [
    {
      title: 'Perfil',
      url: '/profile',
      icon: User,
    },
    ...reportItems,
    ...securityItems,
  ],

  profesor: [
    {
      title: 'Perfil',
      url: '/profile',
      icon: GraduationCap,
    },
    ...reportItems,
    ...securityItems,
  ],

  operador: [
    {
      title: 'Perfil',
      url: '/profile',
      icon: User,
    },
    {
      title: 'Panel operador',
      url: '/operator',
      icon: Wrench,
    },
    ...securityItems,
  ],

  gestor: [
    {
      title: 'Perfil',
      url: '/profile',
      icon: UserCog,
    },
    ...securityItems,
  ],
};
