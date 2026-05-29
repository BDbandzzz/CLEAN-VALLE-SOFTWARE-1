export const USER_ROLES = {
  estudiante: 'Estudiante',
  profesor: 'Profesor',
  operador: 'Operador',
  gestor: 'Gestor de reportes',
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
  {
    id: 'GES001',
    codeUser: 'GES001',
    password: 'demo1234',
    role: 'gestor',
    firstName: 'Gestor',
    lastName: 'Reportes',
    email: 'gestor@correounivalle.edu.co',
    dniUser: '4000000001',
    typeDniId: 1,
    genderId: 3,
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
    description: 'Daños físicos en edificios, mobiliario y servicios básicos',
    color: '#0f766e',
    subtypes: [
      { id: 'dano-estructural', label: 'Daño estructural' },
      { id: 'dano-mobiliario', label: 'Daño en mobiliario', description: 'Sillas, mesas, tableros, lockers rotos o en mal estado' },
      { id: 'falla-electrica', label: 'Falla eléctrica', description: 'Cortos, tomacorrientes dañados, alumbrado apagado' },
      { id: 'falla-plomeria', label: 'Falla en plomeria' },
      { id: 'dano-vias-internas', label: 'Daño en vías internas', description: 'Andenes, rampas, ciclovías o senderos deteriorados' },
    ],
  },
  {
    id: 'seguridad-convivencia',
    label: 'Seguridad y Convivencia',
    description: 'Incidentes que afecten la seguridad o convivencia',
    color: '#dc2626',
    subtypes: [
      { id: 'incidente-seguridad', label: 'Incidente de seguridad', description: 'Robo, hurto, agresión o situación que comprometa la integridad' },
      { id: 'acceso-no-autorizado', label: 'Acceso no autorizado', description: 'Personas sin credenciales en zonas restringidas' },
      { id: 'acoso-discriminacion', label: 'Acoso o discriminacion' },
      { id: 'emergencia-medica', label: 'Emergencia medica' },
    ],
  },
  {
    id: 'medio-ambiente-espacios',
    label: 'Medio Ambiente y Espacios',
    description: 'Problemas ambientales, plagas y zonas verdes',
    color: '#16a34a',
    subtypes: [
      { id: 'plaga-fauna-nociva', label: 'Plaga o fauna nociva', description: 'Presencia de roedores, insectos u otras plagas' },
      { id: 'arbol-zona-verde-riesgo', label: 'Árbol o zona verde en riesgo', description: 'Árboles caídos, ramas peligrosas, zonas verdes con daño' },
      { id: 'ruido-excesivo', label: 'Ruido excesivo', description: 'Fuentes de ruido que afectan clases o trabajo académico' },
      { id: 'mal-olor', label: 'Mal olor', description: 'Focos de malos olores que afecten la salubridad del espacio' },
    ],
  },
  {
    id: 'servicios-ti-conectividad',
    label: 'Servicios TI y Conectividad',
    description: 'Fallas en tecnología, redes y sistemas institucionales',
    color: '#2563eb',
    subtypes: [
      { id: 'falla-conectividad', label: 'Falla en conectividad', description: 'Puntos de WiFi caídos o sin señal en zonas del campus' },
      { id: 'dano-equipos-computo', label: 'Daños en equipos de computo' },
      { id: 'falla-sistemas-institucionales', label: 'Falla en sistemas institucionales', description: 'Plataformas académicas, acceso o pantallas informativas' },
    ],
  },

  {
    id: 'accesibilidad',
    label: 'Accesibilidad',
    description: 'Barreras que limiten el acceso a personas con discapacidad',
    color: '#7c3aed',
    subtypes: [],
  },

  {
    id: 'residuos-aseo',
    label: 'Residuos y aseo',
    description: 'Manejo inadecuado de residuos y limpieza',
    color: '#059669',
    subtypes: [
      { id: 'acumulacion-basuras', label: 'Acumulación de basuras', description: 'Residuos acumulados en zonas no designadas' },
      { id: 'contenedor-danado', label: 'Contenedor dañado', description: 'Canecas o contenedores rotos o desbordados' },
    ],
  },

  {
    id: 'falla-hidrica',
    label: 'Falla hídrica',
    description: 'Problemas relacionados con el agua',
    color: '#0891b2',
    subtypes: [
      { id: 'fuga-agua', label: 'Fuga de agua', description: 'Pérdida visible de agua en tuberías o superficies' },
      { id: 'agua-sin-suministro', label: 'Agua sin suministro', description: 'Ausencia de agua en baños o zonas de uso común' },
    ],
  },

  {
    id: 'contaminacion-ambiental',
    label: 'Contaminación ambiental',
    description: 'Contaminación del aire, suelo o agua en el campus',
    color: '#65a30d',
    subtypes: [
      { id: 'contaminacion-aire', label: 'Contaminación del aire', description: 'Humos, gases o partículas que afecten la calidad del aire' },
      { id: 'contaminacion-suelo', label: 'Contaminación del suelo', description: 'Derrames o residuos peligrosos en el suelo' },
    ],
  },

  {
    id: 'otro',
    label: 'Otro',
    description: 'Categoría abierta para reportes que no encajan en ninguna otra',
    color: '#6b7280',
    subtypes: [
      { id: 'otro', label: 'Otro', description: 'El usuario describe libremente el problema. Requiere contexto adicional.' },
    ],
  },

 
];

export const RISK_LEVELS = [
  { id: 'bajo', label: 'Bajo', color: '#16a34a', priorityScore: 25, responseTimeHours: 120 },
  { id: 'medio', label: 'Medio', color: '#d97706', priorityScore: 50, responseTimeHours: 48 },
  { id: 'alto', label: 'Alto', color: '#dc2626', priorityScore: 75, responseTimeHours: 12 },
  { id: 'critico', label: 'Critico', color: '#991b1b', priorityScore: 100, responseTimeHours: 2 },
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

export const RESOLUTION_QUALITIES = [
  { id: 'muy-baja', label: 'Muy baja', score: 1, color: '#dc2626' },
  { id: 'baja', label: 'Baja', score: 2, color: '#ea580c' },
  { id: 'aceptable', label: 'Aceptable', score: 3, color: '#d97706' },
  { id: 'buena', label: 'Buena', score: 4, color: '#16a34a' },
  { id: 'excelente', label: 'Excelente', score: 5, color: '#0f766e' },
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
      reviewStatusId: 'aprobada',
      qualityId: 'buena',
      resolutionMethod: 'Reposicion de cubierta y verificacion electrica',
      sentAt: '2026-05-21T11:10:00.000Z',
      reviewedAt: '2026-05-22T10:00:00.000Z',
      feedback: 'La solucion es adecuada y la evidencia es suficiente.',
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
    fields: ['id', 'description', 'evidences', 'reviewStatusId', 'qualityId', 'resolutionMethod', 'sentAt', 'reviewedAt', 'feedback'],
    statuses: RESOLUTION_STATUSES.map((status) => status.id),
    qualities: RESOLUTION_QUALITIES.map((quality) => quality.id),
  },
  operatorNotifications: {
    fields: ['id', 'title', 'detail', 'at', 'reportId'],
  },
};
