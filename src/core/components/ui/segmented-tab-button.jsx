import { Button } from '@/core/components/ui/button';

export function SegmentedTabButton({
  label,
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
        'flex-1 rounded-lg px-4 py-2 text-sm font-medium transition',
        active ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
        className,
      ].join(' ')}
    >
      {label}
      {typeof count === 'number' && (
        <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">{count}</span>
      )}
    </Button>
  );
}

