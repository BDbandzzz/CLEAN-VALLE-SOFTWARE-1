export function validateUserForm(formData, users) {
  const errors = {};
  const requiredFields = [
    ['codeUser', 'El código institucional es obligatorio.'],
    ['firstName', 'Los nombres son obligatorios.'],
    ['lastName', 'Los apellidos son obligatorios.'],
    ['email', 'El correo electrónico es obligatorio.'],
    ['dniUser', 'El documento es obligatorio.'],
    ['typeDniId', 'Selecciona el tipo de documento.'],
    ['genderId', 'Selecciona el género.'],
    ['role', 'Selecciona el rol del usuario.'],
  ];

  requiredFields.forEach(([field, message]) => {
    if (!String(formData[field] ?? '').trim()) errors[field] = message;
  });

  const normalizedEmail = formData.email.trim().toLowerCase();
  const normalizedCode = formData.codeUser.trim().toLowerCase();
  const normalizedDni = formData.dniUser.trim().toLowerCase();

  if (normalizedEmail && !/\S+@\S+\.\S+/.test(normalizedEmail)) {
    errors.email = 'Ingresa un correo electrónico válido.';
  }

  if (users.some((user) => user.codeUser?.trim().toLowerCase() === normalizedCode)) {
    errors.codeUser = 'Ya existe un usuario con este código.';
  }

  if (users.some((user) => user.email?.trim().toLowerCase() === normalizedEmail)) {
    errors.email = 'Ya existe un usuario con este correo.';
  }

  if (users.some((user) => user.dniUser?.trim().toLowerCase() === normalizedDni)) {
    errors.dniUser = 'Ya existe un usuario con este documento.';
  }

  if (formData.role === 'operador' && formData.specializationIds.length === 0) {
    errors.specializationIds = 'Selecciona al menos una especialidad para el operador.';
  }

  return errors;
}
