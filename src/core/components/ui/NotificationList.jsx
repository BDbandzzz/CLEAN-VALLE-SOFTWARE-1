export function NotificationList({
  notifications = [],
  emptyText = 'No hay notificaciones para mostrar.',
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
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
}

function NotificationItem({ notification }) {
  return (
    <article className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <p className="text-sm font-semibold text-foreground">{notification.title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{notification.detail}</p>
      <p className="mt-2 text-xs text-muted-foreground">{formatDateTime(notification.at)}</p>
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
