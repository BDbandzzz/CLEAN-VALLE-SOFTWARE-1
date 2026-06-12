export function ReportInfoItem({ label, value }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="break-words text-sm text-foreground [overflow-wrap:anywhere]">
        {value || '-'}
      </p>
    </div>
  );
}

