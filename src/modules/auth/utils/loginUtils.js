/**
 * Utilidades de autenticación y login.
 */

// Ya no construimos perfiles mockeados aquí, el backend se encargará de validar
// y devolver el payload del usuario (incluido en el JWT y su perfil respectivo).

// Si necesitas utilidades futuras de auth (ej. validaciones de código) puedes colocarlas aquí.
export function validateLoginCode(code) {
  if (!code || code.trim().length === 0) return false;
  return true;
}
