/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import {
  getCurrentUser,
  signIn,
  signOut,
  updateAuthPassword,
  updateUserEmail,
} from '@/modules/auth/services/authService';

const AuthContext = createContext();
const CURRENT_USER_KEY = 'cleanvalle_current_user';

function readCachedUser() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
  } catch {
    localStorage.removeItem(CURRENT_USER_KEY);
    return null;
  }
}

function cacheUser(user) {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return;
  }

  localStorage.removeItem(CURRENT_USER_KEY);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readCachedUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      try {
        const currentUser = await getCurrentUser();
        if (!isMounted) return;
        setUser(currentUser);
        cacheUser(currentUser);
      } catch {
        if (!isMounted) return;
        setUser(null);
        cacheUser(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    const nextUser = await signIn(email, password);
    setUser(nextUser);
    cacheUser(nextUser);
    return nextUser.role;
  };

  const clearSession = useCallback(async () => {
    setUser(null);
    cacheUser(null);

    try {
      await signOut();
    } catch {
      // La UI debe cerrar sesion localmente aunque Supabase ya no tenga sesion activa.
    }
  }, []);

  const logout = clearSession;

  const updateUser = async (updatedData) => {
    if (!user) return false;

    await updateUserEmail(user.authId, updatedData.email);

    const nextUser = { ...user, email: updatedData.email };
    setUser(nextUser);
    cacheUser(nextUser);
    return true;
  };

  const changePassword = async (...args) => {
    const payload = typeof args[1] === 'object' ? args[1] : args[0];
    const nextPassword = payload?.newPassword ?? payload;
    return updateAuthPassword(nextPassword);
  };

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
