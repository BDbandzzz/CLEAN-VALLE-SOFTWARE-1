export function MetricCard({ title, value, icon, className = '' }) {
  return (
    <div className={`rounded-xl border border-border bg-card p-4 shadow-sm ${className}`}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        {title}
      </div>
      <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
}

