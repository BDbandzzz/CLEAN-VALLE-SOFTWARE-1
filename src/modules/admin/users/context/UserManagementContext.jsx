/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import {
  buildManagedUser,
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

  const value = useMemo(
    () => ({
      users,
      activeUsers: users.filter((user) => user.active !== false),
      createUser,
    }),
    [users, createUser]
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
