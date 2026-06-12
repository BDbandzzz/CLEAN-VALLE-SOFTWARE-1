import { cn } from '@/core/lib/utils';

export function ResolutionMetric({ icon, label, value, className = '' }) {
  return (
    <div
      className={cn(
        'min-w-0 overflow-hidden rounded-lg border border-emerald-200 bg-white/75 p-3',
        className
      )}
    >
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-800">
        {icon}
        {label}
      </div>
      <p className="mt-1 break-words text-sm font-semibold text-emerald-950 [overflow-wrap:anywhere]">
        {value}
      </p>
    </div>
  );
}

