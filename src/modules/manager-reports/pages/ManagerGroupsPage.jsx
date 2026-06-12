import { ChevronRight, Layers3 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/core/components/ui/button';
import { EmptyState } from '@/core/components/ui/empty-state';
import { ModuleHero } from '@/core/components/ui/module-hero';
import { showErrorAlert } from '@/core/services/alertService';
import { ReportBadge } from '@/modules/reports/components/ReportBadge';
import { getManagerReportGroups } from '@/services/managerReportService';

export default function ManagerGroupsPage() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadGroups = useCallback(async () => {
    setIsLoading(true);
    try {
      setGroups(await getManagerReportGroups());
    } catch (error) {
      showErrorAlert(error, {
        title: 'No fue posible cargar los grupos de reportes',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      <ModuleHero
        icon={<Layers3 />}
        title="Grupos de reportes"
        description="Gestiona incidencias similares como una sola asignación."
        size="compact"
      />

      {isLoading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          Cargando grupos...
        </div>
      ) : groups.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {groups.map((group) => (
            <article
              key={group.id}
              className="rounded-lg bg-card p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">
                    Grupo #{group.id}
                  </p>
                  <h2 className="mt-1 text-base font-semibold text-foreground">
                    {group.title}
                  </h2>
                </div>
                <ReportBadge
                  type="category"
                  label={group.categoryName}
                  color={group.categoryColor}
                />
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                {group.description || 'Sin descripción adicional.'}
              </p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-muted-foreground">
                  {group.reports?.length ?? 0} reportes
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/manager/groups/${group.id}`)}
                >
                  Gestionar
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="Todavía no hay grupos de reportes." />
      )}
    </div>
  );
}
