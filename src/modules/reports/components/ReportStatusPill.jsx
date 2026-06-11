import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

import { REPORT_STATUS_IDS } from '@/core/constants/domainConstants';

export function ReportStatusPill({ meta }) {
  const Icon =
    Number(meta.id) === REPORT_STATUS_IDS.RESOLVED
      ? CheckCircle2
      : Number(meta.id) === REPORT_STATUS_IDS.REJECTED
        ? AlertCircle
        : Clock;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
      style={{ backgroundColor: `${meta.color}18`, color: meta.color, border: `1.5px solid ${meta.color}44` }}
    >
      <Icon className="size-3" />
      {meta.label}
    </span>
  );
}

