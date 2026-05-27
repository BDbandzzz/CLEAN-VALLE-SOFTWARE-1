import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getRoleDisplayName = (role) => {
  const roleNames = {
    estudiante: 'Estudiante universitario',
    profesor: 'Profesor universitario',
  };
  return roleNames[role] || 'Usuario';
};

export const getWelcomeMessage = (role) => {
  const welcomeMessages = {
    estudiante: 'Bienvenido, Estudiante universitario',
    profesor: 'Bienvenido, Profesor universitario',
  };
  return welcomeMessages[role] || 'Bienvenido';
};
