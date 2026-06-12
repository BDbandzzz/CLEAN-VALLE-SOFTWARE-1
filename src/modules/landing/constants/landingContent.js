const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '');
const PUBLIC_ASSET_URL = `${SUPABASE_URL}/storage/v1/object/public/assets`;

export const LANDING_HEADER = {
  loginLabel: 'Iniciar sesión',
};

export const LANDING_HERO = {
  description:
    'Una plataforma para registrar situaciones, seguir su atención y consultar las soluciones realizadas dentro de la universidad.',
  primaryAction: {
    label: 'Ingresar',
    href: '/login',
  },
  secondaryAction: {
    label: 'Ver reportes resueltos',
    href: '/public/reports/resolved',
  },
};

export const LANDING_SLIDES = [
  {
    src: `${PUBLIC_ASSET_URL}/univalle1.webp`,
    alt: 'Vista del campus de la Universidad del Valle',
  },
  {
    src: `${PUBLIC_ASSET_URL}/univalle2.webp`,
    alt: 'Espacios de la Universidad del Valle',
  },
  {
    src: `${PUBLIC_ASSET_URL}/univalle3.webp`,
    alt: 'Entorno universitario de la Universidad del Valle',
  },
];

export const LANDING_CAPABILITIES = [
  {
    id: 'reports',
    title: 'Registro guiado',
    description: 'Documenta la situación con categoría, ubicación y nivel de riesgo.',
  },
  {
    id: 'tracking',
    title: 'Seguimiento',
    description: 'Consulta el estado, la asignación y el avance de cada reporte.',
  },
  {
    id: 'evidence',
    title: 'Evidencias',
    description: 'Adjunta y revisa imágenes sin abandonar el contexto del reporte.',
  },
  {
    id: 'notifications',
    title: 'Notificaciones',
    description: 'Recibe novedades relevantes durante el proceso de atención.',
  },
];

export const LANDING_FOOTER_LINKS = [
  { label: 'Sitio Univalle', href: 'https://www.univalle.edu.co' },
  { label: 'Ingreso', href: '/login' },
];

export const LANDING_FOOTER = {
  rightsLabel: 'Todos los derechos reservados.',
};
