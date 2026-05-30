import { Button } from '@/core/components/ui/button';

export function OperatorDashboardTabButton({ label, active, onClick }) {
  return (
    <Button
      type="button"
      onClick={onClick}
      variant={active ? 'secondary' : 'ghost'}
      className={[
        'flex-1 rounded-lg px-4 py-2 text-sm font-medium transition',
        active ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
      ].join(' ')}
    >
      {label}
    </Button>
  );
}

