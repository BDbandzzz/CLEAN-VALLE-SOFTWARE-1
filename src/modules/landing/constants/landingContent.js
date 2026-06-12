import {
  BarChart3,
  Bell,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Eye,
  FileSearch,
  Leaf,
  Recycle,
  ShieldCheck,
  Users,
  Wrench,
} from 'lucide-react';

export const LANDING_NAV_LINKS = [
  { label: 'Capacidades', href: '#capacidades' },
  { label: 'Flujo', href: '#flujo' },
  { label: 'Acceso', href: '#acceso' },
];

export const LANDING_HEADER = {
  loginLabel: 'Iniciar sesion',
};

export const LANDING_HERO = {
  subtitle:
    'Registra, consulta y acompaña la atención de situaciones dentro de la comunidad universitaria.',
  primaryAction: {
    label: 'Entrar a la plataforma',
    href: '/login',
  },
  secondaryAction: {
    label: 'Ver reportes resueltos',
    href: '/public/reports/resolved',
  },
  statusLabel: 'Sistema activo',
};

export const LANDING_STATS = [
  { icon: ClipboardList, label: 'Reportes gestionados', value: '120+' },
  { icon: ShieldCheck, label: 'Roles de acceso', value: '4' },
  { icon: Bell, label: 'Alertas y avisos', value: '24/7' },
];

export const LANDING_PREVIEW = {
  status: 'Activo',
  rows: [
    { label: 'Reporte recibido', progress: 90 },
    { label: 'Caso asignado', progress: 72 },
    { label: 'Resolucion enviada', progress: 54 },
  ],
};

export const LANDING_FEATURE_SECTION = {
  eyebrow: 'Capacidades del sistema',
  title: 'Herramientas pensadas para la operacion diaria',
  description:
    'La landing ahora presenta las mismas prioridades de la aplicacion: registrar, consultar, asignar y dar seguimiento con componentes claros.',
};

export const LANDING_FEATURES = [
  {
    icon: ClipboardCheck,
    label: 'Reportes',
    title: 'Registro guiado',
    description:
      'Formulario estructurado para documentar incidentes universitarios con categoria, riesgo, ubicacion, contexto e imagenes.',
    tone: 'primary',
  },
  {
    icon: Eye,
    label: 'Consulta',
    title: 'Seguimiento visible',
    description:
      'Filtros, estados e historial para revisar reportes activos o resueltos sin perder trazabilidad.',
    tone: 'info',
  },
  {
    icon: Wrench,
    label: 'Operacion',
    title: 'Gestion por operadores',
    description:
      'Asignacion de casos, resoluciones y revision del avance para los equipos responsables del campus.',
    tone: 'warning',
  },
  {
    icon: Users,
    label: 'Roles',
    title: 'Acceso segmentado',
    description:
      'Experiencias diferenciadas para estudiantes, profesores, operadores y administradores.',
    tone: 'neutral',
  },
  {
    icon: FileSearch,
    label: 'Trazabilidad',
    title: 'Informacion verificable',
    description:
      'Datos organizados para consultar antecedentes, evidencias y decisiones tomadas sobre cada reporte.',
    tone: 'accent',
  },
  {
    icon: Recycle,
    label: 'Comunidad',
    title: 'Impacto institucional',
    description:
      'Una vista consistente para coordinar acciones y mantener informada a la comunidad universitaria.',
    tone: 'success',
  },
];

export const LANDING_FLOW_SECTION = {
  eyebrow: 'Flujo de trabajo',
  title: 'Del reporte a la resolucion',
  description:
    'El recorrido publico resume lo que ocurre dentro de la plataforma y ayuda a orientar a nuevos usuarios.',
};

export const LANDING_FLOW_STEPS = [
  {
    icon: Leaf,
    title: 'Reporta',
    description: 'Registra la situación y adjunta la información necesaria.',
  },
  {
    icon: BarChart3,
    title: 'Da seguimiento',
    description: 'Consulta el estado y las novedades del reporte.',
  },
  {
    icon: CheckCircle2,
    title: 'Consulta la solución',
    description: 'Revisa la atención y las evidencias del cierre.',
  },
];

export const LANDING_CTA = {
  eyebrow: 'Acceso institucional',
  title: 'Ingresa con tus credenciales y continua la gestion',
  description:
    'Accede a tu panel para crear reportes, revisar notificaciones o atender casos asignados segun tu rol.',
  action: {
    label: 'Iniciar sesion',
    href: '/login',
  },
};

export const LANDING_FOOTER_LINKS = [
  { label: 'Sitio Univalle', href: 'https://www.univalle.edu.co' },
  { label: 'Ingreso', href: '/login' },
];

export const LANDING_FOOTER = {
  rightsLabel: 'Todos los derechos reservados.',
};
