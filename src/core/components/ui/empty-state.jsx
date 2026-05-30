export function EmptyState({
  title,
  description = '',
  icon = null,
  containerClassName = '',
}) {
  return (
    <div className={`rounded-xl border border-dashed border-border py-14 text-center text-sm text-muted-foreground ${containerClassName}`}>
      {icon}
      {title && <p className={icon ? 'mt-4 text-base font-medium text-muted-foreground' : ''}>{title}</p>}
      {description && <p className="mt-1 text-sm text-muted-foreground/70">{description}</p>}
    </div>
  );
}

