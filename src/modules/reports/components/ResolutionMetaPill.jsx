export function ResolutionMetaPill({ label, color }) {
  return (
    <span
      className="inline-flex max-w-full shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{ backgroundColor: `${color}22`, color, border: `1.5px solid ${color}55` }}
    >
      {label}
    </span>
  );
}

