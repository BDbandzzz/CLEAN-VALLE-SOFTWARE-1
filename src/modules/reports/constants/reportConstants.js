/**
 * Constantes centralizadas para los reportes de Clean-Valle.
 * Incluye tipos de reporte, niveles de riesgo y su metadata de display.
 */

export const REPORT_TYPES = [
  {
    id: 'basura',
    label: 'Basura',
    color: '#16a34a',         // verde
    bgClass: 'report-type-basura',
  },
  {
    id: 'agua',
    label: 'Agua',
    color: '#2563eb',         // azul
    bgClass: 'report-type-agua',
  },
  {
    id: 'riesgo',
    label: 'Riesgo',
    color: '#dc2626',         // rojo
    bgClass: 'report-type-riesgo',
  },
  {
    id: 'contaminacion',
    label: 'Contaminación',
    color: '#7c3aed',         // morado
    bgClass: 'report-type-contaminacion',
  },
  {
    id: 'otro',
    label: 'Otro',
    color: '#6b7280',         // gris
    bgClass: 'report-type-otro',
  },
];

export const RISK_LEVELS = [
  {
    id: 'bajo',
    label: 'Bajo',
    color: '#16a34a',
    bgClass: 'risk-bajo',
  },
  {
    id: 'medio',
    label: 'Medio',
    color: '#d97706',
    bgClass: 'risk-medio',
  },
  {
    id: 'alto',
    label: 'Alto',
    color: '#dc2626',
    bgClass: 'risk-alto',
  },
];

/** Retorna la metadata de un tipo de reporte por su id. */
export const getReportTypeMeta = (id) =>
  REPORT_TYPES.find((t) => t.id === id) || REPORT_TYPES[REPORT_TYPES.length - 1];

/** Retorna la metadata de un nivel de riesgo por su id. */
export const getRiskLevelMeta = (id) =>
  RISK_LEVELS.find((r) => r.id === id) || RISK_LEVELS[0];

/** Mock inicial de reportes para demostración. */
export const MOCK_REPORTS = [
  {
    id: 'r-001',
    title: 'Basura acumulada en zona norte',
    description: 'Se ha acumulado una gran cantidad de basura en la zona norte del campus, generando malos olores y atrayendo animales.',
    location: 'Zona norte – Bloque A',
    riskLevel: 'alto',
    reportType: 'basura',
    incidentDate: '2026-05-10',
    status: 'pendiente',
    createdAt: '2026-05-10T09:00:00Z',
    images: [],
  },
  {
    id: 'r-002',
    title: 'Tubería rota en cafetería',
    description: 'La tubería del baño de la cafetería presenta una fuga que está encharcando el pasillo.',
    location: 'Cafetería Central',
    riskLevel: 'medio',
    reportType: 'agua',
    incidentDate: '2026-05-12',
    status: 'resuelto',
    createdAt: '2026-05-12T11:30:00Z',
    images: [],
    resolution: 'El equipo de mantenimiento reparó la tubería el 13 de mayo.',
    resolvedAt: '2026-05-13T14:00:00Z',
    operatorName: 'Carlos Méndez',
  },
  {
    id: 'r-003',
    title: 'Cables eléctricos expuestos',
    description: 'Hay cables eléctricos expuestos en el pasillo del edificio de ingeniería, representando un riesgo para los estudiantes.',
    location: 'Edificio de Ingeniería – Pasillo 2',
    riskLevel: 'alto',
    reportType: 'riesgo',
    incidentDate: '2026-05-13',
    status: 'en_progreso',
    createdAt: '2026-05-13T08:15:00Z',
    images: [],
  },
  {
    id: 'r-004',
    title: 'Derrame de químicos en laboratorio',
    description: 'Un derrame menor de químicos ocurrió en el laboratorio de química. El área fue ventilada pero requiere limpieza especializada.',
    location: 'Laboratorio de Química – Piso 3',
    riskLevel: 'alto',
    reportType: 'contaminacion',
    incidentDate: '2026-05-11',
    status: 'resuelto',
    createdAt: '2026-05-11T15:45:00Z',
    images: [],
    resolution: 'Equipo especializado realizó la limpieza y descontaminación del área.',
    resolvedAt: '2026-05-12T10:00:00Z',
    operatorName: 'Laura Torres',
  },
];
