import { useEffect } from 'react';
import { Bell } from 'lucide-react';

import { ModuleHero } from '@/core/components/ui/module-hero';
import { NotificationList } from '@/core/components/ui/NotificationList';
import { useAuth } from '@/core/context/AuthContext';
import { getNotificationRoute } from '@/modules/notifications/constants/notificationRoutes';
import { useNotifications } from '@/modules/notifications/context/NotificationContext';
import { useNavigate } from 'react-router-dom';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    notifications,
    isLoading,
    markAsRead,
    markAllAsRead,
    refresh,
  } = useNotifications();

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      <ModuleHero
        icon={<Bell />}
        title="Notificaciones"
        description="Revisa las novedades relacionadas con tu actividad en CleanValle."
        size="compact"
        variant="surface"
      />

      {isLoading ? (
        <div className="py-14 text-center text-sm text-muted-foreground">
          Cargando notificaciones...
        </div>
      ) : (
        <NotificationList
          notifications={notifications}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onOpen={(notification) => {
            if (!notification.isRead) markAsRead(notification.id);
            navigate(getNotificationRoute(notification, user?.roleId));
          }}
        />
      )}
    </div>
  );
}
