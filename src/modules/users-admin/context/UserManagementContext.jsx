/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  createManagedUser,
  getUserManagementCatalogs,
  listManagedUsers,
  setManagedUserActive,
  updateManagedUser,
} from '@/services/adminUserService';
import { getRoleDisplayLabel } from '@/core/mappers/domainMappers';
import { showErrorAlert } from '@/core/services/alertService';

const UserManagementContext = createContext(null);
const INITIAL_QUERY = {
  page: 1,
  pageSize: 10,
  search: '',
  stateId: null,
  roleId: null,
};

export function UserManagementProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [creatableRoles, setCreatableRoles] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [genders, setGenders] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState('');
  const lastQuery = useRef(INITIAL_QUERY);

  const loadUsers = useCallback(async (query = lastQuery.current) => {
    const normalizedQuery = { ...INITIAL_QUERY, ...query };
    lastQuery.current = normalizedQuery;
    setIsLoading(true);
    setError('');

    try {
      const result = await listManagedUsers(normalizedQuery);
      setUsers(result.users);
      setTotal(result.total);
      return result;
    } catch (loadError) {
      setUsers([]);
      setTotal(0);
      setError(loadError.message);
      showErrorAlert(loadError, { title: 'No fue posible cargar los usuarios' });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadCatalogs = useCallback(async () => {
    try {
      const catalogs = await getUserManagementCatalogs();
      setRoles(
        catalogs.roles.map((role) => ({
          ...role,
          label: getRoleDisplayLabel(role.id, role.label),
        }))
      );
      setCreatableRoles(
        catalogs.creatableRoles.map((role) => ({
          ...role,
          label: getRoleDisplayLabel(role.id, role.label),
        }))
      );
      setDocumentTypes(catalogs.documentTypes);
      setGenders(catalogs.genders);
      setSpecializations(catalogs.specializations);
    } catch (catalogError) {
      setError(catalogError.message);
      showErrorAlert(catalogError, { title: 'No fue posible cargar los catálogos' });
    }
  }, []);

  useEffect(() => {
    Promise.all([loadCatalogs(), loadUsers()]);
  }, [loadCatalogs, loadUsers]);

  const runMutation = useCallback(
    async (operation) => {
      setIsMutating(true);
      setError('');
      try {
        const result = await operation();
        await loadUsers();
        return result;
      } catch (mutationError) {
        setError(mutationError.message);
        showErrorAlert(mutationError);
        throw mutationError;
      } finally {
        setIsMutating(false);
      }
    },
    [loadUsers]
  );

  const createUser = useCallback(
    (formData) => runMutation(() => createManagedUser(formData)),
    [runMutation]
  );

  const updateUser = useCallback(
    (userId, formData) =>
      runMutation(() => updateManagedUser(userId, formData)),
    [runMutation]
  );

  const deleteUser = useCallback(
    (userId) =>
      runMutation(() => setManagedUserActive(userId, false)),
    [runMutation]
  );

  const value = useMemo(
    () => ({
      users,
      roles,
      creatableRoles,
      documentTypes,
      genders,
      specializations,
      total,
      pageSize: lastQuery.current.pageSize,
      currentPage: lastQuery.current.page,
      isLoading,
      isMutating,
      error,
      loadUsers,
      createUser,
      updateUser,
      deleteUser,
    }),
    [
      users,
      roles,
      creatableRoles,
      documentTypes,
      genders,
      specializations,
      total,
      isLoading,
      isMutating,
      error,
      loadUsers,
      createUser,
      updateUser,
      deleteUser,
    ]
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
