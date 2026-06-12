export const CONFIRMATION_MESSAGES = Object.freeze({
  session: {
    logout: {
      title: 'Cerrar sesión',
      reason: '¿Deseas cerrar tu sesión actual?',
      acceptLabel: 'Cerrar sesión',
      rejectLabel: 'Cancelar',
      variant: 'destructive',
    },
  },
  profile: {
    changeEmail: (email) => ({
      title: 'Cambiar correo electrónico',
      reason: `El correo de acceso se cambiará a ${email}.`,
      acceptLabel: 'Cambiar correo',
      rejectLabel: 'Cancelar',
    }),
    changePassword: {
      title: 'Cambiar contraseña',
      reason:
        'Se verificará tu contraseña actual antes de reemplazarla por la nueva.',
      acceptLabel: 'Cambiar contraseña',
      rejectLabel: 'Cancelar',
    },
  },
  authentication: {
    recoverPassword: {
      title: 'Restablecer contraseña',
      reason:
        'Se reemplazará la contraseña de tu cuenta para recuperar el acceso.',
      acceptLabel: 'Restablecer contraseña',
      rejectLabel: 'Cancelar',
    },
  },
  reports: {
    create: (title) => ({
      title: 'Enviar reporte',
      reason: `Se registrará ${title ? `"${title}"` : 'el reporte'} con la información proporcionada.`,
      acceptLabel: 'Enviar reporte',
      rejectLabel: 'Cancelar',
    }),
    delete: {
      title: 'Eliminar reporte',
      reason: 'El reporte pendiente será eliminado y esta acción no se puede deshacer.',
      acceptLabel: 'Eliminar reporte',
      rejectLabel: 'Cancelar',
      variant: 'destructive',
    },
    submitResolution: {
      title: 'Enviar resolución',
      reason: 'La resolución quedará registrada para revisión.',
      acceptLabel: 'Enviar resolución',
      rejectLabel: 'Cancelar',
    },
    updateMetadata: {
      title: 'Actualizar clasificacion',
      reason: 'Se guardaran el riesgo, la razon y la ubicacion seleccionados.',
      acceptLabel: 'Guardar cambios',
      rejectLabel: 'Cancelar',
    },
    updateClassificationAndOperators: {
      title: 'Actualizar clasificación',
      reason:
        'Se guardará la nueva categoría y razón, y se buscarán inmediatamente los operadores compatibles.',
      acceptLabel: 'Actualizar y buscar',
      rejectLabel: 'Cancelar',
    },
    assign: (operatorName) => ({
      title: 'Asignar reporte',
      reason: `El reporte quedara asignado a ${operatorName || 'este operador'}.`,
      acceptLabel: 'Confirmar asignacion',
      rejectLabel: 'Cancelar',
    }),
    discard: (title) => ({
      title: 'Descartar reporte',
      reason: `${title ? `"${title}"` : 'El reporte'} quedara registrado para auditoria, pero saldra de los listados operativos.`,
      acceptLabel: 'Descartar reporte',
      rejectLabel: 'Cancelar',
      variant: 'destructive',
    }),
    approveResolution: {
      title: 'Aprobar resolucion',
      reason: 'El reporte quedara resuelto y la asignacion se cerrara.',
      acceptLabel: 'Aprobar',
      rejectLabel: 'Cancelar',
    },
    rejectResolution: {
      title: 'Descartar resolucion',
      reason: 'El operador recibira el comentario y podra enviar una nueva resolucion.',
      acceptLabel: 'Descartar',
      rejectLabel: 'Cancelar',
      variant: 'destructive',
    },
  },
  users: {
    create: (name) => ({
      title: 'Registrar y enviar invitación',
      reason: `Se registrará el perfil de ${name || 'este usuario'} y se enviará un enlace para que cree su contraseña.`,
      acceptLabel: 'Enviar invitación',
      rejectLabel: 'Cancelar',
    }),
    setInvitationPassword: {
      title: 'Crear contraseña',
      reason:
        'La contraseña quedará asociada únicamente a tu cuenta y completará la activación de tu acceso.',
      acceptLabel: 'Crear contraseña',
      rejectLabel: 'Cancelar',
    },
    update: (name) => ({
      title: 'Modificar usuario',
      reason: `Se guardarán los cambios realizados a ${name || 'este usuario'}.`,
      acceptLabel: 'Guardar cambios',
      rejectLabel: 'Cancelar',
    }),
    delete: {
      title: 'Eliminar usuario',
      reason: 'La cuenta perderá el acceso de forma permanente. Sus registros se conservarán para auditoría.',
      acceptLabel: 'Eliminar usuario',
      rejectLabel: 'Cancelar',
      variant: 'destructive',
    },
  },
  reportTypes: {
    create: (name) => ({
      title: 'Crear tipo de reporte',
      reason: `Se creará ${name || 'el tipo de reporte'} con sus razones asociadas.`,
      acceptLabel: 'Crear tipo',
      rejectLabel: 'Cancelar',
    }),
    update: (name) => ({
      title: 'Modificar tipo de reporte',
      reason: `Se guardarán los cambios de ${name || 'este tipo'} y sus razones asociadas.`,
      acceptLabel: 'Guardar cambios',
      rejectLabel: 'Cancelar',
    }),
    delete: {
      title: 'Eliminar tipo de reporte',
      reason: 'El tipo y sus razones dejarán de estar disponibles de forma permanente. Los registros existentes se conservarán.',
      acceptLabel: 'Eliminar tipo',
      rejectLabel: 'Cancelar',
      variant: 'destructive',
    },
  },
  locations: {
    create: (name) => ({
      title: 'Crear localización',
      reason: `Se creará ${name || 'la localización'} con sus ubicaciones específicas.`,
      acceptLabel: 'Crear localización',
      rejectLabel: 'Cancelar',
    }),
    update: (name) => ({
      title: 'Modificar localización',
      reason: `Se guardarán los cambios de ${name || 'esta localización'} y sus subáreas.`,
      acceptLabel: 'Guardar cambios',
      rejectLabel: 'Cancelar',
    }),
    delete: {
      title: 'Eliminar localización',
      reason: 'El lugar y sus ubicaciones específicas dejarán de estar disponibles de forma permanente.',
      acceptLabel: 'Eliminar localización',
      rejectLabel: 'Cancelar',
      variant: 'destructive',
    },
  },
  specializations: {
    create: (name) => ({
      title: 'Crear especialización',
      reason: `Se creará ${name || 'la especialización'} y quedará disponible para operadores.`,
      acceptLabel: 'Crear especialización',
      rejectLabel: 'Cancelar',
    }),
    update: (name) => ({
      title: 'Modificar especialización',
      reason: `Se guardarán los cambios de ${name || 'esta especialización'}.`,
      acceptLabel: 'Guardar cambios',
      rejectLabel: 'Cancelar',
    }),
    delete: {
      title: 'Eliminar especialización',
      reason: 'Solo se eliminará si no está asignada a ningún operador.',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      variant: 'destructive',
    },
  },
});
