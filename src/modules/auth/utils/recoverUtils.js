/**
 * Utilidades del flujo de recuperacion de contrasena.
 */
export function validateRecoverEmail(email) {
  const trimmed = String(email).trim();

  if (!trimmed) {
    return { ok: false, message: 'Ingresa tu correo electronico.' };
  }

  if (!/\S+@\S+\.\S+/.test(trimmed)) {
    return { ok: false, message: 'El correo no tiene un formato valido.' };
  }

  return { ok: true, email: trimmed };
}
