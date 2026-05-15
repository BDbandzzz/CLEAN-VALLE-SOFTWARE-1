/** Iniciales para el avatar a partir del nombre mostrado y del usuario. */
export function getProfileInitials(fullName, fallbackName) {
  const n = (fullName || fallbackName || 'U').trim();
  const parts = n.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return n.slice(0, 2).toUpperCase() || 'U';
}
