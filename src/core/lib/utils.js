import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getRoleDisplayName = (role) => {
  const roleNames = {
    estudiante: 'Estudiante universitario',
    profesor: 'Profesor universitario',
    operador: 'Operador del sistema',
    admin: 'Administrador del sistema',
  };
  return roleNames[role] || 'Usuario';
};

export const getWelcomeMessage = (role) => {
  const welcomeMessages = {
    estudiante: 'Bienvenido, Estudiante universitario',
    profesor: 'Bienvenido, Profesor universitario',
    operador: 'Bienvenido, Operador del sistema',
    admin: 'Bienvenido, Administrador del sistema',
  };
  return welcomeMessages[role] || 'Bienvenido';
};
