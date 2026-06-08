import { Bell, Eye, GraduationCap, LayoutDashboard, Lock, LogOut, ClipboardPlus, ShieldCheck, Tags, User, UserCog, Users, Wrench } from 'lucide-react';

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

  admin: [
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
