/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  createManagedLocation,
  listManagedLocations,
  setManagedLocationActive,
  updateManagedLocation,
} from '@/services/adminLocationService';

const LocationManagementContext = createContext(null);

export function LocationManagementProvider({ children }) {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState('');

  const loadLocations = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await listManagedLocations();
      setLocations(data);
      return data;
    } catch (loadError) {
      setLocations([]);
      setError(loadError.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  const runMutation = useCallback(
    async (operation) => {
      setIsMutating(true);
      setError('');
      try {
        const result = await operation();
        await loadLocations();
        return result;
      } catch (mutationError) {
        setError(mutationError.message);
        throw mutationError;
      } finally {
        setIsMutating(false);
      }
    },
    [loadLocations]
  );

  const value = useMemo(
    () => ({
      locations,
      isLoading,
      isMutating,
      error,
      createLocation: (formData) =>
        runMutation(() => createManagedLocation(formData)),
      updateLocation: (locationId, formData) =>
        runMutation(() => updateManagedLocation(locationId, formData)),
      setLocationActive: (locationId, active) =>
        runMutation(() => setManagedLocationActive(locationId, active)),
    }),
    [locations, isLoading, isMutating, error, runMutation]
  );

  return (
    <LocationManagementContext.Provider value={value}>
      {children}
    </LocationManagementContext.Provider>
  );
}

export function useLocationManagement() {
  const context = useContext(LocationManagementContext);
  if (!context) {
    throw new Error('useLocationManagement debe usarse dentro de LocationManagementProvider');
  }
  return context;
}
