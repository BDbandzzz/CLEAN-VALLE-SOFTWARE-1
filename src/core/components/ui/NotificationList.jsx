export function NotificationList({
  notifications = [],
  emptyText = 'No hay notificaciones para mostrar.',
  onMarkAsRead,
  onMarkAllAsRead,
  onOpen,
}) {
  if (!notifications.length) {
    return (
      <div className="rounded-xl border border-dashed border-border py-14 text-center text-sm text-muted-foreground">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {onMarkAllAsRead && notifications.some((notification) => !notification.isRead) && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onMarkAllAsRead}
            className="text-sm font-semibold text-primary hover:underline"
          >
            Marcar todas como leídas
          </button>
        </div>
      )}
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}

function NotificationItem({ notification, onMarkAsRead, onOpen }) {
  return (
    <article
      className={[
        'rounded-xl border bg-card p-4 shadow-sm',
        notification.isRead ? 'border-border' : 'border-primary/35',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-foreground">{notification.title}</p>
        {!notification.isRead && onMarkAsRead && (
          <button
            type="button"
            onClick={() => onMarkAsRead(notification.id)}
            className="shrink-0 text-xs font-semibold text-primary hover:underline"
          >
            Marcar como leida
          </button>
        )}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{notification.detail}</p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          {formatDateTime(notification.at)}
        </p>
        {onOpen && notification.entityType && (
          <button
            type="button"
            onClick={() => onOpen(notification)}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Ver detalle
          </button>
        )}
      </div>
    </article>
  );
}

function formatDateTime(value) {
  if (!value) return '-';
  return new Date(value).toLocaleString('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}
