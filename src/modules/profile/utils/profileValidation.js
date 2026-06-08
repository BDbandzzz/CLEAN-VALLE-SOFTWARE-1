export function validateProfileForm(formData) {
  const email = String(formData.email ?? '').trim();
  if (email && !/\S+@\S+\.\S+/.test(email)) {
    return { ok: false, message: { type: 'error', text: 'El email no tiene un formato válido' } };
  }
  return { ok: true };
}
