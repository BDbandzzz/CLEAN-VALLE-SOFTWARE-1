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
      reason: 'La contraseña actual será reemplazada por la nueva.',
      acceptLabel: 'Cambiar contraseña',
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
  },
  users: {
    create: (name) => ({
      title: 'Crear usuario',
      reason: `Se creará la cuenta de ${name || 'este usuario'} y se habilitará su acceso al sistema.`,
      acceptLabel: 'Crear usuario',
      rejectLabel: 'Cancelar',
    }),
    update: (name) => ({
      title: 'Modificar usuario',
      reason: `Se guardarán los cambios realizados a ${name || 'este usuario'}.`,
      acceptLabel: 'Guardar cambios',
      rejectLabel: 'Cancelar',
    }),
    deactivate: {
      title: 'Desactivar usuario',
      reason: 'La cuenta perderá el acceso. Sus registros permanecerán almacenados.',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      variant: 'destructive',
    },
    reactivate: {
      title: 'Reactivar usuario',
      reason: 'La cuenta recuperará el acceso al sistema.',
      acceptLabel: 'Reactivar',
      rejectLabel: 'Cancelar',
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
    deactivate: {
      title: 'Deshabilitar tipo de reporte',
      reason: 'El tipo dejará de estar disponible para crear reportes.',
      acceptLabel: 'Deshabilitar',
      rejectLabel: 'Cancelar',
      variant: 'destructive',
    },
    reactivate: {
      title: 'Reactivar tipo de reporte',
      reason: 'El tipo volverá a estar disponible para crear reportes.',
      acceptLabel: 'Reactivar',
      rejectLabel: 'Cancelar',
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
    deactivate: {
      title: 'Desactivar localización',
      reason: 'El lugar dejará de estar disponible al crear reportes.',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      variant: 'destructive',
    },
    reactivate: {
      title: 'Reactivar localización',
      reason: 'El lugar volverá a estar disponible al crear reportes.',
      acceptLabel: 'Reactivar',
      rejectLabel: 'Cancelar',
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
