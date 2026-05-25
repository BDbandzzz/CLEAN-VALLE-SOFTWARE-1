/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

import { resolveCatalogLabel } from '@/core/catalogs/catalogUtils';
import { API_BASE_URL } from '@/core/constants/api';
import { normalizeRole } from '@/core/constants/roles';
import { useCatalogs } from '@/core/context/CatalogContext';
import { updateUserEmail } from '@/modules/profile/utils/profileService';

const AuthContext = createContext();
const CURRENT_TOKEN_KEY = 'auth_token';

function pickFirst(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== '');
}

function getCatalogLabel(catalogs, catalogKey, value, fallback = '') {
  return resolveCatalogLabel(catalogs?.[catalogKey] ?? [], value, fallback);
}

function buildAuthUser(userData = {}, decoded = {}, userId, catalogs) {
  const firstName = pickFirst(userData.firstName, decoded.firstName, '');
  const lastName = pickFirst(userData.lastName, decoded.lastName, '');
  const fullName = [firstName, lastName].filter(Boolean).join(' ');
  const roleValue = pickFirst(
    userData.idRole,
    userData.role?.idRole,
    userData.roleName,
    userData.role?.roleName,
    decoded.role
  );
  const roleFallback = pickFirst(userData.roleName, userData.role?.roleName, decoded.role);
  const typeDniValue = pickFirst(userData.typeDni, userData.idTypeDni);
  const genderValue = pickFirst(userData.gender, userData.idGender);

  return {
    id: pickFirst(userData.codeUser, userData.id, userId),
    role: normalizeRole(decoded.role || getCatalogLabel(catalogs, 'roles', roleValue, roleFallback)),
    email: pickFirst(userData.email, decoded.email, ''),
    name: pickFirst(fullName, userData.name, decoded.name, decoded.fullName, ''),
    firstName,
    lastName,
    dniUser: pickFirst(userData.dniUser, userData.dni, userData.document, ''),
    typeDniId: typeDniValue,
    typeDni: getCatalogLabel(catalogs, 'typeDni', typeDniValue),
    genderId: genderValue,
    gender: getCatalogLabel(catalogs, 'genders', genderValue),
  };
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { refreshCatalogs } = useCatalogs();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem(CURRENT_TOKEN_KEY);

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);

        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem(CURRENT_TOKEN_KEY);
          setUser(null);
          return;
        }

        const activeCatalogs = await refreshCatalogs();
        const userId = decoded.sub || decoded.code_user || decoded.id;

        try {
          const res = await fetch(`${API_BASE_URL}/api/users/get-user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.ok) {
            const userData = await res.json();
            setUser(buildAuthUser(userData, decoded, userId, activeCatalogs));
          } else {
            setUser(buildAuthUser({}, decoded, userId, activeCatalogs));
          }
        } catch (fetchError) {
          console.error('Error fetching user data', fetchError);
          setUser(buildAuthUser({}, decoded, userId, activeCatalogs));
        }
      } catch (error) {
        console.error('Token invalido', error);
        localStorage.removeItem(CURRENT_TOKEN_KEY);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, [refreshCatalogs]);

  const login = async (code, password) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codeUser: code, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciales invalidas');
      }

      const data = await response.json();
      const token = data.accessToken;

      localStorage.setItem(CURRENT_TOKEN_KEY, token);

      const activeCatalogs = await refreshCatalogs();
      const decoded = jwtDecode(token);
      const userId = decoded.sub || decoded.code_user || decoded.id;
      let nextUser = buildAuthUser({}, decoded, userId, activeCatalogs);

      try {
        const res = await fetch(`${API_BASE_URL}/api/users/get-user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const userData = await res.json();
          nextUser = buildAuthUser(userData, decoded, userId, activeCatalogs);
        }
      } catch (error) {
        console.error('Error fetching user data on login', error);
      }

      setUser(nextUser);
      return nextUser.role || null;
    } catch (error) {
      console.error('Error en login', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_TOKEN_KEY);
  };

  const updateUser = async (updatedData) => {
    try {
      if (!user?.id) throw new Error('Usuario no autenticado');

      await updateUserEmail(user.id, updatedData.email);
      setUser((currentUser) => ({ ...currentUser, email: updatedData.email }));
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const setUserRole = (role) => {
    if (!user) return;
    setUser({ ...user, role });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser, setUserRole }}>
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
