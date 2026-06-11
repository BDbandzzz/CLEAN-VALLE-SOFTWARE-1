export function MetricCard({ title, value, icon, accentColor = '', className = '' }) {
  return (
    <div
      className={`rounded-xl border border-border bg-card p-4 shadow-sm ${className}`}
      style={accentColor ? { borderTopColor: accentColor, borderTopWidth: 3 } : undefined}
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon && <span style={accentColor ? { color: accentColor } : undefined}>{icon}</span>}
        {title}
      </div>
      <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
}

