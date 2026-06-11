import { Bell } from 'lucide-react';

import { ModuleHero } from '@/core/components/ui/module-hero';
import { NotificationList } from '@/core/components/ui/NotificationList';
import { useReports } from '@/modules/reports/context/ReportsContext';

export default function NotificationsPage() {
  const { notifications, markAsRead } = useReports();

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      <ModuleHero
        icon={<Bell />}
        title="Notificaciones"
        description="Revisa las novedades relacionadas con tu actividad en CleanValle."
        size="compact"
        variant="surface"
      />

      <NotificationList notifications={notifications} onMarkAsRead={markAsRead} />
    </div>
  );
}
