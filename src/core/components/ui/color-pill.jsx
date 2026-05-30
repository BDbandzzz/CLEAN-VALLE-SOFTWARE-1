export function ColorPill({ label, color, icon = null, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}
      style={{ backgroundColor: `${color}22`, color, border: `1.5px solid ${color}55` }}
    >
      {icon}
      {label}
    </span>
  );
}

