import {
  ClipboardCheck,
  ClipboardList,
  ClipboardPlus,
  Eye,
  GraduationCap,
  LayoutDashboard,
  Layers3,
  Lock,
  LogOut,
  MapPinned,
  Settings2,
  ShieldCheck,
  Tags,
  User,
  UserCog,
  Users,
  Wrench,
} from 'lucide-react';

import { USER_ROLE_IDS } from '@/core/constants/domainConstants';

const reportItems = [
  {
    title: 'Crear reporte',
    url: '/reports/create',
    icon: ClipboardPlus,
  },
  {
    title: 'Mis reportes',
    url: '/reports/view',
    icon: Eye,
  },
  {
    title: 'Resueltos',
    url: '/reports/resolved',
    icon: ClipboardCheck,
  },
];

const logoutItem = {
  title: 'Cerrar sesión',
  action: 'logout',
  icon: LogOut,
};

const securityItems = [
  {
    title: 'Cambiar contraseña',
    url: '/change-password',
    icon: Lock,
  },
  logoutItem,
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
      title: 'Panel operador',
      url: '/operator/dashboard',
      icon: Wrench,
      end: true,
    },
    {
      title: 'Mis asignaciones',
      url: '/operator/assignments',
      icon: ClipboardList,
    },
    {
      title: 'Resoluciones',
      url: '/operator/resolutions',
      icon: ClipboardCheck,
    },
    {
      title: 'Perfil',
      url: '/profile',
      icon: User,
    },
    ...securityItems,
  ],

  [USER_ROLE_IDS.MANAGER]: [
    {
      title: 'Panel gestor',
      url: '/manager',
      icon: LayoutDashboard,
      end: true,
    },
    {
      title: 'Reportes',
      url: '/manager/reports',
      icon: ClipboardList,
    },
    {
      title: 'Resoluciones',
      url: '/manager/resolutions',
      icon: ClipboardCheck,
    },
    {
      title: 'Grupos',
      url: '/manager/groups',
      icon: Layers3,
    },
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
      title: 'Gestión',
      icon: Settings2,
      children: [
        {
          title: 'Usuarios',
          url: '/admin/users',
          icon: Users,
        },
        {
          title: 'Tipos de reportes',
          url: '/admin/report-types',
          icon: Tags,
        },
        {
          title: 'Localizaciones',
          url: '/admin/locations',
          icon: MapPinned,
        },
        {
          title: 'Especializaciones',
          url: '/admin/specializations',
          icon: Wrench,
        },
      ],
    },
    {
      title: 'Perfil',
      url: '/profile',
      icon: ShieldCheck,
    },
    ...securityItems,
  ],
};
