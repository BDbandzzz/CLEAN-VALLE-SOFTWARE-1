export const TOKEN_ROLES = {
  ROLE_STUDENT: 'estudiante',
  ROLE_PROFESSOR: 'profesor',
  ROLE_OPERATOR: 'operador',
};

export function normalizeRole(rawRole) {
  const role = String(rawRole ?? '').trim().toUpperCase();
  if (TOKEN_ROLES[role]) return TOKEN_ROLES[role];

  const catalogRole = String(rawRole ?? '').trim().toLowerCase();
  return Object.values(TOKEN_ROLES).includes(catalogRole) ? catalogRole : 'estudiante';
}
