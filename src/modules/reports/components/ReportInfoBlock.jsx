export function ReportInfoBlock({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="break-words text-sm text-foreground [overflow-wrap:anywhere]">
        {value}
      </p>
    </div>
  );
}

