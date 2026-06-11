/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
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
  const { user } = useAuth();
  const userId = user?.id;
  const loadedUserId = useRef(null);
  const reportsRequest = useRef(null);
  const resolvedRequest = useRef(null);
  const notificationsRequest = useRef(null);
  const [reports, setReports] = useState([]);
  const [resolvedReports, setResolvedReports] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [isLoadingResolvedReports, setIsLoadingResolvedReports] =
    useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [error, setError] = useState('');

  const refreshReports = useCallback(
    async ({ force = false } = {}) => {
      if (!userId) {
        setReports([]);
        return [];
      }
      if (loadedUserId.current !== userId) {
        loadedUserId.current = userId;
        reportsRequest.current = null;
        notificationsRequest.current = null;
        setReports([]);
        setNotifications([]);
      }
      if (!force && reportsRequest.current) return reportsRequest.current;

      setIsLoadingReports(true);
      setError('');
      reportsRequest.current = getMyReports()
        .then((nextReports) => {
          setReports(nextReports);
          return nextReports;
        })
        .catch((loadError) => {
          setError(loadError.message);
          reportsRequest.current = null;
          throw loadError;
        })
        .finally(() => setIsLoadingReports(false));

      return reportsRequest.current;
    },
    [userId]
  );

  const refreshResolvedReports = useCallback(
    async ({ force = false } = {}) => {
      if (!force && resolvedRequest.current) return resolvedRequest.current;

      setIsLoadingResolvedReports(true);
      setError('');
      resolvedRequest.current = getResolvedReports()
        .then((nextReports) => {
          setResolvedReports(nextReports);
          return nextReports;
        })
        .catch((loadError) => {
          setError(loadError.message);
          resolvedRequest.current = null;
          throw loadError;
        })
        .finally(() => setIsLoadingResolvedReports(false));

      return resolvedRequest.current;
    },
    []
  );

  const refreshNotifications = useCallback(
    async ({ force = false } = {}) => {
      if (!userId) {
        setNotifications([]);
        return [];
      }
      if (loadedUserId.current !== userId) {
        loadedUserId.current = userId;
        reportsRequest.current = null;
        notificationsRequest.current = null;
        setReports([]);
        setNotifications([]);
      }
      if (!force && notificationsRequest.current) {
        return notificationsRequest.current;
      }

      setIsLoadingNotifications(true);
      setError('');
      notificationsRequest.current = getNotifications()
        .then((nextNotifications) => {
          setNotifications(nextNotifications);
          return nextNotifications;
        })
        .catch((loadError) => {
          setError(loadError.message);
          notificationsRequest.current = null;
          throw loadError;
        })
        .finally(() => setIsLoadingNotifications(false));

      return notificationsRequest.current;
    },
    [userId]
  );

  const addReport = useCallback(async (formData) => {
    const createdReport = await createReport(formData);
    reportsRequest.current = null;
    return createdReport;
  }, []);

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
      isLoadingReports,
      isLoadingResolvedReports,
      isLoadingNotifications,
      error,
      addReport,
      markAsRead,
      refreshReports,
      refreshResolvedReports,
      refreshNotifications,
    }),
    [
      addReport,
      error,
      isLoadingNotifications,
      isLoadingReports,
      isLoadingResolvedReports,
      markAsRead,
      notifications,
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
