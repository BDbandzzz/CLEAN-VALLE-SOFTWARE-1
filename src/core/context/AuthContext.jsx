import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const USER_PROFILES_KEY = 'user_profiles';
const CURRENT_USER_KEY = 'current_user';

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

const saveUserProfiles = (profiles) => {
  localStorage.setItem(USER_PROFILES_KEY, JSON.stringify(profiles));
};

const getProfileKey = (userData) => {
  return userData.dniUser ? `user_${userData.dniUser}` : `user_${userData.id || 'unknown'}`;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing current user:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    const profiles = loadUserProfiles();
    const userKey = getProfileKey(userData);
    const existingProfile = profiles[userKey] || {};
    const userWithRole = {
      ...existingProfile,
      id: userData.id || userData.dniUser || 'unknown',
      role: userData.role || existingProfile.role || 'estudiante',
      fullName: userData.fullName || existingProfile.fullName || 'Usuario Test',
      email: userData.email || existingProfile.email || '',
      dniUser: userData.dniUser || existingProfile.dniUser || '',
      typeDni: userData.typeDni || existingProfile.typeDni || '',
      gender: userData.gender || existingProfile.gender || '',
      userCredentials: userData.userCredentials || existingProfile.userCredentials || '',
    };

    setUser(userWithRole);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithRole));

    profiles[userKey] = userWithRole;
    saveUserProfiles(profiles);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const updateUser = (updatedData) => {
    if (user) {
      const updatedUser = {
        ...user,
        fullName: updatedData.fullName || '',
        email: updatedData.email || '',
        dniUser: updatedData.dniUser || '',
        typeDni: updatedData.typeDni || '',
        gender: updatedData.gender || '',
        userCredentials: updatedData.userCredentials || '',
      };
      setUser(updatedUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

      const profiles = loadUserProfiles();
      const userKey = getProfileKey(updatedUser);
      profiles[userKey] = updatedUser;
      saveUserProfiles(profiles);
      return true;
    }
    return false;
  };

  const setUserRole = (role) => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

      const profiles = loadUserProfiles();
      const userKey = getProfileKey(updatedUser);
      profiles[userKey] = updatedUser;
      saveUserProfiles(profiles);
    }
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
