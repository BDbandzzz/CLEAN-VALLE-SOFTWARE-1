import { EmptyState } from '@/core/components/ui/empty-state';
import { OperatorReportCard } from '@/modules/operator/components/OperatorReportCard';

export function OperatorReportList({ reports, emptyText, showResolution = false }) {
  if (!reports.length) {
    return <EmptyState title={emptyText} />;
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <OperatorReportCard key={report.id} report={report} showResolution={showResolution} />
      ))}
    </div>
  );
}
