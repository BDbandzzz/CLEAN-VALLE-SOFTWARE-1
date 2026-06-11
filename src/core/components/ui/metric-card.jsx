export function MetricCard({ title, value, icon, accentColor = '', className = '' }) {
  return (
    <div
      className={`min-w-0 overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm ${className}`}
      style={accentColor ? { borderTopColor: accentColor, borderTopWidth: 3 } : undefined}
    >
      <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
        {icon && <span style={accentColor ? { color: accentColor } : undefined}>{icon}</span>}
        <span className="min-w-0 break-words leading-snug">{title}</span>
      </div>
      <p className="mt-2 break-words text-2xl font-bold text-foreground sm:text-3xl">{value}</p>
    </div>
  );
}

