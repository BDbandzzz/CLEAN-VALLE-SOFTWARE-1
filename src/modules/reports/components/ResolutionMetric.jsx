export function ResolutionMetric({ icon, label, value }) {
  return (
    <div className="rounded-lg border border-emerald-200 bg-white/75 p-3">
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-800">
        {icon}
        {label}
      </div>
      <p className="mt-1 text-sm font-semibold text-emerald-950">{value}</p>
    </div>
  );
}

