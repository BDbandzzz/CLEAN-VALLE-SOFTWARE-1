import { CheckCircle2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/core/components/ui/button';
import { EmptyState } from '@/core/components/ui/empty-state';
import { ModuleHero } from '@/core/components/ui/module-hero';
import { OperatorResolutionCard } from '@/modules/operator/components/OperatorResolutionCard';
import { useOperatorReports } from '@/modules/operator/hooks/useOperatorReports';
import { useReportCatalogs } from '@/modules/reports/hooks/useReportCatalogs';

export default function OperatorResolutionsPage() {
  const { resolvedReports, isLoading } = useOperatorReports();
  const { resolutionReviewStatuses } = useReportCatalogs();
  const [reviewStatusId, setReviewStatusId] = useState('');
  const filteredResolutions = useMemo(
    () =>
      reviewStatusId
        ? resolvedReports.filter(
            (item) =>
              String(item.resolution?.reviewStatusId) === reviewStatusId
          )
        : resolvedReports,
    [resolvedReports, reviewStatusId]
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      <ModuleHero
        icon={<CheckCircle2 />}
        title="Resoluciones"
        description="Consulta el estado y el feedback de tus resoluciones."
        size="compact"
      />

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={!reviewStatusId ? 'default' : 'outline'}
          onClick={() => setReviewStatusId('')}
        >
          Todas
        </Button>
        {resolutionReviewStatuses.map((status) => (
          <Button
            key={status.id}
            type="button"
            variant={reviewStatusId === status.id ? 'default' : 'outline'}
            onClick={() => setReviewStatusId(status.id)}
          >
            {status.label}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          Cargando resoluciones...
        </div>
      ) : filteredResolutions.length ? (
        <div className="space-y-4">
          {filteredResolutions.map((item) => (
            <OperatorResolutionCard
              key={`${item.sourceType}-${item.id}-${item.resolution?.id}`}
              item={item}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No hay resoluciones en esta clasificación." />
      )}
    </div>
  );
}
