/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import {
  buildManagedUser,
  buildUpdatedUser,
  persistManagedUsers,
  readManagedUsers,
} from '@/modules/admin/users/data/userRepository';

const UserManagementContext = createContext(null);

export function UserManagementProvider({ children }) {
  const [users, setUsers] = useState(readManagedUsers);

  const createUser = useCallback((formData) => {
    const user = buildManagedUser(formData);

    setUsers((currentUsers) => {
      const nextUsers = [user, ...currentUsers];
      persistManagedUsers(nextUsers);
      return nextUsers;
    });

    return user;
  }, []);

  const setUserActive = useCallback((userId, active) => {
    setUsers((currentUsers) => {
      const nextUsers = currentUsers.map((user) =>
        String(user.id) === String(userId)
          ? {
              ...user,
              active,
              updatedAt: new Date().toISOString(),
            }
          : user
      );
      persistManagedUsers(nextUsers);
      return nextUsers;
    });
  }, []);

  const updateUser = useCallback((userId, formData) => {
    let updatedUser = null;

    setUsers((currentUsers) => {
      const nextUsers = currentUsers.map((user) => {
        if (String(user.id) !== String(userId)) return user;
        updatedUser = buildUpdatedUser(user, formData);
        return updatedUser;
      });

      persistManagedUsers(nextUsers);
      return nextUsers;
    });

    return updatedUser;
  }, []);

  const value = useMemo(
    () => ({
      users,
      activeUsers: users.filter((user) => user.active !== false),
      createUser,
      updateUser,
      setUserActive,
    }),
    [users, createUser, setUserActive, updateUser]
  );

  return (
    <UserManagementContext.Provider value={value}>
      {children}
    </UserManagementContext.Provider>
  );
}

export function useUserManagement() {
  const context = useContext(UserManagementContext);
  if (!context) {
    throw new Error('useUserManagement debe usarse dentro de UserManagementProvider');
  }
  return context;
}
