import { OperatorReportCard } from '@/modules/operator/components/OperatorReportCard';
import { OperatorDashboardEmptyState } from '@/modules/operator/components/OperatorDashboardEmptyState';

export function OperatorReportList({ reports, emptyText, showResolution = false }) {
  if (!reports.length) {
    return <OperatorDashboardEmptyState text={emptyText} />;
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <OperatorReportCard key={report.id} report={report} showResolution={showResolution} />
      ))}
    </div>
  );
}

