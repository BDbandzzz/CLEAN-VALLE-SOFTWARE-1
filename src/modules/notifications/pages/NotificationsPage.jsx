import { Bell } from 'lucide-react';

import { NotificationList } from '@/core/components/ui/NotificationList';
import { useReports } from '@/modules/reports/context/ReportsContext';

export default function NotificationsPage() {
  const { notifications } = useReports();

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Bell className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notificaciones</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Revisa las novedades relacionadas con tu actividad en CleanValle.
            </p>
          </div>
        </div>
      </section>

      <NotificationList notifications={notifications} />
    </div>
  );
}
