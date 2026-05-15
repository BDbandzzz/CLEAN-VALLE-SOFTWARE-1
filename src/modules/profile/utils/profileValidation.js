/**
 * Validaciones del perfil (sin UI).
 * El diseño vive en `ProfilePage.jsx`.
 */

export function validateProfileForm(formData) {
  const email = String(formData.email ?? '').trim();
  if (email && !/\S+@\S+\.\S+/.test(email)) {
    return { ok: false, message: { type: 'error', text: 'El email no tiene un formato válido' } };
  }
  return { ok: true };
}

export function validatePasswordChangeForm(passwordData) {
  if (!passwordData.currentPassword) {
    return { ok: false, message: { type: 'error', text: 'La contraseña actual es obligatoria' } };
  }
  if (!passwordData.newPassword) {
    return { ok: false, message: { type: 'error', text: 'La nueva contraseña es obligatoria' } };
  }
  if (passwordData.newPassword.length < 6) {
    return {
      ok: false,
      message: { type: 'error', text: 'La nueva contraseña debe tener al menos 6 caracteres' },
    };
  }
  if (passwordData.newPassword !== passwordData.confirmPassword) {
    return { ok: false, message: { type: 'error', text: 'Las contraseñas no coinciden' } };
  }
  return { ok: true };
}
