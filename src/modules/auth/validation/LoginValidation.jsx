/**
 * Reglas de negocio y validación del login (sin UI).
 * El diseño vive en `LoginPage.jsx`.
 */

export const defaultLoginProfile = {
  firstName: '',
  lastName: '',
  email: '',
  dniUser: '',
  typeDni: '',
  gender: '',
  userCredentials: '',
};

export function getRoleFromCredentials(codeValue) {
  const normalized = String(codeValue).toLowerCase().trim();

  if (normalized === '2455194-2724') {
    return 'estudiante';
  }
  if (normalized.startsWith('pro')) {
    return 'profesor';
  }
  if (normalized.startsWith('ope')) {
    return 'operador';
  }
  if (normalized.startsWith('adm')) {
    return 'admin';
  }

  return 'estudiante';
}

export function buildLoginUserPayload(code, password = '') {
  void password;
  const trimmed = code.trim();
  const role = getRoleFromCredentials(trimmed);

  return {
    ...defaultLoginProfile,
    id: trimmed || `user_${Date.now()}`,
    firstName: "Brayan David",
    lastName: "Garzon Arboleda",
    dniUser: "1123121814" || `TEST${Date.now()}`,
    role: "Estudiante",
  };
}
