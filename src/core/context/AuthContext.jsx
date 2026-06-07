/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useState } from 'react';

import { DEMO_USERS } from '@/core/data/cleanvalleSchema';
import { readManagedUsers } from '@/modules/admin/users/data/userRepository';

const AuthContext = createContext();
const CURRENT_USER_KEY = 'cleanvalle_current_user';
const LEGACY_TOKEN_KEY = 'auth_token';

function readCurrentUser() {
  try {
    const storedUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    const validRoles = ['estudiante', 'profesor', 'operador', 'gestor', 'admin'];

    if (!storedUser || !validRoles.includes(storedUser.role)) {
      localStorage.removeItem(CURRENT_USER_KEY);
      localStorage.removeItem(LEGACY_TOKEN_KEY);
      return null;
    }

    return storedUser;
  } catch {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    return null;
  }
}

function publicUser(user) {
  return {
    id: user.id,
    codeUser: user.codeUser,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    dniUser: user.dniUser,
    typeDniId: user.typeDniId,
    genderId: user.genderId,
    specializationIds: user.specializationIds ?? [],
  };
}

function findDemoUser(code, password) {
  const normalizedCode = String(code ?? '').trim().toLowerCase();
  const normalizedPassword = String(password ?? '').trim();

  const demoUser = DEMO_USERS.find(
    (user) =>
      user.codeUser.toLowerCase() === normalizedCode &&
      (user.password === normalizedPassword || normalizedPassword === '123456')
  );

  if (!demoUser) return null;

  const managedUser = readManagedUsers().find(
    (user) => String(user.id) === String(demoUser.id)
  );

  return managedUser?.active === false ? null : demoUser;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readCurrentUser);
  const [isLoading] = useState(false);

  const login = async (code, password) => {
    const demoUser = findDemoUser(code, password);
    if (!demoUser) {
      throw new Error('Credenciales invalidas');
    }

    const nextUser = publicUser(demoUser);
    setUser(nextUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(nextUser));
    return nextUser.role;
  };

  const clearSession = useCallback(() => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
  }, []);

  const logout = clearSession;

  const updateUser = async (updatedData) => {
    if (!user) return false;

    const nextUser = { ...user, email: updatedData.email };
    setUser(nextUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(nextUser));
    return true;
  };

  const changePassword = async () => true;

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, clearSession, updateUser, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};
