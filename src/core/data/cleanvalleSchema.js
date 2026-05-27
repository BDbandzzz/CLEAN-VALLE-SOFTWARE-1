export const USER_ROLES = {
  estudiante: 'Estudiante',
  profesor: 'Profesor',
  operador: 'Operador',
};

export const DEMO_USERS = [
  {
    id: '2024001',
    codeUser: '2024001',
    password: 'demo1234',
    role: 'estudiante',
    firstName: 'Usuario',
    lastName: 'Estudiante',
    email: 'estudiante@correounivalle.edu.co',
    dniUser: '1000000001',
    typeDniId: 1,
    genderId: 1,
  },
  {
    id: 'DOC001',
    codeUser: 'DOC001',
    password: 'demo1234',
    role: 'profesor',
    firstName: 'Usuario',
    lastName: 'Docente',
    email: 'docente@correounivalle.edu.co',
    dniUser: '2000000001',
    typeDniId: 1,
    genderId: 2,
  },
  {
    id: 'OP001',
    codeUser: 'OP001',
    password: 'demo1234',
    role: 'operador',
    firstName: 'Operador',
    lastName: 'Mantenimiento',
    email: 'operador@correounivalle.edu.co',
    dniUser: '3000000001',
    typeDniId: 1,
    genderId: 1,
    specializationIds: ['falla-plomeria', 'dano-estructural', 'falla-electrica'],
  },
];

export const OPERATOR_SPECIALIZATIONS = [
  { id: 'falla-plomeria', label: 'Plomero' },
  { id: 'medio-ambiente-espacios', label: 'Personal de aseo y espacios' },
  { id: 'dano-equipos-computo', label: 'Tecnico en equipos de computo' },
  { id: 'falla-electrica', label: 'Tecnico electrico' },
  { id: 'dano-estructural', label: 'Mantenimiento de infraestructura' },
];

export const DOCUMENT_TYPES = [
  { id: 1, label: 'Cedula de ciudadania' },
  { id: 2, label: 'Tarjeta de identidad' },
  { id: 3, label: 'Cedula de extranjeria' },
];

export const GENDERS = [
  { id: 1, label: 'Masculino' },
  { id: 2, label: 'Femenino' },
  { id: 3, label: 'Otro' },
  { id: 4, label: 'Prefiero no decirlo' },
];

export const REPORT_CATEGORIES = [
  {
    id: 'infraestructura-mantenimiento',
    label: 'Infraestructura y Mantenimiento',
    color: '#0f766e',
    subtypes: [
      { id: 'dano-estructural', label: 'Daño estructural' },
      { id: 'falla-electrica', label: 'Falla electrica' },
      { id: 'falla-plomeria', label: 'Falla en plomeria' },
    ],
  },
  {
    id: 'seguridad-convivencia',
    label: 'Seguridad y Convivencia',
    color: '#dc2626',
    subtypes: [
      { id: 'incidente-seguridad', label: 'Incidente de seguridad' },
      { id: 'acoso-discriminacion', label: 'Acoso o discriminacion' },
      { id: 'emergencia-medica', label: 'Emergencia medica' },
    ],
  },
  {
    id: 'medio-ambiente-espacios',
    label: 'Medio Ambiente y Espacios',
    color: '#16a34a',
    subtypes: [
      { id: 'plaga-fauna-nociva', label: 'Plaga o fauna nociva' },
      { id: 'arbol-zona-verde-riesgo', label: 'Arbol o zona verde en riesgo' },
      { id: 'ruido-excesivo', label: 'Ruido excesivo' },
      { id: 'mal-olor', label: 'Mal olor' },
    ],
  },
  {
    id: 'servicios-ti-conectividad',
    label: 'Servicios TI y Conectividad',
    color: '#2563eb',
    subtypes: [
      { id: 'falla-conectividad', label: 'Falla en conectividad' },
      { id: 'dano-equipos-computo', label: 'Daños en equipos de computo' },
      { id: 'falla-sistemas-institucionales', label: 'Falla en sistemas institucionales' },
    ],
  },

  {
    id: 'otro',
    label: 'Otro',
    color: '#6b7280',
    subtypes: [],
  },

 
];

export const RISK_LEVELS = [
  { id: 'bajo', label: 'Bajo', color: '#16a34a' },
  { id: 'medio', label: 'Medio', color: '#d97706' },
  { id: 'alto', label: 'Alto', color: '#dc2626' },
  { id: 'critico', label: 'Critico', color: '#991b1b' },
];

export const REPORT_STATUSES = [
  { id: 'pendiente', label: 'Pendiente', color: '#d97706' },
  { id: 'en-revision', label: 'En revision', color: '#2563eb' },
  { id: 'asignado', label: 'Asignado', color: '#7c3aed' },
  { id: 'en-proceso', label: 'En proceso', color: '#0891b2' },
  { id: 'resuelto', label: 'Resuelto', color: '#16a34a' },
  { id: 'cerrado', label: 'Cerrado', color: '#0f766e' },
  { id: 'rechazado', label: 'Rechazado', color: '#dc2626' },
];

