export const APP_ERROR_CODES = Object.freeze({
  LOCATION_NAME_REQUIRED: 'CV101',
  LOCATION_DESCRIPTION_REQUIRED: 'CV102',
  LOCATION_SUBAREAS_INVALID: 'CV103',
  SUBAREA_NAME_REQUIRED: 'CV104',
  SUBAREA_DESCRIPTION_REQUIRED: 'CV105',
  LOCATION_NOT_FOUND: 'CV106',
  SUBAREA_NOT_FOUND: 'CV107',
});

export const EDGE_ERROR_CODES = Object.freeze({
  METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',
  FUNCTION_NOT_CONFIGURED: 'FUNCTION_NOT_CONFIGURED',
  SESSION_REQUIRED: 'SESSION_REQUIRED',
  SESSION_INVALID: 'SESSION_INVALID',
  ADMIN_REQUIRED: 'ADMIN_REQUIRED',
  INVALID_PAYLOAD: 'INVALID_PAYLOAD',
  INVALID_EMAIL: 'INVALID_EMAIL',
  ADMIN_ROLE_NOT_ALLOWED: 'ADMIN_ROLE_NOT_ALLOWED',
  OPERATOR_SPECIALIZATION_REQUIRED: 'OPERATOR_SPECIALIZATION_REQUIRED',
  REDIRECT_MISMATCH: 'REDIRECT_MISMATCH',
  EMAIL_ALREADY_REGISTERED: 'EMAIL_ALREADY_REGISTERED',
  USER_CODE_ALREADY_REGISTERED: 'USER_CODE_ALREADY_REGISTERED',
  USER_DOCUMENT_ALREADY_REGISTERED: 'USER_DOCUMENT_ALREADY_REGISTERED',
  INVITATION_FAILED: 'INVITATION_FAILED',
  PROFILE_CREATION_FAILED: 'PROFILE_CREATION_FAILED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
});

export const CONTROLLED_ERROR_MESSAGES = Object.freeze({
  [APP_ERROR_CODES.LOCATION_NAME_REQUIRED]:
    'El nombre de la localización es obligatorio.',
  [APP_ERROR_CODES.LOCATION_DESCRIPTION_REQUIRED]:
    'La descripción de la localización es obligatoria.',
  [APP_ERROR_CODES.LOCATION_SUBAREAS_INVALID]:
    'Las ubicaciones específicas no tienen un formato válido.',
  [APP_ERROR_CODES.SUBAREA_NAME_REQUIRED]:
    'Todas las ubicaciones específicas deben tener nombre.',
  [APP_ERROR_CODES.SUBAREA_DESCRIPTION_REQUIRED]:
    'Todas las ubicaciones específicas deben tener una descripción.',
  [APP_ERROR_CODES.LOCATION_NOT_FOUND]:
    'La localización seleccionada ya no existe.',
  [APP_ERROR_CODES.SUBAREA_NOT_FOUND]:
    'Una ubicación específica no pertenece a la localización seleccionada.',
  [EDGE_ERROR_CODES.METHOD_NOT_ALLOWED]:
    'La operación solicitada no está disponible.',
  [EDGE_ERROR_CODES.FUNCTION_NOT_CONFIGURED]:
    'El servicio de invitaciones no está configurado.',
  [EDGE_ERROR_CODES.SESSION_REQUIRED]:
    'Debes iniciar sesión para registrar usuarios.',
  [EDGE_ERROR_CODES.SESSION_INVALID]:
    'Tu sesión venció. Inicia sesión nuevamente.',
  [EDGE_ERROR_CODES.ADMIN_REQUIRED]:
    'Esta operación requiere una cuenta de administrador activa.',
  [EDGE_ERROR_CODES.INVALID_PAYLOAD]:
    'Revisa los datos obligatorios del usuario.',
  [EDGE_ERROR_CODES.INVALID_EMAIL]:
    'El correo electrónico no es válido.',
  [EDGE_ERROR_CODES.ADMIN_ROLE_NOT_ALLOWED]:
    'No puedes registrar otro administrador desde este módulo.',
  [EDGE_ERROR_CODES.OPERATOR_SPECIALIZATION_REQUIRED]:
    'Selecciona al menos una especialidad para el operador.',
  [EDGE_ERROR_CODES.REDIRECT_MISMATCH]:
    'La dirección de invitación no coincide con la configuración del sistema.',
  [EDGE_ERROR_CODES.EMAIL_ALREADY_REGISTERED]:
    'Ya existe una cuenta registrada con este correo electrónico.',
  [EDGE_ERROR_CODES.USER_CODE_ALREADY_REGISTERED]:
    'Ya existe un usuario con este código institucional.',
  [EDGE_ERROR_CODES.USER_DOCUMENT_ALREADY_REGISTERED]:
    'Ya existe un usuario con este número de documento.',
  [EDGE_ERROR_CODES.INVITATION_FAILED]:
    'No fue posible enviar la invitación al usuario.',
  [EDGE_ERROR_CODES.PROFILE_CREATION_FAILED]:
    'No fue posible guardar los datos del usuario.',
  [EDGE_ERROR_CODES.INTERNAL_ERROR]:
    'No fue posible registrar el usuario. Intenta nuevamente.',
});

