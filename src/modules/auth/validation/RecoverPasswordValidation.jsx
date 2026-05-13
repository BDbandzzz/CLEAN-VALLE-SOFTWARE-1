/**
 * Validación del flujo de recuperación (sin UI).
 */

export function validateRecoverEmail(email) {
  const trimmed = String(email).trim();
  if (!trimmed) {
    return { ok: false, message: 'Ingresa tu correo electrónico.' };
  }
  if (!/\S+@\S+\.\S+/.test(trimmed)) {
    return { ok: false, message: 'El correo no tiene un formato válido.' };
  }
  return { ok: true, email: trimmed };
}
