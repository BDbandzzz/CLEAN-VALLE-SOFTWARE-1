/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useAuth } from '@/core/context/AuthContext';
import {
  createReport,
  getMyReports,
  getNotifications,
  getResolvedReports,
  markNotificationRead,
} from '@/services/reportService';

const ReportsContext = createContext(null);

export function ReportsProvider({ children }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [reports, setReports] = useState([]);
  const [resolvedReports, setResolvedReports] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const refreshReports = useCallback(async () => {
    if (!user?.id) {
      setReports([]);
      return [];
    }

    const nextReports = await getMyReports();
    setReports(nextReports);
    return nextReports;
  }, [user?.id]);

  const refreshResolvedReports = useCallback(async () => {
    const nextReports = await getResolvedReports();
    setResolvedReports(nextReports);
    return nextReports;
  }, []);

  const refreshNotifications = useCallback(async () => {
    if (!user?.id) {
      setNotifications([]);
      return [];
    }

    const nextNotifications = await getNotifications();
    setNotifications(nextNotifications);
    return nextNotifications;
  }, [user?.id]);

  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      await Promise.all([
        refreshReports(),
        refreshResolvedReports(),
        refreshNotifications(),
      ]);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  }, [refreshNotifications, refreshReports, refreshResolvedReports]);

  useEffect(() => {
    if (isAuthLoading) return;
    refreshAll();
  }, [isAuthLoading, refreshAll]);

  const addReport = useCallback(
    async (formData) => {
      const createdReport = await createReport(formData);
      await refreshReports();
      return createdReport;
    },
    [refreshReports]
  );

  const markAsRead = useCallback(async (notificationId) => {
    await markNotificationRead(notificationId);
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  }, []);

  const unreadNotifications = useMemo(
    () => notifications.filter((notification) => !notification.isRead),
    [notifications]
  );

  const value = useMemo(
    () => ({
      reports,
      resolvedReports,
      notifications,
      unreadNotifications,
      isLoading,
      error,
      addReport,
      markAsRead,
      refreshReports,
      refreshResolvedReports,
      refreshNotifications,
      refreshAll,
    }),
    [
      addReport,
      error,
      isLoading,
      markAsRead,
      notifications,
      refreshAll,
      refreshNotifications,
      refreshReports,
      refreshResolvedReports,
      reports,
      resolvedReports,
      unreadNotifications,
    ]
  );

  return <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>;
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (!context) throw new Error('useReports debe ser usado dentro de ReportsProvider');
  return context;
}
