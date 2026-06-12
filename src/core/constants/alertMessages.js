export const ALERT_TYPES = Object.freeze({
  ERROR: 'error',
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info',
});

export const ALERT_DEFAULTS = Object.freeze({
  duration: 5000,
  errorTitle: 'No pudimos completar la acción',
  successTitle: 'Acción completada',
  warningTitle: 'Revisa la información',
  infoTitle: 'Información',
  validationTitle: 'Hay información por corregir',
  fallbackError: 'Ocurrió un error inesperado. Intenta nuevamente.',
});

export const ALERT_MESSAGES = Object.freeze({
  validation: {
    form: 'Revisa los campos marcados antes de continuar.',
  },
  auth: {
    invalidCredentials: 'Credenciales incorrectas. Verifica el correo y la contraseña.',
    recoverySent: 'Enviamos las instrucciones de recuperación al correo indicado.',
    passwordUpdated: 'La contraseña fue actualizada correctamente.',
  },
  reports: {
    created: 'El reporte fue enviado correctamente.',
    resolutionSent: 'La resolución fue enviada correctamente para revisión.',
    assigned: 'El reporte fue asignado correctamente.',
    discarded: 'El reporte fue descartado y se conservará para auditoría.',
  },
});

