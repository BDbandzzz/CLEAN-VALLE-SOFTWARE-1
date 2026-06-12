import { Button } from '@/core/components/ui/button';

export function SegmentedTabButton({
  label,
  mobileLabel,
  count,
  active,
  onClick,
  className = '',
}) {
  return (
    <Button
      type="button"
      onClick={onClick}
      variant={active ? 'secondary' : 'ghost'}
      className={[
        'h-auto min-h-10 min-w-0 flex-1 overflow-hidden rounded-lg px-2 py-2 text-center text-sm font-medium leading-tight transition sm:px-4',
        active ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
        className,
      ].join(' ')}
    >
      <span className={`min-w-0 break-words ${mobileLabel ? 'sm:hidden' : ''}`}>
        {mobileLabel || label}
      </span>
      {mobileLabel && <span className="hidden min-w-0 break-words sm:inline">{label}</span>}
      {typeof count === 'number' && (
        <span className="ml-1 shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-xs sm:ml-2 sm:px-2">
          {count}
        </span>
      )}
    </Button>
  );
}

