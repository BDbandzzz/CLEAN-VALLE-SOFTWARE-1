import { Bell, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/core/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/core/components/ui/dropdown-menu';
import { useAuth } from '@/core/context/AuthContext';
import { cn } from '@/core/lib/utils';
import { getNotificationRoute } from '@/modules/notifications/constants/notificationRoutes';
import { useNotifications } from '@/modules/notifications/context/NotificationContext';

export function NotificationBell() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    notifications,
    unreadCount,
    isLoading,
    refresh,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const openNotification = async (notification) => {
    if (!notification.isRead) await markAsRead(notification.id);
    navigate(getNotificationRoute(notification, user?.roleId));
  };

  return (
    <DropdownMenu onOpenChange={(open) => open && refresh()}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative size-10"
          title="Notificaciones"
        >
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute right-0.5 top-0.5 flex min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-4 text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[min(22rem,calc(100vw-1.5rem))] p-0"
      >
        <div className="flex items-center justify-between gap-3 px-3 py-2.5">
          <DropdownMenuLabel className="p-0 text-sm text-foreground">
            Notificaciones
          </DropdownMenuLabel>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!unreadCount}
            onClick={(event) => {
              event.preventDefault();
              markAllAsRead();
            }}
          >
            <CheckCheck className="size-4" />
            Marcar leídas
          </Button>
        </div>
        <DropdownMenuSeparator className="m-0" />

        <div className="max-h-80 overflow-y-auto p-1">
          {isLoading && !notifications.length ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              Cargando notificaciones...
            </p>
          ) : notifications.length ? (
            notifications.slice(0, 5).map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="items-start py-2.5"
                onSelect={() => openNotification(notification)}
              >
                <span
                  className={cn(
                    'mt-1.5 size-2 shrink-0 rounded-full',
                    notification.isRead ? 'bg-transparent' : 'bg-primary'
                  )}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">
                    {notification.title}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {notification.detail}
                  </span>
                  <span className="mt-1 block text-[11px] text-muted-foreground">
                    {formatRelativeTime(notification.at)}
                  </span>
                </span>
              </DropdownMenuItem>
            ))
          ) : (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              No tienes notificaciones.
            </p>
          )}
        </div>

        <DropdownMenuSeparator className="m-0" />
        <DropdownMenuItem
          className="justify-center rounded-none py-3 font-semibold text-primary"
          onSelect={() => navigate('/notifications')}
        >
          Ver todas
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function formatRelativeTime(value) {
  if (!value) return '';

  const elapsedSeconds = Math.max(
    0,
    Math.floor((Date.now() - new Date(value).getTime()) / 1000)
  );
  if (elapsedSeconds < 60) return 'Hace un momento';
  if (elapsedSeconds < 3600) {
    return `Hace ${Math.floor(elapsedSeconds / 60)} min`;
  }
  if (elapsedSeconds < 86400) {
    return `Hace ${Math.floor(elapsedSeconds / 3600)} h`;
  }
  return new Date(value).toLocaleDateString('es-CO');
}
