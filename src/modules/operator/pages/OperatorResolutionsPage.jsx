import { CheckCircle2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import { EmptyState } from '@/core/components/ui/empty-state';
import { ModuleHero } from '@/core/components/ui/module-hero';
import { SegmentedTabButton } from '@/core/components/ui/segmented-tab-button';
import { OperatorResolutionCard } from '@/modules/operator/components/OperatorResolutionCard';
import { useOperatorReports } from '@/modules/operator/hooks/useOperatorReports';
import { useReportCatalogs } from '@/modules/reports/hooks/useReportCatalogs';

export default function OperatorResolutionsPage() {
  const { resolvedReports, isLoading } = useOperatorReports();
  const { resolutionReviewStatuses } = useReportCatalogs();
  const [reviewStatusId, setReviewStatusId] = useState('');
  const statusCounts = useMemo(
    () =>
      resolvedReports.reduce((counts, item) => {
        const statusId = String(item.resolution?.reviewStatusId ?? '');
        counts[statusId] = (counts[statusId] ?? 0) + 1;
        return counts;
      }, {}),
    [resolvedReports]
  );
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

      <div className="grid grid-cols-2 rounded-xl border border-border bg-muted/40 p-1 sm:flex">
        <SegmentedTabButton
          label="Todas"
          count={resolvedReports.length}
          active={!reviewStatusId}
          onClick={() => setReviewStatusId('')}
        />
        {resolutionReviewStatuses.map((status) => (
          <SegmentedTabButton
            key={status.id}
            label={status.label}
            count={statusCounts[status.id] ?? 0}
            active={reviewStatusId === status.id}
            onClick={() => setReviewStatusId(status.id)}
          />
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
