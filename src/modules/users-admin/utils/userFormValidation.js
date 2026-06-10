import { isOperatorRoleId } from '@/core/mappers/domainMappers';

export function validateUserForm(formData, users, options = {}) {
  const { mode = 'create', currentUserId = null } = options;
  const errors = {};
  const requiredFields = [
    ['codeUser', 'El código institucional es obligatorio.'],
    ['firstName', 'Los nombres son obligatorios.'],
    ['lastName', 'Los apellidos son obligatorios.'],
    ['dniUser', 'El documento es obligatorio.'],
    ['typeDniId', 'Selecciona el tipo de documento.'],
    ['genderId', 'Selecciona el género.'],
    ['roleId', 'Selecciona el rol del usuario.'],
  ];

  if (mode === 'create') {
    requiredFields.push(['email', 'El correo electrónico es obligatorio.']);
  }

  requiredFields.forEach(([field, message]) => {
    if (!String(formData[field] ?? '').trim()) errors[field] = message;
  });

  const normalizedEmail = formData.email.trim().toLowerCase();
  const normalizedCode = formData.codeUser.trim().toLowerCase();
  const normalizedDni = formData.dniUser.trim().toLowerCase();
  const isSameUser = (user) => String(user.id) === String(currentUserId);

  if (mode === 'create' && normalizedEmail && !/\S+@\S+\.\S+/.test(normalizedEmail)) {
    errors.email = 'Ingresa un correo electrónico válido.';
  }

  if (users.some((user) => !isSameUser(user) && user.codeUser?.trim().toLowerCase() === normalizedCode)) {
    errors.codeUser = 'Ya existe un usuario con este código.';
  }

  if (
    mode === 'create' &&
    users.some((user) => !isSameUser(user) && user.email?.trim().toLowerCase() === normalizedEmail)
  ) {
    errors.email = 'Ya existe un usuario con este correo.';
  }

  if (users.some((user) => !isSameUser(user) && user.dniUser?.trim().toLowerCase() === normalizedDni)) {
    errors.dniUser = 'Ya existe un usuario con este documento.';
  }

  if (isOperatorRoleId(formData.roleId) && formData.specializationIds.length === 0) {
    errors.specializationIds = 'Selecciona al menos una especialidad para el operador.';
  }

  return errors;
}