export const SERVICE_ERROR_MESSAGES = Object.freeze({
  fallback: 'No fue posible completar la acción. Intenta nuevamente.',
  auth: {
    login: 'No fue posible iniciar sesión. Verifica tus datos e intenta nuevamente.',
    profile: 'No fue posible cargar los datos de tu cuenta.',
    logout: 'No fue posible cerrar la sesión correctamente.',
    session: 'No fue posible validar la sesión actual.',
    password: 'No fue posible actualizar la contraseña.',
    email: 'No fue posible actualizar el correo electrónico.',
    invitation: 'La invitación no es válida, venció o ya fue utilizada.',
    recovery: 'El enlace de recuperación no es válido, venció o ya fue utilizado.',
    recoveryEmail: 'No fue posible enviar el correo de recuperación.',
  },
  dashboard: {
    admin: 'No fue posible cargar el panel administrativo.',
  },
  users: {
    catalogs: 'No fue posible cargar los datos del formulario de usuarios.',
    list: 'No fue posible cargar los usuarios.',
    create: 'No fue posible registrar ni enviar la invitación al usuario.',
    update: 'No fue posible actualizar el usuario.',
    delete: 'No fue posible eliminar el usuario.',
  },
  locations: {
    list: 'No fue posible cargar las localizaciones.',
    create: 'No fue posible crear la localización.',
    update: 'No fue posible actualizar la localización.',
    delete: 'No fue posible eliminar la localización.',
  },
  reportTypes: {
    list: 'No fue posible cargar los tipos de reporte.',
    create: 'No fue posible crear el tipo de reporte.',
    update: 'No fue posible actualizar el tipo de reporte.',
    delete: 'No fue posible eliminar el tipo de reporte.',
  },
  specializations: {
    list: 'No fue posible cargar las especializaciones.',
    categories: 'No fue posible cargar las categorías disponibles.',
    create: 'No fue posible crear la especialización.',
    update: 'No fue posible actualizar la especialización.',
    delete: 'No fue posible eliminar la especialización.',
  },
  reports: {
    catalogs: 'No fue posible cargar las opciones de reportes.',
    create: 'No fue posible crear el reporte.',
    list: 'No fue posible cargar tus reportes.',
    resolved: 'No fue posible cargar los reportes resueltos.',
    photos: 'No fue posible guardar las imágenes del reporte.',
  },
  manager: {
    dashboard: 'No fue posible cargar la gestión de reportes.',
    detail: 'No fue posible cargar el reporte.',
    metadata: 'No fue posible actualizar la clasificación del reporte.',
    operators: 'No fue posible cargar los operadores disponibles.',
    assign: 'No fue posible asignar el reporte.',
    discard: 'No fue posible descartar el reporte.',
    resolutions: 'No fue posible cargar las resoluciones.',
    review: 'No fue posible guardar la revisión.',
    createGroup: 'No fue posible crear el grupo de reportes.',
    groups: 'No fue posible cargar los grupos de reportes.',
    groupDetail: 'No fue posible cargar el grupo de reportes.',
    groupOperators: 'No fue posible cargar los operadores disponibles.',
    assignGroup: 'No fue posible asignar el grupo de reportes.',
  },
  operator: {
    dashboard: 'No fue posible cargar tus asignaciones.',
    resolution: 'No fue posible enviar la resolución.',
    reject: 'No fue posible rechazar la asignación.',
    photos: 'No fue posible guardar las imágenes de la resolución.',
  },
  notifications: {
    list: 'No fue posible cargar las notificaciones.',
    markRead: 'No fue posible actualizar la notificación.',
    markAllRead: 'No fue posible actualizar las notificaciones.',
  },
  storage: {
    upload: 'No fue posible subir las imágenes.',
    read: 'No fue posible cargar las imágenes.',
  },
});