export const RESOLUTION_STATUSES = [
  { id: 'enviada', label: 'Enviada', color: '#2563eb' },
  { id: 'aprobada', label: 'Aprobada', color: '#16a34a' },
  { id: 'descartada', label: 'Descartada', color: '#dc2626' },
];

export const CAMPUS_LOCATIONS = [
  { id: 'bloque-a', label: 'Bloque A', coordinates: { lat: 3.3759, lng: -76.5325 } },
  { id: 'bloque-b', label: 'Bloque B', coordinates: { lat: 3.3763, lng: -76.5321 } },
  { id: 'biblioteca', label: 'Biblioteca Mario Carvajal', coordinates: { lat: 3.3754, lng: -76.5330 } },
  { id: 'laboratorios', label: 'Laboratorios', coordinates: { lat: 3.3749, lng: -76.5318 } },
  { id: 'cafeteria-central', label: 'Cafeteria Central', coordinates: { lat: 3.3757, lng: -76.5312 } },
  { id: 'cdu', label: 'CDU - Centro deportivo universitario', coordinates: { lat: 3.3770, lng: -76.5340 } },
  { id: 'area-comun', label: 'Area comun', coordinates: null },
  { id: 'otro', label: 'Otro lugar del campus', coordinates: null },
];

export const INITIAL_REPORTS = [
  {
    id: 'rep-demo-001',
    title: 'Fuga de agua en laboratorio',
    description: 'Se observa una fuga constante cerca del lavamanos del laboratorio.',
    categoryId: 'infraestructura-mantenimiento',
    subtypeId: 'falla-plomeria',
    customContext: '',
    riskLevelId: 'medio',
    locationId: 'laboratorios',
    locationName: 'Laboratorios',
    coordinates: { lat: 3.3749, lng: -76.5318 },
    incidentDate: '2026-05-20',
    evidences: [],
    statusId: 'asignado',
    createdBy: '2024001',
    assignedTo: 'OP001',
    assignedAt: '2026-05-21T09:00:00.000Z',
    createdAt: '2026-05-20T14:30:00.000Z',
    history: [
      {
        statusId: 'pendiente',
        at: '2026-05-20T14:30:00.000Z',
        by: '2024001',
        note: 'Reporte creado por el usuario.',
      },
      {
        statusId: 'asignado',
        at: '2026-05-21T09:00:00.000Z',
        by: 'gestor-demo',
        note: 'Reporte asignado al operador.',
      },
    ],
  },
  {
    id: 'rep-demo-002',
    title: 'Toma electrica sin cubierta',
    description: 'Hay una toma electrica expuesta en un salon del Bloque A.',
    categoryId: 'infraestructura-mantenimiento',
    subtypeId: 'falla-electrica',
    customContext: '',
    riskLevelId: 'alto',
    locationId: 'bloque-a',
    locationName: 'Bloque A',
    coordinates: { lat: 3.3759, lng: -76.5325 },
    incidentDate: '2026-05-19',
    evidences: [],
    statusId: 'resuelto',
    createdBy: 'DOC001',
    assignedTo: 'OP001',
    assignedAt: '2026-05-20T08:20:00.000Z',
    createdAt: '2026-05-19T15:15:00.000Z',
    resolution: {
      id: 'res-demo-001',
      description: 'Se instalo una cubierta nueva y se verifico que la toma quedara segura.',
      evidences: [],
      statusId: 'enviada',
      sentAt: '2026-05-21T11:10:00.000Z',
      feedback: '',
    },
    history: [
      {
        statusId: 'pendiente',
        at: '2026-05-19T15:15:00.000Z',
        by: 'DOC001',
        note: 'Reporte creado por el usuario.',
      },
      {
        statusId: 'asignado',
        at: '2026-05-20T08:20:00.000Z',
        by: 'gestor-demo',
        note: 'Reporte asignado al operador.',
      },
      {
        statusId: 'resuelto',
        at: '2026-05-21T11:10:00.000Z',
        by: 'OP001',
        note: 'Resolucion enviada por el operador.',
      },
    ],
  },
];

export const CLEANVALLE_SCHEMA_DUMP = {
  users: {
    fields: ['codeUser', 'firstName', 'lastName', 'email', 'dniUser', 'typeDniId', 'genderId', 'role', 'specializationIds'],
    roles: Object.keys(USER_ROLES),
  },
  reports: {
    fields: [
      'id',
      'title',
      'description',
      'categoryId',
      'subtypeId',
      'customContext',
      'riskLevelId',
      'locationId',
      'locationName',
      'coordinates',
      'incidentDate',
      'evidences',
      'statusId',
      'createdBy',
      'createdAt',
      'history',
    ],
    statuses: REPORT_STATUSES.map((status) => status.id),
  },
  resolutions: {
    fields: ['id', 'description', 'evidences', 'statusId', 'sentAt', 'feedback'],
    statuses: RESOLUTION_STATUSES.map((status) => status.id),
  },
  operatorNotifications: {
    fields: ['id', 'title', 'detail', 'at', 'reportId'],
  },
};
