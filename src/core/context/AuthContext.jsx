/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import {
  getCurrentUser,
  signIn,
  signOut,
  subscribeToAuthChanges,
  updateAuthPassword,
  updateUserEmail,
} from '@/services/authService';

const AuthContext = createContext();
const CURRENT_USER_KEY = 'cleanvalle_current_user';

function readCachedUser() {
  try {
    const cachedUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    if (!cachedUser) return null;

    const expiresAt = Number(cachedUser.sessionExpiresAt);
    if (expiresAt && expiresAt * 1000 <= Date.now()) {
      localStorage.removeItem(CURRENT_USER_KEY);
      return null;
    }

    return cachedUser;
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
    let syncSequence = 0;

    async function syncSession() {
      const sequence = ++syncSequence;
      try {
        const currentUser = await getCurrentUser();
        if (!isMounted || sequence !== syncSequence) return;
        setUser(currentUser);
        cacheUser(currentUser);
      } catch {
        if (!isMounted || sequence !== syncSequence) return;
        setUser(null);
        cacheUser(null);
      } finally {
        if (isMounted && sequence === syncSequence) setIsLoading(false);
      }
    }

    syncSession();

    const unsubscribe = subscribeToAuthChanges((event) => {
      if (!isMounted) return;

      if (event === 'SIGNED_OUT') {
        syncSequence += 1;
        setUser(null);
        cacheUser(null);
        setIsLoading(false);
        return;
      }

      if (
        event === 'SIGNED_IN' ||
        event === 'TOKEN_REFRESHED' ||
        event === 'USER_UPDATED'
      ) {
        window.setTimeout(syncSession, 0);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const nextUser = await signIn(email, password);
    setUser(nextUser);
    cacheUser(nextUser);
    return nextUser.roleId;
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

  const updateEmail = async (email) => {
    if (!user) return false;

    await updateUserEmail(email);

    const nextUser = { ...user, email };
    setUser(nextUser);
    cacheUser(nextUser);
    return true;
  };

  const changePassword = (currentPassword, newPassword) =>
    updateAuthPassword(currentPassword, newPassword);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, clearSession, updateEmail, changePassword }}>
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
