import { Bell, Eye, GraduationCap, LayoutDashboard, Lock, LogOut, ClipboardPlus, ShieldCheck, Tags, User, UserCog, Users, Wrench } from 'lucide-react';

import { USER_ROLE_IDS } from '@/core/constants/domainConstants';

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
  [USER_ROLE_IDS.STUDENT]: [
    {
      title: 'Perfil',
      url: '/profile',
      icon: User,
    },
    ...reportItems,
    ...securityItems,
  ],

  [USER_ROLE_IDS.TEACHER]: [
    {
      title: 'Perfil',
      url: '/profile',
      icon: GraduationCap,
    },
    ...reportItems,
    ...securityItems,
  ],

  [USER_ROLE_IDS.OPERATOR]: [
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

  [USER_ROLE_IDS.MANAGER]: [
    {
      title: 'Perfil',
      url: '/profile',
      icon: UserCog,
    },
    ...securityItems,
  ],

  [USER_ROLE_IDS.ADMIN]: [
    {
      title: 'Panel admin',
      url: '/admin',
      icon: LayoutDashboard,
      end: true,
    },
    {
      title: 'Gestión de Usuarios',
      url: '/admin/users',
      icon: Users,
      end: true,
    },
    {
      title: 'Tipos de reportes',
      url: '/admin/report-types',
      icon: Tags,
      end: true,
    },
    {
      title: 'Perfil',
      url: '/profile',
      icon: ShieldCheck,
    },
    ...securityItems,
  ],
};
