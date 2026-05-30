import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const STATUS_ICONS = {
  pendiente: Clock,
  'en-revision': Clock,
  asignado: Clock,
  'en-proceso': Clock,
  resuelto: CheckCircle2,
  cerrado: CheckCircle2,
  rechazado: AlertCircle,
};

export function ReportStatusPill({ meta }) {
  const Icon = STATUS_ICONS[meta.id] ?? Clock;

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

