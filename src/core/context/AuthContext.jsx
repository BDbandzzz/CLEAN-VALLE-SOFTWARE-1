/**
 * AuthContext.jsx – Contexto global de autenticación.
 *
 * Qué hace:
 *   Gestiona el estado de la sesión del usuario en toda la aplicación.
 *   Persiste el usuario activo en localStorage (clave: 'current_user') y
 *   mantiene perfiles históricos por DNI (clave: 'user_profiles').
 *
 * Cuándo conectar al backend:
 *   Las funciones login(), logout() y updateUser() son los únicos puntos
 *   que deben modificarse. Reemplazar las escrituras en localStorage por
 *   llamadas a la API REST y manejar el token JWT en su lugar.
 *
 * API expuesta por useAuth():
 *   user        {object|null}   – Datos del usuario autenticado o null.
 *   isLoading   {boolean}       – true mientras se valida la sesión (útil para spinners).
 *   login(userData)             – Inicia sesión: persiste el usuario y lo carga en contexto.
 *   logout()                    – Cierra sesión: limpia el estado y localStorage.
 *   updateUser(updatedData)     – Actualiza los datos del perfil del usuario activo.
 *   setUserRole(role)           – Cambia el rol del usuario (útil en tests/demo).
 *
 * Estructura del objeto user:
 *   id, role, firstName, lastName, fullName,
 *   email, dniUser, typeDni, gender, userCredentials
 */
/* eslint-disable react-refresh/only-export-components -- provider + hook pattern */
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const USER_PROFILES_KEY = 'user_profiles';
const CURRENT_USER_KEY  = 'current_user';

/* ── Helpers de persistencia ─────────────────────────────────────────────── */

/** Lee el usuario activo de localStorage al iniciar la app. */
const readCurrentUserFromStorage = () => {
  const storedUser = localStorage.getItem(CURRENT_USER_KEY);
  if (!storedUser) return null;
  try {
    return JSON.parse(storedUser);
  } catch (error) {
    console.error('Error parsing current user:', error);
    return null;
  }
};

/** Carga el mapa de perfiles históricos (keyed by DNI). */
const loadUserProfiles = () => {
  const stored = localStorage.getItem(USER_PROFILES_KEY);
  if (!stored) return {};
  try {
    return JSON.parse(stored) || {};
  } catch (error) {
    console.error('Error parsing user profiles:', error);
    return {};
  }
};

/** Persiste el mapa de perfiles históricos. */
const saveUserProfiles = (profiles) => {
  localStorage.setItem(USER_PROFILES_KEY, JSON.stringify(profiles));
};

/**
 * Genera la clave única de perfil a partir de los datos del usuario.
 * Prioriza dniUser, cae a id si no existe.
 */
const getProfileKey = (userData) =>
  userData.dniUser
    ? `user_${userData.dniUser}`
    : `user_${userData.id || 'unknown'}`;

/* ── Provider ─────────────────────────────────────────────────────────────── */

export const AuthProvider = ({ children }) => {
  const [user, setUser]     = useState(() => readCurrentUserFromStorage());
  const [isLoading]         = useState(false); // → true mientras se valida token con API

  /**
   * Inicia sesión con los datos recibidos (futuro: del endpoint /auth/login).
   * Fusiona con el perfil histórico del mismo usuario para no perder datos previos.
   * @param {object} userData
   */
  const login = (userData) => {
    const profiles    = loadUserProfiles();
    const userKey     = getProfileKey(userData);
    const existingProfile = profiles[userKey] || {};

    const userWithRole = {
      ...existingProfile,
      id:              userData.id              || existingProfile.id              || 'unknown',
      role:            userData.role            || existingProfile.role            || 'estudiante',
      firstName:       userData.firstName       || existingProfile.firstName       || '',
      lastName:        userData.lastName        || existingProfile.lastName        || '',
      fullName:        userData.fullName        || existingProfile.fullName        || 'Usuario Test',
      email:           userData.email           || existingProfile.email           || '',
      dniUser:         userData.dniUser         || existingProfile.dniUser         || '',
      typeDni:         userData.typeDni         || existingProfile.typeDni         || '',
      gender:          userData.gender          || existingProfile.gender          || '',
      userCredentials: userData.userCredentials || existingProfile.userCredentials || '',
    };

    setUser(userWithRole);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithRole));
    profiles[userKey] = userWithRole;
    saveUserProfiles(profiles);
  };

  /** Cierra la sesión y limpia el usuario activo (no borra perfiles históricos). */
  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  /**
   * Actualiza los datos del perfil del usuario activo.
   * @param {object} updatedData
   * @returns {boolean} true si se actualizó correctamente.
   */
  const updateUser = (updatedData) => {
    if (!user) return false;

    const updatedUser = {
      ...user,
      firstName:       updatedData.firstName       || '',
      lastName:        updatedData.lastName        || '',
      fullName:        updatedData.fullName        || '',
      email:           updatedData.email           || '',
      dniUser:         updatedData.dniUser         || '',
      typeDni:         updatedData.typeDni         || '',
      gender:          updatedData.gender          || '',
      userCredentials: updatedData.userCredentials || '',
    };

    setUser(updatedUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

    const profiles = loadUserProfiles();
    profiles[getProfileKey(updatedUser)] = updatedUser;
    saveUserProfiles(profiles);
    return true;
  };

  /**
   * Cambia el rol del usuario activo (útil para demos y pruebas de UI por rol).
   * @param {'estudiante'|'profesor'|'operador'|'admin'} role
   */
  const setUserRole = (role) => {
    if (!user) return;
    const updatedUser = { ...user, role };
    setUser(updatedUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    const profiles = loadUserProfiles();
    profiles[getProfileKey(updatedUser)] = updatedUser;
    saveUserProfiles(profiles);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser, setUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook para consumir el contexto de autenticación.
 * Debe usarse dentro de <AuthProvider>.
 * @returns {{ user, isLoading, login, logout, updateUser, setUserRole }}
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};
