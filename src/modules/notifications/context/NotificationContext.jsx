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
import { showErrorAlert } from '@/core/services/alertService';
import {
  getMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  subscribeToNotifications,
} from '@/services/notificationService';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(
    async (limit = null) => {
      if (!user?.authId) {
        setNotifications([]);
        return [];
      }

      setIsLoading(true);
      try {
        const nextNotifications = await getMyNotifications(limit);
        setNotifications(nextNotifications);
        return nextNotifications;
      } catch (error) {
        showErrorAlert(error, {
          title: 'No fue posible cargar las notificaciones',
        });
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [user?.authId]
  );

  useEffect(() => {
    if (!user?.authId) {
      setNotifications([]);
      return undefined;
    }

    refresh();
    return subscribeToNotifications(user.authId, () => refresh());
  }, [refresh, user?.authId]);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await markNotificationRead(notificationId);
      setNotifications((current) =>
        current.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      showErrorAlert(error, {
        title: 'No fue posible actualizar la notificación',
      });
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((current) =>
        current.map((notification) => ({ ...notification, isRead: true }))
      );
    } catch (error) {
      showErrorAlert(error, {
        title: 'No fue posible marcar las notificaciones',
      });
    }
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications]
  );

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      isLoading,
      refresh,
      markAsRead,
      markAllAsRead,
    }),
    [
      isLoading,
      markAllAsRead,
      markAsRead,
      notifications,
      refresh,
      unreadCount,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotifications debe usarse dentro de NotificationProvider'
    );
  }
  return context;
}
